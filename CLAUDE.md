# The Beans Hub — Build & Brand Reference

Reference for anyone (human or AI) adding or editing pages on thebeanshub.com.
Read this before creating a new page. Keep it updated when conventions change.

---

## 1. What the site is

A **static HTML** site — a specialty coffee discovery marketplace for **Malaysian-roasted beans**.
Users filter ~850 beans from 52 roasters by taste notes, roast level, origin, and process,
then click out to **buy from the roaster directly** (affiliate/referral model — there is no
on-site checkout). Currently pre-revenue, audience-building phase.

- **Live domain:** https://www.thebeanshub.com (canonical is the **www** version)
- **Hosting:** static files + Apache `.htaccess` (LiteSpeed cache present)
- **No build step required** for individual pages — they are hand/generated HTML committed directly.

---

## 2. Brand assets (hard rules)

Defined as CSS variables in `:root` on every page — reuse these exact values, don't invent new colours.

| Token | Value | Use |
|---|---|---|
| `--cream` | `#FDF6EC` | Page background |
| `--green` | `#296241` | Primary text / brand colour |
| `--accent` | `#FDA11D` | Buttons, CTAs, highlights |
| `--accent-hover` | `#DA8A10` | Button hover |
| `--tag-bg` | `#f0ebe0` | Tag/chip background |
| `--tag-text` | `#296241` | Tag text |
| `--border` | `#E8E0D0` | Borders |
| `--text-muted` | `#5a6e5a` | Secondary text |

**Fonts** (Google Fonts, one stylesheet link):
`https://fonts.googleapis.com/css2?family=Sigmar&family=Outfit:wght@300;400;500;600;700&display=swap`
- **Sigmar** (cursive display) — logo, headings, stat numbers
- **Outfit** — all body text (default `font-family`)

**Logo & favicon:** `/img/thebeanshub_logo.png`. Nav logo is text set in Sigmar, with "Hub" in `--accent`.

**Icon set:** `/img/beanshub-icons/` — taste-note icons (fruity, nutty/cocoa, floral, spices, sweet,
roasted, green/vegetative, sour/fermented) and process icons (browse, filter, buy-direct). SVG + PNG.

---

## 3. Analytics — GA4 & the `buy_click` event

**GA4 property: `G-JY42YLKPRM`.** Every page must include this gtag snippet in `<head>`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JY42YLKPRM"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-JY42YLKPRM');
</script>
```

**Custom conversion event `buy_click`** — fires when a visitor clicks a "Buy Now" button out to a
roaster. Always send these three params:

| Param | Value |
|---|---|
| `bean_name` | The bean's name |
| `roaster` | The roaster/brand name |
| `source` | Where the click came from — `'homepage'` (hardcoded on the homepage), or the page path (`pagePath`) on shop/category pages |

Inline example (homepage style):
```html
<a href="..." target="_blank" rel="noopener" class="bean-buy-btn"
   onclick="gtag('event','buy_click',{bean_name:'NAME',roaster:'BRAND',source:'homepage'})">Buy Now</a>
```

**Rule:** any new page with buy buttons must include the gtag snippet AND fire `buy_click` with a
meaningful `source`.

**Google site verification meta (every page):**
`<meta content="jqlfBshOy4vgYUb478viCuTswoIsaWL_jdOhL0srx0w" name="google-site-verification">`

---

## 4. Data model

- **`/beans.json`** (851 records) — the **live** data the homepage and shop fetch at runtime via `fetch('/beans.json')`.
- **`/beans.csv`** — the **source/editable** version. Edit here, then regenerate `beans.json`.
- **`/routine/Tubby Coffee Bean List.xlsx`** — upstream data-collection spreadsheet that feeds the catalogue.

**Fields:** `SKU, brands, name, description, taste_notes, taste_notes_category, price_200g,
image_url, varietal, altitude, processing method, roast level, roasted for, origin, blend, link`

- `taste_notes_category` uses the controlled set that maps to the filter icons:
  **Fruity, Nutty/Cocoa, Floral, Spices, Sweet, Roasted, Green/Vegetative, Sour/Fermented**.
- `link` = the roaster's product URL (the `buy_click` destination).
- `price_200g` is a string like `RM 70`.

---

## 5. Site structure & URLs

```
/                → homepage (index.html)
/shop            → main filterable catalogue (loads beans.json)
/shop/<x>-coffee-beans   → category pages (origin or process; 10 of them)
/posts/<slug>    → blog / library articles (~40)
/library         → article hub
/about  /contact
/img             → images & icons
```

URL rules enforced by **`.htaccess`** — do not break these:

- **Canonical domain = `www.thebeanshub.com`** (non-www 301s to www).
- **Clean URLs** — `.html` is stripped and 301-redirected. **Never link with a `.html` extension.**
  Link posts as `/posts/<slug>`, categories as `/shop/<slug>`.
- Large **301 map from the old WordPress structure** (`/product/`, `/coffee_bean/`, `/coffee-beans/`,
  `/origin_country/`, `/brand/`) into the new `/shop/` categories. This fixed ~9.2k Search Console
  404s — leave it intact.
- `robots.txt` **disallows `/shop?*`** (faceted filter URLs are non-canonical).
- `sitemap.xml` lists the canonical URLs — **add every new page to it.**

---

## 6. Page-build checklist (every new page)

Head / meta:
- [ ] gtag snippet (section 3) + google-site-verification meta
- [ ] `<html lang="en">`, charset, viewport
- [ ] Unique `<title>` — target keyword + brand, ~57–72 chars
- [ ] Unique meta description with keyword, ~152–159 chars
- [ ] Self-referencing `<link rel="canonical">` — clean URL, www, no `.html`
- [ ] `<meta name="robots" content="index, follow">`
- [ ] Open Graph tags (type, title, description, url, image, site_name)
- [ ] Twitter Card tags (`summary_large_image`)
- [ ] Favicon link
- [ ] Fonts stylesheet link

Body:
- [ ] Single `<h1>` containing the target keyword; keyword in first 100 words
- [ ] Logical heading hierarchy (H1 > H2 > H3); each H2 has an `id`
- [ ] Standard nav (Home / Coffee Beans / Coffee Library / About / Contact + orange "Explore Beans" CTA)
      and footer, matching existing pages
- [ ] Buy buttons wired to `buy_click` (if present)
- [ ] One clear CTA pointing to the next step (a `/shop` category or related post)

Posts also include **three JSON-LD blocks**: `BreadcrumbList` (Home › Coffee Library › Page),
`BlogPosting` (headline, description, datePublished, dateModified, image, author, publisher),
and `FAQPage` (mirrored by a visible FAQ section).

After publishing:
- [ ] Add the page to `sitemap.xml`
- [ ] Use `index.html` as the filename inside the slug folder (the standard pattern)

---

## 7. Brand voice (summary — full version in `/marketing/context/brand-voice.md`)

Warm, knowledgeable, community-first. Sounds like a friend who's deep into specialty coffee but
never makes you feel like an outsider.

- **Do:** speak to "you"; celebrate Malaysian roasters by name; teach taste notes / process / brewing;
  use flavour-forward language (fruity, chocolatey, bright, clean, heavy body).
- **Don't:** corporate/stiff phrasing, hype/salesy ("BEST BEANS 🔥"), gatekeeping, generic-lifestyle
  filler. Avoid the words **"premium"**, **"artisanal"**, and metaphorical **"journey"**;
  go light on exclamation marks; spell out acronyms (SCA, etc.) on first use.
- Every piece should either **teach something** or **surface a discovery**, and end with one next step.

---

## 8. Key reference files in this repo

- **`THE-BEANS-HUB-STRATEGY.docx`** — the single source of truth for strategy: positioning, traffic
  reality, keywords, SEO architecture, email capture, growth/monetisation, social, backlinks,
  what's done vs not, and the 90-day plan. **Read this first; update it instead of starting new strategy docs.**
- **`THE-BEANS-HUB-PAGES-AND-FUNNEL.xlsx`** — companion workbook: every page, funnel stage, target
  keyword, next-step CTA, and the user-journey/funnel map.
- `marketing/context/brand-voice.md`, `brand-context.md`, `ideal-customer-profile.md` — canonical brand docs
- `SEO plans/` — now holds only the operational generators (`build-cluster*.js` /
  `generate-category-pages.js`) + `library-image-prompts.md`. The strategy/keyword/cluster docs were
  consolidated into the source of truth and moved to `/archive` (see `archive/README.md`).
- `marketing/projects/Instagram Content System/` + `The-Beans-Hub-Xiaohongshu-Playbook.docx` — social
  content production playbooks (operational; strategy lives in the source of truth).

---

## 9. Known gaps / watch-outs

- **Email capture is now live but not yet a system** — a newsletter signup is on the homepage
  (and a `/find-your-beans` page exists), but there's no lead magnet, no compelling reason-to-join,
  and social traffic is not deliberately routed into the list. See section 10 for the capture status.
- Two older posts use a `<slug>.html` filename instead of the standard `index.html`
  (`posts/specialty-coffee-beans-kl`, `posts/specialty-coffee-beans-pj-selangor`).
- Don't attempt an on-site checkout or a framework rebuild — it's intentionally a static, SEO-first site.

---

## 10. Traffic & audience reality (as of June 2026)

The honest state of the funnel, established from GA4 + Search Console. Read this before judging
traffic numbers or planning growth work.

### Channel mix — single-channel dependency
- **Organic Social (Instagram) drives nearly everything.** It is the #1 channel by a wide margin
  and is effectively the whole top of funnel.
- **Google Search contributes very little** — ~11 clicks and ~561 impressions over a rolling
  3-month window, average position ~25. The site is indexed but not yet winning on its target queries.
- **The entire traffic base rests on a single algorithm we don't control.** When Instagram reach
  cools, traffic falls with it — there is no organic-search baseline to catch the site.
- **No owned audience yet.** Until the email list is built, there is no way to reach past visitors
  directly; every visit is rented from the social algorithm.

### What this means strategically
- This is an **ownership/retention problem, not a traffic problem.** The site can attract attention
  (Instagram can spike, even go viral) but currently keeps almost none of it.
- A viral spike with no capture in place leaks away — exactly what happened in June 2026.

### The June 2026 episode (worked example, don't misread it next time)
- GA4 showed a sharp "cliff" in active users mid-June (anomaly flagged ~16 Jun, ~92% drop).
- Investigation confirmed: **the GA tag is installed correctly and firing** — this was NOT a
  tracking bug. Search Console showed no indexing/penalty/site-down event (impressions held in
  normal range). The drop was **real and concentrated in Organic Social**: an Instagram post had
  gone semi-viral and then naturally decayed. Posting has continued intermittently since.
- Lesson: a sudden GA drop on this site is most likely a **social-reach change**, not a site bug —
  but always confirm the tag fires and cross-check Search Console before assuming either way.

### Capture & growth status — done vs. not done
**Done / in place:**
- Newsletter signup is live on the homepage.
- A `/find-your-beans` taste-finder entry page exists.
- GA4 + the `buy_click` conversion event are wired and working (see section 3).

**Not done yet (the priorities):**
- No lead magnet or strong reason-to-subscribe; the list isn't yet positioned around a clear value
  (e.g. monthly Malaysian roaster drops, taste-matched picks).
- Instagram traffic is **not deliberately funnelled into the email list** — capturing the *next*
  spike into owned audience is the urgent job.
- **Organic-search baseline is weak.** The 850-bean / 52-roaster catalogue and ~40 articles are an
  underused SEO asset — long-tail roaster / origin / taste queries are winnable with on-page work
  and internal linking, and would give traffic that survives quiet posting weeks.
- Posting cadence is not yet a repeatable system (the Instagram Content System project exists to
  support this); virality should be treated as a bonus on top of consistency, not the plan.
