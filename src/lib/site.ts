/**
 * One place that knows the site's public origin. Three files were each
 * carrying their own copy of this fallback, which is exactly how a domain
 * change ends up half-applied.
 */

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.gadaglobalrun.com").replace(
    /\/$/,
    ""
  );
}

/**
 * Absolute URL for a file in `public/`, or null when the site origin is not a
 * public https address. Stripe fetches line-item images from its own servers,
 * so a localhost URL would render as a broken thumbnail on the checkout page
 * rather than simply being ignored.
 */
export function publicAsset(path: string): string | null {
  const base = siteUrl();
  if (!base.startsWith("https://")) return null;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
