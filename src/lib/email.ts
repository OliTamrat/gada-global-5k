// Resend is called over its REST API rather than the SDK: it is a single POST,
// and this keeps the dependency surface (and cold starts) small.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export const EVENT = {
  name: "Gada Global 5K",
  date: "Saturday, October 3, 2026",
  startTime: "9:00 AM",
  packetPickup: "7:00 AM",
  awardsTime: "10:00 AM",
  programHours: "7:00 AM to 12:00 PM",
  location: "Rock Creek Park Tennis Center",
  address: "5220 16th St NW, Washington, DC 20011",
  organization: "Gada Global Inc.",
  supportEmail: "info@gadaglobal.com",
} as const;

export interface RegistrationConfirmation {
  firstName: string;
  lastName: string;
  email: string;
  bib: number;
  tierName: string;
  amountCents: number;
  tshirtSize?: string | null;
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

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://gadaglobal.com").replace(/\/$/, "");
}

function buildHtml(d: RegistrationConfirmation): string {
  const site = siteUrl();
  const rows: Array<[string, string]> = [
    ["Runner", `${d.firstName} ${d.lastName}`],
    ["Bib number", String(d.bib)],
    ["Registration", d.tierName],
    ["Amount paid", formatUsd(d.amountCents)],
  ];
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
    `Packet pickup opens at ${EVENT.packetPickup} at ${EVENT.location}, ${EVENT.address}.`,
    "Bring a photo ID. Your bib, timing chip, and race t-shirt are in your packet.",
    "Wear your bib on the front of your shirt so the timing volunteers can scan it.",
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
            <td style="background:#141210;padding:28px 32px;">
              <div style="color:#E8B930;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">
                ${esc(EVENT.organization)}
              </div>
              <div style="color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.4px;margin-top:6px;">
                ${esc(EVENT.name)}
              </div>
            </td>
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
              <a href="${esc(site)}"
                 style="display:inline-block;background:#E8B930;color:#141210;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                View event details
              </a>
            </td>
          </tr>

          <tr>
            <td style="background:#FAF6EE;padding:22px 32px;border-top:1px solid #eee6d6;">
              <p style="margin:0 0 6px 0;color:#6b6459;font-size:13px;line-height:1.6;">
                Questions? Reply to this email or write to
                <a href="mailto:${esc(EVENT.supportEmail)}" style="color:#141210;font-weight:600;">${esc(EVENT.supportEmail)}</a>.
              </p>
              <p style="margin:0;color:#9a9287;font-size:12px;line-height:1.6;">
                ${esc(EVENT.organization)} &bull; Celebrating Oromo heritage through running.
              </p>
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
  if (d.tshirtSize) lines.push(`T-shirt size: ${d.tshirtSize}`);
  lines.push(
    "",
    "RACE DAY",
    EVENT.date,
    `Race start ${EVENT.startTime} — Packet pickup ${EVENT.packetPickup} — Awards ${EVENT.awardsTime}`,
    `${EVENT.location}, ${EVENT.address}`,
    "",
    "WHAT TO DO NEXT",
    `- Packet pickup opens at ${EVENT.packetPickup}.`,
    "- Bring a photo ID. Bib, timing chip, and t-shirt are in your packet.",
    "- Wear your bib on the front of your shirt for timing scans.",
    `- Awards at ${EVENT.awardsTime}: cash prizes for the top three men and top three women.`,
    `- Live results: ${siteUrl()}/race`,
    "",
    `Questions? ${EVENT.supportEmail}`,
    `${EVENT.organization}`
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
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY is not set" };
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
