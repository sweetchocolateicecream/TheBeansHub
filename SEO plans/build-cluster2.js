/* Generates Cluster 2 SEO pages for The Beans Hub.
   Cluster 2 — Coffee Bean Origins:
     1 pillar  (/posts/coffee-bean-origins)
     1 combined Asia origins post  (/posts/asia-coffee-origins-yunnan-thailand)
     1 single-origin-vs-blend comparison  (/posts/single-origin-vs-blend-coffee)
   The four single-country cluster pages (Ethiopia, Colombia, Brazil, Indonesia)
   are already served by the existing /shop/*-coffee-beans category pages — the
   pillar links down to them rather than duplicating that content.

   Run from the repo root:   node "SEO plans/build-cluster2.js"
*/
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.thebeanshub.com';
const OG_IMG = SITE + '/img/Girl-bought-coffee-from-the-beans-hub.png';
const DATE = '2026-05-15';
const DATE_LABEL = 'May 2026';

const ROOT = process.env.TBH_ROOT || path.join(__dirname, '..');
const basePost = fs.readFileSync(path.join(ROOT, 'posts', 'kl-roasters.html'), 'utf8');
const CSS = basePost.slice(basePost.indexOf('<style>') + 7, basePost.indexOf('</style>')).trim();

const OUT_DIR = process.env.TBH_OUT || path.join(ROOT, 'posts');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function head(p){
  const url = SITE + '/posts/' + p.slug;
  const breadcrumb = {
    "@context":"https://schema.org","@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":SITE+"/"},
      {"@type":"ListItem","position":2,"name":"Coffee Library","item":SITE+"/library"},
      {"@type":"ListItem","position":3,"name":p.breadcrumb,"item":url}
    ]
  };
  const article = {
    "@context":"https://schema.org","@type":"BlogPosting",
    "headline":p.title,"description":p.desc,"url":url,
    "datePublished":DATE,"dateModified":DATE,"image":OG_IMG,
    "author":{"@type":"Organization","name":"The Beans Hub"},
    "publisher":{"@type":"Organization","name":"The Beans Hub",
      "logo":{"@type":"ImageObject","url":SITE+"/img/thebeanshub_logo.png"}},
    "mainEntityOfPage":{"@type":"WebPage","@id":url}
  };
  const faq = {
    "@context":"https://schema.org","@type":"FAQPage",
    "mainEntity":p.faq.map(f=>({"@type":"Question","name":f.q,
      "acceptedAnswer":{"@type":"Answer","text":f.a}}))
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JY42YLKPRM"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-JY42YLKPRM');
</script>
<meta charset="utf-8"/>
<meta content="jqlfBshOy4vgYUb478viCuTswoIsaWL_jdOhL0srx0w" name="google-site-verification"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}"/>
<meta name="robots" content="index, follow"/>
<link href="/img/thebeanshub_logo.png" rel="icon" type="image/png"/>
<link href="https://fonts.googleapis.com/css2?family=Sigmar&amp;family=Outfit:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link rel="canonical" href="${url}"/>
<meta property="og:type" content="article"/>
<meta property="og:title" content="${esc(p.title)}"/>
<meta property="og:description" content="${esc(p.desc)}"/>
<meta property="og:url" content="${url}"/>
<meta property="og:image" content="${OG_IMG}"/>
<meta property="og:site_name" content="The Beans Hub"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(p.title)}"/>
<meta name="twitter:description" content="${esc(p.desc)}"/>
<meta name="twitter:image" content="${OG_IMG}"/>
<script type="application/ld+json">
${JSON.stringify(breadcrumb,null,2)}
</script>
<script type="application/ld+json">
${JSON.stringify(article,null,2)}
</script>
<script type="application/ld+json">
${JSON.stringify(faq,null,2)}
</script>
<style>
${CSS}
</style>
</head>`;
}

function nav(){return `<body>
<nav class="site-nav">
<a class="nav-logo" href="/"><img alt="The Beans Hub Logo" src="/img/thebeanshub_logo.png" style="height: 80px; width: auto;"/></a>
<div class="nav-links">
<a href="/">Home</a>
<a href="/shop">Coffee Beans</a>
<a class="active" href="/library">Coffee Library</a>
<a href="/about">About Us</a>
<a href="/contact">Contact Us</a>
<a class="cta" href="/shop">Explore Beans</a>
</div>
<button aria-label="Menu" class="nav-hamburger" onclick="toggleMenu()">
<span></span><span></span><span></span>
</button>
</nav>
<div class="mobile-menu" id="mobileMenu">
<a href="/">Home</a>
<a href="/shop">Coffee Beans</a>
<a href="/library">Coffee Library</a>
<a href="/about">About Us</a>
<a href="/contact">Contact Us</a>
</div>`;}

function hero(p){return `<div class="post-hero">
<div class="post-hero-inner">
<div class="post-breadcrumb">
<a href="/library">Coffee Library</a>
<span>&rsaquo;</span>
<span>${p.badgeLabel}</span>
</div>
<div class="post-cat-badge ${p.badgeClass}">${p.badgeIcon} ${p.badgeLabel}</div>
<h1>${p.h1}</h1>
<div class="post-hero-meta">
<span>The Beans Hub</span>
<span class="post-hero-meta-dot"></span>
<span>${DATE_LABEL}</span>
<span class="post-hero-meta-dot"></span>
<span class="post-read-time">${p.readTime} min read</span>
</div>
</div>
</div>
<div class="post-banner">${p.banner}</div>`;}

function toc(items){
  return `<aside aria-label="Table of contents" class="toc-sidebar">
<div class="toc-inner">
<div class="toc-title">Contents</div>
<nav class="toc-nav">
${items.map(i=>`<a class="toc-link" href="#${i.id}">${i.label}</a>`).join('\n')}
</nav>
</div>
</aside>`;
}

function morePosts(cards){
  return `<div class="more-posts">
<div class="more-posts-inner">
<h2>More from the Library</h2>
<div class="more-grid">
${cards.map(c=>`<a class="more-card" href="${c.href}">
<div class="more-card-emoji">${c.emoji}</div>
<h3>${c.title}</h3>
<div class="more-card-meta">${c.meta}</div>
</a>`).join('\n')}
</div>
</div>
</div>`;
}

const FOOTER = `<footer class="tbh-footer">
<div class="tbh-footer-inner">
<div class="tbh-footer-brand">
<a class="tbh-footer-logo" href="/">
<img alt="The Beans Hub logo" class="tbh-footer-logo-img" src="/img/thebeanshub_logo.png"/>
<span class="tbh-footer-logo-text">The Beans<span class="accent">Hub</span></span>
</a>
<p class="tbh-footer-tagline">Malaysia's home for specialty coffee — beans, brewers, and roaster guides.</p>
</div>
<div>
<h4 class="tbh-footer-heading">Shop</h4>
<ul class="tbh-footer-list">
<li><a href="/shop">All Coffee Beans</a></li>
<li><a href="/shop/ethiopia-coffee-beans">Ethiopia</a></li>
<li><a href="/shop/colombia%20coffee%20beans">Colombia</a></li>
<li><a href="/shop/brazil-coffee-beans">Brazil</a></li>
<li><a href="/shop/yunnan-coffee-beans">Yunnan</a></li>
<li><a href="/shop/indonesia-coffee-beans">Indonesia</a></li>
<li><a href="/shop/thailand-coffee-beans">Thailand</a></li>
<li><a href="/shop/natural-process-coffee-beans">Natural Process</a></li>
<li><a href="/shop/washed-process-coffee-beans">Washed Process</a></li>
<li><a href="/shop/fermented-coffee-beans">Fermented</a></li>
<li><a href="/shop/arabica-blend-coffee-beans">Arabica Blends</a></li>
</ul>
</div>
<div>
<h4 class="tbh-footer-heading">Explore</h4>
<ul class="tbh-footer-list">
<li><a href="/">Home</a></li>
<li><a href="/about">About Us</a></li>
<li><a href="/contact">Contact Us</a></li>
<li><a href="/library">Coffee Library</a></li>
</ul>
</div>
<div>
<h4 class="tbh-footer-heading">Follow</h4>
<div class="tbh-footer-social">
<a aria-label="Instagram — The Beans Hub" href="https://www.instagram.com/thebeanshub/" rel="noopener" target="_blank">
<svg viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
<span>@thebeanshub</span>
</a>
</div>
</div>
</div>
<div class="tbh-footer-bottom">
<p class="tbh-footer-copy">© 2026 The Beans Hub. All rights reserved.</p>
</div>
</footer>`;

const SCRIPTS = `<script>
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}
(function () {
  const tocLinks = document.querySelectorAll('.toc-link[href^="#"]');
  const headings = Array.from(document.querySelectorAll('.post-body h2[id]'));
  if (!tocLinks.length || !headings.length) return;
  function setActive(id) {
    tocLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  }
  if (headings[0]) setActive(headings[0].id);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
  }, { rootMargin: '-10% 0px -80% 0px', threshold: 0 });
  headings.forEach(h => observer.observe(h));
  tocLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
</script>`;

function faqHtml(faq){
  return `<h2 id="faq">Frequently Asked Questions</h2>
${faq.map(f=>`<h3>${f.q}</h3>
<p>${f.a}</p>`).join('\n')}`;
}

function render(p){
  return head(p) + nav() + hero(p) + `
<div class="post-layout">
<div class="post-body">
${p.body}
${faqHtml(p.faq)}
<div class="post-tags">
${p.tags.map(t=>`<span class="post-tag">${t}</span>`).join('')}
</div>
<div class="post-nav">
<a href="/library">&larr; Back to Coffee Library</a>
<a href="${p.next.href}">${p.next.label} &rarr;</a>
</div>
</div><!-- /post-body -->
${toc(p.toc)}
</div><!-- /post-layout -->
${morePosts(p.more)}
${FOOTER}
${SCRIPTS}
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// PAGE CONTENT
// ---------------------------------------------------------------------------
const pages = [];

/* ===== 1. PILLAR — Coffee Bean Origins ===== */
pages.push({
  slug:'coffee-bean-origins',
  title:"Coffee Bean Origins Explained: A Single-Origin Guide | The Beans Hub",
  desc:"What single origin coffee means, why origin changes how coffee tastes, and a country-by-country guide to the bean origins Malaysian roasters stock — Ethiopia to Yunnan.",
  h1:"Coffee Bean Origins Explained: A Single-Origin Guide for Malaysian Home Brewers",
  breadcrumb:"Coffee Bean Origins",
  badgeClass:"badge-guide", badgeIcon:"🌍", badgeLabel:"Guide",
  banner:"🌍", readTime:11,
  tags:["Coffee Origins","Single Origin","Specialty Coffee","Coffee Beans","Home Brewing"],
  toc:[
    {id:"what-single-origin-means",label:"What single origin means"},
    {id:"why-origin-changes-the-cup",label:"Why origin changes the cup"},
    {id:"the-major-origins",label:"The major origins, in short"},
    {id:"ethiopia",label:"Ethiopia"},
    {id:"colombia",label:"Colombia"},
    {id:"brazil",label:"Brazil"},
    {id:"indonesia",label:"Indonesia"},
    {id:"yunnan-and-thailand",label:"Yunnan &amp; Thailand"},
    {id:"single-origin-vs-blend",label:"Single origin vs blend"},
    {id:"how-to-pick-your-first",label:"How to pick your first single origin"},
    {id:"faq",label:"FAQ"}
  ],
  more:[
    {href:"/posts/asia-coffee-origins-yunnan-thailand",emoji:"🌏",title:"Yunnan &amp; Thailand Coffee Beans: Asia's Specialty Origins",meta:"6 min read"},
    {href:"/posts/single-origin-vs-blend-coffee",emoji:"⚖️",title:"Single Origin vs Blend: Which Should a Home Brewer Buy?",meta:"7 min read"},
    {href:"/posts/specialty-coffee-malaysia",emoji:"☕",title:"Specialty Coffee in Malaysia: A Home Brewer's Guide",meta:"10 min read"}
  ],
  next:{href:"/posts/single-origin-vs-blend-coffee",label:"Read: Single Origin vs Blend"},
  faq:[
    {q:"What does single origin coffee mean?",
     a:"Single origin coffee comes from one place — that could be one country, one growing region within a country, or one specific farm. The more specific the origin, the more traceability and consistency you tend to get. It is the opposite of a blend, which combines coffees from two or more origins."},
    {q:"Why does origin change how coffee tastes?",
     a:"Climate, altitude, soil, varietal and processing all shift with location, and each one affects the cup. High-altitude Ethiopian arabica grown from heirloom varietals tastes nothing like lower-altitude Brazilian arabica from cultivated rows, even though both are arabica. Origin is the easiest way to predict the flavour you will get."},
    {q:"Which coffee origins do Malaysian roasters stock most often?",
     a:"The most common single origins on Malaysian roaster menus are Ethiopia, Colombia, Brazil and Indonesia, with Yunnan and Thailand appearing more often as Asia-region origins gain attention. Most Malaysian roasters import these as green beans and roast them locally."},
    {q:"Is single origin better than a blend?",
     a:"Neither is better in absolute terms — they answer different questions. Single origin gives you the clearest taste of one place; a blend gives you a balanced, consistent cup built from several origins. Home brewers often keep both on the shelf for different brewing methods."}
  ],
  body:`
<p>If you have spent any time looking at specialty coffee bags, you will have noticed that origin is the headline. Ethiopia. Colombia. Brazil. Yunnan. Single farm names if the roaster is being particular. There is a reason for that. Origin is the single biggest influence on what your coffee tastes like — bigger than roast level, bigger than brew method, bigger than almost anything else you can control as a home brewer.</p>
<p>This guide is a tour of the coffee bean origins you will actually encounter on Malaysian roaster shelves. It explains what &ldquo;single origin&rdquo; means, why origin matters so much in the cup, and what each of the major origins tends to taste like. By the end you should be able to walk into any shop catalogue, see &ldquo;Washed Yirgacheffe&rdquo; on a bag and have a reasonable guess at whether you will enjoy it.</p>
<h2 id="what-single-origin-means">What single origin actually means</h2>
<p>Single origin is a loose label that comes in three levels of specificity, and the difference matters.</p>
<div class="info-card">
<h4>The three levels</h4>
<ul>
<li><strong>Country-level:</strong> &ldquo;Ethiopia&rdquo; or &ldquo;Colombia&rdquo; on the bag, with no further detail. Useful as a broad flavour signpost, but two Ethiopian lots can still taste very different.</li>
<li><strong>Regional or cooperative:</strong> &ldquo;Yirgacheffe&rdquo;, &ldquo;Huila&rdquo;, &ldquo;Sul de Minas&rdquo;. Narrower geography, narrower flavour range, more reliable expectations.</li>
<li><strong>Single farm or micro-lot:</strong> the name of a specific farm or producer, sometimes a specific harvest lot. Maximum traceability, usually a higher price.</li>
</ul>
</div>
<p>None of these is &ldquo;real&rdquo; single origin while the others are not. They are points along a spectrum from broad to specific, and a roaster decides how much detail to share based on what they know about the bag. As a buyer, more detail is generally better — it means the roaster trusts their sourcing enough to be specific.</p>
<p>The opposite of single origin is a blend, where the roaster combines two or more single origins to create a deliberate flavour profile. Blends are useful and worth their own guide, which is why we wrote one: <a href="/posts/single-origin-vs-blend-coffee">single origin vs blend</a> covers when each one wins.</p>
<h2 id="why-origin-changes-the-cup">Why origin changes the cup</h2>
<p>The reason origin matters so much is that coffee is an agricultural product, and every variable that shapes the plant also shapes the bean. Climate, altitude, soil, the varietal of arabica being grown, the local processing tradition — none of these is portable. A washed Yirgacheffe and a washed Huila are both washed arabica, but they will not taste alike, because almost everything else about them is different.</p>
<p>Altitude is one of the clearest examples. Higher-altitude coffee tends to ripen more slowly, which builds density and acidity in the bean — you taste it as brightness and complexity. Lower-altitude coffee ripens faster and tends toward heavier body and sweetness, with less acidity. That single factor explains a large part of why East African coffees feel sparkly and Latin American coffees often feel smoother.</p>
<p>Varietal matters too. Ethiopia grows thousands of native heirloom varietals that exist almost nowhere else, which is part of why no two Ethiopian bags taste the same. Most of Latin America grows a smaller set of cultivated varietals — Caturra, Catuai, Bourbon, Typica — which gives those origins a more recognisable family resemblance. If you want to go deeper on the species behind these varietals, our explainer on <a href="/posts/arabica-robusta-liberica">arabica, robusta and liberica</a> is the companion read.</p>
<h2 id="the-major-origins">The major origins, in short</h2>
<p>Here is the quick map. The next few sections expand each one, with links to the matching shop category for current bags.</p>
<div class="info-card">
<h4>What to expect, by origin</h4>
<ul>
<li><strong>Ethiopia:</strong> floral, fruity, tea-like. The reference point for bright specialty coffee.</li>
<li><strong>Colombia:</strong> sweet, balanced, gently bright. The easiest first specialty bag.</li>
<li><strong>Brazil:</strong> chocolate, nuts, caramel. Smooth and low-acid. Built for espresso.</li>
<li><strong>Indonesia:</strong> earthy, full-bodied, low-acid. Bold and savoury.</li>
<li><strong>Yunnan &amp; Thailand:</strong> close-to-home Asian origins with nutty, sweet profiles and a growing experimental edge.</li>
</ul>
</div>
<h2 id="ethiopia">Ethiopia</h2>
<p>Ethiopia is where arabica started, and you can taste it. Most of the Ethiopian beans Malaysian roasters carry come from the high-altitude regions of Yirgacheffe, Sidamo, Guji and Limu, with trees sitting roughly 1,700m to 2,200m above sea level. The cool, slow ripening builds the complexity Ethiopia is famous for.</p>
<p>Two processing styles dominate. Washed Ethiopians lean clean and tea-like — jasmine, bergamot, lemon zest, white peach. Naturals push harder into fruit — blueberry, strawberry, sometimes a winey edge that some people love and others find too much. Both are worth trying side by side. These coffees suit pour-over, V60, AeroPress and filter brewing, where their floral acidity has room to show. Browse current bags on the <a href="/shop/ethiopia-coffee-beans">Ethiopia shop page</a>, and our piece on <a href="/posts/ethiopia-yirgacheffe-coffee-you-should-try">Yirgacheffe coffee</a> goes deeper on the region itself.</p>
<h2 id="colombia">Colombia</h2>
<p>Colombia coffee beans are what a lot of people grew up drinking without realising it — they sit in the middle of the flavour map, which is exactly why they ended up in so many house blends. Specialty Colombian, though, is a different conversation. Most of the lots Malaysian roasters carry come from the Colombian coffee belt — Huila, Nariño, Antioquia, Cauca and Tolima — at roughly 1,400m to 2,100m. Colombia harvests twice a year thanks to its rainfall pattern, which is part of why it shows up year-round when other origins disappear.</p>
<p>The classic Colombian profile is medium-bodied with caramel sweetness, milk chocolate, red apple and a clean, juicy acidity. Washed Colombians are often the safest &ldquo;first specialty bag&rdquo; recommendation. Naturals and honey-process Colombians push toward red fruit, plum and panela sugar, with some producers running anaerobic and co-fermentation lots that taste like strawberry milk or ripe peach. Colombia is one of the most forgiving origins to brew — it works in espresso, pour-over, French press, AeroPress and moka pot. Current bags are on the <a href="/shop/colombia%20coffee%20beans">Colombia shop page</a>.</p>
<h2 id="brazil">Brazil</h2>
<p>Brazil is the largest coffee producer in the world, and that scale shows up in your cup as consistency. Most of the Brazil coffee on Malaysian shelves comes from Minas Gerais, the Cerrado plateau, Mogiana in São Paulo and the Sul de Minas region — flatter land, bigger farms, lower elevations than much of Latin America, usually between 800m and 1,300m.</p>
<p>That lower altitude is not a downside. It is a different style. Brazilian coffee tends to develop more sweetness and body and less of the bright acidity you get from high-grown East African beans. The flavour profile leans heavily toward dark and milk chocolate, peanut, almond, hazelnut, brown sugar, and sometimes a soft red apple or orange note in the better lots. Most use natural or pulped natural processing — the cherry dries on the bean, the sugars deepen, the cup feels rounded and smooth. For home brewers, Brazil is the workhorse for espresso, milk drinks, French press and moka pot. Browse current bags on the <a href="/shop/brazil-coffee-beans">Brazil shop page</a>, and our deeper take is in <a href="/posts/brazil-coffee-beans-to-try">Brazil coffee beans to try</a>.</p>
<h2 id="indonesia">Indonesia</h2>
<p>Indonesia produces some of the most distinctive coffee in the world. Once you have tasted a proper wet-hulled Sumatran, you will never confuse it for anything else. The Indonesian beans Malaysian roasters carry come mostly from Sumatra, Java, Sulawesi, Bali and Flores — five major coffee-growing islands, each with its own character. Most production sits between roughly 900m and 1,700m, with the highest-grown lots from Aceh, Lintong and the Toraja highlands.</p>
<p>The signature processing style here is wet-hulling — locally called <em>giling basah</em> — where the parchment is removed while the beans are still wet, before they finish drying. The result is a cup with low acidity, heavy body, earthy and herbal flavours, and notes of dark chocolate, cedar, tobacco and sometimes overripe tropical fruit. Java lots tend to be cleaner. Sulawesi Toraja sits in the middle. Bali and Flores often show brighter acidity and more fruit in washed and natural lots. Indonesia excels in espresso, French press, moka pot and full-bodied drip brewing. Current bags are on the <a href="/shop/indonesia-coffee-beans">Indonesia shop page</a>.</p>
<h2 id="yunnan-and-thailand">Yunnan &amp; Thailand</h2>
<p>The Asian origins are the newest part of most Malaysian roaster line-ups, and they are worth paying attention to. China grows coffee — almost all of it in Yunnan, the southwestern province bordering Myanmar, Laos and Vietnam — and Thailand has built a small but quality-driven specialty scene in its northern highlands. Both are geographically close to Malaysia, which helps freshness and shipping.</p>
<p>Yunnan and Thai lots can taste nutty and gently sweet at the classic end, and push toward stone fruit, citrus and floral notes in newer washed and experimental lots. We've written a focused guide on both: <a href="/posts/asia-coffee-origins-yunnan-thailand">Yunnan and Thailand coffee beans</a>. Current bags are on the <a href="/shop/yunnan-coffee-beans">Yunnan</a> and <a href="/shop/thailand-coffee-beans">Thailand</a> shop pages.</p>
<h2 id="single-origin-vs-blend">Single origin vs blend</h2>
<p>A common question once you start exploring origins: should you buy single origin or blend? The short answer is that they answer different questions. Single origin gives you the clearest taste of one place — useful for exploration, pour-over and learning what you like. A blend gives you a balanced, consistent cup built from several origins — useful for espresso, milk drinks and daily drinking. Most home brewers end up keeping both on the shelf. The full comparison is in <a href="/posts/single-origin-vs-blend-coffee">single origin vs blend</a>, and current blends are on the <a href="/shop/arabica-blend-coffee-beans">arabica blends shop page</a>.</p>
<h2 id="how-to-pick-your-first">How to pick your first single origin</h2>
<p>If you are new to single origin coffee, the simplest way to start is to pick an origin whose profile sounds like something you already enjoy.</p>
<div class="info-card">
<h4>A starting suggestion</h4>
<ul>
<li>If you love chocolate, nutty, easy-drinking cups: <strong>Brazil</strong> or <strong>Colombia</strong>.</li>
<li>If you want to taste something genuinely different from anything you have had: <strong>Ethiopia</strong>, ideally a washed Yirgacheffe.</li>
<li>If you brew espresso and want body and sweetness: <strong>Brazil</strong> first, then explore from there.</li>
<li>If you love full-bodied, savoury, low-acid coffee: <strong>Indonesia</strong>.</li>
<li>If you want to try something close to home: <strong>Yunnan</strong> or <strong>Thailand</strong>.</li>
</ul>
</div>
<p>Pair the origin with a roast level that suits your brewer. Light to medium roasts let origin character through clearly and work best on pour-over, V60 and AeroPress. Medium to medium-dark roasts suit espresso, milk drinks, French press and moka pot. Our guide to <a href="/posts/light-vs-medium-vs-dark-roast">light, medium and dark roast</a> goes deeper, and the <a href="/posts/best-coffee-beans-malaysia">2026 buying guide</a> covers the full set of buying criteria.</p>
<p>Then taste, take a one-line note, and let your next bag follow what you noticed. Origin is the variable that teaches you the most about your own palate — there is no substitute for trying a few side by side and paying attention to what you actually liked.</p>
<div class="callout">
<p class="callout-title">🌍 Start exploring</p>
<p>Browse single-origin beans from across the world in the full <a href="/shop">coffee bean catalogue</a>, filtered by country, taste and roast style.</p>
</div>
`
});

/* ===== 2. ASIA — Yunnan & Thailand combined ===== */
pages.push({
  slug:'asia-coffee-origins-yunnan-thailand',
  title:"Yunnan & Thailand Coffee Beans: Asia's Origins | The Beans Hub",
  desc:"Yunnan and Thailand are Asia's quiet specialty coffee origins — what they taste like, why proximity matters for Malaysian brewers, and where to buy.",
  h1:"Yunnan & Thailand Coffee Beans: Asia's Specialty Origins",
  breadcrumb:"Yunnan & Thailand Coffee Beans",
  badgeClass:"badge-guide", badgeIcon:"🌏", badgeLabel:"Origin Guide",
  banner:"🌏", readTime:6,
  tags:["Yunnan","Thailand","Asia Coffee","Specialty Coffee","Origin Guide"],
  toc:[
    {id:"why-asia-origins-matter",label:"Why Asia origins matter for Malaysian brewers"},
    {id:"yunnan-china",label:"Yunnan, China"},
    {id:"thailand",label:"Thailand"},
    {id:"yunnan-vs-thailand",label:"Yunnan vs Thailand"},
    {id:"where-to-buy",label:"Where to buy Yunnan &amp; Thai beans"},
    {id:"faq",label:"FAQ"}
  ],
  more:[
    {href:"/posts/coffee-bean-origins",emoji:"🌍",title:"Coffee Bean Origins Explained: A Single-Origin Guide",meta:"11 min read"},
    {href:"/posts/single-origin-vs-blend-coffee",emoji:"⚖️",title:"Single Origin vs Blend: Which Should a Home Brewer Buy?",meta:"7 min read"},
    {href:"/posts/specialty-coffee-malaysia",emoji:"☕",title:"Specialty Coffee in Malaysia: A Home Brewer's Guide",meta:"10 min read"}
  ],
  next:{href:"/posts/single-origin-vs-blend-coffee",label:"Read: Single Origin vs Blend"},
  faq:[
    {q:"What does Yunnan coffee taste like?",
     a:"Classic Yunnan leans nutty, gently sweet and earthy — roasted almond, dark chocolate, brown sugar, dried longan, sometimes a soft black tea finish. Newer washed and anaerobic lots from producers in Baoshan and Pu'er push toward stone fruit, citrus and floral notes that surprise people who think they know what Chinese coffee tastes like."},
    {q:"What does Thailand coffee taste like?",
     a:"The classic Thai cup leans medium-bodied with cocoa, dried fruit, brown sugar and a soft citrus brightness — somewhere between Latin American sweetness and the cleaner side of Indonesian profiles. Washed Thai lots are clean and approachable, naturals can taste like ripe stone fruit or red berry, and anaerobic and honey lots from Chiang Rai are increasingly competitive."},
    {q:"Why should Malaysian home brewers care about Yunnan and Thailand?",
     a:"Both are geographically close to Malaysia, which usually helps freshness and shipping costs compared to coffee imported from Latin America or East Africa. Both are also producing genuinely good specialty lots at prices that tend to be gentler than Panama or Colombia equivalents, which makes them strong-value options for home brewers exploring new origins."},
    {q:"Where can I buy Yunnan and Thai coffee beans in Malaysia?",
     a:"Several Malaysian roasters now stock Yunnan and Thai single origins. You can browse them on The Beans Hub's Yunnan and Thailand shop pages, which collect what Malaysian roasters currently carry, and order directly from the roaster."}
  ],
  body:`
<p>The Asian origins are the newest part of most Malaysian roaster line-ups, and they are some of the most interesting. Yunnan in southwestern China and the highlands of northern Thailand have both spent the last decade or so building genuine specialty scenes, and the bags on offer are no longer just a curiosity — they hold their own against the better-known origins.</p>
<p>If you have never bought from either, this guide is the orientation. We cover what each origin is, what the coffee tastes like, why proximity to Malaysia makes them practical for home brewers, and where to actually find bags.</p>
<h2 id="why-asia-origins-matter">Why Asia origins matter for Malaysian brewers</h2>
<p>The case for Yunnan and Thailand for Malaysian home brewers is partly geography and partly value. Both sit much closer to Malaysia than Latin America or East Africa, so the supply chain is shorter — green beans reach Malaysian roasters faster and at lower freight cost. That tends to translate into gentler retail prices for similar quality.</p>
<p>There is also a quality story. Both origins have spent the last decade investing in better varietals, more careful processing and competition-grade lots, and the difference shows in the cup. For a home brewer who has already explored the classics, Yunnan and Thailand are where you go for value-for-money discovery. The wider <a href="/posts/coffee-bean-origins">coffee bean origins guide</a> sets out how they fit alongside Ethiopia, Colombia, Brazil and Indonesia.</p>
<h2 id="yunnan-china">Yunnan, China</h2>
<p>China grows coffee, and the place where most of it comes from is Yunnan, the southwestern province bordering Myanmar, Laos and Vietnam. Most production sits in Pu'er, Baoshan, Lincang and Dehong — regions with elevations between roughly 1,100m and 2,000m, monsoon rainfall, and a cool dry winter that lets the cherries ripen slowly.</p>
<p>The dominant varietal is Catimor, originally introduced in the 1980s for disease resistance, but you will increasingly see Bourbon, Typica and even Geisha lots from the better farms. The classic Yunnan profile leans nutty, gently sweet and earthy — think roasted almond, dark chocolate, brown sugar and dried longan, sometimes with a soft black tea finish. Newer washed and anaerobic lots from producers in Baoshan and Pu'er push toward stone fruit, citrus and floral notes that genuinely surprise people who think they know what Chinese coffee tastes like.</p>
<p>Processing is mostly washed, but natural and honey lots are growing. A handful of farms are running ambitious experimental ferments at prices that are still gentler than Panama or Colombia equivalents — part of why Yunnan has become a quiet favourite for value. Current bags are on the <a href="/shop/yunnan-coffee-beans">Yunnan shop page</a>.</p>
<h2 id="thailand">Thailand</h2>
<p>Thailand's specialty scene has grown up over roughly the last 15 years, mostly thanks to the highland farms in Chiang Mai, Chiang Rai and the surrounding northern provinces. Most of the specialty production comes from areas like Doi Chaang, Doi Tung, Doi Pangkhon and Mae Hong Son — mountain villages that sit between around 1,000m and 1,600m above sea level.</p>
<p>A lot of these farms grew out of the Royal Project, a long-running initiative that introduced arabica to the highlands as a replacement crop for opium poppies. The story is unusual but the coffee is genuinely good. Common varietals include Catimor, Caturra, Typica and Bourbon, with smaller lots of Geisha from competition farms. The classic Thai cup leans medium-bodied with cocoa, dried fruit, brown sugar and a soft citrus brightness — somewhere between Latin American sweetness and the cleaner side of Indonesian profiles.</p>
<p>Processing covers the full range. Washed Thai lots are clean and approachable. Naturals can taste like ripe stone fruit or red berry. A growing number of producers in Chiang Rai are running anaerobic, honey and co-fermentation lots that compete on quality with anything from Central America. Current bags are on the <a href="/shop/thailand-coffee-beans">Thailand shop page</a>.</p>
<h2 id="yunnan-vs-thailand">Yunnan vs Thailand</h2>
<p>If you are choosing between the two, here is the practical contrast.</p>
<div class="info-card">
<h4>The short comparison</h4>
<ul>
<li><strong>Flavour profile:</strong> Yunnan leans nutty, earthy and chocolatey; Thailand leans cocoa, dried fruit and citrus.</li>
<li><strong>Varietals:</strong> Yunnan is Catimor-dominant with growing Bourbon/Typica; Thailand is more varied across Catimor, Caturra, Typica, Bourbon.</li>
<li><strong>Processing range:</strong> both cover washed, natural, honey and anaerobic. Thailand has more competition-grade experimental lots.</li>
<li><strong>Best for:</strong> Yunnan suits espresso, milk drinks and full-bodied filter; Thailand spans the range, often very good on pour-over.</li>
</ul>
</div>
<p>Both reward side-by-side tasting. Brewing a Yunnan and a Thai lot the same way for a week teaches you more about your palate than any guide can — and that is true of all origin comparisons, as our <a href="/posts/how-to-read-flavour-notes">flavour notes guide</a> explains.</p>
<h2 id="where-to-buy">Where to buy Yunnan and Thai beans</h2>
<p>Several Malaysian roasters now stock Yunnan and Thai single origins, and most ship nationwide. The <a href="/shop/yunnan-coffee-beans">Yunnan</a> and <a href="/shop/thailand-coffee-beans">Thailand</a> shop pages collect what Malaysian roasters currently carry, so you can compare across roasters in one view and order from whichever fits.</p>
<p>As always, check the roast date, buy whole beans and brew within roughly two to four weeks for the best cup. The full buying checklist is in our <a href="/posts/best-coffee-beans-malaysia">2026 buying guide</a>, and if you would rather understand how to read what you are tasting once it arrives, the <a href="/posts/how-to-read-flavour-notes">flavour notes</a> guide is the companion read.</p>
<div class="callout">
<p class="callout-title">🌏 Try a close-to-home origin</p>
<p>Browse Yunnan and Thai bags from Malaysian roasters in the full <a href="/shop">coffee bean catalogue</a>.</p>
</div>
`
});

/* ===== 3. SINGLE ORIGIN VS BLEND ===== */
pages.push({
  slug:'single-origin-vs-blend-coffee',
  title:"Single Origin vs Blend Coffee: Which Should You Buy? | The Beans Hub",
  desc:"Single origin vs blend coffee — the practical difference, when each one wins, how roasters build a blend, and which is better for espresso, milk drinks and pour-over.",
  h1:"Single Origin vs Blend: Which Should a Home Brewer Buy?",
  breadcrumb:"Single Origin vs Blend",
  badgeClass:"badge-guide", badgeIcon:"⚖️", badgeLabel:"Guide",
  banner:"⚖️", readTime:7,
  tags:["Single Origin","Blend","Coffee Beans","Buying Guide","Specialty Coffee"],
  toc:[
    {id:"the-difference",label:"The practical difference"},
    {id:"how-roasters-build-a-blend",label:"How roasters build a blend"},
    {id:"when-blends-win",label:"When a blend is the smarter buy"},
    {id:"when-single-origin-wins",label:"When single origin rewards you"},
    {id:"for-espresso-and-milk",label:"For espresso and milk drinks"},
    {id:"keep-both",label:"Why most home brewers keep both"},
    {id:"faq",label:"FAQ"}
  ],
  more:[
    {href:"/posts/coffee-bean-origins",emoji:"🌍",title:"Coffee Bean Origins Explained: A Single-Origin Guide",meta:"11 min read"},
    {href:"/posts/asia-coffee-origins-yunnan-thailand",emoji:"🌏",title:"Yunnan &amp; Thailand Coffee Beans: Asia's Specialty Origins",meta:"6 min read"},
    {href:"/posts/best-coffee-beans-malaysia",emoji:"🏆",title:"Best Coffee Beans in Malaysia: A 2026 Buying Guide",meta:"8 min read"}
  ],
  next:{href:"/posts/coffee-bean-origins",label:"Read: Coffee Bean Origins Explained"},
  faq:[
    {q:"What is the difference between single origin and blend coffee?",
     a:"A single origin coffee comes from one place — one country, region or farm — so it expresses the character of that place. A blend combines two or more single origins, mixed by the roaster to build a balanced cup with deliberate body, sweetness and finish. Single origin is about clarity; blend is about balance and consistency."},
    {q:"Is single origin coffee better than a blend?",
     a:"Neither is better in absolute terms. Single origin gives you the clearest taste of one place and rewards careful brewing. Blends give you a balanced, consistent cup that holds up across brew methods and milk drinks. The right answer depends on how you brew and what you want from the cup."},
    {q:"How do roasters build a coffee blend?",
     a:"A roaster usually picks a base coffee for body — often Brazilian for its chocolate and nut character and low acidity — then adds other origins for specific roles: Ethiopian or Kenyan for top-note brightness, Colombian or Central American washed lots for sweetness and a clean finish. The proportions are tested by cupping until the cup tastes the way the roaster intends."},
    {q:"Should I use single origin or blend for espresso?",
     a:"Blends are the traditional espresso choice because the balance and body they provide stand up to milk and to small variations in the shot. Plenty of home baristas pull single-origin espresso and love it — especially for natural Brazils and lighter washed lots — but blends remain the most forgiving option for daily espresso and milk drinks."}
  ],
  body:`
<p>Single origin or blend. If you have ever stood in front of a roaster's website unsure which to add to the cart, this guide is for you. The honest answer is that both have their place, and most home brewers eventually keep one of each on the shelf. The interesting question is when each one wins — and once you understand the logic, the choice stops feeling like a coin flip.</p>
<h2 id="the-difference">The practical difference</h2>
<p>A single origin coffee comes from one place. The bag tells you where — Ethiopia, Yunnan, a specific farm in Colombia — and the cup expresses the character of that place. The brighter acidities, the fruit notes, the floral edges or earthy depth that make one origin different from another all come through clearly, because nothing else is in the bag to balance them out.</p>
<p>A blend combines two or more single origins into one bag. The roaster has decided that the cup is better as a combination than any of the parts on their own — usually because they want a specific balance of body, sweetness, acidity and finish that no single coffee delivers cleanly. Blends are an act of editing.</p>
<div class="info-card">
<h4>The one-line version</h4>
<ul>
<li><strong>Single origin:</strong> the clearest expression of one place. Built for clarity and exploration.</li>
<li><strong>Blend:</strong> a deliberate balance of several origins. Built for consistency and everyday drinking.</li>
</ul>
</div>
<p>If you want the wider context on origins, our pillar piece on <a href="/posts/coffee-bean-origins">coffee bean origins</a> walks through what each of the major origins actually tastes like.</p>
<h2 id="how-roasters-build-a-blend">How roasters build a blend</h2>
<p>Blending is a craft. A good blend balances body, acidity, sweetness and finish — using one origin for chocolate depth, another for fruit lift, a third for a long, clean aftertaste. The proportions are not guessed. Roasters test combinations on the cupping table, adjust, and only release a blend once the cup tastes the way they intend.</p>
<p>A few patterns are common enough to be worth knowing. Brazil shows up in a lot of espresso blends because of its body, sweetness and low acidity — it gives the cup its backbone. Ethiopia gets added for floral or fruit top notes. Colombia and other Central American washed lots round out the middle with caramel sweetness and a clean finish. Some roasters disclose the components on the bag; others treat the recipe as house IP and leave you with a flavour description.</p>
<p>Most blends are roasted medium to medium-dark, which is part of why they hold up so well in espresso, milk drinks, moka pot and bigger-batch brewing. The roasting reinforces the balance. Current blends are on the <a href="/shop/arabica-blend-coffee-beans">arabica blends shop page</a>, and our guide to <a href="/posts/light-vs-medium-vs-dark-roast">light, medium and dark roast</a> covers what those roast levels actually mean.</p>
<h2 id="when-blends-win">When a blend is the smarter buy</h2>
<p>Pick a blend when you want consistency more than exploration. A few scenarios where blends genuinely earn their place:</p>
<div class="info-card">
<h4>Blends shine when…</h4>
<ul>
<li><strong>You brew espresso or milk drinks daily.</strong> The body and balance hold up under milk and small shot-to-shot variation.</li>
<li><strong>You want a forgiving bag.</strong> If your grind drifts a touch or your dose is slightly off, a blend punishes you less than a delicate light-roast single origin.</li>
<li><strong>You drink the same coffee every day.</strong> The roaster has done the work of making the cup feel complete, which is what you want from a daily.</li>
<li><strong>You're entertaining or sharing.</strong> Blends suit a range of palates — they are designed to be widely enjoyable.</li>
</ul>
</div>
<h2 id="when-single-origin-wins">When single origin rewards you</h2>
<p>Single origin wins whenever clarity matters more than balance.</p>
<div class="info-card">
<h4>Single origin shines when…</h4>
<ul>
<li><strong>You brew pour-over, V60 or AeroPress.</strong> These methods strip away noise and show off the origin. A washed Ethiopian on a V60 is one of the most rewarding cups a home brewer can make.</li>
<li><strong>You want to taste a place.</strong> If the goal is to learn what Yirgacheffe really tastes like, or compare a Brazilian natural against a washed Colombian, you need single origin.</li>
<li><strong>You enjoy variety.</strong> Specialty coffee is seasonal, and following single origins across the year is part of the fun.</li>
<li><strong>You want to develop your palate.</strong> Tasting unblended origins side by side teaches you more about flavour than reading any guide. Our piece on <a href="/posts/how-to-read-flavour-notes">reading flavour notes</a> is the companion read.</li>
</ul>
</div>
<h2 id="for-espresso-and-milk">For espresso and milk drinks specifically</h2>
<p>Espresso is the place this debate gets the most heated. Traditional advice says blends — and traditional advice is mostly right, for the reasons above. The body and balance of a well-built blend stands up to milk and forgives small recipe drift, both of which matter at 7am.</p>
<p>That said, plenty of home baristas pull single-origin espresso and love it. Natural-process Brazilians and Colombians work especially well because their natural sweetness and body translate to espresso. Lighter washed lots can also be brilliant as espresso, but they are less forgiving — you need a decent grinder, fresh beans and patience to dial them in. If you brew espresso daily and want minimum fuss, start with a blend. If you brew espresso for fun and like the experimentation, single origin is a legitimate path.</p>
<h2 id="keep-both">Why most home brewers keep both</h2>
<p>The cleanest answer to &ldquo;single origin or blend&rdquo; is &ldquo;both, for different jobs.&rdquo; A blend for daily espresso and milk drinks. A rotating single origin for weekend pour-over or whenever you want to think about coffee a little. Two bags, two purposes, no conflict.</p>
<p>It also makes shopping easier. Instead of choosing one or the other, you choose what each bag is for, which turns a vague decision into a practical one. The <a href="/posts/best-coffee-beans-malaysia">2026 buying guide</a> covers the broader criteria, and the wider <a href="/posts/coffee-bean-origins">coffee bean origins</a> pillar helps you pick which single origin to try next.</p>
<div class="callout">
<p class="callout-title">⚖️ Pick your next bag</p>
<p>Browse single origins and blends from Malaysian roasters in the full <a href="/shop">coffee bean catalogue</a>.</p>
</div>
`
});

// ---------------------------------------------------------------------------
let count = 0;
for (const p of pages){
  fs.writeFileSync(path.join(OUT_DIR, p.slug + '.html'), render(p), 'utf8');
  const words = p.body.replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;
  console.log(`${p.slug}.html  —  ~${words} body words`);
  count++;
}
console.log(`\n${count} pages written to ${OUT_DIR}`);
