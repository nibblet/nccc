# NCCC — Ideas Roadmap

A living catalog of ideas inspired by other apps, translated into NCCC's voice, then sequenced for build. Phase 0 of `nccc-implementation-plan.md` remains the active work; everything here is post-Phase-0 candidate scope.

**Translation rules** (from `CLAUDE.md` + `design-system.md`):
- No 1–100 scores, star ratings, or user-facing sliders on the **face**.
- The flavor wheel is **silent infrastructure** — surface as aggregate tag clouds, never as input sliders.
- The Bartender is the system voice. Brass is the single primary action. Ember = lit recommend. Moss = club-validated pairing.
- Private to 12 members. No public feeds, no follower counts.

---

## Guiding design principle — "Clean face, layered depth"

Decided together (Paul + the roadmap conversation). This principle resolves the tension between NCCC's stated minimalism and the desire for cigar-nerd / bourbon-collector depth.

**Three layers per product:**

1. **Editorial layer** — curated reference data per product: construction (wrapper / binder / filler for cigars; mashbill / proof / age / distillery for bourbons), baseline tasting profile, canonical flavor descriptors. We author or source this. Seeded lazily on first recognition or eagerly for a starter set.
2. **Member layer** — each member's individual annotations on top of the editorial baseline: adjusted strength, adjusted flavor descriptors, free-text Session notes per phase. A member's adjustments are attributable to them and visible to the club.
3. **Club aggregate** — derived signal from the member layer: chip frequencies, consensus shape, "what the club tastes." This is what the Bartender narrates on the face.

**What lives where:**

- **The face** (home, Lounge feed, capture flow, feed cards): club aggregate only, Bartender-voiced, chip-based. No scores, no sliders, no charts.
- **The depth** (tap into a stored or recognized product): editorial baseline + every member's adjustments overlaid + your own row for editing. Radar charts and per-field adjustments live here. Still no aggregated 0–100 score — adjustments are per-field, never collapsed into a single number that ranks products.

**Open seed question:** lazy vs. eager editorial seeding. Recommend **lazy with a curated starter set** — the 50 most likely cigars + 50 most likely bourbons get hand-curated reference data; everything else is generated on first recognition (gpt-5-mini vision + reference-data prompt) and human-reviewable later.

---

## Inspiration sources

### 1. Capa (cigar app)

Reviewed: product detail page, tasting profile screen, smoke session flow.

#### Idea 1.1 — Construction reference data on the product page
**What Capa does:** Lists Wrapper (e.g. Brazilian Mata Fina), Binder, Filler origin under a CONSTRUCTION header. Flavor descriptors as chips (Dark Chocolate, Earth, Sweet Spice, Espresso).

**Why it appeals:** Grounds the product page in real cigar reference. Members want to know what they're smoking.

**NCCC translation:** Add a CONSTRUCTION section to the product detail page. Pull from a reference dataset (curated or sourced). For bourbons, the analogous section is mashbill / proof / age / distillery. Flavor chips remain aggregate club-derived chips, not editorial.

**Status:** Clean fit. No conflicts.

---

#### Idea 1.2 — Tasting profile visualization
**What Capa does:** Spider/radar chart with 8 axes (Strength, Body, Complexity, Sweetness, Spice, Finish, Creaminess, Earthiness) scored 0–10.

**Why it appeals:** Glanceable visual signature of a cigar.

**NCCC translation (decided):** Lives in the **depth view** of a product page, never on the face. Three visual layers on the same chart:
- Editorial baseline shape (curated source-of-truth).
- Each member's adjustments as outlined overlay dots, attributable.
- Club consensus shape as a soft moss fill (the aggregate of member adjustments).

Axes derived from the flavor-wheel taxonomy (Strength, Body, Sweetness, Spice, Finish, Earthiness, Creaminess, Complexity for cigars; equivalents for bourbon). Numeric axis labels stay (0–10) because this IS the depth — the place where precision is welcome. The face still sees only chip clouds.

**Status:** In. Goes into the depth-view phase.

---

#### Idea 1.3 — Smoke Session (timer + thirds)
**What Capa does:** Start a session → timer runs → tabs for First Third / Second Third / Final Third. Per-third inputs: strength scale + flavor note chips. Cancel / Finish at top.

**Why it appeals:** Honors actual cigar culture (the experience evolves across the cigar). Captures structured tasting data without feeling like a form. Bourbon has an analog: nose / palate / finish.

**NCCC translation:**
- Rename to **"The Session"** (Bartender-ish, generic across cigar + bourbon).
- Cigar: First / Second / Final Third.
- Bourbon: Nose / Palate / Finish.
- Per-phase input is **chips only** (no strength slider — strength is a derived signal from chip patterns).
- The timer is optional and ambient, not gating.
- "What are thirds?" help link → Bartender voice card explaining the ritual.
- Finishing a Session is the natural moment to tap **Recommend to NCCC** (ember icon lights).

**Status:** Strong fit. Could be a marquee feature.

---

#### Idea 1.4 — Detailed adjustments (reframed from "power-user scoring")
**What Capa does:** Personal 0–100 slider, separate from community average, separate from critic score.

**Why it appeals reframed:** Power users want **precision**, not a number. Capa expresses that as a score; NCCC expresses it as **per-field adjustments to editorial data**.

**NCCC translation (decided per "Clean face, layered depth"):**
- No aggregated 0–100 score. No single number that ranks products.
- Inside the depth view of a product, each member can adjust individual editorial fields:
  - Strength axis (drag a dot on the editorial 0–10 baseline)
  - Each tasting-profile axis (body, sweetness, spice, finish, etc.)
  - Add/remove flavor descriptors from the editorial chip set
  - Free-text Session notes per phase (first/second/final third for cigars; nose/palate/finish for bourbons)
- Each member's adjustments are attributable: "Paul C tastes more coffee, less cocoa."
- The club aggregate shape (moss-filled) is derived from all members' adjustments combined.
- None of this surfaces on the face — only when you tap into a product.

**Status:** In. The depth-view product page is the home for all of this.

---

### 2. Whiskey + cigar pairing app _(name TBD)_

Reviewed: profile/settings page, barcode scanner upsell screen. Pairing screen referenced but not yet shared.

#### Idea 2.1 — Profile page structure
**What the app does:** Avatar with edit pencil → name → email → account tier card → settings rows: Pairing Preferences, Favorites, History, Education.

**Why it appeals:** Clean settings IA. Each row maps to a recognizable concept for a cigar/bourbon member.

**NCCC translation:**
- **Avatar + name + email**: Use `formatMemberName(user)` for display ("Paul C"). Two-Paul case must work. Avatar can be initials by default with optional photo upload.
- **No account tier card.** NCCC is private to 12 — no premium, no upgrade. Replace with a "Member since…" line or omit.
- **Pairing Preferences**: Settings page for what the member tends to gravitate toward — strength range, favorite styles, what to avoid. Used as input to the pairing engine.
- **Favorites**: Cigars + bourbons the member has hearted. Distinct from "what I've recommended to NCCC."
- **History**: Chronological list of every Session completed and every product recommended. Member-private by default; the social surfacing is the club feed, not this list.
- **Education**: The Bartender's library — short articles, glossary ("what are thirds?", "what's a mashbill?"), pairing fundamentals. Bartender voice throughout.

**Status:** Strong fit. Profile page is on the build path anyway; this gives us the right shape.

---

#### Idea 2.2 — Pairing presentation
**What the inspiration app does:** _(designed without screenshot per Paul, intent to iterate.)_

**NCCC translation (initial design):**

Layout (mobile, top to bottom):
1. **Bartender intro line** — single italic Playfair sentence, Bartender voice. Sets the why. E.g. *"The cocoa in this Bellas Artes wants something soft to land on."*
2. **Cigar card** — sepia hero image + brand line + product name + 3–4 club-aggregate flavor chips. Tap-through opens the product depth view.
3. **Etched divider** with the label `PAIRS WITH` (uses `<Divider />` per design system).
4. **Bourbon card** — same anatomy as cigar card.
5. **Status badge** — one of:
   - `THE CLUB AGREES` in moss, when at least one member has logged both products at the same event and recommended both.
   - `THE BARTENDER SUGGESTS` in muted brass-subdued, when the pairing is algorithmic-only.
6. **Why-it-pairs prose** — 1–2 sentences in italic Playfair (Bartender voice), generated by gpt-5-mini from the pairing rule rationales. Cached server-side in `pairings_cache.rationale_text` per existing implementation plan.
7. **Primary action (brass)** — `Try this tonight` — adds both products to the member's next Session, optionally marks intent.
8. **Secondary action** — `Suggest another` — rotates the bourbon (or cigar) via the pairing engine's second-best result.

Entry points:
- **From a product page:** `PAIRS WITH` section on the product detail (already in Phase 4 spec as placeholder; activates in Phase 6).
- **From the Daily Pour:** the home-page hero opens this screen.
- **From the Lounge:** when a member's tasting card is shown for a product that has a club-validated pairing, the card shows a moss accent and a "see the pairing" tap-through.

Voice and color:
- Brass: the single primary action.
- Moss: only when club-validated. Never decorative.
- Ember: not used here (ember is for the recommend action, which lives on each product card, not on the pairing).

**Status:** Designed. Iterate after first build.

---

#### Idea 2.3 — Barcode / UPC scanner
**What the app does:** A "Scan Bottle or Band" flow that identifies the product from a barcode or label scan. Gated as a premium feature in that app.

**Why it appeals:** Fast capture for bourbon bottles when the label is hard to photograph or the member just wants speed.

**Feasibility:**
- **Bourbon:** Workable. PWA can use `@zxing/browser` (Safari lacks native `BarcodeDetector`). UPC lookup is the bottleneck — Open Food Facts has spotty spirits coverage, so we'd accrete our own UPC→product table organically as members scan. First scan of an unknown UPC falls through to the photo/vision pipeline.
- **Cigars:** Not viable as a barcode flow — bands don't have barcodes. The existing photo-of-band vision pipeline IS the "scan" for cigars.

**NCCC translation:**
- Add a "Scan barcode" alternate input on the capture sheet, alongside the camera shutter. Both inputs converge on the same product-recognition pipeline.
- Never a premium gate — no premium tier in NCCC.
- Camera permission is shared; no separate scanner screen.

**Status:** Clean fit, but lower priority than nailing the photo/vision flow first. Sequence as a Phase 2+ enhancement.

---

### 3. Cigarbase

Reviewed: For You feed, My Humidor empty state, home page with Cigar of the Day + Featured Lounge.

#### Idea 3.1 — The Humidor (personal inventory)
**What Cigarbase does:** Bottom-nav tab dedicated to **My Humidor**. Two views: **Collection** (what you currently own) and **Smoked** (what you've finished). Organize / List / Filter affordances. Primary "+ Add Cigar" CTA. Empty state with a bartender-ish hook ("Your humidor awaits").

**Why it appeals:** Cigar/bourbon collectors care about inventory. Tracking what's on the shelf vs. what's been opened/smoked is a real ritual.

**NCCC translation:**
- Add **My Cellar** as a primary tab (or fold under Profile). Two views: **On Hand** and **Finished**.
- Cigars: count + format/vitola. Bourbons: bottle level (full / half / heel / empty), pour count.
- Add via camera capture (same pipeline as Recommend) → no separate "Add" path. The act of adding is just capture + "save to cellar" instead of (or in addition to) "recommend to NCCC."
- Empty state speaks in Bartender voice: *"The cellar's empty. Snap your first one when you're ready."*
- Organize / Filter affordances: filter by brand, strength, format, what's been recommended-to-NCCC, etc.
- Overlaps with Idea 2.1 Favorites / History — the cleaner model is probably: **Cellar** (inventory + state) replaces both Favorites and History; **Favorites** becomes a saved-products list (things you want, not things you own).

**Status:** Strong fit. Worth a dedicated tab in bottom nav.

---

#### Idea 3.2 — Cigar of the Day (daily ritual hook)
**What Cigarbase does:** Big "Cigar of the Day" hero on the home page with a featured pick. Below it, "Featured Lounge."

**Why it appeals:** A reason to open the app every day. Gives the home page a single point of focus.

**NCCC translation — needs Paul's call on shape:**
- Option A — **"Tonight's Pour"**: a single rotating pairing (one cigar + one bourbon) the Bartender suggests each evening, surfaced as a hero card on the home page. Generated by the pairing engine from the club's recent activity. Moss-accented when it's a club-validated pairing.
- Option B — Two heroes: a daily cigar and a daily pour, side by side, with an optional "the Bartender pairs them" call-out.
- Option C — Daily *member spotlight*: today's hero is whatever a specific member recommended in the last 24 hours. Cycles through the club.
- Regardless of shape: never editorial / algorithmic-only. Always rooted in club activity (a member's recent recommendation, or a member's pairing). The Bartender narrates the why.

**Status:** Idea is strong, but the *what's hero?* decision matters. Recommend Option A for the marquee implementation.

---

#### Idea 3.3 — The Lounge (community surface)
**What Cigarbase does:** Bottom-nav "Lounge" tab (community feed). Also a "Featured Lounge" on home that highlights a physical cigar lounge / store.

**Why it appeals:** Names the social space something atmospheric instead of "feed."

**NCCC translation:**
- Rename the planned feed (Phase 5 of the implementation plan) from "Feed" to **"The Lounge"**. Better voice match for NCCC.
- The physical-lounge "Featured Lounge" pattern doesn't transfer — NCCC isn't a directory of cigar shops. The Norton-Commons-events angle could fit if Paul wants to surface upcoming club gatherings on the home page.

**Status:** Trivial rename — easy adoption. The physical-lounge variant is a no.

---

#### Idea 3.4 — Bottom nav shape (5 items with center scan FAB)
**What Cigarbase does:** Home / Humidor / **Scan (center, prominent yellow FAB)** / The Lounge / Profile. The Scan button is visually elevated above the bar — a thumb-magnet for the primary action.

**Why it appeals:** iPhone-first ergonomics. The primary verb (capture/scan) is the easiest tap on the screen.

**NCCC translation:**
- Adopt the 5-item shape with a center FAB.
- NCCC's center FAB is **Capture** (brass-accented per design system — brass is the single primary action). It opens the camera. Barcode scan is an alternate input on the capture sheet (per Idea 2.3).
- Five tabs: **Home / Cellar / Capture / Lounge / Profile** (or whatever name set Paul prefers).

**Status:** Direct adoption. Slot into Phase 5 navigation work.

---

#### Idea 3.5 — Feed post anatomy (For You)
**What Cigarbase does:** Member avatar + name + time + sapling badge → "Smoked" badge (orange flame) → product card (brand line + bold line name + star rating) → big image → interaction bar (heart / comment / thumb / bookmark / share).

**Why it appeals:** Clean rhythm: who → what they did → what it is → image → react.

**NCCC translation:**
- Member chip uses `formatMemberName(user)` ("Paul C") + initials avatar. No badge tier system (12 friends; no levels).
- Replace "🔥 Smoked" badge with NCCC's **ember "Recommend"** icon when lit. "Just lit" / "added to cellar" / "finished" verbs as variants — each with its own subdued icon, only ember gets accent color.
- Product card: brand line + line name. **No star rating in the card** — drop it entirely.
- Interaction bar: keep ember (recommend) + comment. Drop the thumb, bookmark, and share-as-DM affordances. NCCC is a closed club; sharing externally isn't a need.

**Status:** Folds into existing Phase 5 feed work. The simplification (one verb, no scores) is the point.

---

#### Idea 3.6 — Pairings presentation _(awaiting screenshot)_
**Status:** Paul mentioned liking how Cigarbase presents pairings but the screenshot wasn't included. Need a shot of that screen before this can be captured.

---

## Editorial seeding strategy (decided)

Decision: **proactive seeding** of editorial reference data, not lazy.

### Bourbon side — seeded from Paul's curated collection

`Cobb_Whiskey_Collection_Updated.xlsx` is the bourbon seed source. It already contains 98 bottles cataloged with everything we need:

- **Per-bottle reference fields:** Distiller, DSP code (Kentucky distillery plant identifier — a great normalized key), Brand, Expression, Type, Age, Proof, Mash Bill, Tasting Notes.
- **Style families** (6 codes already established): `BWH` (wheated bourbon), `BST` (standard bourbon), `BHR` (high-rye bourbon), `RYE`, `BLD` (blend), `SMW` (single malt). Adopt as the canonical bourbon classification.
- **Tier ranking** 1–5 plus `M` for the Maker's Mark Wall vertical display. Paul's personal tier — useful as a Daily Pour weighting signal in the pairing engine.
- **41 unique tasting descriptors** already in use (top: Caramel, Vanilla, Oak, Spice, Fruity, Smooth, Rich, Honey, Sweet, Peppery, Bold, Cinnamon, Butterscotch…). Adopt as the starter taxonomy for the bourbon flavor wheel. Extend later as members add adjustments.
- **Shelf Plan** sheet contains organizational logic (Tier → Style family → Proof, with Tall-bottle override). Out of scope for the app build but a candidate future feature: "where in the cellar is this bottle?"

**Import path:**
- Schema extension to `products` table: add `style_family`, `tier_seed`, `dsp_code`, and ensure `mash_bill` is on the bourbon side.
- One-shot import script `scripts/seed/seed-bourbons-from-paul.ts` → reads the xlsx, normalizes, inserts as `status='confirmed', source='paul-cobb-curated'`.
- Onboarding bonus: this same dataset becomes **Paul's initial Cellar inventory** on first login. Other members start empty.

### Cigar side — still needs sourcing

Paul does not have an equivalent cigar collection sheet. Recommended approach:
- Hand-curate a starter set of ~100–150 cigars (the brands likely to show up at NCCC meetups).
- Use `docs/design-system.md` flavor wheels for the cigar chip taxonomy.
- Pull editorial reference data (wrapper / binder / filler / vitola / strength) from manufacturer sites + Halfwheel reviews. Existing implementation plan Phase 1 already calls for the Halfwheel RSS path; keep it.
- For the baseline tasting profile (8 radar axes), generate via gpt-5-mini from the editorial review text per product, then a human reviewer (Paul) approves.

### Schema implications

- `products.editorial_baseline_profile jsonb` — `{strength, body, sweetness, spice, finish, earthiness, creaminess, complexity}` each 0–10.
- `product_adjustments` (new table) — `member_id`, `product_id`, `field` (one of the axes or a chip), `value`, `created_at`. Members override editorial fields here; the depth view aggregates these.
- `product_member_chips` — chip adds/removes per member per product, for the chip cloud aggregation.

---

## Open spots for additional inspiration sources

### 4. _(next app — slot left open for future inspiration)_

---

## Sequencing — mapping ideas to implementation phases

The existing `nccc-implementation-plan.md` has Phases 0–7. Most roadmap ideas slot into those phases as enhancements; a few are genuinely new and become Phase 8+.

### Phase 0 — Foundation (no change)
Already covers auth, design tokens, primitives. Nothing from this roadmap affects it.

### Phase 1 — Catalog seeding (enhanced)
- **Replace** the generic bourbon seed sources (bourbonExplorer JSON / makispl CSV) with **Paul's whiskey collection Excel** import — same script slot, better data.
- Keep Halfwheel RSS for the cigar side; **add** a hand-curated cigar starter set (~100–150 cigars).
- **Add** schema extensions: `style_family`, `tier_seed`, `dsp_code` (bourbons); `editorial_baseline_profile` (both sides).
- **Add** the `product_adjustments` and `product_member_chips` tables for the depth-view member layer.

### Phase 2 — Capture & identify (enhanced)
- **Add** UPC barcode scan as an alternate input on the capture sheet (`@zxing/browser`, bourbon path only — cigars have no barcodes). Both inputs converge on the same recognition pipeline.

### Phase 3 — Tasting flow → "The Session" (enhanced)
- **Restructure** the tasting flow into **The Session**:
  - Cigar: tabs for **First Third / Second Third / Final Third**.
  - Bourbon: tabs for **Nose / Palate / Finish**.
  - Each phase accepts chips from the wheel + optional free-text note. Strength is not a slider — it's derived from chip patterns.
  - Optional ambient timer (Capa-style), not gating.
  - `<Voice />` Bartender help: *"What are thirds?"* / *"What's nose / palate / finish?"*.
- **End-of-Session moment:** the natural place to tap brass `Recommend to NCCC` (ember lights). Optional second action: `Add to Cellar`.

### Phase 4 — Product detail (face stays; new depth view)
- **The face** keeps the existing spec: THE CLUB SAYS, HOW IT TASTES, PAIRS WITH placeholder, THE FACTS. Bartender intro on top. Aggregate chip cloud, recommend bar.
- **Add CONSTRUCTION section** to THE FACTS (wrapper / binder / filler for cigars; mashbill / proof / age / DSP / distiller for bourbons) — Idea 1.1.
- **New: depth view** — tap-through from the product page into a deeper layer. Contains:
  - Editorial baseline tasting radar (8 axes, 0–10).
  - Member-adjustment overlay: each member's dots on the chart, attributable.
  - Club consensus shape as soft moss fill.
  - Per-axis adjust UI (drag a dot to override the editorial value).
  - Chip add/remove per member.
  - Free-text Session notes per phase, by member.
  - No 0–100 aggregate score, ever.

### Phase 5 — Lounge, profile, nav (enhanced and renamed)
- **Rename** `Feed` → **The Lounge** (Idea 3.3).
- **Bottom nav** becomes 5 items with a center brass FAB: `Home / Cellar / Capture / Lounge / Profile` (Idea 3.4).
- **Feed card simplification** (Idea 3.5):
  - Member chip with `formatMemberName` + initials avatar. No level badges.
  - One verb: ember `Recommended` (or `Added to Cellar` / `Finished`, each with subdued icon — only ember gets accent).
  - No star ratings on the card.
  - Interaction bar: ember + comment only. No bookmark, thumb, or external share.
- **Member profile** structure (Idea 2.1):
  - Avatar + `formatMemberName` + email. No account-tier card (NCCC is private).
  - **Pairing Preferences** entry.
  - **Favorites** (saved products — distinct from Cellar inventory).
  - **History** (member's Sessions + recommendations, chronological).
  - **Education** (Bartender library — defers content to Phase 7+).

### Phase 5.5 — The Cellar (NEW)
- **New bottom-nav tab.** Two views: `On Hand` and `Finished`.
- Bourbon bottles carry pour-level state: `full / half / heel / empty`. Cigars carry count + format.
- Add-to-Cellar is a path on the capture sheet (parallel to Recommend), not a separate flow.
- **Onboarding hook:** seed Paul's Cellar with his 98 bottles from the Excel import. Other members start empty with a Bartender empty state: *"The cellar's empty. Snap your first one when you're ready."*
- Organize / Filter / List affordances (filter by style family, brand, strength, etc.).
- Future bonus (deferred): shelf-plan location field, informed by Paul's existing Shelf Plan logic.

### Phase 6 — Pairing engine + screen (designed, see Idea 2.2)
- Existing implementation plan covers the engine, rules, group-validation detection, cache, and dedicated `pairings/[cigarId]/[bourbonId]/page.tsx`.
- **Add** the pairing screen design from Idea 2.2: two-card stacked layout, `PAIRS WITH` etched divider, Bartender prose, club-vs-bartender status badge, brass primary action, rotate-suggestion secondary.

### Phase 7 — Polish, admin, Bartender (enhanced)
- Existing implementation plan covers Bartender lines, illustration assets, empty states, settings page, admin, PWA install.
- **Add** Education content authoring (the library entries linked from Profile): glossary, "what are thirds?", "what's a mashbill?", pairing fundamentals. Bartender voice throughout.
- **Add** the depth-view admin: ability for Paul to review member adjustments and accept any back into the editorial baseline.

### Phase 8 — Daily Pour ritual (NEW post-launch)
- Home-page hero card: a single rotating cigar + bourbon pairing for tonight, narrated by the Bartender.
- Source signal blend:
  - Member activity in the last 24h (someone Recommended this; someone is mid-Session).
  - Pairing-engine top result that's also club-validated.
  - Paul's tier signal (lean toward Tier 1–2 bottles on weekends; workhorses on weeknights).
- Moss accent when the suggestion is club-validated.
- Tap-through opens the pairing screen (Phase 6 surface).

### Phase 9+ — Depth-view refinements & shelf plan (deferred bonus)
- Cellar shelf-location import (Paul's Shelf Plan tiers, tall-bottle override, Maker's Mark Wall).
- Member-adjustment moderation tools.
- Education library content expansion.
- iteration on the pairing screen based on real club usage.

---

## Dependencies / critical path

- Phase 1 (seed) blocks Phase 2 (capture matching).
- Phase 3 (Session) generates the member-layer data that Phase 4 (depth view) renders.
- Phase 5.5 (Cellar) depends on Phase 2 (capture pipeline) and Phase 1 (Paul's Excel import). Can ship after Phase 5 social work or alongside it.
- Phase 8 (Daily Pour) depends on Phase 6 (pairing engine output) and a few weeks of real member activity.

---

## Open questions remaining

- **Pairing screen iteration:** built on intent without screenshot. Revisit after Paul tries it.
- **Cigar editorial seed sourcing:** hand-curate which ~100–150? Probably the brands at NCCC meetups + Halfwheel's top-rated list. Needs a list from Paul.
- **Education content:** who authors the Bartender library — Paul? gpt-5-mini drafts with Paul editing? Defer the decision to Phase 7.
