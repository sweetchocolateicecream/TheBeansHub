/* Generates Cluster 1 SEO pages for The Beans Hub.
   Output: ../posts/*.html  (clean URLs via the existing .htaccess rewrite)

   Run from the repo root:   node "SEO plans/build-cluster1.js"
   The shared CSS is lifted from posts/kl-roasters.html so the new pages
   stay visually in sync with the rest of the Coffee Library.
*/
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.thebeanshub.com';
const OG_IMG = SITE + '/img/Girl-bought-coffee-from-the-beans-hub.png';
const DATE = '2026-05-15';
const DATE_LABEL = 'May 2026';

// repo root = parent of the folder this script lives in ("SEO plans/")
const ROOT = process.env.TBH_ROOT || path.join(__dirname, '..');
// pull the shared <style> block from an existing post
const basePost = fs.readFileSync(path.join(ROOT, 'posts', 'kl-roasters.html'), 'utf8');
const CSS = basePost.slice(basePost.indexOf('<style>') + 7, basePost.indexOf('</style>')).trim();

// where to write the .html files — repo posts/ folder
const OUT_DIR = process.env.TBH_OUT || path.join(ROOT, 'posts');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// SHARED MARKUP
// ---------------------------------------------------------------------------
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
    "datePublished":DATE,"dateModified":DATE,
    "image":OG_IMG,
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
// TOC — highlight active section on scroll
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

/* ===== 1. PILLAR ===== */
pages.push({
  slug:'specialty-coffee-malaysia',
  title:"Specialty Coffee in Malaysia: A Home Brewer's Guide | The Beans Hub",
  desc:"Where to find and buy specialty coffee beans in Malaysia — by city and online. What makes coffee “specialty”, how to read a bag, and how The Beans Hub helps.",
  h1:"Specialty Coffee in Malaysia: A Home Brewer's Guide to Finding and Buying Beans",
  breadcrumb:"Specialty Coffee in Malaysia",
  badgeClass:"badge-guide", badgeIcon:"☕", badgeLabel:"Guide",
  banner:"☕", readTime:10,
  tags:["Specialty Coffee","Malaysia","Coffee Beans","Home Brewing","Where to Buy"],
  toc:[
    {id:"what-makes-coffee-specialty",label:"What makes coffee “specialty”?"},
    {id:"malaysian-specialty-scene",label:"The Malaysian specialty scene"},
    {id:"where-to-buy-specialty-beans",label:"Where to buy specialty beans"},
    {id:"how-to-read-a-coffee-bag",label:"How to read a coffee bag"},
    {id:"choosing-by-how-you-brew",label:"Choosing beans by how you brew"},
    {id:"is-specialty-coffee-worth-it",label:"Is specialty coffee worth it?"},
    {id:"how-the-beans-hub-helps",label:"How The Beans Hub helps"},
    {id:"a-simple-way-to-start",label:"A simple way to start"},
    {id:"faq",label:"FAQ"}
  ],
  more:[
    {href:"/posts/kl-roasters",emoji:"🏙️",title:"Best Specialty Coffee Roasters in Kuala Lumpur",meta:"8 min read"},
    {href:"/posts/best-coffee-beans-malaysia",emoji:"🏆",title:"Best Coffee Beans in Malaysia: A 2026 Buying Guide",meta:"8 min read"},
    {href:"/posts/how-to-read-flavour-notes",emoji:"🫐",title:"How to Read Flavour Notes in Coffee (Without Feeling Lost)",meta:"6 min read"}
  ],
  next:{href:"/posts/best-coffee-beans-malaysia",label:"Read: Best Coffee Beans in Malaysia"},
  faq:[
    {q:"What is specialty coffee?",
     a:"Specialty coffee is coffee that has been graded by trained tasters and scored 80 or above on the Specialty Coffee Association's 100-point scale. In practice it means the whole chain — growing, processing, roasting and storage — has been handled carefully enough to keep the coffee free of defects and full of character. It usually comes with a roast date, a named origin and tasting notes on the bag."},
    {q:"Does Malaysia grow its own coffee?",
     a:"Yes, on a small scale. Malaysia mainly grows liberica, especially in Johor and parts of Pahang, along with some robusta in Sabah. Most of the specialty coffee sold by Malaysian roasters, though, is arabica imported as green beans from countries like Ethiopia, Colombia and Brazil, then roasted locally. Malaysia is a larger roasting hub than it is a growing country."},
    {q:"Where can I buy specialty coffee beans in Malaysia?",
     a:"You can buy directly from roasteries in cities like Kuala Lumpur, Petaling Jaya, Penang and Johor Bahru, through online marketplaces, or through a directory like The Beans Hub that lists beans from more than 40 Malaysian roasters in one place so you can compare without checking each roaster's site individually."},
    {q:"Is specialty coffee worth the price?",
     a:"For home brewers who care about flavour, usually yes. You are paying for fresher beans, traceable origins and more careful roasting, and a bag brewed at home still works out cheaper per cup than café coffee. Whether it is worth it depends on how much the difference in the cup matters to you."}
  ],
  body:`
<p>Specialty coffee in Malaysia has gone from a niche interest to a genuine, country-wide scene in not much more than a decade. There are now independent roasters in every major city, hundreds of single-origin bags to choose from, and a steady stream of home brewers who have decided that café coffee is no longer the only good option. If you are somewhere near the start of that journey, this guide is the map.</p>
<p>We built The Beans Hub because finding good beans in Malaysia was harder than it should be. The roasters were there. The information was scattered — across Instagram bios, marketplace listings and word of mouth. This page pulls the basics together: what specialty coffee actually means, what the Malaysian scene looks like, and where to buy beans whether you are in KL, PJ, Penang or anywhere else in the country.</p>
<h2 id="what-makes-coffee-specialty">What makes coffee &ldquo;specialty&rdquo;?</h2>
<p>The word &ldquo;specialty&rdquo; has a real definition behind it. The Specialty Coffee Association grades coffee on a 100-point scale, and any coffee that scores 80 or above is considered specialty grade. Trained tasters assess things like aroma, flavour, acidity, body and the absence of defects. Score below 80 and the coffee is classed as commercial grade, which is most of what ends up in supermarket tins.</p>
<p>A score is only the end of the story, though. That number is protected — or lost — at every step before it. Ripe cherries have to be picked at the right time. Processing has to be done with care. The green beans have to be stored well, roasted with attention, and reach you while they are still fresh. Think of it like good produce: the quality starts at the farm, and every careless step after that chips away at it.</p>
<p>The roaster is the part of that chain you actually interact with, and it matters more than people expect. A roaster decides how to treat each green coffee — how light or dark to take it, how to bring out the sweetness without scorching the origin character — and then has to get the bag to you before the coffee fades. A good roaster working with a good green bean is what specialty coffee really means in practice.</p>
<p>For you as a buyer, the practical signals are simple. A specialty bag almost always tells you where the coffee is from, often down to the region or farm, gives you a roast date rather than just an expiry date, and lists tasting notes. A commercial tin tells you almost none of that. Once you have bought a few specialty bags, the difference becomes obvious — the information on the label is there because the people who made it expect you to care about the cup.</p>
<h2 id="malaysian-specialty-scene">The Malaysian specialty coffee scene</h2>
<p>Malaysia occupies an interesting spot in the coffee world. It grows a little of its own coffee — mostly liberica in Johor and Pahang, plus some robusta in Sabah — but its real strength is roasting. Malaysian roasters import green arabica from origins like Ethiopia, Colombia, Brazil, Indonesia and increasingly Yunnan and Thailand, then roast it here. That makes the country a roasting hub more than a growing one.</p>
<p>Geographically, the scene clusters around a few areas. The Klang Valley — Kuala Lumpur, Petaling Jaya, Subang and the wider Selangor area — has the highest density of specialty roasters. Penang has a strong, café-driven scene with a growing number of roasters selling retail bags. Johor Bahru has been expanding quickly, helped by its closeness to Singapore. You will also find good roasters in Melaka, Ipoh and beyond.</p>
<div class="info-card">
<h4>The short version</h4>
<ul>
<li><strong>Klang Valley (KL, PJ, Selangor):</strong> the largest concentration of roasters and the easiest place to buy direct.</li>
<li><strong>Penang:</strong> a mature café scene with more roasters now packaging beans for home brewers.</li>
<li><strong>Johor Bahru:</strong> a fast-growing scene — see our <a href="/posts/specialty-coffee-johor">Johor specialty coffee guide</a>.</li>
<li><strong>Everywhere else:</strong> most roasters ship nationwide, so your location matters less than it used to.</li>
</ul>
</div>
<p>The fact that Malaysia is a roasting hub rather than a growing country is worth sitting with for a moment, because it shapes what you will find on the shelves. You are not limited to one or two local crops. A single Malaysian roaster might offer an Ethiopian, a Colombian, a Brazilian and an Indonesian side by side, all roasted here within the last week. That range is one of the quiet advantages of buying specialty coffee in Malaysia, and it is why the home-brewing scene has grown so quickly.</p>
<h2 id="where-to-buy-specialty-beans">Where to buy specialty beans</h2>
<p>There are three realistic ways to buy specialty beans in Malaysia, and most home brewers end up using all three. You can buy directly from a roastery, in person or through its own website. You can order through online marketplaces. Or you can use a directory like The Beans Hub to browse beans from many roasters at once and order from whichever one fits.</p>
<p>We have written a focused guide for each major area so you can go straight to what is near you:</p>
<ul>
<li><a href="/posts/specialty-coffee-beans-kl">Where to buy specialty coffee beans in KL</a></li>
<li><a href="/posts/specialty-coffee-beans-pj-selangor">Where to buy specialty coffee beans in PJ &amp; Selangor</a></li>
<li><a href="/posts/specialty-coffee-penang">Specialty coffee in Penang: roasters and where to buy beans</a></li>
<li><a href="/posts/buy-coffee-beans-online-malaysia">How to buy coffee beans online in Malaysia</a></li>
</ul>
<p>If you want to understand who you are buying from before you choose, our guide to <a href="/posts/malaysia-coffee-brands-roasters">Malaysian coffee brands and roasters</a> explains the difference between commercial brands and independent specialty roasters. And when you are ready to actually pick a bag, the <a href="/posts/best-coffee-beans-malaysia">2026 buying guide</a> walks through the criteria that matter.</p>
<h2 id="how-to-read-a-coffee-bag">How to read a bag of specialty coffee</h2>
<p>A specialty bag carries more information than a supermarket tin, and once you know what to look for it stops being intimidating. Five things matter most.</p>
<div class="info-card">
<h4>What to check on the label</h4>
<ul>
<li><strong>Roast date:</strong> not an expiry date. Roasted coffee is at its best within roughly two to four weeks of this date.</li>
<li><strong>Origin:</strong> the country, and often the region or farm. More detail usually means more traceability.</li>
<li><strong>Processing method:</strong> washed, natural, honey or fermented. This shapes the cup as much as the origin does.</li>
<li><strong>Roast level:</strong> light, medium or dark. This should match how you brew — see our guide to <a href="/posts/light-vs-medium-vs-dark-roast">light, medium and dark roast</a>.</li>
<li><strong>Tasting notes:</strong> what the roaster tasted. Our guide to <a href="/posts/how-to-read-flavour-notes">reading flavour notes</a> explains how to use them.</li>
</ul>
</div>
<p>It also helps to know what is actually in the bag. Most specialty coffee is arabica, but Malaysia's own liberica is worth understanding too — our explainer on <a href="/posts/arabica-robusta-liberica">arabica, robusta and liberica</a> covers the differences.</p>
<h2 id="choosing-by-how-you-brew">Choosing beans by how you brew</h2>
<p>One habit makes specialty coffee much less hit-or-miss: choose the bean to suit your brew method, not the other way around. A coffee that sings in a V60 can feel thin pulled as espresso, and a bag built for milk drinks can taste flat in a pour-over.</p>
<p>The rough guide is straightforward. Light to medium roasts suit pour-over, V60, filter and AeroPress, where you want clarity and the origin's character to come through. Medium to medium-dark roasts suit espresso and milk drinks, where you want body, sweetness and a more forgiving shot. French press and moka pot also do well with medium to medium-dark. This is the reason the <a href="/posts/best-coffee-beans-malaysia">2026 buying guide</a> spends time on matching roast level to method — it is the single decision that most affects whether you enjoy the cup.</p>
<p>If you are still working out what you like to taste, that is fine and normal. Buying two contrasting bags — say a washed Ethiopian and a natural Brazilian — and brewing them the same way for a week teaches you more than any guide can. Our notes on <a href="/posts/how-to-read-flavour-notes">reading flavour notes</a> help you put words to what you are tasting along the way.</p>
<h2 id="is-specialty-coffee-worth-it">Is specialty coffee worth the extra cost?</h2>
<p>A bag of specialty beans costs more than a tin of commercial coffee, and it is fair to ask what you are paying for. You are paying for fresher coffee, traceable sourcing, more careful roasting, and in many cases direct support for a small local business. The flavour difference is real — a well-made washed Ethiopian or a sweet natural Brazilian simply does not taste like generic blended coffee.</p>
<p>There is also the per-cup maths. A specialty bag brewed properly at home still works out cheaper than buying the same number of cups at a café. So the honest answer is that it depends on you. If the cup in front of you matters, specialty coffee earns its price. If coffee is purely fuel, it may not, and that is a perfectly reasonable position too.</p>
<h2 id="how-the-beans-hub-helps">How The Beans Hub helps you find roasters</h2>
<p>The hardest part of Malaysian specialty coffee is not quality. It is discovery. Roasters are spread across the country, each with its own website, its own marketplace listings and its own Instagram. Comparing them one by one is slow.</p>
<p>The Beans Hub collects more than 700 beans from over 40 Malaysian roasters into one place. You can filter by taste preference, by roast style — espresso, filter or omni — and by origin, then buy directly from the roaster. The point is to let you spend your time choosing a coffee rather than hunting for one.</p>
<p>That is also why this guide links out the way it does. The city pages tell you where to buy if you are in <a href="/posts/specialty-coffee-beans-kl">KL</a>, <a href="/posts/specialty-coffee-beans-pj-selangor">PJ and Selangor</a> or <a href="/posts/specialty-coffee-penang">Penang</a>. The guide to <a href="/posts/buy-coffee-beans-online-malaysia">buying online</a> covers ordering from anywhere in the country. And the guide to <a href="/posts/malaysia-coffee-brands-roasters">Malaysian roasters</a> helps you judge who you are buying from. Taken together, they are meant to get you from &ldquo;I want better coffee&rdquo; to a good bag in your kitchen with as little guesswork as possible.</p>
<h2 id="a-simple-way-to-start">A simple way to start</h2>
<p>If all of this feels like a lot, here is the short path. Pick one brew method you already own. Buy one bag of whole beans with a recent roast date, in a roast level that matches that method. Brew it the same way for a week, paying a little attention to what you taste. Then buy something different and compare.</p>
<p>That loop — buy, brew, notice, compare — is how every home brewer gets better, and it costs no more than drinking coffee you were going to drink anyway. Everything else in this guide is just detail to support that loop.</p>
<div class="callout">
<p class="callout-title">☕ Start here</p>
<p>Browse the full <a href="/shop">coffee bean catalogue</a> to see what Malaysian roasters are putting out right now, or read on through the city guides below to find what is closest to you.</p>
</div>
`
});

/* ===== 2. KL ===== */
pages.push({
  slug:'specialty-coffee-beans-kl',
  title:"Where to Buy Specialty Coffee Beans in KL | The Beans Hub",
  desc:"A practical guide to buying specialty coffee beans in Kuala Lumpur — roasteries, online ordering, the main roaster areas, and getting fresh KL beans delivered.",
  h1:"Where to Buy Specialty Coffee Beans in KL",
  breadcrumb:"Specialty Coffee Beans in KL",
  badgeClass:"badge-local", badgeIcon:"📍", badgeLabel:"Local Guide",
  banner:"🏙️", readTime:6,
  tags:["Kuala Lumpur","Coffee Beans","Where to Buy","Specialty Coffee","Local Guide"],
  toc:[
    {id:"kl-specialty-scene",label:"KL's specialty coffee scene"},
    {id:"where-home-brewers-buy",label:"Where home brewers buy beans"},
    {id:"kl-roaster-areas",label:"The main roaster areas"},
    {id:"what-kl-roasters-offer",label:"What KL roasters are known for"},
    {id:"freshness-and-delivery",label:"Freshness and delivery"},
    {id:"faq",label:"FAQ"}
  ],
  more:[
    {href:"/posts/kl-roasters",emoji:"🏙️",title:"Best Specialty Coffee Roasters in Kuala Lumpur",meta:"8 min read"},
    {href:"/posts/specialty-coffee-beans-pj-selangor",emoji:"🏘️",title:"Where to Buy Specialty Coffee Beans in PJ &amp; Selangor",meta:"5 min read"},
    {href:"/posts/specialty-coffee-malaysia",emoji:"☕",title:"Specialty Coffee in Malaysia: A Home Brewer's Guide",meta:"10 min read"}
  ],
  next:{href:"/posts/specialty-coffee-beans-pj-selangor",label:"Read: Specialty Coffee Beans in PJ & Selangor"},
  faq:[
    {q:"Where can I buy specialty coffee beans in KL?",
     a:"You can buy specialty coffee beans in KL directly from roasteries in areas like Bangsar, Damansara, TTDI and Mont Kiara, through their own websites, through online marketplaces, or through a directory like The Beans Hub that lists KL roasters alongside roasters from the rest of Malaysia."},
    {q:"Which KL areas have the most specialty coffee roasters?",
     a:"The roaster scene is densest around Bangsar and Damansara, TTDI and Mont Kiara, and the wider Klang Valley including Petaling Jaya and Subang. Our Kuala Lumpur roaster guide breaks these down by neighbourhood."},
    {q:"Can I get KL-roasted coffee beans delivered?",
     a:"Yes. Most KL roasters ship nationwide and many deliver within the Klang Valley quickly. Buying directly from the roaster's own site usually gets you the freshest stock, often roasted within days of dispatch."},
    {q:"How fresh should coffee beans be when I buy them?",
     a:"Look for a roast date on the bag and aim to brew the coffee within roughly two to four weeks of that date. Whole beans stay fresher than pre-ground, so buy whole and grind just before brewing if you can."}
  ],
  body:`
<p>If you live in or around Kuala Lumpur, you are in the best-supplied part of the country for specialty coffee beans. The hard part is not finding a roaster. It is knowing which of the many options to choose, and how to buy in a way that gets you fresh coffee. This guide covers both.</p>
<h2 id="kl-specialty-scene">KL's specialty coffee scene</h2>
<p>Kuala Lumpur's specialty coffee scene has grown quickly over the last decade. What used to be a small group of pioneer roasters is now a dense, competitive ecosystem, and the beans coming out of it hold their own internationally. For a home brewer, that competition is good news — it means more single-origin choice, more processing experiments and more roasters packaging retail bags rather than only supplying cafés.</p>
<p>It also means KL is a sensible place to learn. You can buy a washed Ethiopian and a natural Brazilian from two different KL roasters in the same week and taste the contrast for yourself. For a fuller picture of the scene, the <a href="/posts/specialty-coffee-malaysia">Malaysia specialty coffee guide</a> sets out how the national scene fits together.</p>
<p>The other thing worth knowing is that KL's scene is roaster-led. A lot of the businesses here exist primarily to roast and sell beans, not just to serve coffee at a counter. For a home brewer that is exactly what you want, because it means retail bags, roast dates and origin information are treated as the main product rather than an afterthought.</p>
<h2 id="where-home-brewers-buy">Where home brewers actually buy beans</h2>
<p>There are three common routes, and most KL home brewers mix all three depending on what they want.</p>
<div class="info-card">
<h4>Three ways to buy in KL</h4>
<ul>
<li><strong>Direct from the roastery:</strong> in person or through the roaster's own website. Usually the freshest stock, and the most direct way to support the roaster.</li>
<li><strong>Online marketplaces:</strong> convenient, with many roasters in one checkout, though stock can sit longer before it ships.</li>
<li><strong>A directory like The Beans Hub:</strong> browse beans from KL roasters next to roasters from the rest of Malaysia, filter by taste and roast style, then order from the roaster.</li>
</ul>
</div>
<p>If you would rather start from a curated list of roasters, our guide to the <a href="/posts/kl-roasters">best specialty coffee roasters in Kuala Lumpur</a> walks through them area by area.</p>
<h2 id="kl-roaster-areas">The main roaster areas</h2>
<p>KL's roasters are not evenly spread. A few areas carry most of the scene, which is useful to know if you would rather collect beans in person than wait for delivery.</p>
<p>Bangsar and Damansara have a long-established cluster of roasters and cafés. TTDI and Mont Kiara have their own steady group, including roasters known for more adventurous sourcing. Move out to Petaling Jaya and Subang and the scene continues — we cover that side separately in the <a href="/posts/specialty-coffee-beans-pj-selangor">PJ and Selangor guide</a>, since the Klang Valley really works as one connected coffee region.</p>
<p>You do not have to live next to a roastery, though. Almost every KL roaster ships, so treat these areas as a starting point rather than a limit.</p>
<h2 id="what-kl-roasters-offer">What KL roasters are known for</h2>
<p>KL's roasters are not interchangeable, and getting a feel for what each one does well is part of the fun. Some focus on classic, dependable single origins — the kind of washed Colombian or Brazilian you can brew every morning without thinking. Others lean into more adventurous sourcing, including unusual processing methods and collaborative lots you will not see anywhere else. A good number also champion Malaysian-grown liberica alongside their imported arabica.</p>
<p>For a home brewer, the practical advice is to try a few roasters rather than settling on the first one. Each roaster has a house style — a way they tend to roast — and finding one whose style matches your taste is worth more than chasing any single bag. The <a href="/posts/kl-roasters">Kuala Lumpur roaster guide</a> is a good place to see the range, and the guide to <a href="/posts/malaysia-coffee-brands-roasters">independent versus commercial roasters</a> explains what separates a serious roaster from a brand.</p>
<h2 id="freshness-and-delivery">Freshness and delivery</h2>
<p>Freshness is the one thing worth being slightly fussy about. Roasted coffee is at its best within roughly two to four weeks of the roast date. After that it does not go bad, but the aromatics fade and the cup flattens. Whole beans hold up far better than pre-ground coffee, so buy whole beans and grind them just before you brew.</p>
<p>Buying directly from a KL roaster's website usually gets you the freshest possible bag, often roasted to order or within a few days of dispatch. Within the Klang Valley, delivery is typically fast, and most roasters ship nationwide if you are buying KL beans from elsewhere. One small habit helps: buy in quantities you will actually finish inside a month, rather than stocking up. A fresh 250g bag beats a kilo that goes stale halfway through.</p>
<p>When you are choosing a bag, the <a href="/posts/best-coffee-beans-malaysia">2026 buying guide</a> covers what else to check beyond the roast date, and if you would rather order from outside the Klang Valley, our guide to <a href="/posts/buy-coffee-beans-online-malaysia">buying coffee beans online in Malaysia</a> walks through judging freshness when you cannot see the bag.</p>
<div class="callout">
<p class="callout-title">📍 Ready to browse?</p>
<p>See what KL roasters are putting out right now in the full <a href="/shop">coffee bean catalogue</a>, filtered by the taste and roast style you brew.</p>
</div>
`
});

/* ===== 3. PJ / SELANGOR ===== */
pages.push({
  slug:'specialty-coffee-beans-pj-selangor',
  title:"Where to Buy Specialty Coffee Beans in PJ & Selangor | The Beans Hub",
  desc:"Buying specialty coffee beans in Petaling Jaya and the wider Selangor area — where to look, how the PJ scene relates to KL, and getting beans delivered.",
  h1:"Where to Buy Specialty Coffee Beans in PJ & Selangor",
  breadcrumb:"Specialty Coffee Beans in PJ & Selangor",
  badgeClass:"badge-local", badgeIcon:"📍", badgeLabel:"Local Guide",
  banner:"🏘️", readTime:5,
  tags:["Petaling Jaya","Selangor","Coffee Beans","Where to Buy","Local Guide"],
  toc:[
    {id:"pj-selangor-scene",label:"The PJ and Selangor scene"},
    {id:"pj-vs-kl",label:"Is PJ separate from KL?"},
    {id:"where-to-buy-pj",label:"Where to buy in PJ and Selangor"},
    {id:"what-to-check",label:"What to check before you buy"},
    {id:"delivery-across-selangor",label:"Delivery across Selangor"},
    {id:"faq",label:"FAQ"}
  ],
  more:[
    {href:"/posts/specialty-coffee-beans-kl",emoji:"🏙️",title:"Where to Buy Specialty Coffee Beans in KL",meta:"6 min read"},
    {href:"/posts/kl-roasters",emoji:"☕",title:"Best Specialty Coffee Roasters in Kuala Lumpur",meta:"8 min read"},
    {href:"/posts/specialty-coffee-malaysia",emoji:"☕",title:"Specialty Coffee in Malaysia: A Home Brewer's Guide",meta:"10 min read"}
  ],
  next:{href:"/posts/specialty-coffee-penang",label:"Read: Specialty Coffee in Penang"},
  faq:[
    {q:"Where can I buy specialty coffee beans in Petaling Jaya?",
     a:"You can buy specialty coffee beans in PJ directly from roasteries across Petaling Jaya and Subang, through their websites and online marketplaces, or through The Beans Hub, which lists PJ and Selangor roasters alongside the rest of Malaysia so you can compare in one place."},
    {q:"Is the PJ coffee scene separate from KL?",
     a:"Not really. Petaling Jaya, Subang and the rest of Selangor sit inside the wider Klang Valley, which works as one connected coffee region. Roasters and home brewers move freely between PJ and KL, and most roasters on either side deliver across the whole valley."},
    {q:"Can specialty coffee beans be delivered across Selangor?",
     a:"Yes. Klang Valley delivery is generally fast, and most Selangor roasters also ship nationwide. Ordering directly from a roaster's own website usually gets you the freshest beans."},
    {q:"What should I look for when buying beans in PJ?",
     a:"Check the roast date and aim to brew within two to four weeks of it, buy whole beans rather than pre-ground, and match the roast level to how you brew. Our 2026 buying guide covers the full checklist."}
  ],
  body:`
<p>Petaling Jaya and the wider Selangor area sit right inside Malaysia's busiest coffee region, so finding specialty beans here is less about scarcity and more about knowing where to look. This is a short, practical guide for home brewers in PJ, Subang and the rest of Selangor.</p>
<h2 id="pj-selangor-scene">The PJ and Selangor scene</h2>
<p>Petaling Jaya has its own steady group of specialty roasters, and the scene continues out through Subang and the surrounding Selangor townships. Some focus on classic single origins, some lean into experimental processing, and a good number are committed to Malaysian-grown liberica. For a home brewer, the practical upshot is plenty of choice within a short drive — or a short delivery window.</p>
<p>PJ has also long been a place where roasters set up their actual roasting operations, partly because space is a little easier to come by than in central KL. That gives the area a working, production-focused feel — there are roasteries here that are first and foremost roasteries, with a small retail counter attached. If you want the national context first, the <a href="/posts/specialty-coffee-malaysia">Malaysia specialty coffee guide</a> explains how the Klang Valley fits into the bigger picture.</p>
<h2 id="pj-vs-kl">Is PJ a separate scene from KL?</h2>
<p>Not in any way that matters to your cup. Petaling Jaya, Subang and the rest of Selangor are part of the Klang Valley, and the coffee scene treats the whole valley as one connected region. Roasters supply across the boundary, home brewers shop on both sides of it, and delivery times are similar throughout.</p>
<p>So if you are in PJ, you are not limited to PJ roasters. Many of the roasters in our <a href="/posts/kl-roasters">Kuala Lumpur roaster guide</a> deliver across the valley, and several are based in PJ and Subang to begin with. Treat KL and PJ as one shopping area.</p>
<p>The one practical advantage of being in PJ is collection. If a roaster you like has its roastery in Petaling Jaya or Subang, picking the bag up yourself often gets you the freshest possible coffee and saves the courier wait. It is a small thing, but for a coffee that is at its best within a few weeks of roasting, a couple of saved days is worth having.</p>
<h2 id="where-to-buy-pj">Where to buy in PJ and Selangor</h2>
<div class="info-card">
<h4>Three routes</h4>
<ul>
<li><strong>Direct from the roastery:</strong> in person or via the roaster's website — the freshest option and the most direct support.</li>
<li><strong>Online marketplaces:</strong> convenient and broad, though beans may sit longer before shipping.</li>
<li><strong>A directory like The Beans Hub:</strong> compare PJ and Selangor roasters next to the rest of Malaysia, filter by taste and roast style, then order from the roaster.</li>
</ul>
</div>
<p>Whichever route you pick, the same advice applies: buy whole beans, check the roast date, and match the roast level to your brew method.</p>
<h2 id="what-to-check">What to check before you buy</h2>
<p>Because the Klang Valley gives you so much choice, a short checklist keeps you from being overwhelmed. It is the same checklist wherever you buy, but it is especially useful here where you could easily end up with five roasters open in five browser tabs.</p>
<div class="info-card">
<h4>A quick checklist</h4>
<ul>
<li><strong>Roast date on the bag:</strong> aim to brew within roughly two to four weeks of it.</li>
<li><strong>Whole beans, not pre-ground:</strong> grind at home, just before brewing.</li>
<li><strong>Roast level matched to your brewer:</strong> lighter for filter and pour-over, medium to medium-dark for espresso and milk drinks.</li>
<li><strong>An origin or processing style you already enjoy:</strong> a sensible anchor before you start experimenting.</li>
</ul>
</div>
<p>The full version of this checklist, with the reasoning behind each point, is in the <a href="/posts/best-coffee-beans-malaysia">2026 buying guide</a>.</p>
<h2 id="delivery-across-selangor">Delivery across Selangor</h2>
<p>Delivery is rarely a problem in Selangor. The Klang Valley has dense courier coverage, so beans ordered from a PJ or Subang roaster usually arrive quickly, and most roasters ship nationwide as well. Roasted coffee is at its best within roughly two to four weeks of the roast date, so the short delivery times here work in your favour — order, brew, and you are well inside the window.</p>
<p>When you are ready to actually choose a bag, the <a href="/posts/best-coffee-beans-malaysia">2026 buying guide</a> runs through the criteria that separate a good bag from an average one.</p>
<div class="callout">
<p class="callout-title">📍 Ready to browse?</p>
<p>Browse beans from PJ, Selangor and the rest of Malaysia in the full <a href="/shop">coffee bean catalogue</a>.</p>
</div>
`
});

/* ===== 4. PENANG ===== */
pages.push({
  slug:'specialty-coffee-penang',
  title:"Specialty Coffee in Penang: Where to Buy Beans | The Beans Hub",
  desc:"Penang's specialty coffee scene for home brewers — what makes it distinct, whether it is café-led or roaster-led, and where to buy freshly roasted beans.",
  h1:"Specialty Coffee in Penang: Roasters and Where to Buy Beans",
  breadcrumb:"Specialty Coffee in Penang",
  badgeClass:"badge-local", badgeIcon:"📍", badgeLabel:"Local Guide",
  banner:"🌴", readTime:6,
  tags:["Penang","Coffee Beans","Where to Buy","Specialty Coffee","Local Guide"],
  toc:[
    {id:"penang-scene",label:"What makes Penang distinct"},
    {id:"cafe-led-or-roaster-led",label:"Café-led or roaster-led?"},
    {id:"what-to-expect",label:"What to expect from Penang beans"},
    {id:"where-to-buy-penang",label:"Where to buy in Penang"},
    {id:"ordering-from-penang",label:"Ordering Penang beans"},
    {id:"faq",label:"FAQ"}
  ],
  more:[
    {href:"/posts/specialty-coffee-beans-kl",emoji:"🏙️",title:"Where to Buy Specialty Coffee Beans in KL",meta:"6 min read"},
    {href:"/posts/buy-coffee-beans-online-malaysia",emoji:"📦",title:"How to Buy Coffee Beans Online in Malaysia",meta:"6 min read"},
    {href:"/posts/specialty-coffee-malaysia",emoji:"☕",title:"Specialty Coffee in Malaysia: A Home Brewer's Guide",meta:"10 min read"}
  ],
  next:{href:"/posts/buy-coffee-beans-online-malaysia",label:"Read: How to Buy Coffee Beans Online in Malaysia"},
  faq:[
    {q:"Where can I buy specialty coffee beans in Penang?",
     a:"You can buy specialty coffee beans in Penang directly from roasteries and cafés that package retail bags, through their websites and online marketplaces, or through The Beans Hub, which lists Penang roasters alongside the rest of Malaysia so you can compare and order in one place."},
    {q:"What makes the Penang coffee scene distinct?",
     a:"Penang has a mature, café-driven coffee culture, and a growing number of those cafés and roasters now sell retail bags for home brewing. The scene tends to be tied closely to the island's strong food and café culture rather than being purely roaster-led."},
    {q:"Do Penang roasters ship beans nationwide?",
     a:"Many do. If you are outside Penang, ordering directly from a Penang roaster's website usually gets you fresh beans shipped nationwide, and a directory like The Beans Hub makes it easier to find which roasters ship."},
    {q:"Is Penang coffee café-led or roaster-led?",
     a:"It is more café-led than KL's scene, which is heavily roaster-led, but the line is blurring. More Penang cafés are roasting in-house and packaging beans, so home brewers have more retail options than they used to."}
  ],
  body:`
<p>Penang is known for its food, and coffee has become part of that reputation. The island has a mature café culture and a specialty scene that keeps growing — which is good news for home brewers, because more of those cafés and roasters now sell beans to take home. Here is how to navigate it.</p>
<h2 id="penang-scene">What makes the Penang scene distinct</h2>
<p>Penang's specialty coffee scene grew up alongside its café culture rather than separately from it. The island has long taken eating and drinking out seriously, and specialty coffee slotted naturally into that. The result is a scene that feels closely tied to its cafés, with a strong sense of place.</p>
<p>For a home brewer, the practical difference from the Klang Valley is that Penang's beans have often been a café experience first and a retail product second. That is changing — more roasters are packaging bags specifically for home brewing — but it is worth knowing as you look. For the national context, the <a href="/posts/specialty-coffee-malaysia">Malaysia specialty coffee guide</a> sets out where Penang fits.</p>
<p>There is an upside to a scene that grew out of cafés. The bar for what tastes good tends to be set in public, cup by cup, in front of customers who will simply go elsewhere if the coffee is poor. That feedback loop has pushed Penang's better roasters to be consistent, and consistency is exactly what you want in a bag you brew at home every morning.</p>
<h2 id="cafe-led-or-roaster-led">Café-led or roaster-led?</h2>
<p>It helps to think about the difference between a café-led scene and a roaster-led one. KL's scene, covered in our <a href="/posts/kl-roasters">Kuala Lumpur roaster guide</a>, is heavily roaster-led: many businesses exist primarily to roast and sell beans. Penang leans more café-led, where the coffee is part of a wider sit-down experience.</p>
<p>That line is blurring, though. A growing number of Penang cafés roast in-house and package retail bags, and some dedicated roasters have opened. So while the culture is café-first, the retail options for home brewers are wider than they were a few years ago.</p>
<h2 id="what-to-expect">What to expect from Penang beans</h2>
<p>Penang roasters work with the same global origins as the rest of the country — Ethiopian, Colombian, Brazilian, Indonesian and more — so there is no single &ldquo;Penang flavour&rdquo;. What you do tend to find is a scene shaped by café palates. Beans are often roasted with the espresso bar and milk drinks in mind, because that is what the cafés serve, which means plenty of approachable medium and medium-dark roasts alongside the lighter filter lots.</p>
<p>For a home brewer, that is useful to know when you choose. If you brew espresso or milk drinks, a Penang roaster's house style may suit you straight away. If you are a dedicated pour-over drinker, it is still worth checking the roast level on the bag rather than assuming. Our guide to <a href="/posts/light-vs-medium-vs-dark-roast">light, medium and dark roast</a> explains why that match matters.</p>
<h2 id="where-to-buy-penang">Where to buy in Penang</h2>
<div class="info-card">
<h4>Three routes</h4>
<ul>
<li><strong>Direct from a roastery or roasting café:</strong> in person or via their website — usually the freshest beans.</li>
<li><strong>Online marketplaces:</strong> convenient, with broad selection.</li>
<li><strong>A directory like The Beans Hub:</strong> find Penang roasters that package retail bags, compare them with the rest of Malaysia, and order from the roaster.</li>
</ul>
</div>
<p>Because Penang's scene is café-led, it is worth checking whether a café roasts its own beans and sells bags — many that do will not make it obvious unless you ask or look at their online store. A quick look for a roast date, origin details and an online shop usually tells you whether a café is also a roaster worth buying from.</p>
<h2 id="ordering-from-penang">Ordering Penang beans from anywhere</h2>
<p>You do not need to be on the island to drink Penang coffee. Many Penang roasters ship nationwide, so ordering directly from a roaster's website is a reliable way to get fresh beans wherever you are. If you are in the Klang Valley, that means a Penang bag is just as accessible to you as a local one — the same is true in reverse, as our <a href="/posts/specialty-coffee-beans-kl">KL guide</a> explains.</p>
<p>If you are buying online generally, our guide on <a href="/posts/buy-coffee-beans-online-malaysia">how to buy coffee beans online in Malaysia</a> covers how to judge freshness before you order, and the <a href="/posts/specialty-coffee-malaysia">Malaysia specialty coffee guide</a> puts the whole national picture together. As always, check the roast date, buy whole beans, and brew within roughly two to four weeks for the best cup.</p>
<p>One last suggestion if you do visit Penang: treat the cafés as research. Drink something you like at the counter, then ask whether they sell the same beans by the bag. A scene built around cafés rewards that kind of curiosity, and it is often the quickest way to find a roaster whose style genuinely suits you.</p>
<div class="callout">
<p class="callout-title">📍 Ready to browse?</p>
<p>Find Penang roasters and the rest of Malaysia's beans in the full <a href="/shop">coffee bean catalogue</a>.</p>
</div>
`
});

/* ===== 5. BUY ONLINE ===== */
pages.push({
  slug:'buy-coffee-beans-online-malaysia',
  title:"How to Buy Coffee Beans Online in Malaysia | The Beans Hub",
  desc:"A guide to buying specialty coffee beans online in Malaysia — judging freshness before you order, roaster sites versus marketplaces, and nationwide delivery.",
  h1:"How to Buy Coffee Beans Online in Malaysia",
  breadcrumb:"Buy Coffee Beans Online in Malaysia",
  badgeClass:"badge-guide", badgeIcon:"📦", badgeLabel:"Guide",
  banner:"📦", readTime:6,
  tags:["Buy Online","Coffee Beans","Malaysia","Delivery","Specialty Coffee"],
  toc:[
    {id:"why-buy-online",label:"Why buy beans online"},
    {id:"judging-freshness-online",label:"Judging freshness online"},
    {id:"roaster-sites-vs-marketplaces",label:"Roaster sites vs marketplaces"},
    {id:"subscriptions-and-cadence",label:"Subscriptions and buying cadence"},
    {id:"delivery-across-malaysia",label:"Delivery across Malaysia"},
    {id:"faq",label:"FAQ"}
  ],
  more:[
    {href:"/posts/best-coffee-beans-malaysia",emoji:"🏆",title:"Best Coffee Beans in Malaysia: A 2026 Buying Guide",meta:"8 min read"},
    {href:"/posts/malaysia-coffee-brands-roasters",emoji:"🔥",title:"Malaysian Coffee Brands and Roasters: Independent vs Commercial",meta:"8 min read"},
    {href:"/posts/specialty-coffee-malaysia",emoji:"☕",title:"Specialty Coffee in Malaysia: A Home Brewer's Guide",meta:"10 min read"}
  ],
  next:{href:"/posts/malaysia-coffee-brands-roasters",label:"Read: Malaysian Coffee Brands and Roasters"},
  faq:[
    {q:"How do I buy fresh coffee beans online in Malaysia?",
     a:"Buy from roasters that print a roast date, order whole beans rather than pre-ground, and choose sellers that roast close to dispatch. Buying directly from a roaster's own website, or through a directory like The Beans Hub that links you to the roaster, generally gets you fresher beans than slow-moving marketplace stock."},
    {q:"How can I judge coffee freshness before ordering?",
     a:"Look for a clearly stated roast date rather than only an expiry date, check whether the roaster roasts to order or in small frequent batches, and read the origin and processing details. A roaster that shares this information is usually one that handles freshness well."},
    {q:"Is it better to buy from a roaster's website or a marketplace?",
     a:"Buying directly from a roaster's website usually means fresher stock and more direct support for the roaster. Marketplaces are convenient and let you check out from several roasters at once, but beans can sit in storage longer. Many home brewers use both."},
    {q:"Can coffee beans be delivered anywhere in Malaysia?",
     a:"Yes. Most Malaysian specialty roasters ship nationwide, so you can order beans from KL, Penang, Johor or anywhere else and have them delivered. Delivery is usually fast enough to keep beans well within their freshness window."}
  ],
  body:`
<p>For a lot of Malaysian home brewers, buying beans online is the default — and it makes sense. You get access to roasters across the whole country, not just the ones near you. The one thing online buying asks of you is a little more care about freshness, because you cannot pick up the bag and check the roast date yourself. This guide covers how to do it well.</p>
<h2 id="why-buy-online">Why buy beans online</h2>
<p>The case for buying online is mostly about reach. A home brewer in a smaller town is no longer limited to whatever is stocked locally. You can order a washed Ethiopian from a KL roaster, a liberica from a Johor farm, and a Penang roaster's house blend, all in the same week. Online buying turns Malaysia's whole roaster scene into your local shop.</p>
<p>It is also how The Beans Hub is built to work. Rather than checking dozens of roaster sites one by one, you can browse more than 700 beans from over 40 Malaysian roasters in one place, then order from whichever roaster fits. The <a href="/posts/specialty-coffee-malaysia">Malaysia specialty coffee guide</a> gives the wider context for how the scene is organised.</p>
<p>The other quiet benefit is that online buying lets you support roasters you would otherwise never reach. A small roaster in Ipoh or Kuching does not need a shopfront in your city to earn your order — it just needs to ship. For the roasters, that widens their market; for you, it widens your choice. Both sides win, which is rare enough to be worth pointing out.</p>
<h2 id="judging-freshness-online">Judging freshness before you order</h2>
<p>This is the skill that matters most when you cannot hold the bag. A few signals do most of the work.</p>
<div class="info-card">
<h4>Freshness signals to look for</h4>
<ul>
<li><strong>A stated roast date:</strong> the single most important one. A roaster that prints a roast date is a roaster that expects you to care.</li>
<li><strong>Roast-to-order or small batches:</strong> roasters who roast close to dispatch ship fresher coffee than those holding large stock.</li>
<li><strong>Whole beans, not pre-ground:</strong> whole beans hold their aromatics far longer. Grind at home, just before brewing.</li>
<li><strong>Clear origin and processing details:</strong> a roaster sharing this is usually one paying attention to the whole chain.</li>
</ul>
</div>
<p>Roasted coffee is at its best within roughly two to four weeks of the roast date. It does not spoil after that, but the aromatics fade. So you are aiming to order beans that will reach you, and get brewed, well inside that window.</p>
<p>It is also worth knowing what tends to go wrong, so you can avoid it. The two common problems with online buying are stale stock — beans that sat too long before shipping — and ordering more than you can drink in time. Both are easy to dodge. Favour roasters who show a roast date and roast frequently, and buy in bag sizes you will realistically finish within a month rather than stocking up because the shipping felt worth it.</p>
<h2 id="roaster-sites-vs-marketplaces">Roaster sites versus marketplaces</h2>
<p>There are two main ways to check out online, and they trade off differently.</p>
<p>Buying directly from a roaster's own website usually gets you the freshest stock — often roasted to order — and the most direct support for the business. The trade-off is that you check out separately with each roaster. Marketplaces solve that by putting many roasters in one cart, which is convenient, but stock can sit longer in a warehouse before it ships.</p>
<p>A directory sits usefully between the two: you compare beans from many roasters in one view, then order from the roaster directly so you still get fresh stock. Whichever you choose, the guide to <a href="/posts/malaysia-coffee-brands-roasters">Malaysian coffee brands and roasters</a> helps you judge who you are buying from, and the <a href="/posts/best-coffee-beans-malaysia">2026 buying guide</a> covers how to pick the bag itself.</p>
<h2 id="subscriptions-and-cadence">Subscriptions and buying cadence</h2>
<p>Once you know roughly how much coffee you drink, it is worth thinking about cadence — how often you buy — rather than treating every order as a one-off. Many Malaysian roasters offer subscriptions, where a fresh bag arrives on a set schedule. The appeal is that you are never out of coffee and never drinking stale beans, because the timing is built around freshness.</p>
<p>Subscriptions are not the only way to get the cadence right, though. The simpler version is to work out your weekly consumption, buy a bag size that lasts about three to four weeks, and reorder before you run out. A rough guide: at a typical dose of 15 to 18 grams per cup, a 250g bag is roughly 14 to 16 cups, so a daily drinker moves through one in about two weeks. Whichever approach you take, the goal is the same — a steady supply of beans that are always inside their best window.</p>
<h2 id="delivery-across-malaysia">Delivery across Malaysia</h2>
<p>Delivery is rarely the obstacle it once was. Most Malaysian specialty roasters ship nationwide, and courier coverage is good enough that beans ordered from KL, Penang or Johor Bahru reach the rest of the country quickly — usually well within the freshness window. If you are ordering to a specific city, our city guides for <a href="/posts/specialty-coffee-beans-kl">KL</a>, <a href="/posts/specialty-coffee-beans-pj-selangor">PJ and Selangor</a> and <a href="/posts/specialty-coffee-penang">Penang</a> cover the local picture.</p>
<div class="callout">
<p class="callout-title">📦 Ready to order?</p>
<p>Browse the full <a href="/shop">coffee bean catalogue</a>, filter by taste and roast style, and order directly from Malaysian roasters.</p>
</div>
`
});

/* ===== 6. BRANDS / ROASTERS ===== */
pages.push({
  slug:'malaysia-coffee-brands-roasters',
  title:"Malaysian Coffee Brands & Roasters Explained | The Beans Hub",
  desc:"Commercial coffee brands vs independent Malaysian roasters — why small-batch matters, how to spot a quality roaster, and where to find them in one place.",
  h1:"Malaysian Coffee Brands and Roasters: Independent vs Commercial",
  breadcrumb:"Malaysian Coffee Brands & Roasters",
  badgeClass:"badge-guide", badgeIcon:"🔥", badgeLabel:"Guide",
  banner:"🔥", readTime:8,
  tags:["Coffee Roasters","Malaysia","Coffee Brands","Specialty Coffee","Buying Guide"],
  toc:[
    {id:"commercial-vs-independent",label:"Commercial vs independent"},
    {id:"why-small-batch-matters",label:"Why small-batch matters"},
    {id:"how-roasters-specialise",label:"How roasters specialise"},
    {id:"how-to-spot-a-quality-roaster",label:"How to spot a quality roaster"},
    {id:"the-malaysian-roaster-landscape",label:"The Malaysian roaster landscape"},
    {id:"the-discovery-problem",label:"Why discovery is the real problem"},
    {id:"faq",label:"FAQ"}
  ],
  more:[
    {href:"/posts/best-coffee-beans-malaysia",emoji:"🏆",title:"Best Coffee Beans in Malaysia: A 2026 Buying Guide",meta:"8 min read"},
    {href:"/posts/kl-roasters",emoji:"🏙️",title:"Best Specialty Coffee Roasters in Kuala Lumpur",meta:"8 min read"},
    {href:"/posts/arabica-robusta-liberica",emoji:"🌱",title:"Arabica vs Robusta vs Liberica — What's the Difference?",meta:"5 min read"}
  ],
  next:{href:"/posts/best-coffee-beans-malaysia",label:"Read: Best Coffee Beans in Malaysia"},
  faq:[
    {q:"What is the difference between a commercial coffee brand and an independent roaster?",
     a:"Commercial brands are usually large, widely distributed and built around consistency at scale, often using commercial-grade beans and dark roasts that hide variation. Independent roasters are small-batch businesses that roast specialty-grade beans in smaller quantities, print roast dates, and share origin and processing details. They are aimed at people who want flavour and traceability rather than just availability."},
    {q:"Why do small-batch roasters make better coffee for home brewers?",
     a:"Small-batch roasters roast more frequently in smaller quantities, so the beans you receive are usually fresher. They also tend to source specialty-grade coffee, share where it comes from, and roast to highlight origin character rather than to mask it. For a home brewer who controls the grind and brew, that gives you more to work with."},
    {q:"How can I tell if a Malaysian roaster is any good?",
     a:"Look for a printed roast date on the bag, clear origin information, the processing method and roast level, and tasting notes. A roaster that shares this detail and roasts in small, frequent batches is usually one that takes quality seriously. Reputation among other roasters and home brewers is another useful signal."},
    {q:"Where can I find all Malaysian coffee roasters in one place?",
     a:"The Beans Hub lists more than 700 beans from over 40 Malaysian roasters in one directory, so instead of finding roasters one by one through Instagram or word of mouth, you can compare them side by side and order directly from the roaster."}
  ],
  body:`
<p>When people say &ldquo;Malaysian coffee brand&rdquo;, they could mean two very different things — a large commercial label you have seen on supermarket shelves for years, or a small independent roaster working out of a unit in PJ. Both are coffee businesses. They are aimed at almost opposite customers. If you are a home brewer, knowing the difference saves you money and disappointment.</p>
<h2 id="commercial-vs-independent">Commercial brands vs independent roasters</h2>
<p>Commercial coffee brands are built around scale and consistency. They distribute widely, they roast in large volumes, and they are designed so that every tin tastes the same as the last one — which usually means commercial-grade beans and darker roasts that flatten out any variation. There is nothing wrong with that. It is simply built for convenience and predictability, not for flavour exploration.</p>
<p>Independent specialty roasters are built around something else. They roast in small batches, they tend to source specialty-grade beans, and they put information on the bag — roast date, origin, processing method, tasting notes — because their customers want it. The trade-off is that they are less widely distributed, and their coffees change with the seasons. Neither model is wrong. They are answers to different questions, and knowing which question you are asking is most of the decision.</p>
<div class="info-card">
<h4>The quick contrast</h4>
<ul>
<li><strong>Commercial brand:</strong> widely available, consistent, commercial-grade, usually darker roasted, little origin detail.</li>
<li><strong>Independent roaster:</strong> small-batch, fresher, specialty-grade, roast date and origin shared, rotating selection.</li>
</ul>
</div>
<h2 id="why-small-batch-matters">Why small-batch matters for home brewers</h2>
<p>Small-batch roasting is not a marketing phrase — it changes what reaches your kitchen. A roaster working in small, frequent batches is roasting closer to when you actually buy, so the beans arrive fresher. Roasted coffee is at its best within roughly two to four weeks of the roast date, and a small roaster is far more likely to get a bag to you inside that window than a large brand with a long supply chain.</p>
<p>Small batches also let a roaster make decisions per coffee. A washed Ethiopian and a natural Brazilian want different roast approaches, and a small roaster can give each one its own. That is part of why independent beans show their <a href="/posts/arabica-robusta-liberica">origin and varietal</a> character so clearly — the roasting is working with the bean rather than over it.</p>
<p>There is a trade-off, and it is worth being honest about it. Independent roasters change their line-up with the seasons, so the exact bag you loved may not be there next month. Commercial brands win on pure consistency and availability. For a home brewer who enjoys variety, the rotating selection is a feature rather than a bug — but if you want the identical cup every single time, a commercial brand is built for that and an independent roaster is not.</p>
<h2 id="how-roasters-specialise">How roasters specialise</h2>
<p>Independent roasters are not all trying to do the same thing, and recognising that makes choosing far easier. Over time, most develop a focus.</p>
<div class="info-card">
<h4>Common roaster focuses</h4>
<ul>
<li><strong>Classic single origins:</strong> dependable washed and natural lots from established origins, roasted for everyday drinking.</li>
<li><strong>Experimental processing:</strong> anaerobic, honey and fermented lots for people who want the unusual end of specialty coffee.</li>
<li><strong>Espresso and milk-drink roasts:</strong> blends and roasts built to taste good as a shot or with milk.</li>
<li><strong>Malaysian liberica:</strong> roasters championing the country's own coffee, often with farm-level provenance.</li>
<li><strong>Filter-focused light roasts:</strong> bright, origin-forward coffees aimed at pour-over and AeroPress brewers.</li>
</ul>
</div>
<p>None of these is better than the others — they serve different drinkers. The useful move is to work out what you brew and what you like to taste, then look for a roaster whose focus matches. A filter drinker will be happier with a filter-focused roaster than with an espresso specialist, however good the espresso specialist is. The <a href="/posts/best-coffee-beans-malaysia">2026 buying guide</a> helps you pin down your own preferences.</p>
<h2 id="how-to-spot-a-quality-roaster">How to spot a quality roaster</h2>
<p>You do not need to be an expert to judge a roaster. The packaging and website tell you most of what you need.</p>
<div class="info-card">
<h4>Signs of a roaster that takes quality seriously</h4>
<ul>
<li><strong>A printed roast date</strong> on every bag — not just a generic expiry date.</li>
<li><strong>Clear origin information</strong> — country, and ideally region or farm.</li>
<li><strong>Processing method and roast level</strong> stated, so you can match the bean to how you brew.</li>
<li><strong>Honest tasting notes</strong> — specific, not just &ldquo;rich and bold&rdquo;.</li>
<li><strong>Small, frequent batches</strong> rather than large standing stock.</li>
</ul>
</div>
<p>Reputation helps too. A roaster that other roasters and experienced home brewers speak well of is usually worth trying. Our <a href="/posts/kl-roasters">Kuala Lumpur roaster guide</a> is one place to start, and the <a href="/posts/best-coffee-beans-malaysia">2026 buying guide</a> covers how to choose the bag once you have found the roaster.</p>
<h2 id="the-malaysian-roaster-landscape">The Malaysian roaster landscape</h2>
<p>The independent roaster scene in Malaysia is genuinely deep. There are dozens of small-batch specialty roasters across the country, from the Klang Valley to Penang to Johor Bahru, and many sell online so location is no longer a barrier. Some specialise in particular origins, some in particular processing styles, and a number champion Malaysian-grown liberica. For a home brewer, that depth means you are never short of something new to try — the only real task is finding it.</p>
<p>Geography matters less than it used to, as well. Because most independent roasters ship nationwide, a home brewer anywhere in Malaysia effectively has access to all of them. The old constraint — buy whatever the nearest shop stocks — has mostly gone.</p>
<h2 id="the-discovery-problem">Why discovery is the real problem</h2>
<p>If quality is not the issue and shipping is not the issue, what is left? Discovery. The genuine difficulty in Malaysian specialty coffee is simply finding the roasters and comparing them.</p>
<p>Think about what it currently takes. Each roaster has its own website, its own marketplace listings and its own Instagram, and there is no shared format. One roaster lists tasting notes prominently, another buries them. One shows roast dates, another does not. To compare five roasters fairly you would have five tabs open, each laid out differently, and you would still be guessing. That friction is why so many home brewers end up loyal to the first decent roaster they find — not because it is the best fit, but because looking further is tedious.</p>
<p>The Beans Hub exists to remove that friction. It brings more than 700 beans from over 40 Malaysian roasters into one directory with a consistent format, so you can filter by taste, roast style and origin, compare like with like, and then order directly from the roaster. The roaster still gets your order and your support — you just spend your time choosing rather than hunting. If you would rather understand the buying decision before the roaster decision, the guide to <a href="/posts/buy-coffee-beans-online-malaysia">buying coffee beans online in Malaysia</a> is a good next read, and the <a href="/posts/specialty-coffee-malaysia">Malaysia specialty coffee guide</a> gives the full overview.</p>
<div class="callout">
<p class="callout-title">🔥 See them in one place</p>
<p>Compare Malaysian roasters side by side in the full <a href="/shop">coffee bean catalogue</a>.</p>
</div>
`
});

/* ===== 7. BEST COFFEE BEANS ===== */
pages.push({
  slug:'best-coffee-beans-malaysia',
  title:"Best Coffee Beans in Malaysia: A 2026 Buying Guide | The Beans Hub",
  desc:"How to choose the best coffee beans in Malaysia — five buying criteria that matter, local versus imported-and-roasted, and matching roast level to your brew.",
  h1:"Best Coffee Beans in Malaysia: A 2026 Buying Guide",
  breadcrumb:"Best Coffee Beans in Malaysia",
  badgeClass:"badge-guide", badgeIcon:"🏆", badgeLabel:"Guide",
  banner:"🏆", readTime:8,
  tags:["Best Coffee Beans","Malaysia","Buying Guide","Home Brewing","Specialty Coffee"],
  toc:[
    {id:"what-best-means",label:"What “best” actually means"},
    {id:"five-buying-criteria",label:"Five buying criteria"},
    {id:"origin-quick-reference",label:"An origin quick reference"},
    {id:"local-vs-imported",label:"Local vs imported-and-roasted"},
    {id:"matching-roast-to-brew",label:"Matching roast to your brew"},
    {id:"taste-then-adjust",label:"Taste, then adjust"},
    {id:"faq",label:"FAQ"}
  ],
  more:[
    {href:"/posts/light-vs-medium-vs-dark-roast",emoji:"🔥",title:"Light vs Medium vs Dark Roast — What's the Difference?",meta:"7 min read"},
    {href:"/posts/how-to-read-flavour-notes",emoji:"🫐",title:"How to Read Flavour Notes in Coffee (Without Feeling Lost)",meta:"6 min read"},
    {href:"/posts/malaysia-coffee-brands-roasters",emoji:"🔥",title:"Malaysian Coffee Brands and Roasters: Independent vs Commercial",meta:"8 min read"}
  ],
  next:{href:"/posts/specialty-coffee-malaysia",label:"Read: Specialty Coffee in Malaysia"},
  faq:[
    {q:"What are the best coffee beans to buy in Malaysia?",
     a:"There is no single best bag — the best coffee beans for you depend on how you brew and what you like to taste. The reliable approach is to choose by criteria rather than by brand: a recent roast date, a roast level that matches your brew method, an origin whose flavour profile you enjoy, a processing method you like, and a fair price for the quality. This guide walks through each one."},
    {q:"Should I buy local Malaysian beans or imported beans roasted in Malaysia?",
     a:"Both are good options. Malaysia grows liberica and some robusta, which are worth trying as a local experience. Most specialty arabica sold here is imported as green beans and roasted locally, which is completely normal — what matters is that a Malaysian roaster has roasted it carefully and recently. Buying from a local roaster beats supermarket beans either way."},
    {q:"How fresh should coffee beans be?",
     a:"Look for a roast date and aim to brew within roughly two to four weeks of it. Coffee does not spoil after that, but the aromatics fade and the cup flattens. Buy whole beans rather than pre-ground, since whole beans hold their freshness much longer."},
    {q:"What roast level is best for home brewing?",
     a:"It depends on your method. Light to medium roasts suit pour-over and filter brewing, where you want clarity and origin character. Medium to medium-dark roasts suit espresso and milk drinks, where you want body and sweetness. Match the roast level to how you brew rather than chasing one ideal."}
  ],
  body:`
<p>&ldquo;What are the best coffee beans in Malaysia?&rdquo; is one of the most common questions home brewers ask, and the honest answer is that it depends on you. There is no single best bag. But there is a reliable way to choose, and once you know the criteria, you can walk into any roaster's catalogue and pick well. This guide is that framework, updated for 2026.</p>
<h2 id="what-best-means">What &ldquo;best&rdquo; actually means</h2>
<p>The reason brand rankings rarely help is that &ldquo;best&rdquo; is not a fixed property of a coffee. The best bag for an espresso drinker who takes milk is different from the best bag for someone with a V60 and a light-roast habit. The best bag in January is different from the best bag in June, because specialty coffee is seasonal and roasters rotate their offerings.</p>
<p>So instead of asking which brand is best, ask which bag is best for how you brew and what you like to taste. That turns an impossible question into a series of answerable ones — which is what the rest of this guide is.</p>
<p>This also means you can ignore most &ldquo;top 10 beans&rdquo; lists. They are usually a snapshot of one writer's taste at one moment, and the bags they name may already be sold out or out of season. A set of criteria you can apply yourself is worth far more, because it keeps working every time you shop.</p>
<h2 id="five-buying-criteria">Five buying criteria that matter</h2>
<p>These are the five things worth checking on any bag, in roughly the order they matter.</p>
<div class="info-card">
<h4>1. Roast date</h4>
<p>The most important and most overlooked. Roasted coffee is at its best within roughly two to four weeks of the roast date. A bag with no roast date, only an expiry date, is telling you the roaster does not expect you to care — and you should.</p>
</div>
<div class="info-card">
<h4>2. Roast level</h4>
<p>Light, medium or dark. This should match your brew method, not your mood. Our guide to <a href="/posts/light-vs-medium-vs-dark-roast">light, medium and dark roast</a> goes deeper, and there is a section on matching roast to brew below.</p>
</div>
<div class="info-card">
<h4>3. Origin</h4>
<p>Different origins lean different ways — Ethiopian coffees toward floral and fruity, Brazilian toward chocolate and nuts, Colombian toward sweet and balanced. Pick an origin whose profile you already know you enjoy, then explore outward from there.</p>
</div>
<div class="info-card">
<h4>4. Processing method</h4>
<p>Washed, natural, honey or fermented. Processing shapes the cup as much as the origin does — washed coffees taste cleaner and brighter, naturals taste sweeter and fruitier. Reading the <a href="/posts/how-to-read-flavour-notes">tasting notes</a> alongside the process tells you a lot.</p>
</div>
<div class="info-card">
<h4>5. Price against quality</h4>
<p>Specialty coffee has a wide price range. A higher price can reflect a rarer origin, an experimental process or a competition-grade lot — or just a premium brand. Judge price against the information on the bag, not on its own.</p>
</div>
<p>If you only internalise one of these, make it the roast date. The other four shape what the coffee tastes like; the roast date decides whether you get to taste it properly at all.</p>
<h2 id="origin-quick-reference">An origin quick reference</h2>
<p>Origin is the criterion most people find hardest to use, because the names mean nothing until you have tasted a few. Here is a rough starting map. Treat it as a generalisation — every origin has range, and processing and roast level shift things — but it is enough to point you somewhere sensible.</p>
<div class="info-card">
<h4>What origins tend to taste like</h4>
<ul>
<li><strong>Ethiopia:</strong> floral and fruity, tea-like, bright. Washed lots lean citrus and jasmine; naturals lean blueberry and strawberry.</li>
<li><strong>Colombia:</strong> sweet, balanced, gently bright — caramel, milk chocolate, red apple. A safe first specialty bag.</li>
<li><strong>Brazil:</strong> chocolate, nuts, caramel, low acidity, smooth body. Built for espresso and milk drinks.</li>
<li><strong>Indonesia:</strong> earthy, full-bodied, low-acid — dark chocolate, cedar, herbal notes. Bold and savoury.</li>
<li><strong>Yunnan &amp; Thailand:</strong> nutty and gently sweet, with newer lots pushing toward stone fruit and citrus. Close-to-home origins.</li>
</ul>
</div>
<p>You can explore each of these on The Beans Hub — the <a href="/shop/ethiopia-coffee-beans">Ethiopia</a>, <a href="/shop/colombia%20coffee%20beans">Colombia</a>, <a href="/shop/brazil-coffee-beans">Brazil</a>, <a href="/shop/indonesia-coffee-beans">Indonesia</a> and <a href="/shop/yunnan-coffee-beans">Yunnan</a> category pages each collect what Malaysian roasters currently stock. And to make sense of the tasting notes once a bag arrives, our guide to <a href="/posts/how-to-read-flavour-notes">reading flavour notes</a> is the companion piece.</p>
<h2 id="local-vs-imported">Local beans vs imported-and-roasted</h2>
<p>A question that comes up a lot: should you buy Malaysian-grown coffee, or imported coffee roasted in Malaysia? Both are good answers.</p>
<p>Malaysia grows liberica — mainly in Johor and Pahang — along with some robusta in Sabah. Liberica in particular is worth trying as a genuine local experience, and our explainer on <a href="/posts/arabica-robusta-liberica">arabica, robusta and liberica</a> covers what makes it distinct. But most of the specialty arabica sold here is imported as green beans and roasted locally, and that is completely normal. The country is a roasting hub. What matters is that a Malaysian roaster has sourced it well, roasted it carefully and roasted it recently.</p>
<p>Either way, the comparison that really matters is local roaster against supermarket tin. A bag from a local Malaysian roaster — whatever the bean's origin — will almost always beat a mass-market tin on freshness, traceability and flavour. The guide to <a href="/posts/malaysia-coffee-brands-roasters">Malaysian coffee brands and roasters</a> explains why.</p>
<h2 id="matching-roast-to-brew">Matching roast level to your brew</h2>
<p>If you only take one practical rule from this guide, take this one: match the roast level to how you brew.</p>
<div class="info-card">
<h4>A simple starting point</h4>
<ul>
<li><strong>Pour-over, V60, filter, AeroPress:</strong> light to medium roasts, where clarity and origin character come through.</li>
<li><strong>Espresso and milk drinks:</strong> medium to medium-dark roasts, where you want body, sweetness and a forgiving shot.</li>
<li><strong>French press and moka pot:</strong> medium to medium-dark also works well, for body without harshness.</li>
</ul>
</div>
<p>This is a starting point, not a rule book — plenty of people pull light roasts on espresso and love it. But if you are buying for a specific brewer and want a high chance of a good cup, matching roast to method is the safest move. From there, the <a href="/posts/specialty-coffee-malaysia">Malaysia specialty coffee guide</a> and our city guides for <a href="/posts/specialty-coffee-beans-kl">KL</a>, <a href="/posts/specialty-coffee-beans-pj-selangor">PJ and Selangor</a> and <a href="/posts/specialty-coffee-penang">Penang</a> point you toward where to actually buy.</p>
<h2 id="taste-then-adjust">Taste, then adjust</h2>
<p>The criteria above get you a sensible bag. What turns a sensible bag into the best bag for you is the loop that comes after: brew it, pay attention, and adjust the next purchase based on what you noticed.</p>
<p>The adjustments are usually small. If a coffee tasted thin, your next bag could be a touch darker, or an origin with more body like Brazil or Indonesia. If it tasted flat or heavy, try lighter, or a brighter origin like Ethiopia. If it was good but you could not describe why, that is fine too — keep a one-line note on each bag, and within a few months you will have a clear picture of what you actually like, rather than what a guide told you that you should like.</p>
<p>That is the real answer to &ldquo;what are the best coffee beans in Malaysia&rdquo;. There is no fixed best bag, but there is a best next bag, and you find it by tasting your way toward it. The guide to <a href="/posts/malaysia-coffee-brands-roasters">Malaysian coffee brands and roasters</a> helps you choose who to buy that next bag from, and <a href="/posts/buy-coffee-beans-online-malaysia">buying online</a> covers getting it delivered fresh.</p>
<div class="callout">
<p class="callout-title">🏆 Put it to use</p>
<p>Browse the full <a href="/shop">coffee bean catalogue</a> and filter by roast style, taste and origin to find the bag that fits how you brew.</p>
</div>
`
});

// ---------------------------------------------------------------------------
// WRITE
// ---------------------------------------------------------------------------
let count = 0;
for (const p of pages){
  const html = render(p);
  fs.writeFileSync(path.join(OUT_DIR, p.slug + '.html'), html, 'utf8');
  // rough word count of body text
  const words = p.body.replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;
  console.log(`${p.slug}.html  —  ~${words} body words`);
  count++;
}
console.log(`\n${count} pages written to ${OUT_DIR}`);
