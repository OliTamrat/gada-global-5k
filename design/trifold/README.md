# The sponsorship tri-fold

A printed leaflet for businesses: US Letter landscape (11 × 8.5in), two sides,
three panels each, no bleed — so it prints on an office printer rather than
needing a trade press.

```bash
npm i --no-save --no-package-lock playwright-core
node design/trifold/build.mjs     # -> brochure.html
node design/trifold/render.mjs    # -> the PDF and two 288dpi PNGs
```

`CHROMIUM_PATH` points `render.mjs` at a Chromium binary if the default is
wrong. Outputs are gitignored: they are derived, and a committed PDF is a
second copy of the offer free to drift from the first.

## Panel order

Left to right on the flat sheet, which is the thing that is easy to get wrong
and expensive to get wrong:

| Side | Left | Middle | Right |
|---|---|---|---|
| Outside | Back cover — contact, levels at a glance, QR | At a glance — the facts | **Front cover** |
| Inside | Overview — who you reach | The morning — the schedule | Sponsorship levels |

Folded as a **roll fold**: the right panel of the outside becomes the front and
the left panel tucks inside, which is why the tuck-in panel is cut fractionally
narrower — otherwise the fold bows the cover instead of closing flat. If your
printer folds the other way, swap the panel order in the two sheets at the
bottom of `build.mjs` rather than re-laying anything out.

## Three things that are load-bearing

**The offer is not typed in here.** `design/lib/source.mjs` parses the levels,
prices and benefits out of `src/lib/sponsors.ts`, and the date, venue and times
out of `src/lib/email.ts` — the same modules the website renders from. Change a
price and rebuild, and the leaflet, the letter and the site move together.
Every extractor throws when it matches nothing, so a rename fails the build
loudly instead of printing five hundred copies with a gap where a fact was.

**The levels table is derived, never described.** A check for every benefit a
level unlocks and a dash for every one it does not, straight from
`SPONSOR_BENEFITS`. Prose is how the letter's first draft came to say "the
higher levels add your logo to the race t-shirt" — true of Bronze, false of
Gold.

**`render.mjs` fails the build if anything overflows a panel or crosses a
fold.** A leaflet that overflows silently is a stack of paper with a sentence
creased through the middle, and you find out at the printer. Decorative shapes
are exempt because they are *meant* to run off the edge; they are marked
`aria-hidden`, and the check hides them before measuring — with them visible
the disc behind the schedule reported 125px of overflow on a panel that was
two-thirds empty.

## Design notes

The visual language is a near-black field, two-tone display type, numbered
discs and a hairline rule under every heading. The palette is the site's own
(`src/app/globals.css`), and three fields alternate — charcoal, deep green,
cream — so no two adjacent panels share a colour and the folds stay legible.

**The cover field is charcoal rather than deep green** because the two display
colours have to sit on it: Oromo red on dark green does not reach 3:1, and the
cover depends on that pair. Colour is used at display size only, so nothing
here needs a reader to tell two similar hues apart, and a black-and-white
office printer degrades it to greys rather than losing information.

**The PDF is vector**, not a raster of the PNGs — nothing in this design uses
`mix-blend-mode`, CSS masks or backdrop filters, which is what forces other
Chromium print jobs to raster. Text stays selectable and a print shop can pull
it straight in.

Anton and DM Sans are vendored under `fonts/` (SIL OFL) and embedded in the
HTML as data URIs, so the file renders identically on any machine and needs no
network.

## Before this is printed

The same cautions as the letter, none of which appear on the leaflet:

1. **The sponsorship prices are placeholders** (ADR-0006) — from a sample
   flyer, not an agreed offer.
2. **No runner-count figure appears**, because nobody has a real one for a
   first running. It is the first thing a business asks; add it when it exists.
3. **No artwork deadline** — the leaflet says to ask, rather than guessing.
