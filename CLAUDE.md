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

- `marketing/context/brand-voice.md`, `brand-context.md`, `ideal-customer-profile.md` — canonical brand docs
- `beans-hub-growth-playbook.md` — monetisation strategy (roaster partner programme, email list, subscription box)
- `SEO plans/` — topic-cluster strategy, keyword/gap audits, cluster checklists, and the
  `build-cluster*.js` / `generate-category-pages.js` generators used to mass-produce pages
- `marketing/projects/Instagram Content System/` — social content plan + carousel design system

---

## 9. Known gaps / watch-outs

- **No email capture is live yet** — the growth playbook flags building the list as urgent.
- Two older posts use a `<slug>.html` filename instead of the standard `index.html`
  (`posts/specialty-coffee-beans-kl`, `posts/specialty-coffee-beans-pj-selangor`).
- Don't attempt an on-site checkout or a framework rebuild — it's intentionally a static, SEO-first site.
