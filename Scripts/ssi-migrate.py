#!/usr/bin/env python3
"""Convert hardcoded sitewide header/footer into SSI includes.

For each HTML file passed on the command line:
  1. Replace the site header block  (<nav ...>...</nav> + the following
     <div class="mobile-menu">...</div>)  with the header include.
  2. Replace the footer block  (<footer class="tbh-footer">...</footer>)
     with the footer include.
  3. Bump the page's top offset by +38px so content clears the taller
     fixed header (announce bar 38px + nav 68px = 106px). The selector
     that owns the offset differs per template, so pass it with --offset
     "SELECTOR_PREFIX" (e.g. ".post-hero { padding:"). Only the first
     number after the prefix is increased.

Idempotent: files already containing the header include are skipped.
Prints a one-line status per file. Exits non-zero if any file couldn't
be fully converted (header or footer block not found).
"""
import re
import sys

HEADER_INCLUDE = '<!--#include virtual="/partials/header.html" -->'
FOOTER_INCLUDE = '<!--#include virtual="/partials/footer.html" -->'

# Site header = first <nav>...</nav> immediately followed by the mobile menu.
HEADER_RE = re.compile(
    r'<nav\b[^>]*>.*?</nav>\s*<div class="mobile-menu"[^>]*>.*?</div>',
    re.DOTALL,
)
FOOTER_RE = re.compile(r'<footer class="tbh-footer">.*?</footer>', re.DOTALL)


def bump_offset(text, prefix, delta=38):
    """Increase, by `delta`, the first integer after every `prefix` match."""
    pat = re.compile(re.escape(prefix) + r'(\s*)(\d+)')

    def repl(m):
        return prefix + m.group(1) + str(int(m.group(2)) + delta)

    new, n = pat.subn(repl, text)
    return new, n > 0


def convert(path, offset_prefix=None):
    with open(path, encoding='utf-8') as fh:
        text = fh.read()
    if HEADER_INCLUDE in text:
        return 'skip (already converted)'
    new, nh = HEADER_RE.subn(HEADER_INCLUDE, text, count=1)
    if nh == 0:
        return 'FAIL (header block not found)'
    new, nf = FOOTER_RE.subn(FOOTER_INCLUDE, new, count=1)
    if nf == 0:
        return 'FAIL (footer block not found)'
    note = ''
    if offset_prefix:
        new, changed = bump_offset(new, offset_prefix)
        note = ' +offset' if changed else ' (offset prefix not found!)'
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(new)
    return f'OK header+footer{note}'


def main():
    args = sys.argv[1:]
    offset_prefix = None
    files = []
    i = 0
    while i < len(args):
        if args[i] == '--offset':
            offset_prefix = args[i + 1]
            i += 2
        else:
            files.append(args[i])
            i += 1
    failed = False
    for f in files:
        status = convert(f, offset_prefix)
        if status.startswith('FAIL'):
            failed = True
        print(f'{status:40s} {f}')
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
