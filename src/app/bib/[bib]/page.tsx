import { permanentRedirect } from "next/navigation";

/**
 * Printable bibs were removed.
 *
 * A bib anyone can print at home is a bib anyone can run on, and with a $1,200
 * purse across six places that is not a risk worth carrying. Bibs are now
 * issued in person at packet pickup and checked against the registration list.
 *
 * This route stays as a redirect rather than being deleted, because
 * confirmation emails already in people's inboxes link to /bib/<number>. Those
 * links land on the "how to collect your bib" page instead of a 404.
 */
export default async function LegacyBibPage({
  params,
}: {
  params: Promise<{ bib: string }>;
}) {
  await params;
  permanentRedirect("/bib");
}
