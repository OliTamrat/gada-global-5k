"""
Official sponsorship letterhead — US Letter portrait, 8.5 x 11 in.

Two files come out of this: a blank sheet to write on, and the same sheet
carrying a model sponsorship request so the organizers have wording to edit
rather than a blank page to face.

The partnership levels in the model letter are read from
``src/lib/sponsors.ts``, so a letter posted to a sponsor cannot quote a price
the website has since changed.

    python3 design/letterhead/build.py
    node    design/letterhead/render.mjs
    node    design/letterhead/pdf.mjs

Designed to be ink-light: paper stays paper, one gold rule, one red mark, and a
watermark faint enough to survive a photocopier. A letterhead is a surface for
someone else's words — it should not compete with them.
"""
import re, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).resolve().parent
SRC = (ROOT / "src/lib/sponsors.ts").read_text()

TIERS = [(m[1], m[2]) for m in re.findall(
    r'id:\s*"(\w+)",\s*name:\s*"([^"]+)",\s*amount:\s*"([^"]+)"', SRC)]
if len(TIERS) < 2:
    sys.exit("sponsors.ts tier extractor matched nothing — fix the regex")

LEVELS_LINE = " · ".join(f"{name} {amount}" for name, amount in TIERS)

LOGO = "../../public/images/brand/gada-global-logo.png"
DC   = "../../public/images/course/washington-monument.jpg"

CSS = """
@font-face { font-family:"Shoulders"; src:url("../brochure/BigShoulders-Bold.ttf"); font-weight:700; }
@font-face { font-family:"Mono"; src:url("../brochure/GeistMono-Regular.ttf"); font-weight:400; }
@font-face { font-family:"Mono"; src:url("../brochure/GeistMono-Bold.ttf"); font-weight:700; }
@font-face { font-family:"Text"; src:url("IBMPlexSerif-Regular.ttf"); font-weight:400; }
@font-face { font-family:"Text"; src:url("IBMPlexSerif-Bold.ttf"); font-weight:700; }
@font-face { font-family:"Text"; src:url("IBMPlexSerif-Italic.ttf"); font-style:italic; }
:root{ --red:#CE1126; --gold:#C8991F; --gold-hot:#F5C842; --ink:#141210;
       --muted:#5C564C; --paper:#FCFAF5; --rule:rgba(20,18,16,.16); }
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:850px;height:1100px}
body{background:var(--paper);color:var(--ink);font-family:"Mono",monospace;
     position:relative;overflow:hidden;-webkit-font-smoothing:antialiased}

/* Washington, faint enough that a photocopier will mostly ignore it. */
.watermark{position:absolute;right:-60px;bottom:96px;width:520px;height:420px;
  overflow:hidden;pointer-events:none;opacity:.09;
  -webkit-mask-image:radial-gradient(70% 70% at 62% 60%,#000 20%,transparent 78%);
  mask-image:radial-gradient(70% 70% at 62% 60%,#000 20%,transparent 78%)}
.watermark img{width:100%;height:100%;object-fit:cover;object-position:56% 30%;
  filter:grayscale(1) contrast(1.2) brightness(.9)}

.sheet{position:absolute;inset:0;padding:52px 68px 0;display:flex;flex-direction:column}

/* ── Masthead ─────────────────────────────────────────────────────────── */
.head{display:flex;justify-content:space-between;align-items:flex-start}
.mark{display:flex;align-items:center;gap:14px}
.mark img{width:70px;height:60px;object-fit:contain}
.name{font-family:"Shoulders",sans-serif;font-weight:700;font-size:31px;
  letter-spacing:.07em;line-height:1}
.name em{font-style:normal;color:var(--red)}
.name-sub{font-size:8.5px;letter-spacing:.24em;color:var(--muted);margin-top:6px;
  text-transform:uppercase}
.head-right{text-align:right;font-size:9px;letter-spacing:.13em;line-height:2;color:var(--muted)}
.head-right b{color:var(--ink);font-weight:700}

.rule{height:3px;margin-top:18px;
  background:linear-gradient(90deg,var(--red) 0 86px,var(--gold-hot) 86px 214px,
    rgba(20,18,16,.34) 214px 100%)}

/* ── Body: the part that belongs to whoever is writing ────────────────── */
.body{flex:1;padding:40px 0 0;font-family:"Text",Georgia,serif;
  font-size:13.5px;line-height:1.78;color:var(--ink)}
.body p{margin-bottom:13px}
.meta{font-size:12.5px;line-height:1.72;color:var(--muted);margin-bottom:26px}
.subject{font-weight:700;margin-bottom:16px}
.levels{border-left:3px solid var(--gold-hot);padding:9px 0 9px 16px;margin:3px 0 16px;
  font-family:"Mono",monospace;font-size:11.5px;letter-spacing:.03em;line-height:1.9;color:var(--ink)}
.sign{margin-top:24px;font-size:13px;line-height:1.8}
.sign .line{width:220px;height:1px;background:var(--rule);margin:30px 0 8px}

/* ── Footer ───────────────────────────────────────────────────────────── */
.foot{padding:0 0 40px}
.foot-rule{height:1px;background:var(--rule);margin-bottom:13px}
.foot-row{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;
  font-size:9px;letter-spacing:.13em;line-height:1.95;color:var(--muted)}
.foot-row b{color:var(--ink);font-weight:700}
.foot-tag{text-align:right;color:var(--gold)}
"""

HEAD = f"""
  <header class="head">
    <div class="mark">
      <img src="{LOGO}" alt="">
      <div>
        <div class="name"><em>GADA</em> GLOBAL</div>
        <div class="name-sub">Gada Global Inc. &nbsp;·&nbsp; Washington, D.C.</div>
      </div>
    </div>
    <div class="head-right">
      <div><b>GADA GLOBAL 5K RUN</b></div>
      <div>Saturday, October 3, 2026</div>
      <div>Rock Creek Park Tennis Center</div>
    </div>
  </header>
  <div class="rule"></div>"""

FOOT = """
  <footer class="foot">
    <div class="foot-rule"></div>
    <div class="foot-row">
      <div>
        <div><b>GADA GLOBAL INC.</b> &nbsp;·&nbsp; WASHINGTON, D.C.</div>
        <div>INFO@GADAGLOBALRUN.COM &nbsp;·&nbsp; GADAGLOBALRUN.COM</div>
      </div>
      <div class="foot-tag">
        RUN TOGETHER &nbsp;·&nbsp; ACHIEVE TOGETHER<br>INSPIRE TOGETHER
      </div>
    </div>
  </footer>"""

LETTER = f"""
  <div class="body">
    <div class="meta">
      [Date]<br><br>
      [Recipient name, title]<br>
      [Organization]<br>
      [Street address]<br>
      [City, State ZIP]
    </div>

    <div class="subject">Re: Partnership in the Gada Global 5K Run — Saturday, October 3, 2026</div>

    <p>Dear [Name],</p>

    <p>
      Gada Global Inc. produces timed road races and cultural programming in the
      Washington DC metropolitan area. On Saturday, October 3, 2026 we will hold
      the Gada Global 5K Run at the Rock Creek Park Tennis Center — a field of up
      to 500 runners, a five-hour programme from packet pickup at 7:00 AM through
      a cultural festival at noon, and a $1,200 prize purse. I am writing to
      invite [Organization] to partner with us.
    </p>

    <p>
      Partnership places your brand in front of runners, their families and
      supporters for the whole morning rather than for a moment: on the official
      race shirt every entrant receives, on venue signage from before the first
      arrival, from the stage at the ceremony and the awards, and across the
      event's website and social channels. Four levels are available:
    </p>

    <div class="levels">{LEVELS_LINE}</div>

    <p>
      Each level includes complimentary entries for your team, and the top level
      carries category exclusivity, presenting billing and a written post-event
      report. In-kind contributions — water, food, printing, medical cover or
      prize goods — can be credited against a level. The full offer is at
      gadaglobalrun.com/sponsors.
    </p>

    <p>
      I would welcome the chance to discuss which level fits your goals. Shirt and
      bib printing close well before race day, so an early decision secures the
      widest placement. Please reply to this letter or write to
      info@gadaglobalrun.com and we will send the agreement and the current
      artwork deadline.
    </p>

    <div class="sign">
      With thanks,
      <div class="line"></div>
      [Name]<br>
      [Title] &nbsp;·&nbsp; Gada Global Inc.<br>
      info@gadaglobalrun.com
    </div>
  </div>"""

BLANK = '<div class="body"></div>'

SHELL = """<!doctype html><meta charset="utf-8"><style>%s</style>
<body><div class="watermark"><img src="%s" alt=""></div>
<div class="sheet">%s%s%s</div></body>"""

(OUT / "letterhead-blank.html").write_text(SHELL % (CSS, DC, HEAD, BLANK, FOOT))
(OUT / "letterhead-letter.html").write_text(SHELL % (CSS, DC, HEAD, LETTER, FOOT))
print(f"levels from sponsors.ts: {LEVELS_LINE}")
print("letterhead-blank.html, letterhead-letter.html written")
