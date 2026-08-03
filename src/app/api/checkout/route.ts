import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { products } from "@/lib/products";
import { EVENT } from "@/lib/email";
import { publicAsset } from "@/lib/site";

export const dynamic = "force-dynamic";

/** What the browser sends. Only the id, size and quantity are trusted. */
interface CartLine {
  id?: unknown;
  size?: unknown;
  quantity?: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const { items }: { items?: CartLine[] } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Price comes from the catalogue on the server, never from the request
    // body. The browser could otherwise post a $55 hoodie at any amount it
    // liked and Stripe would happily charge it.
    const line_items = [];
    const summary: string[] = [];

    for (const line of items) {
      const product = products.find((p) => p.id === line.id);
      if (!product) {
        return NextResponse.json({ error: "Unknown product in cart" }, { status: 400 });
      }

      const size = String(line.size ?? "");
      if (!product.sizes.includes(size)) {
        return NextResponse.json(
          { error: `${product.name} is not available in size ${size || "(none)"}` },
          { status: 400 }
        );
      }

      const quantity = Number(line.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
      }

      const image = publicAsset(product.image);
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${product.name} — Size ${size}`,
            description: product.description,
            ...(image ? { images: [image] } : {}),
          },
          unit_amount: product.price,
        },
        quantity,
      });
      summary.push(`${product.name} (${size}) x${quantity}`);
    }

    const session = await getStripe().checkout.sessions.create({
      // Payment methods come from the Stripe Dashboard rather than being
      // pinned to card here, so wallets show up alongside the card form.
      line_items,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      custom_text: {
        submit: {
          message: `Official ${EVENT.name} merchandise. Questions about sizing or delivery: ${EVENT.supportEmail}`,
        },
      },
      success_url: `${req.nextUrl.origin}/success?type=shop`,
      cancel_url: `${req.nextUrl.origin}/shop`,
      metadata: {
        type: "merchandise",
        // Stripe caps a metadata value at 500 characters.
        items: summary.join(", ").slice(0, 500),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session. Make sure STRIPE_SECRET_KEY is set." },
      { status: 500 }
    );
  }
}
