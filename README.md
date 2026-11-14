<!-- SPDX-License-Identifier: Apache-2.0 -->
# neosite

The NeoSymbian website: a static site (plain HTML, CSS and JavaScript, no build step) hosted on Vercel.

| Page | File | What |
|---|---|---|
| `/` | `index.html` | The idea, what works today, a three.js Pixel 3a XL with the real home screen |
| `/screens` | `screens.html` | Real neoui frames: home, calls, contacts, Settings, Wi-Fi, Terminal, keyboard |
| `/roadmap` | `roadmap.html` | Seven phases and the parts of the project, from `assets/roadmap.js`; the architecture |
| `/devices` | `devices.html` | Device matrix, the tested-phone report form, contribution flow, contact form, licences |

## Layout

| Path | What |
|---|---|
| `assets/site.css` | All styles; the design tokens (the org's copper on graphite) are at the top |
| `assets/logo.svg`, `favicon.svg` | The org logo and mark, cut from `NeoSymbian/.github` `profile/assets/neo-symbian-banner.svg` |
| `assets/roadmap.js` | **The roadmap's single source**: phases, parts, every stage with its state, date and dependencies. To change a state, edit the stage and `AS_OF`; `npm test` checks order and consistency |
| `assets/hero.js` | The 3D phone (three.js r152 from cdnjs); without WebGL the still image shows |
| `assets/report.js` | Form logic: field caps, the prefilled GitHub issue URL, the POST to the sheet |
| `assets/config.js` | `SHEET_URL` (the Apps Script web app) and the issues repo |
| `apps-script/Code.gs` | The Google Apps Script that writes form posts into the project sheet |
| `img/screens/` | Frames from neoui's snapshot tests, 540 px wide |
| `tools/sync-screens.sh` | Refreshes `img/screens/` from a neoui checkout (macOS `sips`) |
| `tests/` | `node --test`: form logic, the Apps Script parser, and the roadmap data (ids, phase order, states vs dependencies) |

## Work on it

```sh
npm test        # Node 20+, no dependencies
npm run serve   # http://localhost:8080 with clean URLs, like Vercel
```

The screens come from `NeoSymbian/neoui` `snapshots/`, which neoui's snapshot tests write with the same renderer the
phone runs. After the UI changes: `tools/sync-screens.sh ../neoui`, check the images, commit. They show demo data;
captions say so. Never put photos or captures that show a real number, IMEI, ICCID or contact on the site.

## Deploy

**Vercel:** import the repo, framework preset "Other", no build command, output directory `.`. `vercel.json` sets clean
URLs and the security headers (the CSP allows cdnjs, Google Fonts and the Apps Script hosts only).

**The project sheet (once):**
1. Create a Google Sheet, then Extensions → Apps Script, and paste `apps-script/Code.gs`.
2. Deploy → New deployment → Web app; Execute as: me; Who has access: Anyone. Copy the `/exec` URL.
3. Put it in `assets/config.js` as `SHEET_URL` and deploy the site. Each form gets its own tab (`device`, `contact`).

Until `SHEET_URL` is set, device reports still open a prefilled GitHub issue, and the contact form says it isn't
connected yet.

**The GitHub issue form** lives in `NeoSymbian/docs` at `.github/ISSUE_TEMPLATE/device-report.yml`, with a
`device-report` label. Its field ids (`model`, `codename`, `bootloader`, `build`, `working`, `log`) must match the
query keys in `assets/report.js`.

## Licences

Our code is Apache-2.0 (`LICENSE`). The screen images are output of NeoSymbian/neoui. NeoSymbian is not affiliated with
Nokia, Accenture, the former Symbian Foundation, or Google.
