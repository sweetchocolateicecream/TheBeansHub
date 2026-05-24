#!/usr/bin/env node
/**
 * generate-category-pages.js
 *
 * Builds 10 static category pages for The Beans Hub from beans.json.
 *
 * Usage (from project root, where shop.html and beans.json live):
 *     node generate-category-pages.js
 *
 * Outputs:
 *     /shop/ethiopia/index.html
 *     /shop/colombia/index.html
 *     /shop/brazil/index.html
 *     /shop/yunnan/index.html
 *     /shop/thailand/index.html
 *     /shop/indonesia/index.html
 *     /shop/natural-process/index.html
 *     /shop/washed-process/index.html
 *     /shop/fermentation-process/index.html
 *     /shop/blend/index.html
 *
 * Each page:
 *   - Inherits the inline <style>, <nav> and <footer> from shop.html so styling
 *     stays in sync with the main shop.
 *   - Renders a full product grid (server-rendered, no JS filter needed).
 *   - Includes <title>, <meta description>, <link rel="canonical">, OpenGraph
 *     and Twitter card tags, and a CollectionPage + ItemList JSON-LD block.
 *   - Card structure matches shop.html's renderCard output (image, brand, name,
 *     meta row, taste tags, price, buy button).
 */

const fs   = require('fs');
const path = require('path');

const ROOT     = __dirname;
const SHOP_URL = 'https://www.thebeanshub.com';
const SHOP_HTML = path.join(ROOT, 'shop.html');
const BEANS_JSON = path.join(ROOT, 'beans.json');
const OUT_DIR  = path.join(ROOT, 'shop');

// ---------------------------------------------------------------------------
// 1. CATEGORY DEFINITIONS (Phase 1 content baked in)
// ---------------------------------------------------------------------------

const CATEGORIES = [
  {
    slug: 'ethiopia',
    title: 'Ethiopia Coffee Beans Malaysia | Buy Online | The Beans Hub',
    metaDescription: 'Shop Ethiopia coffee beans from Malaysian roasters — Yirgacheffe, Sidamo, Guji and more. Floral, citrus, tea-like cups. Order online, delivered fresh.',
    h1: 'Ethiopia Coffee Beans — Floral, Bright Cups from the Birthplace of Arabica',
    headerSubtitle: 'Yirgacheffe, Sidamo, Guji and Limu lots from Malaysian specialty roasters.',
    intro: `
      <p>Ethiopia is where Arabica started, and you can taste it. Most of the Ethiopia coffee beans on this page come from the high-altitude growing regions of Yirgacheffe, Sidamo, Guji and Limu — places where the trees sit between roughly 1,700m and 2,200m above sea level, and where the cool, slow ripening builds the kind of complexity you only get when nature isn't rushing anything.</p>
      <!-- source: Specialty Coffee Association origin profile, Ethiopia, https://sca.coffee -->
      <p>What makes Ethiopia worth your attention as a Malaysian home brewer is the sheer character. Most lots are still grown from heirloom varietals — thousands of native Arabica genetic lines that don't exist anywhere else — which is why one Ethiopian bag rarely tastes like the next.</p>
      <!-- source: World Coffee Research, Ethiopian heirloom varietal database, https://varieties.worldcoffeeresearch.org -->
      <p>You'll see two main processing styles on Malaysian roaster shelves. Washed Ethiopians lean clean and tea-like — jasmine, bergamot, lemon zest, white peach. Naturals push harder into fruit — blueberry, strawberry, sometimes a winey edge that some people love and others find too much. Both are worth trying side by side at least once, because that comparison teaches you more about coffee than any guide can.</p>
      <!-- source: SCA Coffee Tasters Flavor Wheel; Counter Culture Coffee Ethiopia origin notes -->
      <p>These beans tend to suit pour-over, V60, AeroPress and filter brewing. Espresso shots with light Ethiopian roasts can be brilliant but unforgiving — you'll need a decent grinder and patience. Most arrive light to medium-light roasted to protect the floral and acidic top notes that make the origin distinct.</p>
      <p>If you've only been drinking nutty, chocolatey blends, this is the section that will rearrange how you think about coffee. Browse the Ethiopia beans below, or head back to the <a href="/shop">full shop</a> for the wider selection.</p>
    `,
    filter: bean => Array.isArray(bean.origin) && bean.origin.includes('Ethiopia'),
  },
  {
    slug: 'colombia',
    title: 'Colombia Coffee Beans Malaysia | Buy Online | The Beans Hub',
    metaDescription: 'Shop Colombia coffee beans from Malaysian roasters — Huila, Nariño, Antioquia, Cauca lots. Sweet, balanced cups. Order online, delivered fresh nationwide.',
    h1: 'Colombia Coffee Beans — Balanced, Sweet, and Always Reliable',
    headerSubtitle: 'Huila, Nariño, Antioquia, Cauca and Tolima lots from Malaysian roasters.',
    intro: `
      <p>Colombia coffee beans are what a lot of people grew up drinking without realising it. They sit in the middle of the flavour map — sweet, balanced, gently bright — which is exactly why they ended up in so many house blends and supermarket bags. But the specialty Colombia beans you'll find from Malaysian roasters are a completely different conversation.</p>
      <p>Most of the lots on this page are grown across the Colombian coffee belt — Huila, Nariño, Antioquia, Cauca, Tolima — at altitudes ranging from around 1,400m to 2,100m. The country sits across the Andes, which gives every region its own microclimate, and the harvest happens twice a year thanks to two rainy seasons. That's part of why Colombia keeps showing up year-round when other origins disappear from menus.</p>
      <!-- source: Federación Nacional de Cafeteros de Colombia, harvest calendar, https://federaciondecafeteros.org -->
      <p>The classic Colombian profile is medium-bodied with caramel sweetness, milk chocolate, red apple, and a clean, juicy acidity. Washed Colombians usually feel polished and easy to drink — they're often the safest "first specialty bag" recommendation. Naturals and honey-process Colombians push toward red fruit, plum, and panela sugar. There's also a wave of producers experimenting with anaerobic and co-fermentation lots, which can taste like strawberry milk or ripe peach if you're willing to spend.</p>
      <!-- source: SCA Coffee Tasters Flavor Wheel; Cafe Imports Colombia producer profiles -->
      <p>For home brewing, Colombia is one of the most forgiving origins out there. It works in espresso, pour-over, French press, AeroPress, and even moka pot. Roasts tend to land medium or medium-light — bright enough to taste the fruit, deep enough to keep the chocolate.</p>
      <p>If you want a specialty bag that won't surprise you in a bad way, start here. Browse the Colombia beans below, or head back to the <a href="/shop">main shop</a>.</p>
    `,
    filter: bean => Array.isArray(bean.origin) && bean.origin.includes('Colombia'),
  },
  {
    slug: 'brazil',
    title: 'Brazil Coffee Beans Malaysia | Buy Online | The Beans Hub',
    metaDescription: 'Shop Brazil coffee beans from Malaysian roasters — chocolate, nut, caramel profiles built for espresso and milk drinks. Order online, delivered fresh.',
    h1: 'Brazil Coffee Beans — Smooth, Chocolatey, and Built for Espresso',
    headerSubtitle: 'Minas Gerais, Cerrado, Mogiana and Sul de Minas lots from Malaysian roasters.',
    intro: `
      <p>Brazil is the largest coffee producer in the world, and that scale shows up in your cup as consistency. Most of the Brazil coffee beans on this page come from Minas Gerais, the Cerrado plateau, Mogiana in São Paulo, and the Sul de Minas region — where the land is flatter, the farms are bigger, and elevations sit lower than in much of Latin America, usually between 800m and 1,300m.</p>
      <!-- source: Brazil Specialty Coffee Association (BSCA), regional production data, https://bsca.com.br -->
      <!-- source: USDA Foreign Agricultural Service, Brazil Coffee Annual Report 2024 -->
      <p>That lower altitude isn't a downside — it's just a different style. Brazilian coffee tends to develop more sweetness and body and less of the bright acidity you get from high-grown East African beans. The flavour profile leans heavily toward dark chocolate, milk chocolate, peanut, almond, hazelnut, brown sugar, and sometimes a soft red apple or orange note in the better lots.</p>
      <p>Most Brazil lots use natural or pulped natural processing. The cherry dries on the bean, the sugars deepen, and the resulting cup feels rounded and smooth. A smaller but growing number of producers are running anaerobic and yeast-fermented lots, which add tropical fruit and winey notes without losing the body Brazil is known for.</p>
      <!-- source: World Coffee Research processing manual, "Pulped Natural / Honey Processing in Brazil" -->
      <p>For Malaysian home brewers, Brazil is the workhorse — the bag you reach for when you want a flat white that actually tastes like a flat white, or a moka pot brew that won't punish you. It plays beautifully in espresso, milk drinks, French press, and AeroPress. Roasts sit anywhere from medium to medium-dark.</p>
      <p>If you've ever wondered why the espresso at your favourite local café feels familiar — there's almost always Brazil sitting underneath the recipe. Browse the Brazil beans below, or back to the <a href="/shop">full shop</a>.</p>
    `,
    filter: bean => Array.isArray(bean.origin) && bean.origin.includes('Brazil'),
  },
  {
    slug: 'yunnan',
    title: 'Yunnan Coffee Beans Malaysia | China Specialty | Beans Hub',
    metaDescription: "Shop Yunnan coffee beans from Malaysian roasters — China's specialty origin from Pu'er, Baoshan, Lincang. Nutty, sweet, increasingly experimental cups.",
    h1: "Yunnan Coffee Beans — China's Specialty Origin, Now in Malaysia",
    headerSubtitle: "Pu'er, Baoshan, Lincang and Dehong lots from Malaysian roasters.",
    intro: `
      <p>China grows coffee, and the place where most of it comes from is Yunnan, the southwestern province bordering Myanmar, Laos and Vietnam. The Yunnan coffee beans on this page are still a relatively new conversation in Malaysia, but the quality has moved fast in the last decade and the bags are worth your attention.</p>
      <p>Most of the production sits in Pu'er, Baoshan, Lincang and Dehong — regions with elevations between roughly 1,100m and 2,000m, monsoon rainfall, and a cool dry winter that lets the cherries ripen slowly. The dominant varietal is Catimor, originally introduced in the 1980s for disease resistance, but you'll increasingly see Bourbon, Typica and even Geisha lots from the better farms.</p>
      <!-- source: Yunnan International Coffee Exchange (YCE) production data, https://www.yce.cn -->
      <!-- source: World Coffee Research varietal database, Catimor profile -->
      <p>The classic Yunnan flavour profile leans nutty, gently sweet and earthy — think roasted almond, dark chocolate, brown sugar, dried longan, and sometimes a soft black tea finish. Newer washed and anaerobic lots from producers in Baoshan and Pu'er push toward stone fruit, citrus and floral notes that genuinely surprise people who think they know what Chinese coffee tastes like.</p>
      <!-- source: SCA Coffee Tasters Flavor Wheel; Yunnan Coffee Traders cupping notes -->
      <p>Processing is mostly washed, but natural and honey lots are growing. A handful of farms — Manlao, Manhanmu, Lao Zhai — are running ambitious experimental ferments at prices that are still gentler than Panama or Colombia equivalents. That's part of why Yunnan has become a quiet favourite among Malaysian home brewers looking for value.</p>
      <p>It's also one of the closest origins to us geographically, so freshness and shipping costs are usually in your favour. Browse the Yunnan selection below, or go back to the <a href="/shop">full shop</a> for everything else.</p>
    `,
    filter: bean => Array.isArray(bean.origin) && bean.origin.some(o => /yunnan/i.test(o || '')),
  },
  {
    slug: 'thailand',
    title: 'Thailand Coffee Beans Malaysia | Doi Chaang Highland | TBH',
    metaDescription: 'Shop Thailand coffee beans from Malaysian roasters — Chiang Rai, Doi Chaang, Doi Tung highland Arabica. Cocoa, dried fruit, citrus profiles. Fresh delivery.',
    h1: 'Thailand Coffee Beans — Single-Origin Specialty from Doi Chaang and Beyond',
    headerSubtitle: 'Chiang Rai, Doi Chaang, Doi Tung and Mae Hong Son lots from Malaysian roasters.',
    intro: `
      <p>Thailand has become a quiet specialty origin in the last 15 years, mostly thanks to the highland farms in Chiang Mai, Chiang Rai and the surrounding northern provinces. The Thailand coffee beans you'll find on this page are still a small slice of the Malaysian roaster scene, but the quality keeps improving and the prices stay reasonable.</p>
      <p>Most of the specialty production comes from areas like Doi Chaang, Doi Tung, Doi Pangkhon and Mae Hong Son — mountain villages that sit between around 1,000m and 1,600m above sea level. A lot of these farms grew out of the Royal Project, a long-running initiative that introduced Arabica to the highlands as a replacement crop for opium poppies. The story is unusual but the coffee is genuinely good.</p>
      <!-- source: Royal Project Foundation, Thailand, https://www.royalprojectthailand.com -->
      <!-- source: UNODC, "Thailand: From Opium to Coffee" report, 2019 -->
      <p>Common varietals include Catimor, Caturra, Typica and Bourbon, with smaller lots of Geisha appearing from competition farms. The classic Thai cup leans medium-bodied with cocoa, dried fruit, brown sugar and a soft citrus brightness — somewhere between Latin American sweetness and the cleaner side of Indonesian profiles.</p>
      <!-- source: Specialty Coffee Association of Thailand origin notes; SCA Flavor Wheel -->
      <p>Processing covers all the major styles. Washed Thai lots are clean and approachable. Naturals can taste like ripe stone fruit or red berry. A growing number of producers in Chiang Rai are running anaerobic, honey and co-fermentation lots that compete on quality with anything from Central America.</p>
      <p>For Malaysian home brewers, Thailand is geographically close, often more affordable, and a great way to support an ASEAN origin. It works well across pour-over, espresso and milk drinks. Browse the Thailand selection below, or head back to the <a href="/shop">full shop</a>.</p>
    `,
    filter: bean => Array.isArray(bean.origin) && bean.origin.includes('Thailand'),
  },
  {
    slug: 'indonesia',
    title: 'Indonesia Coffee Beans Malaysia | Sumatra, Java, Bali | TBH',
    metaDescription: 'Shop Indonesia coffee beans from Malaysian roasters — Sumatra, Java, Sulawesi, Bali, Flores. Earthy, full-bodied, low-acid wet-hulled cups. Fresh delivery.',
    h1: 'Indonesia Coffee Beans — Earthy, Bold, and Built for Bigger Brews',
    headerSubtitle: 'Sumatra, Java, Sulawesi, Bali and Flores lots from Malaysian roasters.',
    intro: `
      <p>Indonesia produces some of the most distinctive coffee in the world, and once you've tasted a proper wet-hulled Sumatran, you'll never confuse it for anything else. The Indonesia coffee beans on this page come mostly from Sumatra, Java, Sulawesi, Bali and Flores — five major coffee-growing islands, each with its own character.</p>
      <p>Most of the production sits at altitudes between roughly 900m and 1,700m, with the highest-grown lots coming from Aceh, Lintong, and the Toraja highlands. The climate is humid, tropical and consistent year-round, which is part of why Indonesian coffees develop the dense, syrupy body they're known for.</p>
      <!-- source: Specialty Coffee Association of Indonesia (SCAI), origin and altitude data, https://scai.id -->
      <p>The signature processing style here is wet-hulling — locally called <em>giling basah</em> — where the parchment is removed while the beans are still wet, before they finish drying. The result is a cup with low acidity, heavy body, earthy and herbal flavours, and notes of dark chocolate, cedar, tobacco, mushroom and sometimes overripe tropical fruit. It's bold, savoury, and unmistakably Indonesian.</p>
      <!-- source: World Coffee Research processing manual, "Wet-Hulled / Giling Basah" -->
      <!-- source: Counter Culture Coffee, Sumatra origin notes -->
      <p>Java lots tend to be cleaner, with cocoa and nut profiles. Sulawesi Toraja sits in the middle — earthy but with more sweetness. Bali and Flores often show brighter acidity and more fruit, especially in washed and natural lots. A small but growing number of producers in Aceh and Bali are experimenting with anaerobic and honey processing.</p>
      <p>For Malaysian home brewers, Indonesia is a close-to-home origin that excels in espresso, French press, moka pot, and full-bodied drip. It's the bag you reach for when you want depth and weight rather than brightness. Browse the Indonesia beans below, or back to the <a href="/shop">full shop</a>.</p>
    `,
    filter: bean => Array.isArray(bean.origin) && bean.origin.includes('Indonesia'),
  },
  {
    slug: 'natural-process',
    title: 'Natural Process Coffee Beans Malaysia | Buy Online | TBH',
    metaDescription: 'Shop natural process coffee beans from Malaysian roasters — sweet, fruity, whole-cherry dried. Strawberry, blueberry, stone fruit cups. Fresh delivery.',
    h1: 'Natural Process Coffee Beans — Sweet, Fruity, and Whole-Cherry Dried',
    headerSubtitle: 'Whole-cherry dried lots from Ethiopia, Brazil, Colombia, Indonesia and beyond.',
    intro: `
      <p>Natural process is the oldest way of preparing coffee, and these days it's also one of the most popular. The natural process coffee beans on this page have all been dried with the cherry still on the bean — fruit, mucilage and all — instead of being washed clean before drying.</p>
      <p>The technique is simple in principle. Pickers harvest ripe cherries, the cherries get spread on raised African beds, patios or drying tables, and they sit in the sun for two to four weeks while the fruit slowly dehydrates around the seed. As the sugars in the fruit ferment and the moisture drops, the seed inside absorbs flavour from the cherry — which is why naturals taste so different from washed coffees of the same origin.</p>
      <!-- source: Specialty Coffee Association processing standards, "Natural / Dry Process" -->
      <!-- source: World Coffee Research processing manual, 2020 -->
      <p>Expect a bigger, sweeter, more fruit-forward cup. Common natural-process flavours include strawberry, blueberry, ripe stone fruit, red wine, dried apricot, jammy berry and sometimes a tropical edge like mango or passion fruit. Body tends to be heavier than washed, acidity rounder, and the finish often carries a slight winey character that some people fall in love with immediately.</p>
      <!-- source: SCA Coffee Tasters Flavor Wheel -->
      <p>The trade-off is consistency. Naturals are harder to process well — too much fermentation and you get vinegar or rotting fruit notes; too little and you lose the magic. The producers who do it consistently command premium prices for good reason.</p>
      <p>This category includes natural process coffees from Ethiopia, Brazil, Colombia, Indonesia and beyond. If you've only been drinking washed coffees, this is the section that will widen your taste vocabulary fast. Browse below, or go back to the <a href="/shop">full shop</a>.</p>
    `,
    // Match anything where processing_method explicitly contains "natural" but excludes the dominantly fermented sub-styles already covered by the anaerobic page.
    filter: bean => {
      const pm = (bean.processing_method || '').toLowerCase();
      if (!pm) return false;
      if (/anaerobic|carbonic|co-?ferment|ferment|yeast|barrel|nitrogen|thermal|whisky|wine|hop|lactic|maceration|infused|inoculated/i.test(pm)) return false;
      return /natural/.test(pm);
    },
  },
  {
    slug: 'washed-process',
    title: 'Washed Process Coffee Beans Malaysia | Buy Online | TBH',
    metaDescription: 'Shop washed process coffee beans from Malaysian roasters — clean, bright, origin-forward cups. Citrus, floral, stone fruit profiles. Fresh nationwide.',
    h1: 'Washed Process Coffee Beans — Clean, Bright, and Origin-Forward',
    headerSubtitle: 'Clean, transparent washed lots from across the major coffee origins.',
    intro: `
      <p>Washed process is the standard against which most other processing methods are measured. The washed process coffee beans on this page have been depulped within hours of picking, fermented in tanks to remove the sticky mucilage, rinsed clean with water, and then dried — leaving you with a cup that tastes like the bean itself, not the fruit around it.</p>
      <p>That's the whole point. By stripping away the cherry early, washed coffee gives you a cleaner, brighter, more transparent expression of the origin, varietal and altitude. If you want to taste what Yirgacheffe actually tastes like, what Huila actually tastes like, what a Bourbon varietal actually tastes like — washed is the best window.</p>
      <!-- source: Specialty Coffee Association processing standards, "Washed / Wet Process" -->
      <!-- source: James Hoffmann, "The World Atlas of Coffee", 2nd edition, 2018 -->
      <p>Common washed-process flavour notes include citrus (lemon, bergamot, orange), stone fruit (peach, apricot), florals (jasmine, rose), black tea, milk chocolate, almond, and crisp acidity. The body tends to be lighter than naturals or wet-hulled coffees, the finish cleaner, and the acidity more pronounced. It's the processing style that taught a generation of baristas what "third-wave" specialty coffee was supposed to feel like.</p>
      <!-- source: SCA Coffee Tasters Flavor Wheel -->
      <p>You'll find washed lots from every major origin on this page — Ethiopian Yirgacheffes and Sidamos, Colombian Huilas and Nariños, Kenyans, Costa Ricans, Guatemalans, Panama Geishas. The water-intensive nature of the process means it's most common in regions with reliable water access.</p>
      <p>If you're using a pour-over, V60, Chemex or AeroPress, washed process coffees are usually where you'll learn the most about your brewing technique. Browse the washed selection below, or go back to the <a href="/shop">full shop</a>.</p>
    `,
    filter: bean => {
      const pm = (bean.processing_method || '').toLowerCase();
      if (!pm) return false;
      if (/anaerobic|carbonic|co-?ferment|ferment|yeast|barrel|nitrogen|thermal|whisky|wine|hop|lactic|maceration|infused|inoculated/i.test(pm)) return false;
      return /wash/.test(pm);
    },
  },
  {
    slug: 'fermentation-process',
    title: 'Anaerobic Fermented Coffee Beans Malaysia | The Beans Hub',
    metaDescription: 'Shop anaerobic and fermentation process coffee beans from Malaysian roasters — wild, winey, experimental cups. Tropical fruit, wine, whisky notes. Fresh.',
    h1: 'Anaerobic & Fermentation Process Coffee — Wild, Winey, and Experimental',
    headerSubtitle: 'Anaerobic, carbonic maceration, co-fermentation and barrel-aged lots.',
    intro: `
      <p>Anaerobic and fermentation process coffee beans are the most exciting — and most divisive — corner of specialty coffee right now. The beans on this page have all been fermented in some kind of controlled, oxygen-restricted environment, usually inside sealed plastic or stainless steel tanks, before being dried as either natural, honey or washed lots.</p>
      <p>The technique started picking up properly around 2015, with producers in Colombia, Costa Rica and Ethiopia experimenting with anaerobic and carbonic maceration tanks borrowed from the wine industry. By controlling oxygen, temperature, pH and time, producers can guide which microorganisms work on the cherry — yeasts, lactic acid bacteria, acetic acid bacteria — and the resulting flavour compounds get absorbed into the bean.</p>
      <!-- source: Perfect Daily Grind, "A History of Anaerobic Fermentation in Coffee", 2021 -->
      <!-- source: Cropster Hub research notes, fermentation control variables -->
      <p>Expect intense, unusual cups. Common notes include tropical fruit (passion fruit, lychee, mango), red wine, whisky, strawberry candy, ripe banana, cinnamon, jasmine, and sometimes a deep boozy or fermented-fruit funk. Sub-styles you'll see on the labels include anaerobic natural, anaerobic washed, carbonic maceration, co-fermentation, thermal shock, lactic ferment, and yeast-inoculated lots.</p>
      <!-- source: SCA Coffee Tasters Flavor Wheel; Specialty Coffee Association processing research -->
      <p>The trade-off is price and consistency. Good experimental ferments cost more because they're harder to produce, harder to control, and command higher specialty grades. Bad ones taste like solvent or rotting fruit. Stick with reputable producers and roasters.</p>
      <p>This section includes fermented lots from across origins — Colombian co-fermentation, Yunnan anaerobic naturals, Ethiopian carbonic maceration, Thai whisky-barrel ferments and more. If you want to taste where coffee is heading next, this is where you start. Browse below, or back to the <a href="/shop">full shop</a>.</p>
    `,
    filter: bean => {
      const pm = (bean.processing_method || '').toLowerCase();
      if (!pm) return false;
      return /anaerobic|carbonic|co-?ferment|ferment|yeast|barrel|nitrogen|thermal|whisky|wine|hop|lactic|maceration|infused|inoculated/i.test(pm);
    },
  },
  {
    slug: 'blend',
    title: 'Coffee Blends Malaysia | Multi-Origin Beans | The Beans Hub',
    metaDescription: 'Shop coffee blends from Malaysian roasters — multi-origin beans built for espresso, milk drinks and daily brewing. Chocolate, caramel, smooth daily cups.',
    h1: 'Coffee Blends — Multi-Origin Beans Built for Daily Drinking',
    headerSubtitle: 'Multi-origin recipes from Malaysian specialty roasters.',
    intro: `
      <p>A coffee blend is what you get when a roaster combines two or more single-origin coffees into one bag, and the goal is almost always the same: a cup that tastes more complete, more balanced or more reliable than any single origin could deliver on its own. The coffee blends on this page come from Malaysian roasters who've spent years dialling in their house recipes.</p>
      <p>Blending is a craft. A good blend balances body, acidity, sweetness and finish — using one origin for chocolate depth, another for fruit lift, a third for the long aftertaste. Brazil shows up in a lot of espresso blends because of its body and low acidity. Ethiopia gets added for floral or fruit top notes. Colombia and Central American washed lots round out the middle.</p>
      <!-- source: James Hoffmann, "The World Atlas of Coffee", 2nd edition, 2018, blending chapter -->
      <!-- source: Counter Culture Coffee blending notes; SCA Brewing Standards -->
      <p>Most blends are roasted medium to medium-dark, which is part of why they hold up better in milk drinks, moka pots, espresso machines and bigger-batch brewing. They're forgiving — the kind of bag you can grind for a flat white at 7am without thinking, and that won't punish you if your espresso recipe drifts a few seconds off.</p>
      <p>You'll see two broad styles on this page. Espresso blends are designed to taste good as a shot or with milk — chocolate, caramel, nut, brown sugar profiles dominate. Filter or omni-roast blends lean lighter and brighter, and work better in pour-over or AeroPress. Some roasters call out the components on the bag, others treat the recipe as house IP.</p>
      <p>If you've been chasing single-origin lots and want something that just works every morning, coffee blends are where you settle in. Browse the blend selection below, or back to the <a href="/shop">full shop</a>.</p>
    `,
    filter: bean => bean.is_blend === true,
  },
];

// ---------------------------------------------------------------------------
// 2. UTILITIES
// ---------------------------------------------------------------------------

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str = '') {
  return escapeHtml(str);
}

function parsePrice(p) {
  if (!p) return Infinity;
  const num = parseFloat(String(p).replace(/[^0-9.]/g, ''));
  return Number.isFinite(num) ? num : Infinity;
}

/**
 * Pull the inline <style>, <nav>, <div class="mobile-menu">, <footer> and
 * head <link rel="canonical"> styles from shop.html. Returning these as
 * strings lets each category page inherit the same look-and-feel.
 */
function extractTemplate(html) {
  const styleMatch = html.match(/<style[\s\S]*?<\/style>/i);
  if (!styleMatch) throw new Error('Could not find <style> block in shop.html');

  const navMatch = html.match(/<nav[\s\S]*?<\/nav>/i);
  if (!navMatch) throw new Error('Could not find <nav> block in shop.html');

  const mobileMenuMatch = html.match(/<div class="mobile-menu"[\s\S]*?<\/div>/i);

  const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
  if (!footerMatch) throw new Error('Could not find <footer> block in shop.html');

  // Some shops use <div class="page-footer"> instead. Fall back if needed.
  let footerHtml = footerMatch[0];
  if (!/page-footer|footer-logo/.test(footerHtml)) {
    const altFooter = html.match(/<div class="page-footer"[\s\S]*?<\/div>\s*(?=<\/body>|<script|$)/i);
    if (altFooter) footerHtml = altFooter[0];
  }

  return {
    style: styleMatch[0],
    nav: navMatch[0],
    mobileMenu: mobileMenuMatch ? mobileMenuMatch[0] : '',
    footer: footerHtml,
  };
}

/**
 * Render one product card. Mirrors shop.html's renderCard() but with SEO
 * improvements: descriptive alt text, server-rendered (crawlable) markup.
 */
function renderCard(bean) {
  const price = bean.price_200g || bean.price_500g || bean.price_1kg || null;
  const priceLabel = bean.price_200g ? '200g' : bean.price_500g ? '500g' : bean.price_1kg ? '1kg' : '';

  const altText = `${bean.brand || ''} ${bean.name || ''} – specialty coffee beans Malaysia`.trim();

  const imgHtml = bean.image_url
    ? `<img class="card-img" src="${escapeAttr(bean.image_url)}" alt="${escapeAttr(altText)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const placeholderHtml = `<div class="card-img-placeholder" style="${bean.image_url ? 'display:none' : ''}">☕</div>`;

  const tasteHtml = (bean.taste_notes || []).slice(0, 3).map(t => `<span class="taste-tag">${escapeHtml(t)}</span>`).join('');
  const originText = (bean.origin || []).slice(0, 2).join(', ') || '—';

  const metaItems = [];
  metaItems.push(`<div class="card-meta-item">🌍 <span>${escapeHtml(originText)}</span></div>`);
  if (bean.roast_level && bean.roast_level !== 'Unknown') {
    metaItems.push(`<div class="card-meta-item">🔥 <span>${escapeHtml(bean.roast_level)}</span></div>`);
  }
  if (bean.processing_method) {
    metaItems.push(`<div class="card-meta-item">⚙️ <span>${escapeHtml(bean.processing_method)}</span></div>`);
  }
  if (bean.roasted_for) {
    metaItems.push(`<div class="card-meta-item">☕ <span>${escapeHtml(bean.roasted_for)}</span></div>`);
  }

  const priceBlock = price
    ? `<div class="card-price">${escapeHtml(price)}</div><div class="card-price-sub">per ${priceLabel}</div>`
    : '<div class="card-price-sub">Price varies</div>';

  const buyBtn = bean.link
    ? `<a href="${escapeAttr(bean.link)}" target="_blank" rel="noopener" class="buy-btn">Buy Now ↗</a>`
    : '<span style="font-size:0.75rem;color:var(--text-muted)">No link</span>';

  return `
    <div class="card">
      ${imgHtml}${placeholderHtml}
      <div class="card-body">
        <div class="card-brand">${escapeHtml(bean.brand || '')}</div>
        <div class="card-name">${escapeHtml(bean.name || '')}</div>
        <div class="card-meta">
          ${metaItems.join('\n          ')}
        </div>
        <div class="taste-tags">${tasteHtml}</div>
      </div>
      <div class="card-footer">
        <div>${priceBlock}</div>
        ${buyBtn}
      </div>
    </div>`;
}

/**
 * Build the JSON-LD payload for a category page. CollectionPage wraps an
 * ItemList, where each list item is a Product with offers. Search engines use
 * this for rich-result eligibility.
 */
function buildSchema(category, beans, pageUrl) {
  const itemListElement = beans.slice(0, 50).map((bean, idx) => {
    const price = bean.price_200g || bean.price_500g || bean.price_1kg;
    const priceNumber = parsePrice(price);
    const product = {
      '@type': 'Product',
      name: `${bean.brand || ''} ${bean.name || ''}`.trim(),
      image: bean.image_url || undefined,
      brand: bean.brand ? { '@type': 'Brand', name: bean.brand } : undefined,
      url: bean.link || undefined,
      description: ((bean.taste_notes || []).join(', ') || undefined),
    };
    if (price && Number.isFinite(priceNumber)) {
      product.offers = {
        '@type': 'Offer',
        priceCurrency: 'MYR',
        price: priceNumber,
        availability: 'https://schema.org/InStock',
        url: bean.link || pageUrl,
      };
    }
    // Strip undefined values for clean JSON.
    Object.keys(product).forEach(k => product[k] === undefined && delete product[k]);
    if (product.brand) Object.keys(product.brand).forEach(k => product.brand[k] === undefined && delete product.brand[k]);

    return {
      '@type': 'ListItem',
      position: idx + 1,
      item: product,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.h1,
    description: category.metaDescription,
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: beans.length,
      itemListElement,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SHOP_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: `${SHOP_URL}/shop` },
        { '@type': 'ListItem', position: 3, name: category.h1.split('—')[0].trim(), item: pageUrl },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// 3. PAGE BUILDER
// ---------------------------------------------------------------------------

function buildPage(category, beans, template) {
  const pageUrl = `${SHOP_URL}/shop/${category.slug}/`;
  const ogImage = `${SHOP_URL}/img/Girl-bought-coffee-from-the-beans-hub.png`;
  const schema = buildSchema(category, beans, pageUrl);

  // Sort beans by price ascending (with no-price last) for a sane default order.
  const sortedBeans = [...beans].sort((a, b) => parsePrice(a.price_200g) - parsePrice(b.price_200g));

  const cardsHtml = sortedBeans.length
    ? sortedBeans.map(renderCard).join('\n')
    : `<div class="empty-state" style="grid-column:1/-1">
         <div class="emoji">☕</div>
         <h3>No beans in this category yet</h3>
         <p>Check back soon, or browse the <a href="/shop">full shop</a>.</p>
       </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JY42YLKPRM"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-JY42YLKPRM');
</script>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>${escapeHtml(category.title)}</title>
<meta name="description" content="${escapeAttr(category.metaDescription)}">
<link rel="canonical" href="${pageUrl}">
<link rel="icon" type="image/png" href="/img/thebeanshub_logo.png">
<link href="https://fonts.googleapis.com/css2?family=Sigmar&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeAttr(category.title)}">
<meta property="og:description" content="${escapeAttr(category.metaDescription)}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:image" content="${ogImage}">
<meta property="og:site_name" content="The Beans Hub">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeAttr(category.title)}">
<meta name="twitter:description" content="${escapeAttr(category.metaDescription)}">
<meta name="twitter:image" content="${ogImage}">

<!-- Inline CSS inherited from shop.html (kept identical so styling stays in sync) -->
${template.style}

<!-- CollectionPage + ItemList schema for rich results -->
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
</head>
<body>
${template.nav}
${template.mobileMenu}

<header class="page-header">
  <h1>${escapeHtml(category.h1)} <span class="result-count">${sortedBeans.length}</span></h1>
  <p>${escapeHtml(category.headerSubtitle || 'Curated from Malaysian roasters.')}</p>
</header>

<main class="main" style="max-width:1200px;margin:0 auto;padding:32px 32px 0;">
  <section class="category-intro" style="margin-bottom:32px;line-height:1.65;font-size:1rem;color:var(--brown-dark);max-width:820px;">
    ${category.intro.trim()}
  </section>

  <div class="top-bar">
    <div class="top-bar-left">Showing <strong>${sortedBeans.length}</strong> beans in this category — visit the <a href="/shop" style="color:var(--accent);text-decoration:none;font-weight:600;">full shop</a> for filters and more.</div>
  </div>

  <div class="grid">
    ${cardsHtml}
  </div>
</main>

${template.footer}

<script>
  function toggleMenu(){ document.getElementById('mobileMenu').classList.toggle('open'); }
</script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// 4. MAIN
// ---------------------------------------------------------------------------

function main() {
  if (!fs.existsSync(SHOP_HTML))   { console.error(`Missing: ${SHOP_HTML}`);  process.exit(1); }
  if (!fs.existsSync(BEANS_JSON))  { console.error(`Missing: ${BEANS_JSON}`); process.exit(1); }

  const shopHtml = fs.readFileSync(SHOP_HTML, 'utf8');
  const allBeans = JSON.parse(fs.readFileSync(BEANS_JSON, 'utf8'));
  const template = extractTemplate(shopHtml);

  console.log(`Loaded ${allBeans.length} beans from beans.json`);
  console.log(`Output directory: ${OUT_DIR}/<slug>/index.html`);
  console.log('');

  const summary = [];

  for (const category of CATEGORIES) {
    const matched = allBeans.filter(category.filter);
    const html = buildPage(category, matched, template);

    const dir = path.join(OUT_DIR, category.slug);
    fs.mkdirSync(dir, { recursive: true });
    const outPath = path.join(dir, 'index.html');
    fs.writeFileSync(outPath, html, 'utf8');

    summary.push({ slug: category.slug, count: matched.length, path: outPath });
    console.log(`  /shop/${category.slug.padEnd(22)} → ${String(matched.length).padStart(4)} beans`);
  }

  console.log('');
  console.log(`Done. Generated ${summary.length} pages.`);
  return summary;
}

if (require.main === module) {
  main();
}

module.exports = { main, CATEGORIES, buildPage, renderCard };
