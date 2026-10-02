// The race-eve update sent to every paid registrant from /organizers.
//
// Registrants who signed up before the NPS safety plan was adopted were told
// 9:00 AM. This tells each of them their own start time and that bibs and
// T-shirts are collected on site from packet pickup. Times come from EVENT and
// WAVE_META, so the email cannot disagree with the site.

import { WAVE_META, coerceWave, type Wave } from "@/lib/waves";
import { siteUrl } from "@/lib/site";
import { EVENT } from "@/lib/event";

/** Bump this to send a *new* announcement; reusing it is what stops a resend. */
export const RACE_UPDATE_ID = "race-day-times-2026-10";

export interface RaceUpdateRecipient {
  firstName: string;
  email: string;
  bib: number;
  wave: Wave | string | null;
}

function esc(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function schedule(): Array<[string, string]> {
  return [
    [EVENT.packetPickup, "Packet pickup opens — collect your bib and T-shirt"],
    [EVENT.kidsStartTime, "Kids 1K starts"],
    [EVENT.startTime, "5K starts — elite race and fun run"],
    [EVENT.courseCloses, "Course closes; awards ceremony"],
  ];
}

export function buildRaceUpdateEmail(d: RaceUpdateRecipient): {
  subject: string;
  html: string;
  text: string;
} {
  const wave = WAVE_META[coerceWave(d.wave)];
  const site = siteUrl();
  const bibUrl = `${site}/bib/${d.bib}`;
  const subject = `Updated race times: your ${wave.label} start is ${wave.startTime} — ${EVENT.name}`;

  const intro =
    `Our start times have changed to meet the conditions of our National Park Service ` +
    `permit for Rock Creek Park. If you saw a 9:00 AM start earlier, please use the times below instead.`;

  const notes = [
    `Collect your bib and T-shirt at packet pickup from ${EVENT.packetPickup} at the ${EVENT.location}, ${EVENT.address}. Bring a photo ID.`,
    `Please arrive early. Pickup lines get long close to the start, so aim to be there by 7:30 AM.`,
    `Already printed your bib? Bring it with you, and still stop by pickup for your T-shirt.`,
    `The 5K course closes at ${EVENT.courseCloses}, when the park road reopens, so every runner and walker needs to finish within 60 minutes.`,
    `Live results on race day: ${site}/race`,
  ];

  const rows = schedule()
    .map(
      ([time, what]) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee6d6;color:#141210;font-size:14px;font-weight:700;width:90px;vertical-align:top;">${esc(time)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee6d6;color:#4a453d;font-size:14px;">${esc(what)}</td>
        </tr>`
    )
    .join("");

  const noteRows = notes
    .map(
      (n) => `
        <tr>
          <td style="padding:0 0 10px 0;vertical-align:top;width:18px;color:#E8B930;font-weight:800;">&bull;</td>
          <td style="padding:0 0 10px 0;color:#4a453d;font-size:14px;line-height:1.6;">${esc(n)}</td>
        </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f6f1e7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1e7;padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eee6d6;">
      <tr><td style="background:#141210;padding:26px 32px 24px 32px;">
        <div style="color:#E8B930;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">Race-day update</div>
        <div style="color:#ffffff;font-size:22px;font-weight:700;margin-top:10px;">${esc(EVENT.name)}</div>
        <div style="color:#9a9287;font-size:13px;margin-top:5px;">${esc(EVENT.date)} &bull; ${esc(EVENT.location)}</div>
      </td></tr>
      <tr><td style="height:4px;background:#E8B930;font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td style="padding:28px 32px 0 32px;color:#141210;font-size:15px;line-height:1.65;">
        <p style="margin:0 0 14px 0;">Hi ${esc(d.firstName)},</p>
        <p style="margin:0 0 18px 0;">${esc(intro)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf7ee;border:1px solid #eee6d6;border-radius:12px;">
          <tr><td style="padding:16px 18px;">
            <div style="color:#6b6459;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Your start</div>
            <div style="color:#141210;font-size:22px;font-weight:800;margin-top:4px;">${esc(wave.label)} &bull; ${esc(wave.startTime)}</div>
            <div style="color:#4a453d;font-size:14px;margin-top:2px;">Bib #${esc(d.bib)}</div>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:24px 32px 0 32px;">
        <div style="color:#141210;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;margin-bottom:6px;">Race morning</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </td></tr>
      <tr><td style="padding:24px 32px 0 32px;">
        <div style="color:#141210;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;margin-bottom:10px;">Good to know</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${noteRows}</table>
      </td></tr>
      <tr><td style="padding:12px 32px 0 32px;">
        <a href="${esc(bibUrl)}" style="display:inline-block;background:#E8B930;color:#141210;text-decoration:none;font-weight:800;font-size:14px;padding:12px 20px;border-radius:10px;">View your bib</a>
      </td></tr>
      <tr><td style="padding:26px 32px 30px 32px;color:#6b6459;font-size:13px;line-height:1.6;">
        Questions? Reply to this email or write to <a href="mailto:${esc(EVENT.supportEmail)}" style="color:#141210;">${esc(EVENT.supportEmail)}</a>.<br>See you at the start line.
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const text = [
    `Hi ${d.firstName},`,
    "",
    intro,
    "",
    `YOUR START: ${wave.label} — ${wave.startTime} — Bib #${d.bib}`,
    "",
    "RACE MORNING",
    ...schedule().map(([time, what]) => `${time}  ${what}`),
    "",
    "GOOD TO KNOW",
    ...notes.map((n) => `- ${n}`),
    "",
    `Your bib: ${bibUrl}`,
    "",
    `Questions? ${EVENT.supportEmail}`,
    "See you at the start line.",
  ].join("\n");

  return { subject, html, text };
}
