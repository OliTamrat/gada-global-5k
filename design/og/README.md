# Share card (`public/og.png`)

The 1200×630 image messaging apps and social platforms show when someone shares
the site. Source is `og.html`; re-render it after any change to the name, date
or venue.

```bash
npm i --no-save playwright-core   # not a site dependency
CHROMIUM_PATH=/path/to/chromium node -e '
  const { chromium } = require("playwright-core");
  (async () => {
    const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
    const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
    await p.goto("file://" + process.cwd() + "/design/og/og.html", { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: "public/og.png" });
    await b.close();
  })();
'
```

The logo is copied in beside `og.html` at render time from
`public/images/brand/gada-global-logo.png`.

## Two things that are easy to get wrong

**Do not put the lockup in `og:title`.** Several share surfaces split a title on
`|` and render only one side. That is exactly how a share went out reading
"Irrecha Celebration Run - October 3, 2026" — the brand half was dropped from
"Gada Global 5K | Irrecha Celebration Run - October 3, 2026". The lockup belongs
on the browser tab; share titles use `EVENT.name`.

**Nothing may spill past 630px.** The first draft clipped the date/start/venue
row off the bottom. Check the bar's bottom edge after editing.

## Caches

Messaging apps and social platforms cache a preview per URL, often for days. A
correct deploy will still show the old card until the cache clears. Force a
re-scrape with Facebook's Sharing Debugger or LinkedIn's Post Inspector; for
iMessage/WhatsApp, appending `?v=2` to the shared link is the reliable trick.
