/**
 * The printed pieces' palettes, as data.
 *
 * Two of them, and both are live — the tri-fold, the letterhead and the letter
 * all take `--palette navy` or `--palette ink` and build the whole set either
 * way. A second hard-coded copy of the colours in each build script is exactly
 * the drift this directory exists to prevent, so the choice is a parameter
 * rather than an edit.
 *
 * Both came out of a four-way comparison rendered as covers rather than
 * argued about in prose — two rounds of reasoning from contrast ratios
 * produced two rejected palettes, and one comparison sheet settled it. When a
 * colour note comes back twice, render options.
 *
 * The token NAMES are what the build scripts use, so a third palette is this
 * file plus nothing:
 *
 *   field / fieldSoft / fieldDeep   the dark panels and their decoration
 *   onDark / onDarkMuted            text on those panels
 *   d1 / d2                         the two words of the cover headline
 *   accent                          rules, discs, bullets, panel rails
 *   accentSoft                      the warm highlight on dark panels
 *   accentInk                       the same hue at a weight readable on cream
 *   cream / paper / ink / inkSoft / inkMuted / rule
 */

export const PALETTES = {
  /**
   * A — midnight navy and amber. The palette of the proposal decks this work
   * was modelled on, and the one picked from the comparison.
   */
  navy: {
    id: "navy",
    label: "Midnight navy + amber",
    field: "#131C3A",
    fieldSoft: "#1B2650",
    fieldDeep: "#0D1428",
    onDark: "#E8ECF7",
    onDarkMuted: "#A7B0CC",
    d1: "#F08A24",
    d2: "#FFD166",
    accent: "#F08A24",
    accentSoft: "#FFD166",
    // Amber on cream is 1.8:1 and unreadable. Same hue, dropped to a weight
    // that clears 4.5:1, for labels on the light panels.
    accentInk: "#B4630C",
    cream: "#FAF7F0",
    paper: "#FFFFFF",
    ink: "#16182A",
    inkSoft: "#4C4F62",
    inkMuted: "#8A8D9C",
    rule: "#E2DED2",
  },

  /**
   * B — near-black and a single amber. This is what gadaglobalrun.com already
   * looks like, so the printed pieces and the website match exactly. One
   * accent rather than two: the cover headline is white over amber instead of
   * orange over amber.
   */
  ink: {
    id: "ink",
    label: "Ink + one amber",
    field: "#15161A",
    fieldSoft: "#1E2026",
    fieldDeep: "#0C0D10",
    onDark: "#F2F2F4",
    onDarkMuted: "#A9AAB2",
    d1: "#FFFFFF",
    d2: "#F5C842",
    accent: "#F5C842",
    accentSoft: "#F5C842",
    // The site's yellow is 1.6:1 on cream. This is it at a readable weight.
    accentInk: "#8A6800",
    cream: "#FAF8F2",
    paper: "#FFFFFF",
    ink: "#15161A",
    inkSoft: "#4A4A50",
    inkMuted: "#8A8A92",
    rule: "#E4E0D6",
  },
};

/** Reads `--palette <id>` from argv, defaulting to the chosen one. */
export function paletteFromArgs(argv = process.argv.slice(2)) {
  const i = argv.indexOf("--palette");
  const id = i === -1 ? "navy" : argv[i + 1];
  const palette = PALETTES[id];
  if (!palette) {
    throw new Error(
      `unknown palette "${id}" — expected one of ${Object.keys(PALETTES).join(", ")}`,
    );
  }
  return palette;
}
