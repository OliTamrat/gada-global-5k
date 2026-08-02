import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { tiers, type RegistrationData } from "@/lib/registration";
import { query } from "@/lib/db";
import { coerceWave } from "@/lib/waves";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let registrationId: string | undefined;

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

    // Persist as pending first so the entry survives even if the runner
    // abandons checkout. The webhook promotes it to paid.
    // An unrecognised wave falls back to Open rather than failing the
    // registration — a bad select value must never cost a sale.
    const wave = coerceWave(data.wave);

    const [row] = await query<{ id: string }>(
      `insert into registrations
         (first_name, last_name, email, phone, age, gender,
          tshirt_size, tier_id, tier_name, amount_cents, emergency_contact, wave)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       returning id`,
      [
        data.firstName,
        data.lastName,
        data.email,
        data.phone || null,
        data.age,
        data.gender,
        data.tshirtSize || null,
        tier.id,
        tier.name,
        tier.price,
        data.emergencyContact || null,
        wave,
      ]
    );
    registrationId = row.id;

    // Create Stripe Checkout session
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: data.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Gada Global 5K - ${tier.name} Registration`,
              description: `5K Run/Walk registration for ${data.firstName} ${data.lastName}. Includes race bib, medal, and t-shirt (${data.tshirtSize}).`,
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
        registrationId,
        registrant: `${data.firstName} ${data.lastName}`,
        email: data.email,
        tier: tier.name,
        tshirtSize: data.tshirtSize,
        wave,
      },
    });

    await query("update registrations set stripe_session_id = $2 where id = $1", [
      registrationId,
      session.id,
    ]);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Registration error:", error);

    // Don't leave a pending row behind for a checkout that never opened.
    if (registrationId) {
      await query(
        "delete from registrations where id = $1 and payment_status = 'pending'",
        [registrationId]
      ).catch((cleanupError) =>
        console.error("Failed to clean up pending registration:", cleanupError)
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to create checkout session. Make sure DATABASE_URL and STRIPE_SECRET_KEY are set.",
      },
      { status: 500 }
    );
  }
}
