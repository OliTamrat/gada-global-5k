import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import type { CartItem } from "@/context/CartContext";

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.name} (${item.size})`,
          description: `Gada Global 5K Official Merchandise - Size ${item.size}`,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${req.nextUrl.origin}/success?type=shop`,
      cancel_url: `${req.nextUrl.origin}/shop`,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      metadata: {
        type: "merchandise",
        items: items.map((i) => `${i.name} (${i.size}) x${i.quantity}`).join(", "),
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
