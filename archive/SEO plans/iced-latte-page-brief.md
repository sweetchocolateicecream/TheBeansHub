# Content & SEO/GEO Brief — "Coffee Beans for Your Iced Latte"

Target page: `/shop/coffee-beans-for-iced-latte` (guide + bean-grid hybrid)
Status: research complete, ready to build. Prepared June 2026.

---

## 1. Search intent & keyword reality

The exact phrase "coffee beans for iced latte" is a thin head term. The traffic and the
AI-citation value live in the **question cluster** around it, plus the higher-volume adjacent
term **"best roast for iced coffee."** Build the page to answer the whole cluster so it can win
featured snippets (SEO) and AI Overview / ChatGPT / Perplexity citations (GEO/AIO).

**Primary keyword:** best coffee beans for iced latte
**Secondary / adjacent:** best roast for iced latte · light vs dark roast iced coffee ·
beans for iced coffee · espresso beans for iced latte · iced latte at home

**Our unfair advantage:** every page currently ranking is a foreign roaster's blog. We can own
**"best Malaysian-roasted beans for iced latte"** and link straight to in-stock local beans.
No competitor can answer the local-intent version well.

---

## 2. Core questions to answer (each becomes an H2 + mirrored FAQ entry)

1. What coffee beans are best for an iced latte?
2. What roast level is best for an iced latte — light, medium, or dark?
3. Do you use espresso or brewed coffee for an iced latte?
4. Which taste notes work best with milk and ice?
5. Is light roast or dark roast better for iced coffee?
6. What is the coffee-to-milk ratio for an iced latte?
7. How do you make an iced latte at home without it tasting watery?
8. What's the difference between an iced latte, iced coffee, and cold brew?
9. What's the best milk for an iced latte?
10. Can you use any beans for an iced latte, or do you need special ones?
11. Why does my iced latte taste sour, weak, or bitter?

---

## 3. GEO/AIO answer-targets (write these tight — 2–3 sentences, no hedging; this is the text engines lift)

**Definition (the one-liner):**
An iced latte is espresso plus cold milk over ice. Beans with chocolate, caramel, and nutty
notes at a medium to medium-dark roast hold up best, because those flavours stay clear through
milk and dilution where bright, fruity light roasts get muddied.

**Roast verdict (commit, don't hedge):**
For a milk-based iced *latte*, choose medium to medium-dark. Light roast is better for *black*
iced coffee, where its brightness has room to shine; in a latte the milk flattens it.

**Bean-picker table (gets lifted whole):**

| Taste note | Why it works iced + milk | Good for |
|---|---|---|
| Nutty / Cocoa | Chocolate-forward, survives milk + ice, naturally sweet | Classic creamy iced latte |
| Sweet (caramel) | Adds body and sweetness, less syrup needed | Crowd-pleaser |
| Nutty/Cocoa + Sweet | Best of both — rich and smooth | Default recommendation |
| Fruity (medium) | Adds a juicy lift if you like brighter lattes | Adventurous drinkers |

**Ratio (quick answer):**
Standard 1:2 espresso to milk. Want it stronger, go 1:1; creamier, 1:3. Brew the coffee
double-strength so melting ice doesn't water it down.

**Difference table:**

| Drink | Base | Milk | Taste |
|---|---|---|---|
| Iced latte | Espresso | Essential | Creamy, smooth, milk-forward |
| Iced coffee | Brewed/drip | Optional | Bolder, more bitter |
| Cold brew | Steeped 12–24h | Optional | Smoothest, low acidity |

---

## 4. Beans to feature (from beans.json)

Filter to `taste_notes_category` containing **Nutty/Cocoa** and/or **Sweet** (the milk-and-ice-proof
profile). The catalogue has ~270+ matching beans — plenty to populate a grid and a "see all"
link to the filtered shop.

Logic for the grid: load `/beans.json`, keep beans whose category includes "Nutty/Cocoa" or
"Sweet", optionally prioritise medium/medium-dark roast levels, show a curated set with buy
buttons (each firing `buy_click` with `source` = page path).

---

## 5. On-page SEO essentials (per CLAUDE.md checklist)

- Title (~57–72 chars): `Best Coffee Beans for Iced Latte (Malaysia) | The Beans Hub`
- Meta description (~152–159): chocolate/caramel/nutty beans from Malaysian roasters, the right
  roast for iced lattes, buy direct.
- Self-referencing canonical, www, no `.html`.
- Single H1 with target keyword; keyword in first 100 words.
- gtag snippet + google-site-verification meta.
- Three JSON-LD blocks if treated as content page: BreadcrumbList, (Article or WebPage), FAQPage
  mirroring the visible FAQ. At minimum include **FAQPage** — highest GEO value here.
- Add to `sitemap.xml` after publishing.
- One clear CTA into the filtered `/shop`.

---

## 6. Brand-voice reminders

Warm, teaching, community-first. Celebrate Malaysian roasters by name. Avoid "premium",
"artisanal", metaphorical "journey", and hype. Every section teaches something or surfaces a
discovery, and the page ends with one next step (browse the matching beans).

---

## 7. Sources

- Balance Coffee — best beans for latte: https://balancecoffee.co.uk/blogs/blog/best-coffee-beans-for-latte
- Via Guatemala — espresso beans for iced lattes & cold brew: https://viaguatemalacoffee.com/blogs/articles/best-espresso-beans-iced-lattes-cold-brew
- Caffeine Advisor — coffee for iced lattes at home: https://caffeineadvisor.com/best-coffee-beans/top-coffee-for-iced-lattes-at-home/
- Buddha's Cup — what coffee is best for iced lattes: https://buddhascup.com/blogs/faqs/what-type-of-coffee-is-best-for-iced-lattes
- Tasting Table — avoid light roast for iced coffee: https://www.tastingtable.com/1658110/avoid-light-roast-bean-iced-coffee/
- Frontier Coffee — why light roast suits iced coffee (counterview): https://frontiercoffeeroasters.com/blogs/frontier-coffee-roasters-blog/why-light-roast-coffee-is-perfect-for-iced-coffee
- Bones Coffee — how to make an iced latte: https://www.bonescoffee.com/a/blog/how-to-make-an-iced-latte
- Starbucks At Home — iced latte recipe/ratio: https://athome.starbucks.com/recipe/iced-latte
- CAFELY — iced coffee vs iced latte: https://cafely.com/blogs/info/iced-coffee-vs-iced-latte
- Milk & Honey Coffee — how milk type changes flavour: https://milkhoney.coffee/blogs/news/why-milk-type-matters-how-oat-almond-and-dairy-change-coffee-flavor
