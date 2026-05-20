# NCCC — Ideas Roadmap

A living catalog of ideas inspired by other apps, translated into NCCC's voice, then sequenced for build. Phase 0 of `nccc-implementation-plan.md` remains the active work; everything here is post-Phase-0 candidate scope.

**Translation rules** (from `CLAUDE.md` + `design-system.md`):
- No 1–100 scores, star ratings, or user-facing sliders.
- The flavor wheel is **silent infrastructure** — surface as aggregate tag clouds, never as input sliders.
- The Bartender is the system voice. Brass is the single primary action. Ember = lit recommend. Moss = club-validated pairing.
- Private to 12 members. No public feeds, no follower counts.

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

**NCCC translation:** *Conditional.* A radar chart can work if and only if it is computed from aggregated club tag data (i.e. the silent wheel surfacing as a shape), never from user-facing sliders. The axes would be derived from the flavor wheel taxonomy, not invented separately. Labeled with the Bartender's voice ("THE CLUB TASTES…") rather than numeric axes.

**Status:** Needs design exploration. Decision: do we want this at all, or is the chip cloud already enough?

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

#### Idea 1.4 — Detailed power-user scoring
**What Capa does:** Personal 0–100 slider, separate from community average, separate from critic score.

**Why it appeals:** Power users (cigar nerds, bourbon collectors) want to keep precise records.

**NCCC translation — open question:** This directly contradicts the current spec ("avoid: star ratings, 1–100 scores, or sliders"). Three ways to reconcile:

1. **Hold the line.** NCCC has no scores, period. Power users keep notes in free text. The whole product's differentiation is "no scores."
2. **Private power-user mode.** A per-user toggle in settings adds a hidden personal scoring field, visible only to that member, never aggregated, never shown to the club. Doesn't change the social surface.
3. **Embrace it.** Add scoring to the core product. (Breaks the current design philosophy.)

**Recommendation:** Option 2 is the only one that preserves the club voice while serving power users. Worth a separate spec conversation before adoption.

**Status:** Decision needed from Paul before this enters the sequenced roadmap.

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
**What the app does:** _(screenshot not yet shared — Paul described liking the presentation)_

**NCCC translation:** TBD pending screenshot. Note: NCCC's pairing engine is rules-based (per the spec), and moss is the dedicated color for **club-validated pairings**. The presentation should make club-validated pairings visually distinct from generic suggestions.

**Status:** Needs a screenshot before we can capture specifics.

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

## Open spots for additional inspiration sources

### 3. _(next app)_

---

## Sequencing — TBD

Sequencing happens after all inspiration sources are captured and Paul has reacted to each idea.
