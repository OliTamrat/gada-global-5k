# Sponsorship letterhead

US Letter portrait, two sheets:

| File | Use |
|---|---|
| `gada-5k-letterhead-blank.pdf` | The empty sheet — print it, or use it as a background and type over it |
| `gada-5k-letterhead-letter.pdf` | The same sheet carrying a model sponsorship request, so there is wording to edit rather than a blank page to face |

```bash
python3 design/letterhead/build.py    # sponsors.ts -> both HTML sheets
node    design/letterhead/render.mjs  # -> 2550x3300 PNGs (300dpi)
node    design/letterhead/pdf.mjs     # -> print PDFs
```

The partnership levels quoted in the model letter are read from
`src/lib/sponsors.ts`, so a letter posted to a sponsor cannot quote a price the
website has since changed. `render.mjs` fails if the letter body runs past the
footer.

## Design constraints

A letterhead has to survive an office printer, a photocopier and a scan, so it
is deliberately ink-light: paper stays paper, one rule under the masthead, and a
Washington watermark at 9% opacity that a copier will mostly ignore.

Three typefaces, each with one job — Big Shoulders for the wordmark, Geist Mono
for the letter-spaced marks in the masthead and footer, IBM Plex Serif for the
letter itself. The body was set in mono first and read like console output
rather than correspondence.

Playwright is not a site dependency; install it only when rebuilding:

```bash
npm i --no-save playwright-core   # then set CHROMIUM_PATH to a Chromium binary
```
