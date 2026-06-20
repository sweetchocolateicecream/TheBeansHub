# Cluster 2 — SEO Checklist (Completed)

**Cluster:** Coffee Bean Origins
**Pages:** 1 pillar + 2 new cluster pages + 4 existing `/shop/*` origin pages serving as cluster pages
**Location:** new posts live in `/posts/` — clean URLs served via the existing `.htaccess` rewrite
**Built:** May 2026 · Generator: `SEO plans/build-cluster2.js`

## Why only 3 new pages?

Cluster 2's design has 6 cluster pages under the pillar. Four of them — Ethiopia, Colombia, Brazil and Indonesia — are already served by your existing `/shop/*-coffee-beans` category pages, which already carry the intro copy drafted in `category-content-review.md` (verified via grep). Building parallel `/posts/*` pages for them would create keyword cannibalisation. So the pillar **links down to the existing shop pages** rather than duplicating them, and the two genuinely new cluster pages — the combined Yunnan & Thailand guide and the single-origin-vs-blend comparison — were written from scratch.

## Pages shipped

| Page | URL | Target keyword | Title len | Words |
|---|---|---|---|---|
| Pillar | /posts/coffee-bean-origins | single origin coffee | 68 | ~2,005 |
| New cluster | /posts/asia-coffee-origins-yunnan-thailand | yunnan coffee beans malaysia | 66 | ~1,130 |
| New cluster | /posts/single-origin-vs-blend-coffee | single origin vs blend | 68 | ~1,250 |
| Existing | /shop/ethiopia-coffee-beans | ethiopia coffee beans malaysia | — | (intro copy already in place) |
| Existing | /shop/colombia%20coffee%20beans | colombia coffee beans malaysia | — | (intro copy already in place) |
| Existing | /shop/brazil-coffee-beans | brazil coffee beans malaysia | — | (intro copy already in place) |
| Existing | /shop/indonesia-coffee-beans | indonesia coffee beans malaysia | — | (intro copy already in place) |

## On-page SEO — done on every new page

- [x] Unique `<title>` with target keyword + brand, 66–68 chars
- [x] Unique meta description with target keyword, 148–168 chars
- [x] Single `<h1>` containing the target keyword
- [x] Logical heading hierarchy (H1 > H2 > H3), every H2 carries an `id`
- [x] Target keyword in the first 100 words of body copy
- [x] `<link rel="canonical">` — self-referencing, clean URL
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

- [x] Pillar links **down** to all 6 cluster destinations — 4 existing shop pages (Ethiopia, Colombia, Brazil, Indonesia) plus the two new posts
- [x] Each new cluster page links **up** to the pillar
- [x] Cross-links between the new cluster pages
- [x] Links **across** to Cluster 1 (Specialty Coffee Malaysia, Best Coffee Beans, How to Read Flavour Notes, Light vs Medium vs Dark Roast) and existing origin posts (Ethiopia Yirgacheffe, Brazil)
- [x] Links to `/shop` and relevant `/shop/*` origin and blend pages — all 28 internal-link targets verified to exist (no broken links)
- [x] Contextual back-link added from `posts/arabica-robusta-liberica.html` → the pillar and the single-origin-vs-blend post
- [x] Descriptive anchor text throughout
- [x] No links to query-string `/shop?*` URLs (disallowed in robots.txt)

## Technical

- [x] Valid HTML — tag balance, nesting and all 3 JSON-LD blocks parse cleanly
- [x] CSS, nav and footer lifted from existing posts — visually consistent with the Library
- [x] `sitemap.xml` updated — 3 new `<loc>` entries (pillar priority 0.85, cluster pages 0.75)
- [x] Mobile responsive (inherits the site's existing breakpoints)
- [x] Google Analytics tag present (G-JY42YLKPRM)
- [x] OG image reuses existing site asset — no new alt-text debt

## Content quality

- [x] Voice matched to existing blog posts — conversational, informed, plain English, mixed sentence length; avoids fragment sentences and the "not X — it's Y" construction
- [x] Fact-checked: SCA origin profiles, Colombian coffee belt regions (Huila, Nariño, Antioquia, Cauca, Tolima) and altitudes (1,400–2,100m), Brazilian regions (Minas Gerais, Cerrado, Mogiana, Sul de Minas) at 800–1,300m, Indonesian regions (Sumatra, Java, Sulawesi, Bali, Flores) at 900–1,700m, Ethiopian altitudes (Yirgacheffe, Sidamo, Guji, Limu at 1,700–2,200m), Yunnan regions (Pu'er, Baoshan, Lincang, Dehong at 1,100–2,000m), Thai regions (Doi Chaang, Doi Tung, Doi Pangkhon, Mae Hong Son at 1,000–1,600m), Royal Project history, *giling basah* wet-hulling, Catimor varietal introduction, freshness window (2–4 weeks from roast)
- [x] No exaggeration — origin character descriptions stay within widely-attested specialty profiles
- [x] No fabricated specifics — no invented roaster names, farm names or competition placements
- [x] Word counts within the brief's per-page targets

## Discoverability — done

- [x] 3 new library cards added to `/library` for the pillar, the Yunnan & Thailand guide and the single-origin-vs-blend post, matching the existing card format (`data-cat="origin"` for the pillar and Asia guide, `data-cat="guide"` for the comparison post). `picksCount` updated 19 → 22
- [x] Sitemap updated — 3 new `<url>` entries (pillar priority 0.85, others 0.75)
- [x] Cross-link added from `posts/arabica-robusta-liberica.html` so the cluster has an in-context back-link from an established post

## Existing shop cluster pages — brought into line with the brief

The brief in `The-Beans-Hub-SEO-Topic-Clusters.docx` lists Ethiopia, Colombia, Brazil and Indonesia as cluster pages under the Origins pillar, using the existing `/shop/*-coffee-beans` pages. They were missing several brief requirements; fixed in this pass:

- [x] **Canonical URL fixed** on all 4 — they were pointing to `/shop/{country}/` paths that 404 under the current `.htaccess` rewrites. Updated to the actual deployed URLs (`/shop/ethiopia-coffee-beans`, `/shop/colombia%20coffee%20beans`, `/shop/brazil-coffee-beans`, `/shop/indonesia-coffee-beans`)
- [x] **`og:url` fixed** on all 4 to match the new canonical
- [x] **JSON-LD `url` and BreadcrumbList `item` URLs fixed** on all 4 to match
- [x] **UP-link to the pillar** added to the intro paragraph of all 4 — every cluster page now links to `/posts/coffee-bean-origins`
- [x] **ACROSS-links to processing categories** added per the brief:
  - Ethiopia → washed-process + natural-process
  - Colombia → washed-process + single-origin-vs-blend post
  - Brazil → natural-process + single-origin-vs-blend post
  - Indonesia → washed-process + natural-process + light-vs-medium-vs-dark-roast post
- [x] **Brief's 4 questions covered** on each — the existing FAQ sections and intro copy already answer them (verified: washed vs natural, Yirgacheffe/Sidamo regions, brew methods, etc. for Ethiopia; equivalent for the other three)
- [x] Pillar `/posts/coffee-bean-origins` confirmed to link **down** to all 6 cluster destinations (4 shop pages + 2 new posts) and **across** to the processing category pages and the varieties post

## Recommended follow-ups (need your call after pushing)

- [ ] After publishing, submit the updated `sitemap.xml` in Google Search Console
- [ ] Request indexing for the pillar (`/posts/coffee-bean-origins`) first, then the 2 new cluster pages
- [ ] The shop pages still use `og:type=website`. Could be tightened to `og:type=product.group` or kept as-is — left to your call
- [ ] Optionally add more in-context links from older origin posts (e.g. `ethiopia-yirgacheffe-coffee-you-should-try` → the pillar) — held off to avoid disturbing the personal voice of those posts
