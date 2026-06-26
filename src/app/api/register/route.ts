import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { tiers, type RegistrationData } from "@/lib/registration";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "registrations.json");

async function saveRegistration(data: RegistrationData) {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });

  let registrations: RegistrationData[] = [];
  try {
    const existing = await fs.readFile(DATA_FILE, "utf-8");
    registrations = JSON.parse(existing);
  } catch {
    // File doesn't exist yet
  }

  registrations.push(data);
  await fs.writeFile(DATA_FILE, JSON.stringify(registrations, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const data: RegistrationData = await req.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.tierId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tier = tiers.find((t) => t.id === data.tierId);
    if (!tier) {
      return NextResponse.json(
        { error: "Invalid registration tier" },
        { status: 400 }
      );
    }

    // Save registration data locally
    await saveRegistration(data);

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: data.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Gada Global 5K - ${tier.name} Registration`,
              description: `5K Run/Walk registration for ${data.firstName} ${data.lastName}. Includes bib, timing chip, medal, and t-shirt (${data.tshirtSize}).`,
            },
            unit_amount: tier.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.nextUrl.origin}/success?type=registration&name=${encodeURIComponent(data.firstName)}`,
      cancel_url: `${req.nextUrl.origin}/register`,
      metadata: {
        type: "registration",
        registrant: `${data.firstName} ${data.lastName}`,
        email: data.email,
        tier: tier.name,
        tshirtSize: data.tshirtSize,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session. Make sure STRIPE_SECRET_KEY is set." },
      { status: 500 }
    );
  }
}
