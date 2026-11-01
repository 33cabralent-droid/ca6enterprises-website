# ca6enterprises-website

Official website for CA6 ENTERPRISES LLC - Florida Document L23000310743.
Live at <https://ca6enterprises.com> (and `www`). A single static page in dark black and gold, hosted on Cloudflare Pages. There is no build step and no framework.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The whole home page: HTML plus its CSS in one `<style>` block. |
| `menu.js` | Phone-width menu toggle (button with `aria-expanded`, Escape closes it). Kept as a separate file so the CSP needs no `'unsafe-inline'` for scripts. |
| `404.html` | "Page not found" page. Pages serves it with HTTP 404 for any path that does not exist. |
| `favicon.svg` | Tab icon: "CA6" in gold on black. |
| `_headers` | Security headers Pages adds to every response (see below). Pages reads it; it is not served. |
| `CA6-NAICS-Codes.pdf` | NAICS code sheet linked from the NAICS section. |
| `README.md` | This file. Note: Pages serves every file in the repo root, so this README is public at `/README.md`. |

## Run locally

```sh
python3 -m http.server 8080   # then open http://localhost:8080/
```

The local server does not apply `_headers` or the 404 page; those only take effect on Pages.

## How deploys work

- Cloudflare Pages project `ca6enterprises-website` is connected to this repo.
- Every push to `main` deploys to production automatically (about a minute). Custom domains: `ca6enterprises.com`, `www.ca6enterprises.com`.
- Preview deployments for other branches are turned off (setting: "None", since 2026-11-01), so a pushed branch does not publish a public `*.pages.dev` preview. To preview a branch on purpose, turn previews back on for that branch in Pages > Settings > Builds & deployments.
- Check a deploy: `curl -sI https://ca6enterprises.com/` should return `200` with the headers listed below.

## How to roll back

Pick one:

1. **Fastest (no git change):** Cloudflare dashboard > Workers & Pages > `ca6enterprises-website` > Deployments > pick the last good production deployment > "Rollback to this deployment". Production switches in seconds. The next push to `main` deploys again, so also fix `main`.
2. **Git:** `git revert <bad-commit-sha>` and push to `main` (or use GitHub's "Revert" button on the commit). Pages redeploys the reverted state.

## Security headers (`_headers`)

| Header | Value | Why |
| --- | --- | --- |
| `Strict-Transport-Security` | `max-age=31536000` | Browsers use HTTPS only for a year. No `includeSubDomains` or `preload`, so other subdomains are not locked in. |
| `X-Frame-Options` | `DENY` | No other site can frame this one (clickjacking). |
| `Content-Security-Policy` | see `_headers` | Scripts only from this site (`menu.js` and Cloudflare's `/cdn-cgi/` email-decode script) and Cloudflare Web Analytics (`static.cloudflareinsights.com`, which reports to `/cdn-cgi/rum` or `cloudflareinsights.com`). Styles from this site, inline `<style>`, and Google Fonts CSS; fonts from `fonts.gstatic.com`. The form may only post to `https://formsubmit.co`. `frame-ancestors 'none'` repeats the no-framing rule. |
| `Permissions-Policy` | camera, microphone, geolocation, payment, usb all off | The site needs none of them. |
| `X-Content-Type-Options` | `nosniff` | Browsers trust the declared file type. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Other sites see only the domain, not full URLs. |

If you add a script, font, image host, or form target from another domain, add it to the CSP in `_headers` first, or the browser will block it.

## Known limits

- **Contact form:** it posts to FormSubmit (`https://formsubmit.co/info@ca6enterprises.com`). FormSubmit needs a one-time activation: the first submission sends a confirmation email to info@ca6enterprises.com, and messages are only delivered after that link is clicked.
- **HTTP to HTTPS redirect and minimum TLS version** are Cloudflare zone settings (SSL/TLS > Edge Certificates: "Always Use HTTPS", "Minimum TLS Version 1.2"), not files in this repo.
- If Cloudflare Bot Fight Mode or JavaScript detections are turned on later, Cloudflare injects an inline script that this CSP blocks; update the CSP before turning those on.
- CAA DNS records (which certificate authorities may issue certificates) live in Cloudflare DNS, not here.

## Content rules

- Name the buyer as "Department of War" or "DoW". Do not use the department's former name or its abbreviation.
- Do not publish a phone number, street address, or EIN.
- Do not claim certifications, set-aside statuses, or years of experience that are not verified. Ownership status stays worded as it is: self-represented in SAM.gov.
- Keep company data (UEI, CAGE, Florida document number, NAICS and PSC codes) matching SAM.gov and Sunbiz.
