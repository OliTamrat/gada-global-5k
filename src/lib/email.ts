// Resend is called over its REST API rather than the SDK: it is a single POST,
// and this keeps the dependency surface (and cold starts) small.

import { WAVE_META, coerceWave, type Wave } from "@/lib/waves";
import { siteUrl } from "@/lib/site";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export const EVENT = {
  name: "Gada Global 5K",
  // The public-facing brand. "Gada Global Inc." below is the registered legal
  // entity the brand operates under — use it only where the legal name is
  // required, never as a heading a runner reads.
  brand: "Gada Global Run",
  date: "Saturday, October 3, 2026",
  startTime: "9:00 AM",
  packetPickup: "7:00 AM",
  awardsTime: "10:00 AM",
  programHours: "7:00 AM to 12:00 PM",
  location: "Rock Creek Park Tennis Center",
  address: "5220 16th St NW, Washington, DC 20011",
  organization: "Gada Global Inc.",
  supportEmail: "info@gadaglobalrun.com",
} as const;

export interface RegistrationConfirmation {
  firstName: string;
  lastName: string;
  email: string;
  bib: number;
  tierName: string;
  amountCents: number;
  tshirtSize?: string | null;
  wave?: Wave | string | null;
}

export interface SendResult {
  sent: boolean;
  error?: string;
}

function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Escapes interpolated values so a name with `<` cannot break the markup. */
function esc(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Google Maps link for the venue — "get directions" is the one thing a
 *  runner actually needs from this email on the morning itself. */
function mapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${EVENT.location}, ${EVENT.address}`
  )}`;
}

function buildHtml(d: RegistrationConfirmation): string {
  const site = siteUrl();
  const rows: Array<[string, string]> = [
    ["Runner", `${d.firstName} ${d.lastName}`],
    ["Bib number", String(d.bib)],
    ["Registration", d.tierName],
    ["Amount paid", formatUsd(d.amountCents)],
  ];
  rows.push(["Start wave", WAVE_META[coerceWave(d.wave)].label]);
  if (d.tshirtSize) rows.push(["T-shirt size", d.tshirtSize]);

  const detailRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee6d6;color:#6b6459;font-size:14px;">${esc(label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee6d6;color:#141210;font-size:14px;font-weight:600;text-align:right;">${esc(value)}</td>
        </tr>`
    )
    .join("");

  const nextSteps = [
    `Print your bib from the button below — plain paper is fine, but print at 100% scale rather than "fit to page", which shrinks the number.`,
    `No printer? Collect it at packet pickup, open from ${EVENT.packetPickup} at ${EVENT.location}, ${EVENT.address}. Bring a photo ID.`,
    "Your race t-shirt is in your packet at pickup either way.",
    `You are in the ${WAVE_META[coerceWave(d.wave)].label} wave — line up in that corral. Waves set off a few minutes apart so faster runners are not weaving through walkers and children.`,
    "Wear your bib on the front of your shirt so the finish-line volunteers can scan it.",
    `The awards ceremony follows at ${EVENT.awardsTime}, with cash prizes for the top three men and top three women.`,
    `Live results will be posted at ${site}/race on race day.`,
  ]
    .map(
      (step) => `
        <tr>
          <td style="padding:0 0 10px 0;vertical-align:top;width:22px;">
            <div style="width:6px;height:6px;border-radius:50%;background:#E8B930;margin-top:7px;"></div>
          </td>
          <td style="padding:0 0 10px 0;color:#4a453d;font-size:14px;line-height:1.6;">${esc(step)}</td>
        </tr>`
    )
    .join("");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(EVENT.name)} registration confirmed</title>
</head>
<body style="margin:0;padding:0;background:#FAF6EE;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    You are registered for the ${esc(EVENT.name)}. Your bib number is ${esc(d.bib)}.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6EE;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eee6d6;">

          <tr>
            <td style="background:#141210;padding:26px 32px 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-right:12px;vertical-align:middle;">
                    <img src="${esc(`${site}/images/brand/gada-global-logo.png`)}"
                         width="52" height="44" alt="${esc(EVENT.brand)}"
                         style="display:block;width:52px;height:auto;border:0;outline:none;text-decoration:none;">
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="color:#E8B930;font-size:17px;font-weight:800;letter-spacing:2.5px;line-height:1;">
                      GADA<span style="color:#ffffff;font-weight:500;">&nbsp;GLOBAL</span>
                    </div>
                  </td>
                </tr>
              </table>
              <div style="color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.4px;margin-top:16px;">
                ${esc(EVENT.name)}
              </div>
              <div style="color:#9a9287;font-size:13px;line-height:1.5;margin-top:5px;">
                ${esc(EVENT.date)} &bull; Washington, DC
              </div>
            </td>
          </tr>
          <tr>
            <td style="height:4px;background:#E8B930;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <tr>
            <td style="padding:32px 32px 8px 32px;">
              <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.3;color:#141210;font-weight:700;letter-spacing:-0.3px;">
                You are registered, ${esc(d.firstName)}.
              </h1>
              <p style="margin:0;color:#6b6459;font-size:15px;line-height:1.7;">
                Your payment is confirmed and your spot at the ${esc(EVENT.name)} is secured.
                Keep this email — it has your bib number and everything you need for race day.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6EE;border-radius:12px;border:1px solid #eee6d6;">
                <tr>
                  <td align="center" style="padding:20px;">
                    <div style="color:#6b6459;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">
                      Your bib number
                    </div>
                    <div style="color:#141210;font-size:44px;font-weight:800;letter-spacing:-1px;margin-top:6px;">
                      ${esc(d.bib)}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows}</table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 0 32px;">
              <div style="color:#141210;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;margin-bottom:12px;">
                Race day
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid #E8B930;">
                <tr>
                  <td style="padding:2px 0 2px 14px;color:#141210;font-size:15px;font-weight:600;line-height:1.6;">
                    ${esc(EVENT.date)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:2px 0 2px 14px;color:#4a453d;font-size:14px;line-height:1.6;">
                    Race start ${esc(EVENT.startTime)} &bull; Packet pickup ${esc(EVENT.packetPickup)} &bull; Awards ${esc(EVENT.awardsTime)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:2px 0 2px 14px;color:#4a453d;font-size:14px;line-height:1.6;">
                    ${esc(EVENT.location)}, ${esc(EVENT.address)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 0 32px;">
              <div style="color:#141210;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;margin-bottom:12px;">
                What to do next
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${nextSteps}</table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;">
                <tr>
                  <td width="50%" valign="middle" style="padding-right:6px;">
                    <a href="${esc(`${site}/bib/${d.bib}`)}"
                       style="display:block;background:#E8B930;color:#141210;text-decoration:none;padding:14px 8px;border-radius:10px;font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;text-align:center;white-space:nowrap;">
                      Print your bib
                    </a>
                  </td>
                  <td width="50%" valign="middle" style="padding-left:6px;">
                    <a href="${esc(mapsUrl())}"
                       style="display:block;color:#4a453d;text-decoration:none;padding:13px 8px;border-radius:10px;font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;text-align:center;white-space:nowrap;border:1px solid #ded5c4;">
                      Directions
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#141210;padding:26px 32px 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;">
                <tr>
                  <td style="padding-right:10px;vertical-align:middle;">
                    <img src="${esc(`${site}/images/brand/gada-global-logo.png`)}"
                         width="34" height="29" alt="${esc(EVENT.brand)}"
                         style="display:block;width:34px;height:auto;border:0;outline:none;text-decoration:none;">
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="color:#E8B930;font-size:13px;font-weight:800;letter-spacing:2px;line-height:1;">
                      GADA<span style="color:#ffffff;font-weight:500;">&nbsp;GLOBAL</span>
                    </div>
                  </td>
                </tr>
              </table>

              <div style="color:#9a9287;font-size:13px;line-height:1.75;margin-bottom:16px;">
                ${esc(EVENT.location)}<br>
                ${esc(EVENT.address)}<br>
                ${esc(EVENT.date)} &bull; ${esc(EVENT.programHours)}
              </div>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;">
                <tr>
                  <td style="padding-right:16px;">
                    <a href="${esc(`${site}/#event`)}" style="color:#E8B930;font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;text-decoration:none;">Event</a>
                  </td>
                  <td style="padding-right:16px;">
                    <a href="${esc(`${site}/race`)}" style="color:#E8B930;font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;text-decoration:none;">Results</a>
                  </td>
                  <td style="padding-right:16px;">
                    <a href="${esc(`${site}/shop`)}" style="color:#E8B930;font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;text-decoration:none;">Shop</a>
                  </td>
                  <td>
                    <a href="${esc(`${site}/sponsors`)}" style="color:#E8B930;font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;text-decoration:none;">Sponsor</a>
                  </td>
                </tr>
              </table>

              <div style="border-top:1px solid #2a2520;padding-top:16px;">
                <p style="margin:0 0 10px 0;color:#c9c2b7;font-size:13px;line-height:1.65;">
                  Questions? Reply to this email or write to
                  <a href="mailto:${esc(EVENT.supportEmail)}" style="color:#E8B930;font-weight:600;text-decoration:none;">${esc(EVENT.supportEmail)}</a>
                </p>
                <p style="margin:0 0 4px 0;color:#6b6459;font-size:12px;line-height:1.6;">
                  ${esc(EVENT.brand)} &bull; Celebrating Oromo heritage through running.
                </p>
                <p style="margin:0 0 4px 0;color:#5a544c;font-size:11px;line-height:1.6;">
                  &copy; 2026 ${esc(EVENT.organization)} All rights reserved. You are receiving
                  this because you registered for the ${esc(EVENT.name)}.
                </p>
                <p style="margin:0;color:#4a453d;font-size:11px;line-height:1.6;">
                  Built by Olink Technologies
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText(d: RegistrationConfirmation): string {
  const lines = [
    `${EVENT.name} — registration confirmed`,
    "",
    `You are registered, ${d.firstName}.`,
    "",
    `Bib number: ${d.bib}`,
    `Runner: ${d.firstName} ${d.lastName}`,
    `Registration: ${d.tierName}`,
    `Amount paid: ${formatUsd(d.amountCents)}`,
  ];
  lines.push(`Start wave: ${WAVE_META[coerceWave(d.wave)].label}`);
  if (d.tshirtSize) lines.push(`T-shirt size: ${d.tshirtSize}`);
  lines.push(
    "",
    "RACE DAY",
    EVENT.date,
    `Race start ${EVENT.startTime} — Packet pickup ${EVENT.packetPickup} — Awards ${EVENT.awardsTime}`,
    `${EVENT.location}, ${EVENT.address}`,
    "",
    "WHAT TO DO NEXT",
    `- Print your bib: ${siteUrl()}/bib/${d.bib} (print at 100% scale, not "fit to page")`,
    `- No printer? Collect it at packet pickup from ${EVENT.packetPickup}. Bring a photo ID.`,
    "- Your race t-shirt is in your packet at pickup either way.",
    `- You are in the ${WAVE_META[coerceWave(d.wave)].label} wave — line up in that corral.`,
    "- Wear your bib on the front of your shirt for finish-line scans.",
    `- Awards at ${EVENT.awardsTime}: cash prizes for the top three men and top three women.`,
    `- Live results: ${siteUrl()}/race`,
    "",
    `Questions? ${EVENT.supportEmail}`,
    `${EVENT.brand} — operated by ${EVENT.organization}`
  );
  return lines.join("\n");
}

/** Builds the confirmation message. Exported so the template can be rendered
 *  and reviewed without sending mail. */
export function buildRegistrationEmail(d: RegistrationConfirmation): {
  subject: string;
  html: string;
  text: string;
} {
  return {
    subject: `You are registered — ${EVENT.name}, bib #${d.bib}`,
    html: buildHtml(d),
    text: buildText(d),
  };
}

/**
 * Sends the registration confirmation. Never throws: a failed send must not
 * fail the Stripe webhook, or Stripe would retry and re-process the payment.
 */
export async function sendRegistrationConfirmation(
  d: RegistrationConfirmation
): Promise<SendResult> {
  // RESEND_API_KEY is the canonical name; RESEND_API is accepted as a fallback
  // so a differently-named variable in the host environment still works.
  const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_API;
  if (!apiKey) {
    return { sent: false, error: "Neither RESEND_API_KEY nor RESEND_API is set" };
  }

  const from = process.env.REGISTRATION_FROM_EMAIL || `${EVENT.name} <${EVENT.supportEmail}>`;
  const replyTo = process.env.REGISTRATION_REPLY_TO || EVENT.supportEmail;
  const { subject, html, text } = buildRegistrationEmail(d);

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [d.email],
        reply_to: replyTo,
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { sent: false, error: `Resend responded ${res.status}: ${body.slice(0, 300)}` };
    }

    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ── Organizer notification ───────────────────────────────────────────────────

export interface OrganizerNotification extends RegistrationConfirmation {
  /** Count of paid registrations including this one. */
  totalRegistered: number;
  phone?: string | null;
  emergencyContact?: string | null;
}

/**
 * Where registration alerts go. Falls back to the support address so
 * organizers are never silently left without notifications because a variable
 * was missed — a blind organizer is the failure this exists to prevent.
 */
function organizerRecipients(): string[] {
  const raw = process.env.ORGANIZER_EMAILS || EVENT.supportEmail;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function buildOrganizerEmail(d: OrganizerNotification): {
  subject: string;
  html: string;
  text: string;
} {
  const site = siteUrl();
  const rows: Array<[string, string]> = [
    ["Runner", `${d.firstName} ${d.lastName}`],
    ["Bib", String(d.bib)],
    ["Email", d.email],
    ["Wave", WAVE_META[coerceWave(d.wave)].label],
    ["Registration", d.tierName],
    ["Amount", formatUsd(d.amountCents)],
  ];
  if (d.tshirtSize) rows.push(["T-shirt", d.tshirtSize]);
  if (d.phone) rows.push(["Phone", d.phone]);
  if (d.emergencyContact) rows.push(["Emergency contact", d.emergencyContact]);

  const detailRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee6d6;color:#6b6459;font-size:13px;">${esc(label)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee6d6;color:#141210;font-size:13px;font-weight:600;text-align:right;">${esc(value)}</td>
        </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF6EE;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6EE;padding:28px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #eee6d6;">
        <tr>
          <td style="background:#141210;padding:22px 28px;">
            <div style="color:#E8B930;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">
              New registration
            </div>
            <div style="color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;margin-top:6px;">
              ${esc(d.totalRegistered)} registered
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 28px 8px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px 26px 28px;">
            <a href="${esc(`${site}/organizers`)}"
               style="display:inline-block;background:#E8B930;color:#141210;text-decoration:none;padding:12px 24px;border-radius:9px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
              Open dashboard
            </a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `New registration — ${d.totalRegistered} registered`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `Dashboard: ${site}/organizers`,
  ].join("\n");

  return {
    subject: `Registration #${d.totalRegistered} — ${d.firstName} ${d.lastName}, bib ${d.bib}`,
    html,
    text,
  };
}

/**
 * Notifies organizers of a paid registration. Never throws, for the same
 * reason the runner confirmation does not: a mail failure must not fail the
 * webhook, or Stripe would retry and re-process the payment.
 */
export async function sendOrganizerNotification(
  d: OrganizerNotification
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_API;
  if (!apiKey) {
    return { sent: false, error: "Neither RESEND_API_KEY nor RESEND_API is set" };
  }

  const to = organizerRecipients();
  if (to.length === 0) return { sent: false, error: "No organizer recipients configured" };

  const from = process.env.REGISTRATION_FROM_EMAIL || `${EVENT.name} <${EVENT.supportEmail}>`;
  const { subject, html, text } = buildOrganizerEmail(d);

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      // reply_to is the runner, so an organizer can answer a question by
      // hitting reply rather than copying the address out.
      body: JSON.stringify({ from, to, reply_to: d.email, subject, html, text }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { sent: false, error: `Resend responded ${res.status}: ${body.slice(0, 300)}` };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : String(err) };
  }
}
