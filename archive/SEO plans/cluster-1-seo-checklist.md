# Cluster 1 — SEO Checklist (Completed)

**Cluster:** Specialty Coffee in Malaysia (Local & Buying)
**Pages:** 1 pillar + 6 cluster pages = 7 pages
**Location:** `/posts/` — clean URLs served via the existing `.htaccess` rewrite
**Built:** May 2026 · Generator: `SEO plans/build-cluster1.js`

## Pages shipped

| Page | URL | Target keyword | Title len | Words |
|---|---|---|---|---|
| Pillar | /posts/specialty-coffee-malaysia | specialty coffee malaysia | 67 | ~2,050 |
| Cluster | /posts/specialty-coffee-beans-kl | specialty coffee beans kl | 57 | ~1,090 |
| Cluster | /posts/specialty-coffee-beans-pj-selangor | specialty coffee petaling jaya | 72 | ~925 |
| Cluster | /posts/specialty-coffee-penang | specialty coffee penang | 62 | ~1,030 |
| Cluster | /posts/buy-coffee-beans-online-malaysia | coffee beans online malaysia | 58 | ~1,125 |
| Cluster | /posts/malaysia-coffee-brands-roasters | malaysia coffee brand | 64 | ~1,425 |
| Cluster | /posts/best-coffee-beans-malaysia | best coffee beans malaysia | 66 | ~1,515 |

## On-page SEO — done on every page

- [x] Unique `<title>` with target keyword + brand, 57–72 chars (within display range)
- [x] Unique meta description with target keyword, 152–159 chars
- [x] Single `<h1>` containing the target keyword
- [x] Logical heading hierarchy (H1 > H2 > H3), every H2 carries an `id`
- [x] Target keyword in the first 100 words of body copy
- [x] `<link rel="canonical">` — self-referencing, clean URL (no `.html`, no `www` mismatch)
- [x] `<meta name="robots" content="index, follow">`
- [x] `<meta name="viewport">` and `<html lang="en">`
- [x] Open Graph tags (type, title, description, url, image, site_name)
- [x] Twitter Card tags (summary_large_image)
- [x] Favicon link
- [x] Sticky table of contents with scroll-spy (matches existing posts)

## Structured data (JSON-LD) — 3 blocks per page

- [x] `BreadcrumbList` — Home › Coffee Library › Page
- [x] `BlogPosting` — headline, description, datePublished, dateModified, image, author, publisher
- [x] `FAQPage` — 4 Q&As per page, mirrored as a visible FAQ section (eligible for FAQ rich results)

## Internal linking

- [x] Every cluster page links **up** to the pillar
- [x] Pillar links **down** to all 6 cluster pages
- [x] Cluster pages link **across** to 2–4 sibling pages
- [x] Links **out** to relevant existing Library posts (kl-roasters, specialty-coffee-johor, arabica-robusta-liberica, how-to-read-flavour-notes, light-vs-medium-vs-dark-roast)
- [x] Links to `/shop` and relevant `/shop/*` category pages — all targets verified to exist
- [x] Descriptive anchor text throughout (no "click here")
- [x] No links to query-string `/shop?*` URLs (disallowed in robots.txt)
- [x] No broken internal links — every `/posts/*` target confirmed present

## Technical

- [x] Valid HTML — tag balance, nesting and all 3 JSON-LD blocks parse cleanly
- [x] CSS, nav and footer lifted from existing posts — visually consistent with the Library
- [x] `sitemap.xml` updated — 7 new `<loc>` entries (pillar priority 0.85, cluster pages 0.75)
- [x] Mobile responsive (inherits the site's existing breakpoints)
- [x] Google Analytics tag present (G-JY42YLKPRM)
- [x] No images added — OG image reuses an existing site asset, so no new alt-text debt

## Content quality

- [x] Voice matched to existing blog posts — conversational, informed, plain English, mixed sentence length; avoids fragment sentences and the "not X — it's Y" construction
- [x] Fact-checked: SCA 80-point specialty threshold, coffee freshness window (2–4 weeks from roast), roast-level/brew-method pairing, Malaysia as a roasting hub growing mainly liberica, dose maths (15–18 g/cup)
- [x] No exaggeration — "more than 700 beans from over 40 roasters" reflects the actual counts in `beans.json` (714 beans, 47 brands)
- [x] No fabricated specifics — no invented roaster names, per-city counts, or competitor claims
- [x] Word counts within the brief's per-page targets

## Discoverability — done

- [x] All 7 pages already wired into `/library` — the pillar is the Featured card; the other six appear in the posts grid with the correct tags and categories
- [x] Contextual back-link added from `posts/kl-roasters.html` → `/posts/specialty-coffee-beans-kl` and `/posts/specialty-coffee-malaysia` (in-context, in the "How to Find More" section)

## Recommended follow-ups (need your call after pushing)

- [ ] After publishing, submit the updated `sitemap.xml` in Google Search Console
- [ ] Request indexing for the pillar (`/posts/specialty-coffee-malaysia`) first, then the 6 cluster pages
- [ ] Optionally add more in-context links from older posts (e.g. `arabica-robusta-liberica` → pillar, `specialty-coffee-johor` → pillar) — held off to avoid disturbing the personal voice of those posts
