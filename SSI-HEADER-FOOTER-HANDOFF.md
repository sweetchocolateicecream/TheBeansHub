# Shared header & footer via SSI — what it is, how to verify, next steps

## 1. The problem we're solving
Your header and footer are currently hard-coded into all 527 HTML pages. Changing a
nav link means editing 527 files. We're moving the header and footer into **one file
each**, so you edit once and every page updates.

## 2. What SSI is (plain English)
**SSI = Server-Side Includes.** Your web server reads a one-line instruction inside a
page —

    <!--#include virtual="/partials/header.html" -->

— and *before sending the page to the browser*, it pastes in the contents of
`/partials/header.html`. The visitor (and Google) receives one complete page. No
JavaScript, no flash, SEO-safe.

Key point: SSI only runs on a **live server**. Opening an HTML file straight off your
computer (a `file://...` address) will NOT process it — that's why the local test page
showed a blank middle. It must be tested at a real web address.

## 3. What's already been built (sitting in your repo, not yet pushed)
- `partials/header.html` — sitewide header (announce bar + nav + mobile menu), copied
  exactly from the homepage. Self-contained: carries its own CSS + JS.
- `partials/footer.html` — sitewide footer, copied exactly from the homepage.
- `.htaccess` — added the two lines that turn SSI on (see section 6).
- `robots.txt` — hides `/partials/` from search.
- `ssi-test/index.html` — a temporary, no-index test page that pulls in both partials.
- `ssi-test/preview-local.html` — a pre-assembled preview (already confirmed: brand is intact).

**Nothing on the live site has changed yet.** Only new/test files were added.

## 4. Next step — push and deploy (your setup: GitHub → Hostinger)
1. Have Claude Code commit and push these paths to GitHub:
   `partials/`, `ssi-test/`, `.htaccess`, `robots.txt`
2. Get Hostinger to pull the new commit:
   - hPanel → **Advanced → Git** → your repo → click **Deploy** (or **Pull**).
   - If you set up auto-deployment/webhook, it pulls on its own — give it a minute.

A ready-to-paste prompt for Claude Code is in section 7.

## 5. How to check whether your server runs SSI
After deploying, open this as a **typed web address** (not from your folder):

    https://www.thebeanshub.com/ssi-test

Three possible outcomes:

| What you see | Meaning | Action |
|---|---|---|
| The green nav on top + full footer below | ✅ SSI works | Tell me — I roll out to all 527 pages |
| A blank gap; "View Page Source" shows a raw `<!--#include ... -->` comment | SSI is **off** on the host | Section 6, then re-test |
| **500 Internal Server Error** | The `Options` line isn't allowed in `.htaccess` | Section 6 note, then re-test |

To view source: right-click the page → "View Page Source" → search for `#include`.
If the include got processed you'll see real `<nav>` HTML; if not, you'll see the raw comment.

## 6. If SSI is off (Hostinger specifics)
Hostinger shared hosting runs **LiteSpeed**, which supports SSI — it usually just needs
the `.htaccess` directives we added:

    Options +IncludesNOEXEC
    AddOutputFilter INCLUDES .html

- **If you got a 500 error:** some shared hosts forbid the `Options` line in `.htaccess`.
  Fix: delete the `Options +IncludesNOEXEC` line and re-test — LiteSpeed often parses
  SSI from the `AddOutputFilter` line alone. If it still doesn't work, message Hostinger
  support: *"Can you enable Server-Side Includes (SSI / mod_include, INCLUDES output
  filter) for .html files on my plan?"*
- **If you'd rather not rely on the host:** there's a JavaScript fallback that works
  everywhere — slightly worse for SEO, but functional. Say the word and I'll build it.

## 7. Paste this to Claude Code
> Commit and push only these paths to the GitHub repo for thebeanshub.com:
> `partials/header.html`, `partials/footer.html`, `.htaccess`, `robots.txt`,
> `ssi-test/index.html`, `ssi-test/preview-local.html`.
> Use commit message: "Add SSI shared header/footer partials + test page".
> Do NOT modify any other pages yet. After pushing, tell me the commit hash so I can
> trigger the Hostinger deploy and test https://www.thebeanshub.com/ssi-test.

## 8. After it's confirmed working
Report back to me (Cowork) what the `/ssi-test` URL showed. If it works, I'll convert
all 527 pages to use the includes — scripted, in batches, each step committed so it's
fully reversible — then we delete the `ssi-test/` folder.
