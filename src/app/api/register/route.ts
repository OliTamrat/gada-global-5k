import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { tiers, type RegistrationData } from "@/lib/registration";
import { query } from "@/lib/db";
import { coerceWave, WAVE_META } from "@/lib/waves";
import { EVENT } from "@/lib/email";
import { publicAsset } from "@/lib/site";

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

    // Checkout is the last thing a runner sees before paying, so it repeats the
    // facts they would otherwise have to trust from memory: who the entry is
    // for, which wave, and when and where the race actually is.
    const logo = publicAsset("/images/brand/gada-global-logo.png");
    const runner = `${data.firstName} ${data.lastName}`;
    const detail = [
      runner,
      `${WAVE_META[wave].label} wave`,
      data.tshirtSize ? `T-shirt ${data.tshirtSize}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    const session = await getStripe().checkout.sessions.create({
      // No payment_method_types: Stripe then offers everything enabled on the
      // account, so Apple Pay, Google Pay and Link appear above the card form
      // instead of a bare card field. Which methods show is controlled in the
      // Stripe Dashboard under Settings -> Payment methods.
      customer_email: data.email,
      client_reference_id: registrationId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${EVENT.name} — Race Entry (${tier.name})`,
              description: `${detail}. ${EVENT.date}, ${EVENT.startTime} at the ${EVENT.location}, Washington DC.`,
              ...(logo ? { images: [logo] } : {}),
            },
            unit_amount: tier.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      custom_text: {
        submit: {
          message:
            "Entry includes your race bib, a finisher medal, the official event t-shirt, water stations on course, race photography, and access to the Irrecha cultural festival afterwards. The top three men and top three women share a $1,200 cash purse.",
        },
        after_submit: {
          message: `Your confirmation email with your bib number and start wave arrives within a few minutes. Questions: ${EVENT.supportEmail}`,
        },
      },
      success_url: `${req.nextUrl.origin}/success?type=registration&name=${encodeURIComponent(data.firstName)}`,
      cancel_url: `${req.nextUrl.origin}/register`,
      metadata: {
        type: "registration",
        registrationId,
        registrant: runner,
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
