# Sponsorship brochure

A printed tri-fold, US Letter landscape (11 × 8.5 in), two sides.

**The offer is not typed in here.** `build.py` reads the levels, prices and
benefits out of `src/lib/sponsors.ts` — the same module the website renders
from — so the brochure a sponsor is handed cannot disagree with the page they
visit afterwards. Change a price in `sponsors.ts`, rebuild, and the table
follows.

```bash
python3 design/brochure/build.py    # sponsors.ts -> outside.html, inside.html
node    design/brochure/render.mjs  # -> 3300x2550 PNGs (300dpi)
node    design/brochure/pdf.mjs     # -> two-page print PDF
```

`render.mjs` exits non-zero if any element escapes its panel, so a broken
layout cannot reach a printer unnoticed.

The render step needs Playwright, which is **not** a dependency of the site —
install it only when you are rebuilding the brochure:

```bash
npm i --no-save playwright-core   # then set CHROMIUM_PATH to a Chromium binary
```

## Panel order

Left to right as printed:

| Side | Left | Middle | Right |
|---|---|---|---|
| Outside | Back cover — the organization, contact, QR | At a glance — schedule and figures | Front cover |
| Inside | Why partner | Partnership levels — table spans the middle and right panels | |

The tuck-in panel is cut 4px narrower so a roll fold closes flat. If your
printer folds the other way, swap the panel order in the two writes at the
bottom of `build.py`.

## Why the PDF is a raster

Chromium's print pipeline does not composite `mix-blend-mode`, CSS masks or
backdrop filters, all of which this design uses; printing the DOM produced a
black page. `pdf.mjs` therefore assembles the PDF from the rendered PNGs, which
prints correctly at 300dpi but is not text-selectable.
