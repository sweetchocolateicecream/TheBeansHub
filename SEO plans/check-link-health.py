#!/usr/bin/env python3
"""
check-link-health.py — audits every `link` in beans.json for The Beans Hub.

Run this on YOUR computer (it needs normal internet access — the Cowork
sandbox does not have it). From the repo root:

    pip install requests
    python3 "SEO plans/check-link-health.py"

It produces two files next to beans.json:
    link-health-report.csv   — full per-bean result
    link-health-summary.txt  — headline numbers

What it detects
---------------
DEAD        : URL returns 404/410/timeout/connection error, or redirects to a
              collection/home page (Shopify often 302s a removed product to /).
OUT_OF_STOCK: For Shopify product pages it reads <url>.json and checks
              variants[].available — this is the *real* stock flag, not a guess.
              For non-Shopify pages it scans the HTML for sold-out phrases.
OK          : Reachable and at least one variant available.
UNKNOWN     : Reachable but stock couldn't be determined (e.g. Shopee blocks
              bots, or a custom cart we can't read). Worth a manual look.

Notes
-----
- Shopee (~187 links) almost always lands in UNKNOWN — they block automated
  requests. Spot-check those by hand.
- Tune SLEEP / WORKERS if a roaster rate-limits you.
"""

import csv
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse

try:
    import requests
except ImportError:
    sys.exit("Please `pip install requests` first.")

HERE = os.path.dirname(os.path.abspath(__file__))
BEANS = os.path.join(HERE, "..", "beans.json")          # repo-root/beans.json
OUT_CSV = os.path.join(HERE, "..", "link-health-report.csv")
OUT_TXT = os.path.join(HERE, "..", "link-health-summary.txt")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/124.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}
TIMEOUT = 20
WORKERS = 8          # parallel requests; lower if you get rate-limited
SLEEP = 0.0          # per-request politeness delay (seconds)

SOLDOUT_PATTERNS = re.compile(
    r"sold\s*out|out\s*of\s*stock|stok\s*habis|kehabisan\s*stok|"
    r"currently\s*unavailable|no\s*longer\s*available",
    re.IGNORECASE,
)


def classify(link: str) -> tuple[str, str]:
    """Return (status, detail) for one product link."""
    if not link or not link.strip():
        return "DEAD", "empty link"

    host = urlparse(link).netloc.lower()

    # Shopee: blocks bots — don't waste a request pretending otherwise.
    if "shopee" in host:
        return "UNKNOWN", "shopee blocks automated checks — verify manually"

    # 1) Try the Shopify product JSON (exact stock truth).
    if "/products/" in link:
        base = link.split("?")[0].rstrip("/")
        try:
            r = requests.get(base + ".json", headers=HEADERS, timeout=TIMEOUT)
            if r.status_code == 200 and "application/json" in r.headers.get("content-type", ""):
                variants = r.json().get("product", {}).get("variants", [])
                if variants:
                    any_avail = any(v.get("available") for v in variants)
                    return ("OK", "in stock") if any_avail else ("OUT_OF_STOCK", "all variants sold out")
            elif r.status_code in (404, 410):
                return "DEAD", f"product .json {r.status_code}"
        except requests.RequestException:
            pass  # fall through to HTML check

    # 2) Generic HTML fetch — status code + sold-out phrase scan.
    try:
        r = requests.get(link, headers=HEADERS, timeout=TIMEOUT, allow_redirects=True)
    except requests.Timeout:
        return "DEAD", "timeout"
    except requests.RequestException as e:
        return "DEAD", f"connection error: {type(e).__name__}"

    if r.status_code in (404, 410):
        return "DEAD", f"HTTP {r.status_code}"
    if r.status_code >= 400:
        return "UNKNOWN", f"HTTP {r.status_code}"

    # Redirected to a non-product page (removed product bounced to home/collection)?
    final = urlparse(r.url).path.lower()
    if "/products/" in link and "/products/" not in final and "/product/" not in final:
        return "DEAD", f"redirected away to {r.url}"

    if SOLDOUT_PATTERNS.search(r.text):
        # Shopify templates always contain a hidden "Sold out" label, so this is
        # only a strong signal on non-Shopify carts. Flag for review, don't trust blindly.
        return "OUT_OF_STOCK", "page text shows sold-out phrase (verify)"

    return "OK", f"HTTP {r.status_code}"


def main():
    with open(BEANS, encoding="utf-8") as f:
        beans = json.load(f)

    print(f"Checking {len(beans)} links with {WORKERS} workers...\n")
    rows = []

    def work(b):
        link = b.get("link", "")
        status, detail = classify(link)
        if SLEEP:
            time.sleep(SLEEP)
        return {
            "SKU": b.get("SKU", ""),
            "brand": b.get("brands", ""),
            "name": b.get("name", ""),
            "status": status,
            "detail": detail,
            "link": link,
        }

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = [ex.submit(work, b) for b in beans]
        for i, fut in enumerate(as_completed(futures), 1):
            row = fut.result()
            rows.append(row)
            if row["status"] in ("DEAD", "OUT_OF_STOCK"):
                print(f"  [{row['status']:12}] {row['brand']} — {row['name']}")
            if i % 50 == 0:
                print(f"  ...{i}/{len(beans)} done")

    # Stable order by status severity then brand.
    order = {"DEAD": 0, "OUT_OF_STOCK": 1, "UNKNOWN": 2, "OK": 3}
    rows.sort(key=lambda r: (order.get(r["status"], 9), r["brand"], r["name"]))

    with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["SKU", "brand", "name", "status", "detail", "link"])
        w.writeheader()
        w.writerows(rows)

    counts = {}
    for r in rows:
        counts[r["status"]] = counts.get(r["status"], 0) + 1
    total = len(rows)
    summary = [
        f"Link health audit — {total} beans",
        "=" * 40,
    ]
    for k in ("DEAD", "OUT_OF_STOCK", "UNKNOWN", "OK"):
        c = counts.get(k, 0)
        summary.append(f"{k:13} {c:4}  ({c/total*100:.1f}%)")
    summary.append("")
    summary.append("DEAD + OUT_OF_STOCK are the ones costing you clicks.")
    summary.append("UNKNOWN is mostly Shopee — spot-check by hand.")
    text = "\n".join(summary)

    with open(OUT_TXT, "w", encoding="utf-8") as f:
        f.write(text + "\n")

    print("\n" + text)
    print(f"\nFull report: {os.path.abspath(OUT_CSV)}")


if __name__ == "__main__":
    main()
