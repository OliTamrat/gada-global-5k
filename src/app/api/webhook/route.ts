import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { query, transaction } from "@/lib/db";
import { sendRegistrationConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";

interface ConfirmedRegistration {
  id: string;
  bib: number;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  gender: string;
  tier_name: string;
  amount_cents: number;
  tshirt_size: string | null;
  wave: string;
  already_confirmed: boolean;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.metadata?.type === "merchandise") {
          await handleMerchandise(event.id, event.type, session);
        } else {
          const registration = await handleRegistration(event.id, event.type, session);
          // Sent after the transaction commits, so a mail failure can never
          // roll back the payment record.
          if (registration && !registration.already_confirmed) {
            await sendConfirmation(registration);
          }
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    // Returning 500 asks Stripe to retry. The event claim is written inside the
    // same transaction as the side effects, so a retry re-runs cleanly.
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

/**
 * Claims the Stripe event, assigns a bib, and marks the registration paid —
 * all in one transaction. Returns null when the event was already processed.
 */
async function handleRegistration(
  eventId: string,
  eventType: string,
  session: Stripe.Checkout.Session
): Promise<ConfirmedRegistration | null> {
  return transaction(async (client) => {
    // Claiming inside the transaction makes redelivery a no-op without
    // permanently swallowing an event that fails partway through.
    const claim = await client.query(
      `insert into stripe_events (id, type) values ($1, $2)
       on conflict (id) do nothing returning id`,
      [eventId, eventType]
    );
    if (claim.rowCount === 0) {
      console.log(`Stripe event ${eventId} already processed, skipping`);
      return null;
    }

    const registrationId = session.metadata?.registrationId;
    const locked = await client.query<{
      id: string;
      bib: number | null;
      first_name: string;
      last_name: string;
      email: string;
      age: number;
      gender: string;
      tier_name: string;
      amount_cents: number;
      tshirt_size: string | null;
      wave: string;
      payment_status: string;
      confirmation_sent_at: Date | null;
    }>(
      registrationId
        ? "select * from registrations where id = $1 for update"
        : "select * from registrations where stripe_session_id = $1 for update",
      [registrationId ?? session.id]
    );

    if (locked.rowCount === 0) {
      console.error(
        `No registration found for session ${session.id} (registrationId=${registrationId ?? "none"})`
      );
      return null;
    }

    const reg = locked.rows[0];
    const alreadyConfirmed =
      reg.payment_status === "paid" && reg.confirmation_sent_at !== null;

    const updated = await client.query<{ bib: number }>(
      `update registrations
         set bib            = coalesce(bib, nextval('bib_seq')),
             payment_status = 'paid',
             paid_at        = coalesce(paid_at, now())
       where id = $1
       returning bib`,
      [reg.id]
    );
    const bib = updated.rows[0].bib;

    // Put the runner on the timing roster so volunteers can scan them.
    // start_time is seeded from wave_starts, so a day-of registration whose
    // wave has already been sent still has a running clock.
    await client.query(
      `insert into race_entries (bib, first_name, last_name, age, gender, wave, start_time)
       values ($1, $2, $3, $4, $5, $6,
               (select started_at from wave_starts where wave = $6))
       on conflict (bib) do nothing`,
      [bib, reg.first_name, reg.last_name, reg.age, reg.gender, reg.wave]
    );

    return {
      id: reg.id,
      bib,
      first_name: reg.first_name,
      last_name: reg.last_name,
      email: reg.email,
      age: reg.age,
      gender: reg.gender,
      tier_name: reg.tier_name,
      amount_cents: session.amount_total ?? reg.amount_cents,
      tshirt_size: reg.tshirt_size,
      wave: reg.wave,
      already_confirmed: alreadyConfirmed,
    };
  });
}

async function sendConfirmation(reg: ConfirmedRegistration): Promise<void> {
  const result = await sendRegistrationConfirmation({
    firstName: reg.first_name,
    lastName: reg.last_name,
    email: reg.email,
    bib: reg.bib,
    tierName: reg.tier_name,
    amountCents: reg.amount_cents,
    tshirtSize: reg.tshirt_size,
    wave: reg.wave,
  });

  if (result.sent) {
    await query("update registrations set confirmation_sent_at = now() where id = $1", [
      reg.id,
    ]);
    console.log(`Confirmation email sent to ${reg.email} for bib #${reg.bib}`);
  } else {
    // confirmation_sent_at stays null, so unsent confirmations remain findable:
    //   select * from registrations where payment_status='paid'
    //     and confirmation_sent_at is null;
    console.error(
      `Confirmation email FAILED for bib #${reg.bib} (${reg.email}): ${result.error}`
    );
  }
}

async function handleMerchandise(
  eventId: string,
  eventType: string,
  session: Stripe.Checkout.Session
): Promise<void> {
  await transaction(async (client) => {
    const claim = await client.query(
      `insert into stripe_events (id, type) values ($1, $2)
       on conflict (id) do nothing returning id`,
      [eventId, eventType]
    );
    if (claim.rowCount === 0) {
      console.log(`Stripe event ${eventId} already processed, skipping`);
      return;
    }

    await client.query(
      `insert into merch_orders (stripe_session_id, email, items, amount_cents)
       values ($1, $2, $3, $4)
       on conflict (stripe_session_id) do nothing`,
      [
        session.id,
        session.customer_details?.email ?? session.customer_email ?? null,
        session.metadata?.items ?? "",
        session.amount_total ?? null,
      ]
    );
  });

  console.log(`Merchandise order recorded for session ${session.id}`);
}
