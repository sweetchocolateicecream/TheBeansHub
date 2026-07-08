# Build Plan — Interactive "Malaysian Coffee Roasters by State" Directory

---

## ⛳ PROGRESS STATUS — updated 8 Jul 2026 (read this before resuming)

**Method change (Nick's call, 8 Jul):** NO Google Places API. Enrichment is done by
browsing Google Maps via the Claude-in-Chrome extension (navigate → JS-extract name,
rating, count, address, website, ftid, top reviews per roaster). Same verification rules
(website-domain match, else name+area). `gbp_url` will be built from the stored `ftid`
as `https://maps.google.com/?cid=<decimal of second hex in ftid>` at Phase-3 time.

**Where the data lives:** `/routine/roasters_enrichment_progress.jsonl` — one JSON record
per roaster (72 records so far). This is the single source of progress. Fields:
`name` (CSV name), `display`, `match` (domain|name+area|NONE), `gbp_name`, `rating`,
`count`, `address`, `postcode`, `ftid`, `website`, `state_api`, `kv_area`,
`state_fixed`/`kv_fixed` (corrections vs CSV), `review_notes` (raw grounded notes —
the polished 1–2-sentence `review_summary` still needs to be written from these at
Phase 3, following rule 2.5).

### Done
- Phase 0–1 ✅ (no API key — resolved by method change; dupes resolved, see below).
- Phase 2: **72 / 81 physical roasters enriched** with verified real data.

### Phase 2 — REMAINING (9 lookups, resume here)
1. Coffee Hub (KL, shopee coffe.ehub) — first search got hijacked by "The Hub"; retry `"Coffee Hub" KL`.
2. Ask Coffee Roastery (Shah Alam) — candidates found: "ASK Coffee Roastery" 4.7(266) ftid `0x31d1f1dc2e0ca081:0x8223d1f49d83c2f4` (⚠ 0x31d1f1 prefix looks Melaka — verify address!) and "ASK COFFEE ROASTERY HQ" 3.0(3) ftid `0x31cc4d94d0dd2211:0xf5a123a6b1825258`. Open both, pick by address.
3. Coffex Coffee (Shah Alam) — not searched yet.
4. Baristar Roastery (Subang, no-link row) — keep only if real storefront found.
5. Emery Coffee Roastery (Subang, emery.coffee) — not searched yet.
6. The Crackpots Coffee Roaster (Subang) — not searched yet.
7. Rumah Panggang (Sungai Petani, Kedah) — first two searches failed (got an unrelated Shah Alam restaurant). Try `Rumah Panggang roastery Sungai Petani` / check rumahpanggang.com for address.
8. Bean Doe/ talker (Subang, beandoe.com.my) — not searched yet.
9. Putra Roasters Coffee (Subang, putraroasters.com) — not searched yet.

### NEEDS_MANUAL_REVIEW (already logged in the jsonl — excluded from directory unless Nick confirms)
- **Dateless Coffee Roaster** (JB) — no Maps listing found; likely online-only.
- **Drunk Coffee Roasters** (Segamat) — no listing; IG-only.
- **Cup O Joe** (KL) — no listing; shopee-only.
- **Charlie's Factory** (Bayan Lepas) — no listing; shopee-only.
- **Deadman Tongue** (GT, no-link row) — candidate rebrand "Tongue Mission Coffee Roasters" 4.8(24); needs human confirm.
- **Nogita Coffee** — GBP exists but no address/rating → reclassify to online/ships-nationwide.

### Phase-1 resolutions made (don't redo)
- **Bean Specialty = "Beam"** (beamspecialty.com, Bandar Sri Damansara) — physical record kept; fold online "Beam Coffee Roastery" (shopee/beamspecialty) into it, remove from online list.
- **Kafein Roastery ≠ The Kaffei Roastery** — confirmed two different brands (Alam Damai vs Pudu), both enriched.
- **Feeka, Playground Coffeery, Ome by spacebar** (no-link rows) — real storefronts found → KEEP (shop links noted in jsonl).
- **The Hub Coffee Roaster** = OUG branch, KL confirmed.
- State fixes from Maps addresses: Arkib Rasmi KL→Selangor (Cheras 43200); Mama Typica KL→Selangor (Ampang — new `kv_area:"Ampang"`, render chips from data); Craft Origin & Ground Coffee Roasters Selangor(PJ)→KL (TTDI / Bandar Sri Damansara → Damansara chip); Ghostbird kv_area Cheras→KL City (Seputeh); Common Man → Damansara (TTDI).

### Not started
Phases 3–9: JSON build, page build, SEO copy, schema, QA, sitemap/internal links, deploy.
(Phase 3 also still needs: write final `review_summary` sentences from `review_notes`,
compute `gbp_url` from ftids, sort states/roasters, produce `/routine/roasters_enriched.csv`
+ `/roasters-directory.json` + `NEEDS_MANUAL_REVIEW.md`.)

---

**For:** the Claude agent (fable model) that will execute this build.
**Owner:** Nick / The Beans Hub.
**Goal:** a high-intent, high-conversion, SEO + GEO directory page listing every physical
Malaysian coffee roaster by state, with a Klang Valley (Selangor/KL) area sub-filter, each
showing a real address, a link to their Google Business Profile, real Google rating/review
count, and a short grounded review summary. Online-only roasters appear in a separate
"Ships nationwide" section.

> **READ `CLAUDE.md` (repo root) BEFORE TOUCHING ANYTHING.** Every brand token, the gtag
> snippet, the canonical/slash-less URL rules, the `index.html`-per-folder rule, and the
> sitemap rule below come from it and are non-negotiable.

---

## The one rule that matters most (read twice)

**NEVER invent an address, a Google Business Profile link, a rating, a review count, or a
review sentence.** Every one of those fields must come from the Google Places API for that
exact business, verified by a matching website domain. If a roaster cannot be matched with
confidence, leave its enrichment fields **blank** and add it to a `NEEDS_MANUAL_REVIEW`
list. A fabricated local directory is worse than a smaller true one — it destroys the exact
trust signal (accuracy) that GEO and Google's local ranking reward. This is the error we
cannot afford.

---

## Confirmed decisions (already made — do not re-litigate)

1. **Data source = Google Places API (New).** Nick will provide a Google Maps Platform API
   key with Places API enabled.
2. **Online-only roasters** (Shopee-only, home-based, import-only) go in a **separate
   "Ships nationwide / online-only"** block — NO address, NO reviews, shop link only.
3. **Klang Valley uses ~8 area chips, not 4.** Bangsar is in KL; PJ / Subang Jaya / Shah
   Alam / Seri Kembangan are in Selangor. Keep the state (for schema) and the area (for the
   sub-filter) as separate fields.

---

## Inputs already produced (in repo)

- **`/CoffeeRoastersList.csv`** — original raw list (100 roasters).
- **`roasters_clean.csv`** (in the working outputs; copy into repo as
  `/routine/roasters_clean.csv`) — normalized: `name, orig_location, state,
  klang_valley, kv_area, type, shop_link, site_status, gbp_prospect`, plus **blank**
  enrichment columns (`gbp_place_id, gbp_url, address, postcode, google_rating,
  google_review_count, review_summary`) waiting to be filled in Phase 2.
- **`roasters_issues.md`** — the cleaning/issues log (counts + rows needing a human call).

Current split: **81 physical, 19 online.** Physical by state: Selangor 27, KL 24, Johor 13,
Penang 10, Perak 2, Terengganu 2, Sabah 1, Melaka 1, Kedah 1.

---

# PHASES

Do the phases in order. Do **not** start the HTML (Phase 4) until enrichment (Phase 2) is
complete and verified — the page is only as good as the data behind it.

---

## Phase 0 — Setup & guardrails (30 min)

1. Confirm the Places API key is available as an environment variable (e.g.
   `GOOGLE_MAPS_API_KEY`). Never hard-code it into any committed file or the HTML.
2. Re-read `CLAUDE.md` sections 2 (brand tokens), 3 (gtag/analytics), 5 (URL rules),
   6 (page checklist), 7 (brand voice), 10 (traffic reality).
3. Load the brand tokens you will reuse verbatim (do not invent colours):
   `--cream #FDF6EC, --green #296241, --accent #FDA11D, --accent-hover #DA8A10,
   --tag-bg #f0ebe0, --tag-text #296241, --border #E8E0D0, --text-muted #5a6e5a`.
   Fonts: Sigmar (display/headings) + Outfit (body).
4. Restate the no-fabrication rule in your working notes.

**Exit test:** you can print the API key length from env, and you have the brand tokens and
URL rules written into your task notes.

---

## Phase 1 — Data cleaning (DONE — just verify + resolve the human calls)

The normalization is already done in `roasters_clean.csv`. Your job here is only to:

1. **Resolve the 5 no-link rows** (Feeka Coffee Roaster, Playground Coffeery, Deadman
   Tongue, Ome by spacebar, Baristar Roastery). If Phase 2 finds a real Google listing with
   a website, keep them; otherwise mark `type=online` with no shop link → drop from the
   directory (or list name-only). Default: **keep if Places returns a real storefront,
   else drop.**
2. **Resolve known duplicates the auto-checker can't catch (different domains, same brand):**
   - `Bean Specialty` (beamspecialty.com) vs `Beam Coffee Roastery`
     (shopee.com.my/beamspecialty) vs `Beam Coffee Roastery` — likely **one brand**. Keep
     the physical storefront record, fold the Shopee one into it as the online shop link.
   - `Kafein Roastery` (shopee /kafein_roastery) vs `The Kaffei Roastery`
     (shopee /thekaffei_roastery) — **possibly two different brands.** Do NOT merge without
     confirming via their Google listing / IG. If unsure, keep separate and flag.
   - `The Hub Coffee Roaster` (thehuboug.com) — note "OUG"; confirm the correct area (OUG is
     KL/Selangor border) before assigning `kv_area`.
3. **Damansara** is tagged KL in source but sits on the KL/Selangor border — leave as KL
   unless the Places result says otherwise.

**Exit test:** every row in `roasters_clean.csv` has a `type` of `physical` or `online`, and
every unresolved judgment call is written into `NEEDS_MANUAL_REVIEW`.

---

## Phase 2 — Enrichment via Google Places API (the real work)

For every **physical** roaster, fetch and store the real data. Use the **Places API (New)**.

### 2.1 Find the place (Text Search)
- `POST https://places.googleapis.com/v1/places:searchText`
- Query string: `"{name} coffee roaster {orig_location} Malaysia"`
  (e.g. `"Bad Artist coffee roaster PJ Malaysia"`).
- FieldMask (header `X-Goog-FieldMask`):
  `places.id,places.displayName,places.formattedAddress,places.location,
  places.rating,places.userRatingCount,places.googleMapsUri,places.websiteUri,
  places.addressComponents`.

### 2.2 Verify the match (this is what prevents wrong data)
Accept a result **only if at least one** is true:
- The place `websiteUri` domain **equals** the roaster's `shop_link` domain (strongest), OR
- The `displayName` is a clear match to the roaster name **and** the `formattedAddress`
  is in the expected state/area.

If no result passes, **do not guess.** Set enrichment fields blank and push the roaster to
`NEEDS_MANUAL_REVIEW` with the top candidate for a human to confirm.

### 2.3 Pull details + reviews (Place Details)
- `GET https://places.googleapis.com/v1/places/{PLACE_ID}`
- FieldMask: add `reviews` (returns up to 5 reviews with `text`, `rating`,
  `authorAttribution`, `relativePublishTimeDescription`).

### 2.4 Fields to store per roaster
| Field | Source |
|---|---|
| `gbp_place_id` | `places.id` |
| `gbp_url` | `googleMapsUri` (this IS the public Google Business Profile link) |
| `address` | `formattedAddress` |
| `postcode` | parse from `addressComponents` (type `postal_code`) |
| `state` | confirm against `addressComponents` (type `administrative_area_level_1`) — **fix `roasters_clean.csv` if the API disagrees with our guess** |
| `kv_area` | keep our mapping; refine from the address locality if wrong |
| `google_rating` | `rating` (e.g. 4.6) |
| `google_review_count` | `userRatingCount` |
| `review_summary` | **written by you — see 2.5** |

### 2.5 The `review_summary` rule (ToS-safe + grounded)
- Read the returned reviews. Write **1–2 original editorial sentences** describing the
  genuine consensus — what people repeatedly praise, plus any honest recurring caveat.
  Example: *"Regulars come back for the bright, fruity single-origins and the calm
  minimalist space; a few mention it gets crowded on weekends."*
- It must be **grounded in the actual reviews** — do not generalise beyond what reviewers
  said. Match The Beans Hub voice (warm, specific, flavour-forward; no "premium",
  "artisanal", or "journey"; go light on exclamation marks — see `CLAUDE.md` §7).
- **If `userRatingCount` < 5 or no reviews:** omit the summary. Show only the rating/count,
  or the line *"New or quiet listing — few Google reviews yet."* Never manufacture a vibe.
- Do **not** paste Google review text verbatim as the summary (avoids ToS/attribution
  issues). Displaying the numeric **rating + count with a "Google rating" label and a link
  to the profile** is fine and expected.

### 2.6 Output
Write everything to **`/routine/roasters_enriched.csv`** (human-auditable) AND the runtime
file **`/roasters-directory.json`** (Phase 3 schema). Keep a separate
`NEEDS_MANUAL_REVIEW.md`.

**Exit test:** every physical roaster is either fully enriched with verified real data, or
in `NEEDS_MANUAL_REVIEW`. Zero invented values. Spot-check 10 records by opening their
`gbp_url` and confirming the address/rating match.

---

## Phase 3 — Final data model (`/roasters-directory.json`)

Single JSON the page fetches at runtime (mirrors the existing `beans.json` pattern).

```json
{
  "generated": "2026-07-08",
  "states": [
    {
      "state": "Selangor",
      "is_klang_valley": true,
      "roasters": [
        {
          "name": "Bad Artist",
          "kv_area": "Petaling Jaya",
          "address": "…real formatted address…",
          "postcode": "47800",
          "gbp_url": "https://maps.google.com/…",
          "gbp_place_id": "ChIJ…",
          "google_rating": 4.6,
          "google_review_count": 214,
          "review_summary": "…1–2 grounded sentences…",
          "shop_link": "https://badartistcoffee.com/collections/all"
        }
      ]
    }
  ],
  "online": [
    { "name": "Beam Coffee Roastery", "shop_link": "https://shopee.com.my/beamspecialty" }
  ]
}
```

Rules: states sorted by roaster count desc (Selangor, KL, Johor, Penang first); within a
state, sort by `google_rating` desc then `google_review_count` desc (roasters with no rating
go last). Klang Valley states carry `is_klang_valley: true` so the UI knows to show area
chips.

---

## Phase 4 — Page architecture, URL & files

- **URL (canonical, slash-less, no `.html`, www):**
  `https://www.thebeanshub.com/coffee-roasters-malaysia`
- **File:** create folder `/coffee-roasters-malaysia/` containing **`index.html`**
  (the slash-less rewrite in `.htaccess` requires the `index.html` filename — see
  `CLAUDE.md` §5 & §9). A folder without `index.html` will 404.
- **Add the URL to `/sitemap.xml`** (slash-less, matching the existing entries).
- Do **not** link to it anywhere with a `.html` extension.
- Add internal links **to** this page from: the homepage, the `/library` hub, the
  `malaysia-coffee-brands-roasters` and `kl-roasters` posts (these already exist and are
  topically adjacent — good for indexing this new page).

**Head/meta (from the `CLAUDE.md` §6 checklist — all required):**
- gtag snippet `G-JY42YLKPRM` + `google-site-verification` meta.
- `<html lang="en">`, charset, viewport.
- `<title>` ~57–72 chars, e.g. *"Malaysian Coffee Roasters by State — Directory | The Beans Hub"*.
- Meta description ~152–159 chars, keyword-led, mentions "by state / Klang Valley / Google
  reviews".
- Self-referencing canonical (clean, www, no slash).
- `<meta name="robots" content="index, follow">`.
- Open Graph + Twitter `summary_large_image` tags.
- Favicon + Google Fonts (Sigmar + Outfit) stylesheet links.

---

## Phase 5 — Interactive front-end (modern, on-brand)

Single self-contained `index.html` (inline CSS + JS, fetches `/roasters-directory.json`).
Reuse the exact brand tokens and the standard nav + footer from an existing page (copy the
markup from `/shop` or a recent post so nav/footer match sitewide).

### 5.1 Layout (top to bottom)
1. **Standard nav** (Home / Coffee Beans / Coffee Library / About / Contact + orange
   "Explore Beans" CTA).
2. **Hero**: single `<h1>` "Malaysian Coffee Roasters by State" (target keyword in the H1
   and in the first 100 words). One-paragraph intro: what this is, that it links straight to
   each roaster's Google profile and shop. A live count ("81 roasters · 9 states"), numbers
   set in Sigmar per brand.
3. **State selector** — a horizontal row of state "pills"/chips (Selangor, Kuala Lumpur,
   Johor, Penang, Perak, Terengganu, Kedah, Melaka, Sabah) + an "All" and a "Ships
   nationwide" pill. Sticky on scroll.
4. **Klang Valley sub-filter (the interaction Nick asked for):** when the user selects
   **Selangor** or **Kuala Lumpur** (or the grouped "Klang Valley" pill), reveal a second
   row of **area chips**: Petaling Jaya, Bangsar, Subang Jaya, Shah Alam, Cheras, Seri
   Kembangan, Damansara, KL City. Chips are multi-select toggles. A short prompt: *"Where in
   the Klang Valley are you? Pick your area."* Default = all areas shown.
5. **Results grid** of roaster **cards** (see 5.2), grouped under a state heading (`<h2 id>`
   per state for anchor links + schema).
6. **Ships-nationwide section** at the bottom: simpler cards (name + shop link, labelled
   "Online · ships within Malaysia"), no address/reviews.
7. **FAQ section** (visible, mirrors the FAQ schema — Phase 7).
8. **CTA** to `/shop` ("Browse 850+ beans from these roasters") — the one clear next step.
9. **Standard footer.**

### 5.2 Roaster card (the core unit)
Contains, in this order:
- Roaster **name** (H3).
- **Area/state** tag chip (uses `--tag-bg` / `--tag-text`).
- **Google rating** as stars + numeric (e.g. ★ 4.6) and **review count** ("214 Google
  reviews"), with the "Google rating" label. Hide this block entirely if no rating.
- **Address** (real, from Places).
- **`review_summary`** (1–2 sentences) — omit if none.
- Two buttons:
  - **"View on Google"** → `gbp_url` (`target="_blank" rel="noopener"`).
  - **"Visit shop"** → `shop_link` (`target="_blank" rel="noopener"`).

### 5.3 Design direction (modern + interactive, still on-brand)
- Cream (`--cream`) page; white cards with `--border`, soft shadow, ~14px radius,
  hover lift/scale transition.
- Green (`--green`) headings; accent (`--accent`) buttons with `--accent-hover` on hover.
- Filter chips: unselected = `--tag-bg`; selected = `--green` bg / cream text. Smooth
  toggle animation; result count updates live ("Showing 15 roasters in Petaling Jaya").
- Instant client-side filtering (no reload). Animate cards in/out (fade + slight translate).
- Fully responsive: cards 3-up desktop → 2-up tablet → 1-up mobile. Filter chips wrap /
  horizontal-scroll on mobile. Sticky filter bar with a subtle shadow on scroll.
- Accessibility: chips are real buttons with `aria-pressed`; keyboard-navigable; visible
  focus rings; `aria-live` on the result count.
- **No external JS/CSS frameworks** beyond Google Fonts (matches the site's static, no-build
  approach). Vanilla JS only.

### 5.4 Analytics (extend the `CLAUDE.md` §3 convention)
Fire a GA4 event on each outbound click:
```js
gtag('event','roaster_click',{
  roaster:'NAME', state:'STATE', destination:'gbp'|'shop', source: location.pathname
});
```
Also fire a `filter_use` event when a state/area filter is applied (helps Nick see which
areas high-intent users want).

**Exit test:** page loads, fetches JSON, all filters work (state → KV area reveal → live
count), cards render real data, all buttons open correct URLs in new tabs, mobile layout
clean, GA events fire (check the DebugView).

---

## Phase 6 — On-page SEO

- One `<h1>` with the primary keyword; keyword in first 100 words.
- Heading hierarchy: `<h1>` → `<h2>` per state (each with `id`, e.g.
  `id="selangor-coffee-roasters"`) → `<h3>` per roaster.
- **Above-the-fold intro copy (~120–180 words)** naming the value: find and visit roasters
  near you, real Google ratings, direct links. Weave natural keywords: *coffee roasters
  Malaysia, specialty coffee roasters KL, coffee roaster Petaling Jaya / Selangor / Penang /
  Johor.*
- **Per-state mini-intro (1–2 sentences)** under each `<h2>` — real, specific, indexable
  text (not just cards). E.g. "Selangor has the densest roaster scene in the country, from
  Petaling Jaya to Shah Alam." This is what wins the "coffee roasters in Selangor" long-tail.
- Descriptive, keyword-aware internal anchor text linking to `/shop/…` category pages and the
  two roaster posts.
- Image alt text if any images are used; lazy-load below the fold.
- Keep the page fast (inline critical CSS, defer non-critical JS, no heavy libs).

---

## Phase 7 — Structured data + GEO (this is how AI engines quote you)

Add JSON-LD blocks (this page is a directory, so lean on `ItemList` + `LocalBusiness`):

1. **`BreadcrumbList`** — Home › Coffee Roasters by State.
2. **`ItemList`** — ordered list of all roasters (`itemListElement` → `ListItem` →
   `item` as a `LocalBusiness`/`CafeOrCoffeeShop`).
3. **Per roaster `LocalBusiness` / `CafeOrCoffeeShop`** with: `name`, `address`
   (`PostalAddress` with `addressRegion` = state, `postalCode`, `addressLocality`),
   `aggregateRating` (`ratingValue` = `google_rating`, `reviewCount` =
   `google_review_count`) — **only include `aggregateRating` when the real numbers exist**,
   `hasMap`/`url` = `gbp_url`, `sameAs` = shop link. Do not add ratings schema to roasters
   without a real rating (invalid + risky).
4. **`FAQPage`** — mirrored by the visible FAQ. Questions targeting real high-intent /
   voice / AI queries: *"Where can I buy freshly roasted coffee beans in KL?"*, *"Which are
   the best-rated coffee roasters in Petaling Jaya?"*, *"Are there specialty coffee roasters
   in Penang / Johor?"*, *"Which Malaysian roasters ship nationwide?"* Answers should be
   concise, factual, and cite the directory.

**GEO specifics (optimising for AI answer engines, not just Google):**
- Lead every section with a **direct, extractable answer** (AI engines lift the first clear
  sentence). E.g. start the Selangor block with "There are 27 specialty coffee roasters in
  Selangor…".
- Use clean, consistent entity naming (roaster name + area + state) so models can
  disambiguate.
- Provide the data as real HTML text, not only inside the JSON/JS — AI crawlers and some
  search bots don't execute the fetch. **Server-render or pre-bake the roaster cards into
  the HTML** as the source of truth, and use the JSON only to hydrate the filters. (If a
  build step isn't feasible, generate the full card HTML into `index.html` at build time
  from the JSON, so the content ships in the initial HTML.) This is critical — the July 2026
  GSC audit (`CLAUDE.md` §10) shows this site's bottleneck is indexing; JS-only content
  makes that worse.
- Include a short, quotable summary line near the top ("The Beans Hub tracks 81 physical
  specialty coffee roasters across 9 Malaysian states, each with its Google rating and a
  direct link to buy.").

---

## Phase 8 — QA & verification (do not skip — "no errors" lives here)

Run every check; fix before deploy.

1. **No-fabrication audit:** open 15 random roaster `gbp_url`s; confirm name, address,
   rating, and review count match the page exactly. Any mismatch = data bug, fix at source.
2. **Coverage:** every physical roaster appears exactly once under the correct state; every
   online roaster is in the nationwide block; `NEEDS_MANUAL_REVIEW` items are excluded (not
   shown with blanks).
3. **Links:** every `gbp_url` and `shop_link` returns 200 / opens correctly; all
   `target="_blank"` have `rel="noopener"`.
4. **Filters:** state filter, Klang Valley area reveal, multi-select area chips, "All",
   "Ships nationwide", and the live count all behave. Test on mobile width.
5. **Schema:** validate all JSON-LD in Google's Rich Results Test + Schema.org validator.
   Confirm no `aggregateRating` on unrated roasters.
6. **On-page:** exactly one `<h1>`; canonical is slash-less/www/no-`.html`; title & meta
   lengths in range; gtag + verification meta present.
7. **Content-in-HTML check:** view source (not devtools DOM) and confirm roaster names,
   addresses, and per-state intros are present in the raw HTML (GEO/indexing requirement).
8. **Analytics:** confirm `roaster_click` fires with correct params in GA4 DebugView.
9. **Performance/mobile:** Lighthouse pass; layout clean at 360px, 768px, 1280px.

**Recommended:** run this QA pass as a fresh subagent so it audits with clean eyes rather
than trusting the build.

---

## Phase 9 — Deploy & index

1. Save `index.html` in `/coffee-roasters-malaysia/`; save `/roasters-directory.json` at
   web root; copy `roasters_enriched.csv` to `/routine/` for future edits.
2. Add the canonical URL to `/sitemap.xml`.
3. Add the internal links from homepage / library / the two roaster posts (Phase 4).
4. After deploy: verify the slash-less URL returns **200** (GSC URL Inspection → Test Live
   URL — the `CLAUDE.md` §9 gotcha), resubmit `sitemap.xml`, and **Request Indexing** on the
   new page.
5. Because this site's real constraint is backlinks/authority (`CLAUDE.md` §10), use this
   page as outreach bait: it links out to all 52+ roasters' Google profiles — tell them
   they're featured and ask for a link back. That's what will actually get it indexed.

---

## Field/name reference (so the agent stays consistent)

- Primary keyword: **coffee roasters Malaysia** (+ per-state and per-area long-tails).
- Slug: `/coffee-roasters-malaysia` · file `/coffee-roasters-malaysia/index.html`.
- Runtime data: `/roasters-directory.json`. Editable source: `/routine/roasters_enriched.csv`.
- GA4: property `G-JY42YLKPRM`; events `roaster_click`, `filter_use`.
- Brand tokens & voice: `CLAUDE.md` §2 & §7. URL rules: §5 & §9. Page checklist: §6.

---

## Sequencing summary (hand this order to the fable agent)

Phase 0 setup → Phase 1 resolve the 5 no-link + dupe calls → **Phase 2 enrich via Places API
(the bulk of the work)** → Phase 3 build the JSON → Phase 4 scaffold URL/folder/meta →
Phase 5 build the interactive page (pre-baked HTML cards + JS filters) → Phase 6 on-page SEO
copy → Phase 7 schema + GEO → Phase 8 full QA (fresh subagent) → Phase 9 deploy + request
indexing + roaster outreach.

**Gate:** do not advance past Phase 2 until zero physical roasters have invented data.
