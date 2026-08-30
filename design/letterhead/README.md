# Sponsorship letterhead

US Letter portrait. One sheet, in editable and print-ready form:

| File | Use |
|---|---|
| `gada-5k-letterhead-blank.docx` | **The one to write in.** Open in Word, type, print |
| `gada-5k-letterhead-letter.docx` | The model sponsorship request, editable — change the bracketed fields and send |
| `gada-5k-letterhead-blank.pdf` | Print-ready empty sheet, for a print shop or pre-printed stock |
| `gada-5k-letterhead-letter.pdf` | Print-ready model letter |

```bash
pip install python-docx                # build-time only, not a site dependency
python3 design/letterhead/build.py     # sponsors.ts -> both HTML sheets
node    design/letterhead/render.mjs   # -> 2550x3300 PNGs (300dpi)
node    design/letterhead/pdf.mjs      # -> print PDFs
python3 design/letterhead/word.py      # -> editable .docx (needs the PNG above)
```

## The Word files

The artwork is **not** in the body. It is one full-page image in the page
header, anchored to the page and behind the text, so nobody editing the letter
can select it, drag it or delete it by accident, and it repeats by itself if a
letter runs to a second page. Margins are taken from the design, so typed text
lands in the same column as the printed sample: 1.73 in from the top, 0.95 in
clear of the footer, 0.68 in either side.

The body is set in **Georgia**, not the IBM Plex Serif of the print PDFs —
Georgia ships with Windows and macOS, so the file looks right on a machine that
has installed nothing. For an exact match to the PDF, install the three
`IBMPlexSerif-*.ttf` files in this folder, then select all and change the font.

The model letter runs to about two-thirds of the page, so there is room to add a
paragraph without spilling onto a second sheet. `render.mjs` checks that for the
printed sheet; nothing can check it for Word, so glance at the page count after
a long edit.

Do not name a file in this folder `docx.py` — it shadows the python-docx library
and the import in `word.py` silently resolves to the wrong module.

The partnership levels quoted in the model letter are read from
`src/lib/sponsors.ts`, and the letter's own wording lives in `LETTER_BLOCKS` in
`build.py`, which the printed sheet and the Word file are both generated from.
So a letter posted to a sponsor cannot quote a price the website has since
changed, and the editable file cannot drift from the printed one.
`render.mjs` fails if the letter body runs past the footer.

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
