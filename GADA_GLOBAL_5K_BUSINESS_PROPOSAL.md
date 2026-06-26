# BUSINESS PROPOSAL & PROJECT QUOTE

## Gada Global 5K — Event Management Platform
### Web Development, Registration System, E-Commerce & Digital Services

---

**Prepared by:** DAPS Analytics PLC
**Prepared for:** Gada Global Organization
**Date:** June 26, 2026
**Proposal Validity:** 30 Days
**Event Date:** October 3, 2026

---

## 1. Executive Summary

DAPS Analytics is pleased to present this proposal for the **Gada Global 5K** — an annual community running event celebrating Oromo heritage and the Irrecha thanksgiving festival. Scheduled for October 3, 2026 at Rock Creek Parkway in Washington, DC, this inaugural event will bring together up to 500 runners and community members.

This document outlines the complete digital platform built to power the event — from marketing and athlete registration to merchandise sales and payment processing. The platform is designed to serve as a reusable foundation for annual events going forward.

---

## 2. Project Scope — What We Are Building

### 2.1 Event Marketing Website

A fully custom-designed, mobile-responsive Next.js web application with a premium sports aesthetic inspired by world-class marathon platforms. The website includes:

- **Cinematic Hero Section** — Full-screen video background with blurred DC running footage, animated typewriter headline that cycles through key cultural words ("Oromo" / "Irrecha" / "Gada" and "running" / "unity" / "movement"), floating golden particle effects, and two prominent CTA cards (Register + Buy Merch)

- **Live Countdown Timer** — Real-time countdown to race day (October 3, 2026, 7:30 AM ET) displayed in a branded bar with days, hours, minutes, and seconds

- **Dashboard-Style Stat Cards** — Four cards in the hero section inspired by the ActiveDays sports platform: Race Distance (5K), Elevation Gain (45m), Event Stats (bar chart with 500 runners), and Event Highlights (3 key features with badge labels)

- **About Section** — Dual-image layout with information about the event, Irrecha festival, and Oromo heritage. Four feature cards: Irrecha Festival, 5K Run & Walk, Cultural Program, Community Unity

- **Event Details Section** — World Marathon-inspired editorial layout with cinematic runner photo, overlaid temperature/time/elevation statistics, stacked location typography (WASHINGTON / ROCK CREEK / PARKWAY), decorative route line SVG, and 5 detail cards (Start Time, Terrain, Capacity, Awards, Location)

- **Race Day Schedule** — Visual timeline from 6:00 AM Packet Pickup through 2:00 PM Irrecha Cultural Festival, with color-coded time markers

- **Irrecha Heritage Section** — Cultural education content covering the Odaa Tree, Water Blessing, and Global Diaspora with green photo-overlay background

- **Call-to-Action Section** — Final conversion section with Register and Shop Merch buttons

- **Responsive Navbar** — Fixed dark navigation bar with active page highlighting, cart icon with item count badge, Register CTA button, and mobile hamburger menu. Transparent on homepage hero, solid on all other pages

- **Footer** — Four-column layout with brand info, event links, shop links, and contact information plus social media icons

### 2.2 Athlete Registration System

A complete registration flow that collects participant data and processes payment:

- **Registration Page** — Dark hero banner with breadcrumb navigation, race stats, and three-tier pricing selector:

| Tier | Period | Price |
|------|--------|-------|
| Early Bird | Until August 15, 2026 | $25/person |
| Standard | Aug 16 - Sep 25, 2026 | $35/person |
| Race Week | Sep 26 - Oct 2, 2026 | $45/person |

- **Registration Form** — Collects: First Name, Last Name, Email, Phone, Age, Gender, T-Shirt Size, Emergency Contact. Displays selected tier with real-time price badge

- **What's Included** — Every registration includes: Official race bib with timing chip, Gada Global 5K finisher medal, Official race t-shirt, Post-race Irrecha celebration access, Water stations on course, Professional race photography

- **Payment Processing** — Stripe Checkout integration. On form submission, participant data is saved locally (JSON) and a Stripe Checkout session is created. Participant is redirected to Stripe's secure hosted payment page, then returned to a branded success confirmation page

- **Success Page** — Post-payment confirmation with "What's Next" checklist (check email, mark calendar, packet pickup info, t-shirt details) and links to Shop Merch or return Home

### 2.3 Merchandise E-Commerce Store

A branded merchandise shop with cart functionality and Stripe payment:

- **Product Catalog** — Three launch products:

| Product | Price | Description |
|---------|-------|-------------|
| Official Race Tee | $28 | Moisture-wicking performance fabric with event logo and Irrecha artwork |
| Irrecha Gold Edition | $35 | Premium cotton tee with golden Irrecha sunrise design and Oromo proverb |
| Gada Heritage Hoodie | $55 | Heavyweight fleece hoodie with Odaa tree emblem |

- **Size Selection** — Each product offers XS through XXL with visual size buttons
- **Shopping Cart** — React Context-based cart with add/remove items, quantity adjustment (+/-), per-item totals, and grand total. Cart state persists across page navigation. Cart icon in navbar shows live item count badge
- **Checkout Flow** — Cart contents sent to API route which creates a Stripe Checkout session with line items and US shipping address collection. Customer is redirected to Stripe, then returned to success page

### 2.4 API Layer

Server-side API routes that handle secure operations:

| Endpoint | Method | Function |
|----------|--------|----------|
| `/api/register` | POST | Validates registration data, saves to local JSON store, creates Stripe Checkout session with registration fee |
| `/api/checkout` | POST | Receives cart items, creates Stripe Checkout session with line items and shipping |
| `/api/webhook` | POST | Receives Stripe webhook events (payment confirmation), logs completed transactions |

### 2.5 Design System

The platform follows a cohesive design language matched to world-class sports event platforms:

| Token | Value | Usage |
|-------|-------|-------|
| Primary Yellow | `#F5C842` | CTA buttons, accent cards, active indicators |
| Gold | `#E8B930` | Gradients, headings, icon accents |
| Charcoal | `#141210` | Backgrounds, dark sections, navbar |
| Cream | `#FAF6EE` | Light section backgrounds |
| Warm Gray | `#2a2520` | Dark section variants |
| Green Deep | `#1B5E20` | Nature/Irrecha sections, secondary buttons |
| Heading Font | DM Sans | Bold geometric sans-serif for all headings |
| Body Font | Inter | Clean sans-serif for body text and UI |

- **No emojis** — All icons are inline SVG stroke icons for crisp rendering at any size
- **Scroll reveal animations** — Intersection Observer-based fade-in on scroll
- **Yellow Card** / **Dark Card** component classes for consistent card styling
- **Fully responsive** — Mobile-first with breakpoints at 768px and 1024px

---

## 3. How the System Works

### Registration Flow
```
Participant visits /register
    → Selects tier (Early Bird / Standard / Race Week)
    → Fills out registration form
    → Clicks "Proceed to Payment"
    → POST /api/register saves data + creates Stripe session
    → Redirected to Stripe Checkout (secure hosted page)
    → Completes payment on Stripe
    → Redirected to /success?type=registration
    → Confirmation page with next steps
    → Stripe webhook confirms payment (server-side)
```

### Merchandise Purchase Flow
```
Visitor browses /shop
    → Selects product size
    → Clicks "Add to Cart" (React Context state)
    → Adjusts quantities in cart summary
    → Clicks "Checkout"
    → POST /api/checkout creates Stripe session with all items
    → Redirected to Stripe Checkout with shipping collection
    → Completes payment
    → Redirected to /success?type=shop
    → Order confirmation page
```

### Data Architecture
```
Registration Data:  JSON file (data/registrations.json) — server-side
Payment Processing: Stripe Checkout Sessions — PCI-compliant, hosted
Cart State:         React Context (client-side, in-memory)
Product Catalog:    TypeScript constants (src/lib/products.ts)
Tier Pricing:       TypeScript constants (src/lib/registration.ts)
```

---

## 4. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router) | Server/client rendering, API routes, routing |
| Language | TypeScript | Type-safe development |
| Styling | Tailwind CSS v4 | Utility-first responsive design |
| Payments | Stripe (Checkout Sessions) | PCI-compliant payment processing |
| Fonts | Google Fonts (DM Sans + Inter) | Typography |
| Animations | CSS Keyframes + Intersection Observer | Scroll reveals, typing effect, particles |
| Hosting | Vercel (recommended) | Edge deployment, auto-scaling |

---

## 5. Platform Hosting & Infrastructure

| Service | Provider | Estimated Cost |
|---------|----------|----------------|
| Website Hosting | Vercel (Free/Pro) | $0-20/month |
| Payment Processing | Stripe | 2.9% + $0.30 per transaction |
| Domain | Custom domain (e.g. gadaglobal5k.com) | ~$12/year |
| Video CDN | Vercel/Cloudflare (for hero video) | $0 (included) |
| **Estimated Monthly Total** | | **$0-20/month** + Stripe fees |

---

## 6. Future Enhancements (Phase 2)

The following features are planned for the next development phase:

### 6.1 Admin Dashboard
- View and export all registrations (CSV/Excel)
- Track t-shirt size distribution for ordering
- Monitor revenue by tier and product
- Manage product inventory and pricing
- Send bulk email notifications to registered participants

### 6.2 Database Migration
- Move from JSON file storage to PostgreSQL (Supabase or Neon)
- Proper registration records with payment status tracking
- Order history and fulfillment tracking
- Participant search and filtering

### 6.3 Email Notifications
- Registration confirmation email (with race details, bib number)
- Order confirmation email (with shipping tracking)
- Pre-race reminder emails (1 week, 1 day before)
- Post-race thank you email with results link

### 6.4 Race Results System
- Post-race results page with search by name/bib number
- Age group rankings
- Finisher certificates (downloadable PDF)
- Photo gallery integration

### 6.5 Additional Features
- Custom domain setup (gadaglobal5k.com)
- Google Analytics / Plausible integration
- Social sharing (race results, registration confirmation)
- Multi-language support (Afaan Oromo, Amharic)
- Volunteer registration form
- Sponsor showcase section with logo upload
- Mobile PWA support for race-day use

---

## 7. Pricing

### Phase 1 — Complete Event Platform (Current Build)

| Item | Description | Amount |
|------|-------------|--------|
| Event Marketing Website (6 Sections) | Hero with video/animation, About, Event Details, Schedule, Culture, CTA | Included |
| Athlete Registration System | 3-tier pricing, form, Stripe payment, success page | Included |
| Merchandise E-Commerce Store | 3 products, cart system, Stripe checkout with shipping | Included |
| API Layer | Registration, checkout, and webhook endpoints | Included |
| Design System | Custom sports-inspired design, responsive, no-emoji SVG icons | Included |
| Animated Hero | Video background, typewriter word rotation, particle effects | Included |
| Deployment Setup | Vercel configuration, environment variables, Stripe setup guidance | Included |
| **Phase 1 Total** | | **$3,500** |

### Phase 2 — Admin & Operations (Quoted Separately)

| Item | Estimated Range |
|------|----------------|
| Admin Dashboard (registrations, orders, revenue) | $1,500 - $2,500 |
| Database Migration (PostgreSQL) | $500 - $800 |
| Email Notifications (transactional emails) | $500 - $800 |
| Race Results System | $800 - $1,200 |
| Custom Domain + Analytics | $200 - $400 |
| **Phase 2 Estimated Total** | **$3,500 - $5,700** |

> *Pricing is open to discussion. Payment plans available upon request.*

---

## 8. What's Included at No Extra Cost

- Full source code ownership transfer
- Stripe account setup guidance and testing
- 30 days of post-delivery support for bug fixes
- Deployment documentation
- Design assets and SVG icon library
- One round of design revisions based on feedback

---

## 9. Project Timeline

| Milestone | Target Date |
|-----------|------------|
| Phase 1 Platform Delivery | July 2026 |
| Stripe Integration & Testing | July 2026 |
| Domain Setup & Production Deploy | July 2026 |
| Early Bird Registration Opens | August 1, 2026 |
| Phase 2 Admin Dashboard | August 2026 |
| Standard Registration Period | Aug 16, 2026 |
| Race Week Registration | Sep 26, 2026 |
| **Race Day** | **October 3, 2026** |

---

## 10. Terms & Conditions

1. **Payment:** 50% deposit required before development begins. Remaining 50% due upon delivery and client approval of Phase 1.
2. **Revisions:** Up to 2 rounds of design revisions are included. Additional revisions will be quoted separately.
3. **Hosting Costs:** Client is responsible for monthly hosting costs (estimated $0-20/month via Vercel) and Stripe transaction fees (2.9% + $0.30 per charge).
4. **Stripe Account:** Client must create their own Stripe account. DAPS Analytics will provide setup guidance and API key configuration.
5. **Content:** Client is responsible for providing event photos, video footage, and final copy for all sections. DAPS Analytics will provide placeholder content for development.
6. **Intellectual Property:** Upon full payment, all source code, design assets, and digital deliverables become the property of Gada Global Organization.
7. **Confidentiality:** Both parties agree to keep project details and business terms confidential.
8. **Annual Reuse:** The platform is designed to be reused for future annual events with minimal reconfiguration (update dates, pricing, and content).

---

## 11. Contact

**DAPS Analytics PLC**
Burtonsville, Maryland, USA
Email: oli@dapsanalytics.com

---

*Thank you for choosing DAPS Analytics. We are proud to support the Gada Global 5K and the celebration of Oromo heritage through this digital platform.*

---

**Accepted by:**

_________________________
**Gada Global Organization**
Authorized Representative
Date: _______________

_________________________
**DAPS Analytics PLC**
Oli T. — Co-Founder & CTO
Date: _______________
