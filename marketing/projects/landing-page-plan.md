# Landing Page Plan — "Malaysia's Most Complete Specialty Coffee Directory"

**Goal (in priority order):** 1) capture the email, 2) prove the directory is the most complete one in Malaysia, 3) collect richer brewer data *after* the email via progressive profiling.
**Design weighting:** interactive directory hero is the hook; the email is the conversion. ~60% of design effort defends the email capture.
**Status:** spec for approval. No HTML built yet.

---

## 0. The strategic frame (read first)

This page has one irreversible job: **don't let a visitor leave without their email.** Everything else is reversible — they can come back and filter beans any time. They cannot un-bounce.

So the structure is: hook them with a working tool → give them a reason to hand over the email (their result) → collect everything else once they're already invested. We ask for **one field upfront (email)**. Brew method, roast preference, and budget come *after*, on the result/welcome step, where a progress bar and a personalised payoff pull them through.

Per your own growth playbook: *"If it doesn't serve [growing the list] or [moving towards a sale], cut it."* This plan is filtered through that.

---

## 1. Wireframe (top to bottom)

```
┌─────────────────────────────────────────────┐
│ NAV  (existing: Home · Coffee Beans · Library · About · Contact · [Explore Beans]) │
├─────────────────────────────────────────────┤
│ HERO — split layout                         │
│  LEFT: headline + subhead + email-first CTA │
│  RIGHT: LIVE filter demo (real beans react  │
│         as you tap taste-note chips)        │
│  ↳ trust strip: 851 beans · 52 roasters ·   │
│    100% Malaysian-roasted                    │
├─────────────────────────────────────────────┤
│ THE QUIZ HOOK (primary email capture)       │
│  "Find your 5 perfect beans in 30 seconds"  │
│  → 4 quick questions → email to reveal       │
├─────────────────────────────────────────────┤
│ PROOF — why "most complete"                  │
│  3 stat cards + logo wall of roaster names  │
├─────────────────────────────────────────────┤
│ HOW IT WORKS — Browse · Filter · Buy Direct │
│  (uses your existing /img/beanshub-icons)   │
├─────────────────────────────────────────────┤
│ DISCOVERY STRIP — taste-note categories as  │
│  clickable chips → deep-link into /shop     │
├─────────────────────────────────────────────┤
│ SECONDARY EMAIL CAPTURE (for scrollers who  │
│  skipped the quiz) — "New beans weekly"     │
├─────────────────────────────────────────────┤
│ FOOTER (existing)                            │
└─────────────────────────────────────────────┘
```

Two capture points, one offer. A visitor either takes the quiz (rich) or the plain newsletter box (email only). Either way you get the email.

---

## 2. Section-by-section copy

### HERO

**Headline (H1, contains target keyword):**
> Malaysia's most complete specialty coffee directory.

**Subhead:**
> 851 beans. 52 local roasters. One place to find your next bag — by taste, roast, origin and process. Then buy straight from the roaster.

**CTA (email-first):**
- Input placeholder: `your@email.com`
- Button: **Match me to my beans →**
- Microcopy under it: *"30-second taste quiz. No spam — just new Malaysian beans worth knowing."*

**Trust strip (under CTA):** `851 beans · 52 roasters · 100% Malaysian-roasted`

**RIGHT side — live filter demo:** a compact, working version of your /shop filter showing 4–6 real bean cards that visibly reshuffle when the visitor taps a taste-note chip (Fruity / Nutty-Cocoa / Floral / Sweet). This is the "wow" — not animation, *proof*. It says "most complete" by showing it. Pull from `beans.json` exactly like /shop does.

> **Voice check:** no "premium / artisanal / journey", light on exclamation marks. "worth knowing" not "BEST BEANS". ✔

---

### THE QUIZ HOOK (primary capture)

**Heading (H2, id="quiz"):** Find your 5 perfect Malaysian beans
**Sub:** Answer 4 quick questions. We'll match you to beans — and the roasters who make them — from across all 52.

**The 4 questions (answered *before* email — low friction, no typing, all taps):**

1. **How do you usually brew at home?**
   Espresso machine · Moka pot · V60 / pour-over · French press · Aeropress · I'm just starting out
2. **What flavours pull you in?** (pick up to 2)
   Fruity & bright · Chocolatey & nutty · Floral & tea-like · Sweet & caramel · Bold & roasty
3. **Roast level you reach for?**
   Light · Medium · Dark · Not sure — surprise me
4. **Rough budget per 200g bag?**
   Under RM50 · RM50–80 · RM80+ · Price isn't the deciding factor

**Then the gate:**
> **Your 5 matches are ready.** Pop in your email and we'll show them — plus send new beans that fit your taste as roasters release them.
> [ email field ] **[ Show my beans → ]**

This is the magic moment: they've already invested 4 taps, so the email feels like the last small step to a reward they can see coming. Far higher conversion than asking for email cold.

**After submit → result block (still on page, no reload needed):**
Show 5 real bean cards from `beans.json` filtered by their answers, each with a **Buy Now** button wired to `buy_click`. This *is* the progressive-profiling payoff — they gave you brew method + flavour + roast + budget, and got matched beans in return.

---

### PROOF — "why most complete"

**H2 (id="why"):** The whole Malaysian scene, in one place
Three stat cards (Sigmar numbers, your brand style):
- **851** beans catalogued
- **52** roasters, from KL to Sabah
- **8** taste-note families to filter by

Below: a quiet logo/name wall of roaster names (103 Coffee, Brewsmith, Cloud Catcher, Curate, Ghostbird… pulled from the data). Celebrating roasters by name is on-brand and makes "complete" tangible.

---

### HOW IT WORKS

**H2 (id="how"):** Browse → Filter → Buy direct
Three columns using your existing process icons (`/img/beanshub-icons/`):
- **Browse** every specialty bag roasted in Malaysia.
- **Filter** by taste, roast, origin, process until it's *your* shortlist.
- **Buy direct** from the roaster — we send you straight to their store.

One honest line that doubles as positioning: *"We don't sell coffee. We help you find it — then point you to the roaster."* (Sets up the affiliate model truthfully and makes leaving feel like the intended happy path.)

---

### DISCOVERY STRIP

**H2 (id="explore"):** Or just start exploring
Clickable taste-note chips → deep-link into the relevant `/shop` category pages (origin/process). Keeps the SEO category pages fed and gives non-quiz visitors a path deeper in.

---

### SECONDARY EMAIL CAPTURE

For people who scrolled past the quiz:
> **New Malaysian beans, every week.**
> 52 roasters drop new lots constantly. Get the ones worth your money in your inbox.
> [ email field ] **[ Keep me posted ]**

---

## 3. Progressive profiling — what you capture, and when

| Stage | Field | When |
|---|---|---|
| **Upfront (required)** | Email | At the quiz gate / newsletter box |
| **Captured *with* the email (no extra friction)** | Brew method, flavour prefs, roast level, budget | Already answered as quiz taps before the gate |
| **Later (email automation)** | Name, location/state, frequency of buying, favourite roaster | First welcome email or a 1-click follow-up survey |

Key point: because the 4 quiz questions are answered *before* the email gate, you capture a full taste profile **and** the email in a single submit — without ever showing a long form. That's how you get "as much info as possible" without tanking conversion.

**Data you'll have per subscriber after one quiz submit:** email + brew method + up to 2 flavour families + roast preference + budget band. That's enough to segment every newsletter and, later, to pitch the subscription box to the right people.

---

## 4. Technical / brand wiring (so the build drops straight in)

- **Static HTML**, single file, no build step — matches site convention.
- **Brand tokens only** — reuse `:root` vars (`--cream`, `--green`, `--accent` #FDA11D, etc.). No new colours.
- **Fonts:** existing Google Fonts link (Sigmar + Outfit). Sigmar for headline + stat numbers.
- **Nav + footer:** copy the existing markup exactly (Home · Coffee Beans · Coffee Library · About · Contact + orange "Explore Beans" CTA).
- **GA4:** include the `G-JY42YLKPRM` gtag snippet + google-site-verification meta.
- **Events to add (so you can measure this page):**
  - `buy_click` on every result-card Buy Now — params `bean_name`, `roaster`, `source:'landing'`.
  - `quiz_start`, `quiz_complete`, `email_submit` (source: `'quiz'` vs `'newsletter'`) — custom events so you can see the funnel in GA4.
- **Email backend — decision needed (see below).** The form needs somewhere to POST. Until then, JS can validate + store and fire the GA4 event, but emails won't persist.
- **Bean data:** `fetch('/beans.json')` for both the hero demo and the quiz results — same source as /shop, so it stays in sync.
- **SEO head:** unique title (~57–72 chars), meta description (~152–159), self-referencing canonical (www, no `.html`), OG + Twitter tags, robots index/follow.
- **Post-publish:** add the URL to `sitemap.xml`. If this *replaces* the homepage, no new route; if it's a separate page (e.g. `/find-your-beans`), add the route + sitemap entry.

---

## 5. The one blocker I can't decide for you

**There is no live email capture on the site yet** (CLAUDE.md §9 flags this as urgent). A beautiful quiz that has nowhere to send the email is theatre. Before/alongside the build, pick a backend:

- **Mailchimp / MailerLite / Brevo** — free tiers, hosted forms, easy. Fastest path.
- **ConvertKit / Beehiiv** — better if the newsletter is central to the plan.
- **Klaviyo** — heavier; worth it only if you're heading toward e-commerce/subscription automation soon. (You have a Klaviyo connector available.)

My read: **[Likely] MailerLite or Brevo** for now — free, fast, and you can migrate later. Don't let backend choice stall the build; the JS can be wired to swap in whichever you pick.

---

## 6. What I'd cut (so the page stays sharp)

- No hero video, no parallax, no auto-playing carousel — they slow load and distract from the email. The interactive filter *is* the spectacle.
- No social-proof testimonials yet (you're pre-revenue — fake or empty ones hurt more than help). Stats + roaster names carry the proof instead.
- No long "about us" copy on this page. One honest line about the model is enough.

---

## 7. Open questions before I build the HTML

1. **Is this the new homepage, or a separate landing page** (e.g. `/find-your-beans`)? Affects routing + sitemap.
2. **Email backend** — which provider? (Or build with a placeholder POST + working GA4 events, you wire the provider after.)
3. **Quiz result behaviour** — reveal beans inline on the same page (recommended), or redirect to a pre-filtered `/shop` view?
