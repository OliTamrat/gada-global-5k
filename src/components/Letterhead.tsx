import Image from "next/image";
import { EVENT } from "@/lib/email";
import { siteUrl } from "@/lib/site";

/**
 * The organization's letterhead, and the sheet it sits on.
 *
 * Split out from the letter that uses it because a letterhead is not a
 * property of one letter. The next one — a thank-you to a sponsor who paid, a
 * permit cover note, a school outreach letter — is a new body on this same
 * masthead, and a letterhead that gets rebuilt per letter is a letterhead that
 * drifts by the third one.
 *
 * Everything factual comes from `EVENT` in `src/lib/email.ts`, which is
 * already the single source for the venue, the date and the support address
 * used by the confirmation emails. A letter carrying a different address from
 * the emails is worse than no letter.
 *
 * `Gada Global Inc.` rather than `Gada Global Run`: on correspondence a
 * business is going to file, sign or write a cheque against, the registered
 * legal entity is the correct name. `EVENT.brand` stays for anything a runner
 * reads.
 */

const SITE = siteUrl();

/** The domain without the scheme — print does not want a clickable-looking URL. */
function displayDomain(): string {
  return SITE.replace(/^https?:\/\//, "");
}

export function Letterhead() {
  return (
    <header className="flex items-start justify-between gap-6 pb-4 border-b-2 border-charcoal">
      <div className="flex items-center gap-4">
        <Image
          src="/images/brand/gada-global-logo.png"
          alt=""
          width={64}
          height={64}
          className="w-12 h-12 md:w-14 md:h-14 object-contain shrink-0"
          priority
        />
        <div>
          <p className="font-[family-name:var(--font-heading)] text-[20px] md:text-[22px] font-bold tracking-tight text-charcoal leading-none">
            {EVENT.organization}
          </p>
          <p className="text-[12px] tracking-[3px] uppercase text-charcoal/55 mt-1.5">
            {EVENT.name}
          </p>
        </div>
      </div>

      {/* Right-aligned contact block: where a recipient's eye goes for the
          reply address, and where it sits on almost every business letter
          they have ever received.

          It says "Washington, DC" and NOT the venue address. A letterhead's
          address block is the sender's, and printing the Rock Creek Park
          Tennis Center there tells a business to post its reply to a park
          building the organization does not occupy. Gada Global Inc. has no
          mailing address recorded anywhere in this repo; when it has one, it
          goes here, and the city line comes out. The venue and the date are
          in the letter's own footer, which is where an event belongs. */}
      <div className="text-right text-[11.5px] leading-[1.7] text-charcoal/70 shrink-0">
        <p>Washington, DC</p>
        <p className="mt-1.5 font-semibold text-charcoal">{EVENT.supportEmail}</p>
        <p>{displayDomain()}</p>
      </div>
    </header>
  );
}

/**
 * The page the letterhead is printed on.
 *
 * Fixed at the 7in a US Letter sheet leaves inside the 0.75in margins set in
 * `globals.css`, so what is on screen is what comes out of the printer. A
 * letter laid out in viewport units looks right on the screen it was built on
 * and wrong on paper, which is the only place this one is ever read.
 */
export function LetterSheet({ children }: { children: React.ReactNode }) {
  return (
    <article className="letter-sheet bg-white text-charcoal mx-auto w-full max-w-[7in] px-7 py-8 md:px-10 md:py-11 rounded-sm shadow-[0_10px_40px_rgba(20,18,16,0.14)]">
      {children}
    </article>
  );
}

/**
 * The sign-off. A name and a title are left blank on purpose — whoever sends
 * the letter types their own, and a hard-coded organizer name is the first
 * thing to go stale on a volunteer committee.
 */
export function LetterSignOff({ senderName, senderTitle }: {
  senderName: string;
  senderTitle: string;
}) {
  return (
    <div className="mt-5 letter-signoff">
      <p className="text-[13px] text-charcoal">With thanks,</p>
      {/* Room for an actual pen. A printed letter that leaves nowhere to sign
          reads as a mailshot, which is the opposite of the point. */}
      <div className="h-10" aria-hidden />
      <p className="text-[13px] font-bold text-charcoal">{senderName}</p>
      <p className="text-[12.5px] text-charcoal/70">{senderTitle}</p>
      <p className="text-[12.5px] text-charcoal/70">{EVENT.organization}</p>
    </div>
  );
}
