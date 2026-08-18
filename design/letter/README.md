# Letterhead and the sponsorship letter — Word documents

Two `.docx` files an organizer opens, types into, saves and prints. This is the
half of the letter that lives outside the website: `/sponsors/letter` is for
printing and copying from a browser, these are for attaching to an email or
handing to someone who works in Word.

```bash
npm i --no-save --no-package-lock docx     # not a dependency of the site

node design/letter/build.mjs --blank       # -> Gada-Global-Letterhead.docx
node design/letter/build.mjs               # -> Gada-Global-5K-Sponsor-Letter.docx
node design/letter/build.mjs --tier gold   # -> …-Sponsor-Letter-gold.docx
```

`--out <path>` writes somewhere other than the working directory. The generated
files are gitignored: they are outputs, and a committed `.docx` is a second
copy of the offer free to drift from the first.

## The offer is not typed into this script

`build.mjs` parses the levels, prices and benefits out of `src/lib/sponsors.ts`
and the event facts out of `src/lib/email.ts` — the same modules the website
renders from. Change a price in `sponsors.ts`, rebuild, and both documents
follow.

That is the whole reason this is a build script rather than a `.docx` somebody
hand-edited once. The three proposal documents in this repo
(`GADA_GLOBAL_5K_BUSINESS_PROPOSAL.md`, `public/proposal.html`,
`proposal/index.html`) went stale exactly that way and still carry the old
venue and the 7:30 AM start.

Every extractor throws if it matches nothing, so a rename in `sponsors.ts`
fails the build loudly instead of quietly producing a letter with gaps in it.

## What is in each file

**`--blank`** is the letterhead on its own: masthead, brand rule, footer, and a
skeleton body. It is the file that outlives the sponsorship letter — the next
thank-you, permit cover note or school letter is written into this, so nobody
rebuilds a masthead from memory and gets the colours or the reply address
slightly wrong.

**The letter** is the same words as `/sponsors/letter`. With no `--tier` it
presents all four levels; with one it proposes that level. Either way the
benefit list is **derived**, never described — an earlier prose version said
"the higher levels add your logo to the race t-shirt", which is true in a
Bronze letter and false in a Gold one.

Everything a person must fill in is a bracketed prompt in capitals —
`[BUSINESS NAME]`, `[DATE]`, `[YOUR NAME]`. A blank line can be sent by
accident; `[BUSINESS NAME]` cannot, and Word's find-and-replace picks them all
up in one pass.

## Before you send one

The same four things the web page warns about, none of which print:

1. **The prices are confirmed; the benefits are not.** $5,000 / $2,500 /
   $1,000 / $500 are the organizers' own figures. The four benefits are still
   the sample flyer's, and Silver and Bronze unlock the same two — so nothing
   justifies the $500 difference. Settle that before this goes out widely.
2. **Add how many runners you expect.** It is the first question a business
   asks and the most persuasive line in the letter. It is left out because
   nobody has a real number for a first running.
3. **The artwork deadline** is promised, not stated. Get it from whoever prints
   the shirts.
4. **There is no postal address** on the letterhead — it reads "Washington, DC",
   because the venue address is the park's, not the organization's. Add the
   real one in `letterhead()` when there is one.

## Gotchas

- **US Letter is set explicitly.** docx-js defaults to A4, which reflows the
  whole letter and is invisible until it prints wrong.
- **The brand rule is a table, not a border.** A paragraph border cannot be two
  colours, and the rule is deep green running into gold.
- **Table cells carry `WidthType.DXA` widths that sum to the table width.**
  Percentages break in Google Docs.
- **`ShadingType.CLEAR`, never `SOLID`** — solid renders black.
- **LibreOffice cannot render these in the agent sandbox**: only
  `libreoffice-core` is installed, with no writer module, so `soffice
  --convert-to pdf` fails on any file including a plain `.txt`. Verify with
  `docx-preview` in Chromium instead — that is what produced the checked
  renders of both files.
