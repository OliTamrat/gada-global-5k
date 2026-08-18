"""
Generates the printed tri-fold sponsorship brochure.

The offer is read out of ``src/lib/sponsors.ts`` — the same module the website
renders from — so a price or benefit can never differ between the brochure a
sponsor is handed and the page they visit afterwards. Run it from the repo root:

    python3 design/brochure/build.py      # writes outside.html / inside.html
    node design/brochure/render.mjs       # -> PNGs at 300dpi
    node design/brochure/pdf.mjs          # -> two-page US Letter PDF

Fold order, left to right as printed:
    outside   back cover | at-a-glance flap | front cover
    inside    why partner | partnership levels (spans two panels)
The tuck-in panel is cut 4px narrower so a roll fold closes flat. If your
printer folds the other way, swap the panel order in the two writes at the
bottom of this file.
"""
import re, json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).resolve().parent
SRC = (ROOT / "src/lib/sponsors.ts").read_text()

TIERS = [{"id": m[0], "name": m[1], "amount": m[2], "blurb": " ".join(m[3].split())}
         for m in re.findall(
    r'id:\s*"(\w+)",\s*name:\s*"([^"]+)",\s*amount:\s*"([^"]+)",\s*blurb:\s*\n?\s*"([^"]+)"', SRC, re.S)]

BEN = []
for m in re.finditer(
    r'id:\s*"(\w+)",\s*label:\s*"([^"]+)",\s*detail:\s*\n?\s*"([^"]+)",\s*icon:\s*"(\w+)",\s*tiers:\s*\[([^\]]+)\]', SRC, re.S):
    BEN.append({"id": m.group(1), "label": m.group(2),
                "detail": " ".join(m.group(3).split()), "icon": m.group(4),
                "tiers": re.findall(r'"(\w+)"', m.group(5))})

# Fail loudly rather than printing a brochure with half an offer on it.
if len(TIERS) < 2 or len(BEN) < 2:
    sys.exit(f"sponsors.ts extractor matched {len(TIERS)} tiers / {len(BEN)} benefits — fix the regex")

CSS = """
@font-face { font-family:"Shoulders"; src:url("BigShoulders-Bold.ttf"); font-weight:700; }
@font-face { font-family:"Shoulders"; src:url("BigShoulders-Regular.ttf"); font-weight:400; }
@font-face { font-family:"Mono"; src:url("GeistMono-Regular.ttf"); font-weight:400; }
@font-face { font-family:"Mono"; src:url("GeistMono-Bold.ttf"); font-weight:700; }
:root{
  --gold:#F5C842; --gold-hot:#FFE9A8; --gold-deep:#B07C10;
  --red:#CE1126; --ink:#12100C; --paper:#F7F3E9; --ground:#0B0A08;
  --rule:rgba(18,16,12,.14);
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1100px;height:850px}
body{font-family:"Mono",monospace;background:var(--ground);display:flex;overflow:hidden;
  -webkit-font-smoothing:antialiased}
.panel{position:relative;overflow:hidden;height:850px}
/* Roll fold: the panel that tucks inside is cut narrower so the fold closes flat. */
.p-wide{width:368px} .p-narrow{width:364px}
.fold{position:absolute;top:0;bottom:0;width:1px;background:rgba(255,255,255,.10);z-index:9}
h1,h2,h3,.num{font-family:"Shoulders",sans-serif;font-weight:700;text-transform:uppercase}
.eyebrow{font-size:9.5px;font-weight:700;letter-spacing:.24em;text-transform:uppercase}
"""

def qr_block(dark=True):
    fg = "#FFFFFF" if dark else "#12100C"
    return f"""
      <div style="display:flex;align-items:center;gap:14px">
        <div style="width:96px;height:96px;padding:8px;background:#fff;flex:none">
          <img src="sponsors-qr.png" style="width:100%;height:100%;display:block">
        </div>
        <div style="font-size:10.5px;line-height:1.75;color:{fg};letter-spacing:.05em">
          <div style="font-weight:700">gadaglobalrun.com/sponsors</div>
          <div style="opacity:.72">Scan for the full offer,<br>or email us to discuss<br>a custom package.</div>
        </div>
      </div>"""

# ══════════════════════════════════ OUTSIDE ══════════════════════════════
BACK = f"""
<div class="panel p-narrow" style="background:var(--ground);padding:40px 34px">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:26px">
    <img src="../../public/images/brand/gada-global-logo.png" style="width:56px;height:48px;object-fit:contain">
    <div>
      <div style="font-family:Shoulders;font-weight:700;font-size:24px;letter-spacing:.06em;color:#fff">
        <span style="color:var(--red)">GADA</span> GLOBAL</div>
      <div style="font-size:8.5px;letter-spacing:.2em;color:rgba(255,255,255,.6);margin-top:4px">GADA GLOBAL INC.</div>
    </div>
  </div>

  <div class="eyebrow" style="color:var(--gold);margin-bottom:12px">The Organization</div>
  <p style="font-size:11px;line-height:1.85;color:rgba(255,255,255,.85)">
    Gada Global Inc. produces timed road races and cultural programming in the
    Washington DC metropolitan area. We design, staff and operate each event
    end to end — registration and payments, course operations, wave starts,
    live public results, and a written report to every partner afterwards.
  </p>
  <p style="font-size:11px;line-height:1.85;color:rgba(255,255,255,.85);margin-top:12px">
    The Gada Global 5K Run is our flagship event, held each October alongside
    Irrecha, the Oromo thanksgiving festival.
  </p>

  <div style="height:1px;background:rgba(255,255,255,.16);margin:24px 0"></div>

  <div class="eyebrow" style="color:var(--gold);margin-bottom:12px">Contact</div>
  <div style="font-size:11.5px;line-height:2;color:#fff;letter-spacing:.04em">
    <div style="font-weight:700">info@gadaglobalrun.com</div>
    <div style="opacity:.78">gadaglobalrun.com</div>
    <div style="opacity:.78">Washington, D.C.</div>
  </div>

  <div style="margin-top:24px">{qr_block(True)}</div>

  <div style="position:absolute;left:34px;right:34px;bottom:32px">
    <div style="height:1px;background:rgba(255,255,255,.16);margin-bottom:12px"></div>
    <div style="font-size:8.5px;letter-spacing:.16em;color:rgba(255,255,255,.5);line-height:1.9">
      SPONSORSHIP PROSPECTUS 2026<br>
      GADA GLOBAL INC. &nbsp;·&nbsp; ALL RIGHTS RESERVED
    </div>
  </div>
</div>"""

GLANCE = f"""
<div class="panel p-wide" style="background:#101008;padding:40px 32px">
  <div class="eyebrow" style="color:var(--gold);margin-bottom:14px">The Event at a Glance</div>
  <h2 style="font-size:34px;line-height:.95;color:#fff;margin-bottom:22px">
    Saturday<br>3 October<br><span style="color:var(--red)">2026</span></h2>

  <div style="font-size:11px;line-height:1.8;color:rgba(255,255,255,.86);letter-spacing:.03em">
    <div style="font-weight:700;color:#fff">Rock Creek Park Tennis Center</div>
    <div style="opacity:.8">5220 16th Street NW, Washington, DC 20011</div>
  </div>

  <div style="height:1px;background:rgba(255,255,255,.14);margin:22px 0"></div>

  <table style="width:100%;border-collapse:collapse;font-size:10.5px;color:rgba(255,255,255,.88)">
    {"".join(f'''<tr>
      <td style="padding:7px 0;letter-spacing:.14em;color:var(--gold);font-weight:700;width:76px">{t}</td>
      <td style="padding:7px 0;letter-spacing:.03em">{v}</td></tr>''' for t, v in [
      ("7:00", "Packet pickup opens"),
      ("8:15", "Opening ceremony"),
      ("9:00", "Race start — three waves"),
      ("10:00", "Awards and prize presentation"),
      ("10:45", "Cultural festival until noon"),
    ])}
  </table>

  <div style="height:1px;background:rgba(255,255,255,.14);margin:22px 0"></div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px 12px">
    {"".join(f'''<div>
      <div class="num" style="font-size:30px;color:var(--gold);line-height:1">{n}</div>
      <div style="font-size:9px;letter-spacing:.14em;color:rgba(255,255,255,.72);margin-top:4px;text-transform:uppercase">{l}</div>
    </div>''' for n, l in [
      ("500", "Runner field cap"),
      ("5 HRS", "On-site programme"),
      ("$1,200", "Prize purse"),
      ("3", "Start waves"),
    ])}
  </div>

  <div style="position:absolute;left:32px;right:32px;bottom:34px">
    <div style="font-size:10px;line-height:1.8;color:rgba(255,255,255,.7);letter-spacing:.04em">
      Timed event with live public results, age-group rankings and a
      $1,200 purse split evenly between the men's and women's fields.
    </div>
  </div>
</div>"""

FRONT = f"""
<div class="panel p-wide" style="background:var(--ground)">
  <img src="../../public/images/course/washington-monument.jpg" style="position:absolute;inset:0;width:100%;height:100%;
    object-fit:cover;object-position:56% 28%;filter:contrast(1.1) saturate(1.25) brightness(.98)">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,#FFB01F 0%,#E08A12 46%,#2A1A04 100%);
    mix-blend-mode:color;opacity:.5"></div>
  <div style="position:absolute;inset:0;background:
    linear-gradient(180deg,rgba(7,7,3,.72) 0%,rgba(7,7,3,.10) 26%,rgba(7,7,3,.72) 62%,rgba(7,7,3,.97) 88%)"></div>
  <div style="position:absolute;inset:0;background:
    radial-gradient(220px 190px at 58% 40%,rgba(255,226,140,.4),transparent 72%);mix-blend-mode:screen"></div>

  <div style="position:relative;padding:40px 32px;height:100%;display:flex;flex-direction:column">
    <div style="display:flex;align-items:center;gap:11px">
      <img src="../../public/images/brand/gada-global-logo.png" style="width:52px;height:44px;object-fit:contain">
      <div style="font-family:Shoulders;font-weight:700;font-size:21px;letter-spacing:.06em;color:#fff">
        <span style="color:var(--red)">GADA</span> GLOBAL</div>
    </div>

    <div style="margin-top:auto">
      <div class="eyebrow" style="color:#fff;background:rgba(7,7,3,.86);border-left:4px solid var(--red);
        display:inline-block;padding:7px 12px 6px;margin-bottom:18px">Sponsorship Prospectus 2026</div>
      <h1 style="font-size:78px;line-height:.8;color:#fff;letter-spacing:-.015em;
        text-shadow:2px 2px 0 #2B2620,4px 4px 0 #171410,6px 6px 0 #0A0908,8px 8px 0 #000,10px 11px 22px rgba(0,0,0,.8)">
        Gada<br>Global<br><span style="color:var(--red)">5K</span> Run</h1>

      <div style="margin-top:22px;background:linear-gradient(100deg,var(--gold),var(--gold-hot) 52%,var(--gold));
        color:#120C00;padding:9px 16px 7px;display:inline-block;box-shadow:0 5px 0 var(--gold-deep)">
        <div style="font-family:Shoulders;font-weight:700;font-size:23px;letter-spacing:.03em;white-space:nowrap">
          Saturday 3 October 2026</div>
      </div>

      <div style="font-size:10.5px;line-height:1.85;color:rgba(255,255,255,.92);margin-top:16px;letter-spacing:.05em">
        <div style="font-weight:700">Rock Creek Park Tennis Center</div>
        <div style="opacity:.82">Washington, D.C. &nbsp;·&nbsp; 9:00 AM start</div>
      </div>
      <div style="font-size:10px;letter-spacing:.16em;color:var(--gold);margin-top:22px;font-weight:700">
        PARTNERSHIP LEVELS FROM $500 TO $5,000</div>
    </div>
  </div>
</div>"""

# ══════════════════════════════════ INSIDE ═══════════════════════════════
VALUE = [
    ("Five hours, not five seconds",
     "Runners, families and supporters are on site from packet pickup at 7:00 AM through the "
     "cultural festival at noon. Sponsor signage is in front of them for the entire programme."),
    ("A shirt that leaves with 500 people",
     "Every registered runner receives the official race shirt. Logos printed on it are worn "
     "around the DC metro area long after October 3."),
    ("A defined, reachable audience",
     "Runners and families across the Washington DC metropolitan area, and the Oromo diaspora "
     "community the event was founded to serve."),
    ("Reported, not estimated",
     "Registration, results and merchandise run on our own platform. Platinum partners receive "
     "a written post-event report — field size, demographics and campaign placement."),
]

def check(on, dark=False):
    if on:
        return ('<span style="display:inline-flex;width:17px;height:17px;border-radius:50%;'
                'background:var(--gold);align-items:center;justify-content:center">'
                '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#12100C" '
                'stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">'
                '<path d="M20 6L9 17l-5-5"/></svg></span>')
    return ('<span style="display:inline-block;width:17px;height:17px;border-radius:50%;'
            'border:1px solid rgba(18,16,12,.22)"></span>')

WHY = f"""
<div class="panel p-narrow" style="background:var(--paper);padding:40px 30px;color:var(--ink)">
  <div class="eyebrow" style="color:var(--gold-deep);margin-bottom:12px">Why Partner</div>
  <h2 style="font-size:29px;line-height:1.02;margin-bottom:8px">An audience that<br>stays all morning</h2>
  <p style="font-size:10.5px;line-height:1.8;color:rgba(18,16,12,.72);margin-bottom:20px">
    A 5K is not a passive audience. People arrive early, stay for the awards
    and eat lunch at the festival.
  </p>
  {"".join(f'''
  <div style="border-top:1px solid var(--rule);padding:13px 0">
    <div style="display:flex;gap:9px;align-items:baseline">
      <span style="font-family:Shoulders;font-weight:700;font-size:15px;color:var(--red)">{i+1:02d}</span>
      <div>
        <div style="font-family:Shoulders;font-weight:700;font-size:15px;letter-spacing:.01em;line-height:1.15">{h}</div>
        <p style="font-size:10px;line-height:1.75;color:rgba(18,16,12,.72);margin-top:5px">{t}</p>
      </div>
    </div>
  </div>''' for i, (h, t) in enumerate(VALUE))}

  <div style="position:absolute;left:30px;right:30px;bottom:34px;background:var(--ink);color:#fff;padding:14px 16px">
    <div class="eyebrow" style="color:var(--gold);margin-bottom:6px">In-kind welcome</div>
    <p style="font-size:10px;line-height:1.75;color:rgba(255,255,255,.86)">
      Water, food, printing, medical cover and prize goods can be credited
      against a level. Tell us what you can supply.
    </p>
  </div>
</div>"""

def tier_col(t, i):
    count = sum(1 for b in BEN if t["id"] in b["tiers"])
    accent = "var(--red)" if i == 0 else "var(--ink)"
    head_bg = "var(--ink)" if i == 0 else "transparent"
    head_fg = "#fff" if i == 0 else "var(--ink)"
    return f"""
    <th style="width:86px;vertical-align:bottom;padding:0 6px 12px;text-align:center;background:{head_bg}">
      <div style="font-family:Shoulders;font-weight:700;font-size:17px;letter-spacing:.05em;color:{head_fg};padding-top:12px">{t['name']}</div>
      <div style="font-family:Shoulders;font-weight:700;font-size:26px;color:{'var(--gold)' if i==0 else accent};line-height:1.05">{t['amount']}</div>
      <div style="font-size:8.5px;letter-spacing:.1em;color:{'rgba(255,255,255,.7)' if i==0 else 'rgba(18,16,12,.6)'};margin-top:3px">{count} OF {len(BEN)}</div>
    </th>"""

LEVELS = f"""
<div class="panel" style="width:736px;background:var(--paper);padding:40px 34px;color:var(--ink)">
  <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:6px">
    <div>
      <div class="eyebrow" style="color:var(--gold-deep);margin-bottom:10px">Partnership Levels</div>
      <h2 style="font-size:34px;line-height:1">Choose the level<br>that fits your reach</h2>
    </div>
    <div style="text-align:right;font-size:10px;line-height:1.8;color:rgba(18,16,12,.7);letter-spacing:.04em">
      <div style="font-weight:700;color:var(--ink)">Artwork deadline</div>
      <div>Shirt and bib printing close<br>well before race day — ask<br>for the current date.</div>
    </div>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-top:18px">
    <thead><tr>
      <th style="text-align:left;vertical-align:bottom;padding-bottom:12px">
        <div style="font-size:9.5px;letter-spacing:.2em;color:rgba(18,16,12,.55);text-transform:uppercase">What each level includes</div>
      </th>
      {"".join(tier_col(t, i) for i, t in enumerate(TIERS))}
    </tr></thead>
    <tbody>
      {"".join(f'''<tr>
        <td style="border-top:1px solid var(--rule);padding:9px 12px 9px 0;font-size:10.5px;line-height:1.5;letter-spacing:.02em">{b['label']}</td>
        {"".join(f'<td style="border-top:1px solid var(--rule);text-align:center;padding:9px 6px;{"background:rgba(18,16,12,.04)" if j==0 else ""}">{check(t["id"] in b["tiers"])}</td>' for j, t in enumerate(TIERS))}
      </tr>''' for b in BEN)}
    </tbody>
  </table>

  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:20px">
    {"".join(f'''<div style="border-top:3px solid {'var(--red)' if i==0 else 'var(--gold)'};padding-top:9px">
      <div style="font-family:Shoulders;font-weight:700;font-size:13px;letter-spacing:.05em">{t['name']}</div>
      <p style="font-size:9.5px;line-height:1.65;color:rgba(18,16,12,.72);margin-top:4px">{t['blurb']}</p>
    </div>''' for i, t in enumerate(TIERS))}
  </div>

  <div style="display:flex;gap:20px;align-items:center;margin-top:22px;background:var(--ink);padding:16px 20px">
    <div style="flex:1">
      <div class="eyebrow" style="color:var(--gold);margin-bottom:7px">How to proceed</div>
      <div style="font-size:10px;line-height:1.75;color:rgba(255,255,255,.88)">
        <b>1.</b> Email info@gadaglobalrun.com with your level. &nbsp;
        <b>2.</b> We return a one-page agreement and an invoice. &nbsp;
        <b>3.</b> Send your logo as vector or high-resolution PNG before the artwork deadline. &nbsp;
        <b>4.</b> Your placement goes live on the site immediately and on site from 7:00 AM on race day.
      </div>
    </div>
    <div style="width:92px;height:92px;padding:7px;background:#fff;flex:none">
      <img src="sponsors-qr.png" style="width:100%;height:100%;display:block">
    </div>
  </div>
</div>"""

SHELL = """<!doctype html><meta charset="utf-8"><style>%s</style><body>%s</body>"""
(OUT / "outside.html").write_text(SHELL % (CSS, BACK + '<div class="fold" style="left:364px"></div>' + GLANCE + '<div class="fold" style="left:732px"></div>' + FRONT))
(OUT / "inside.html").write_text(SHELL % (CSS, WHY + '<div class="fold" style="left:364px"></div>' + LEVELS + '<div class="fold" style="left:732px"></div>'))
print(f"{len(TIERS)} tiers, {len(BEN)} benefits -> outside.html, inside.html")
