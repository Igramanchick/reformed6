# Reformed Hope Foundation — website

Static site. Plain HTML, CSS and vanilla JavaScript. No frameworks, no build
step, no Node. Everything in this folder is deployed exactly as it sits.

## Deploying to Bluehost

Upload the entire contents of this folder to `public_html/` via cPanel File
Manager or SFTP. There is nothing to compile or install.

Make sure hidden files are included — **`.htaccess` is easy to miss** and it
provides the custom 404 page, gzip, cache headers and clean URLs.

Then, in cPanel:

1. Turn on the free SSL certificate for the domain.
2. Once SSL is active, uncomment the HTTPS redirect block at the bottom of
   `.htaccess`.

## Deploying to Vercel

The site is also set up for Vercel, which builds nothing and serves this folder
as it sits. `vercel.json` is the Vercel equivalent of `.htaccess`:

| `.htaccess` provides | on Vercel |
|---|---|
| `mod_rewrite` clean URLs (`/about`) | `"cleanUrls": true` |
| `ErrorDocument 404 /404.html` | automatic — a root `404.html` is used |
| `mod_deflate` compression | automatic (gzip / brotli) |
| `mod_expires` + `mod_headers` caching | the `headers` rules in `vercel.json` |
| `mod_mime` types | automatic |
| the commented-out HTTPS redirect | automatic |

One behavioural difference worth knowing: Vercel's `cleanUrls` *also*
308-redirects `/about.html` to `/about`, which the Apache config deliberately
does not do. Nothing breaks — the redirect target is exactly the
`<link rel="canonical">` each page already declares, and every internal link
still uses the `.html` form, so the site keeps working as plain files.

`.vercelignore` keeps `.htaccess` and this README out of the deployed output.
Both stay in the repo for the Bluehost deployment.

The Vercel project is linked to this git repository: **pushing to `main`
publishes the site.** Neither host is authoritative — the same folder is valid
on both.

## Before launch — three placeholders to replace

| What | Where | Notes |
|---|---|---|
| **EIN** | footer of all 9 pages | Search for `EIN PLACEHOLDER`. The EIN line is **deliberately not rendered** — a visibly fake number in the footer of a site that solicits donations reads worse than no number at all. Add `<p>EIN 12-3456789</p>` back in all 9 files once the real EIN exists. Confirm the exact tax-status wording too — no 501(c)(3) claim is currently made anywhere on the site. |
| **Donation platform** | `donate.html` | Search for `DONATION EMBED GOES HERE`. Replace the whole `.donate-placeholder` block with the provider's embed. Do not hand-build a payment form. |
| **Photographs** | `images/` | See the table below. |

## Client assets

Drop replacements in at the same paths and filenames and no *markup structure*
needs to change.

**One exception, and it matters: `alt` text.** The placeholder images carry
`alt=""` because a brand-toned gradient conveys nothing to a screen-reader user.
A real photograph does convey something, so it needs a descriptive `alt` — and
leaving the empty one behind turns a correct decision into a WCAG 1.1.1 failure.
Every affected `<img>` has a comment above it saying so.

| File | Used on | Notes |
|---|---|---|
| `images/logo-mark.png` | header + footer, every page | The phoenix, cropped from the supplied logo with a transparent background. Replace with the final mark at 256×256 or larger, square, transparent. |
| `images/allison-viescas-headshot.jpg` | `about.html` | Square (1:1). **Currently a brand-toned placeholder, not a photograph** — but unlike the others it carries a descriptive `alt` announcing a portrait of a named person. Until the real headshot lands, screen-reader users are told there is a portrait that does not exist. Highest-priority swap. |
| `images/caring-for-caregivers.jpg` | `index.html` | 3:2. Currently a brand-toned placeholder. When you swap in a real photo, give it descriptive `alt` text — it is currently `alt=""` because a placeholder carries no information. |
| `images/financial-literacy-youth.jpg` | `index.html` | 3:2, same note as above. |
| `images/care-works.jpg` | `care-works.html` | 3:2. Brand-toned placeholder, same `alt` note as the two above. |
| `images/og-card.png` | social sharing preview | 1200×630. |
| `images/logo-original.webp` | — | The original supplied logo. Source asset only, not referenced by any page. |

## Adding caregiver resources

`resources.html` has a large comment block above the resource list showing
exactly how to add a state, a category, or a single link. The markup is
deliberately repetitive so it can be edited by hand, and its structure maps
one-to-one onto a spreadsheet's columns (state / category / name / url /
description) if the list is ever moved to a Google Sheet.

## Design notes

**Colour.** The palette is derived from the logo, not invented. The logo's
cream (`#FDFAEF`) is the page background. But the logo's sage wordmark
(`#80857B`, 3.62:1) and its orange (`#DF7D31`, 2.82:1) both fail WCAG AA as
text on that cream, so the text colours are darkened derivatives of those same
hues. The true logo orange survives as `--flame`, restricted to decorative
rules and motifs. The Donate button uses `--gold` (`#EBA85A`) — sampled from
the phoenix's wing highlight — with dark ink on it at 6.32:1.

The rules are documented at the top of `styles.css`. The short version:
**`--flame`, `--line` and `--line-strong` are never text and never outline a
control. Orange text is always `--accent`.**

**Type.** One self-hosted font: Source Serif 4 (SIL Open Font License 1.1), a
single 122 KB variable file covering weights 400–700, in `fonts/`. Body text is
the system sans stack at 17px. There are no external requests of any kind — no
CDN, no Google Fonts, no analytics, no libraries.

**Accessibility.** Built to WCAG 2.1 AA: semantic landmarks, one `h1` per page,
no skipped heading levels, a skip link as the first focusable element, visible
focus on everything, descriptive link text throughout, and `prefers-reduced-motion`
support. Every foreground/background pairing in the stylesheet was contrast-tested.

If you edit the site, re-check: heading order, that new links describe their
destination (never "click here"), and that any new colour pairing clears 4.5:1
for text.

## Editing the shared header and footer

There are no server-side includes, so the header and footer are duplicated in
each of the 9 HTML files. **A change to the navigation must be made in all
nine**: `index.html`, `about.html`, `programs.html`, `care-works.html`,
`resources.html`, `contact.html`, `donate.html`, `privacy.html`, `404.html`.

Note that `404.html` uses root-relative paths (`/styles.css`) because Apache
serves it from any URL depth; the other pages use relative paths. Any script
that edits all nine files has to account for that split, and for the fact that
the current page's nav link carries `aria-current="page"`.

`privacy.html` is deliberately **not** in the main nav — it is reached from the
footer, which is where people look for it.

## Contact details live in exactly one place

`contact.html` carries a commented-out `EMAIL / PHONE / POSTAL SLOT`. That is
the only spot on the site where an address, phone number or email is meant to
appear as content, so adding them later is one edit rather than a hunt through
nine files. When you fill it in, also complete the matching fields in the
JSON-LD block at the bottom of `index.html` — the comment there lists them.

The contact page is organized by **reason for getting in touch**, not by
channel. Several rows currently point at the same hosted Google Form; that is
temporary, and labelling the reason means each row can be repointed
independently later without the page reading oddly in the meantime.

## Generated files

These were produced from `images/logo-mark.png` and can be regenerated from it
if the logo changes:

| File | Purpose |
|---|---|
| `images/favicon-16x16.png`, `images/favicon-32x32.png` | PNG favicons alongside the `.ico` |
| `images/icon-192.png`, `images/icon-512.png` | manifest icons, composited on the brand cream |
| `images/icon-maskable-512.png` | maskable icon; the mark sits inside the inner 60% so launchers can crop it to any shape |
| `apple-touch-icon.png` (root) | iOS probes this path before parsing the HTML |
| `site.webmanifest` | installable metadata and `theme-color` |
| `robots.txt`, `sitemap.xml` | the sitemap uses the extensionless URL form so it matches the `<link rel="canonical">` on each page |

**Still missing: an SVG favicon.** The `sizes="any"` on the `.ico` is there so
an SVG would take precedence, but there is no vector version of the logo in the
repo — only rasters. Tracing a PNG would produce a worse mark than the original
artwork, so this waits for a real vector from the designer.

## Local preview

```
python -m http.server 8000
```

then open <http://localhost:8000>. Clean URLs (`/about`) only work on Apache,
since they come from `.htaccess`; every internal link uses the `.html` form, so
the site works fully without it.
