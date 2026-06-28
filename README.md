# Campus Hire

> **Campus hiring intelligence — on any device, offline-ready.**

Campus Hire is a Progressive Web App (PWA) for HR and campus recruitment teams. Upload your college and employee Excel files and instantly get ranked college insights, hiring funnel diagnostics, ROI simulations, and auto-generated intelligence — no installation, no server, no data leaving your device.

---

## Screenshots

| Upload | Dashboard — Overview | Rankings | ROI Simulator |
|--------|---------------------|----------|---------------|
| *(upload screen)* | *(KPI cards + scatter chart)* | *(ranked bar chart + table)* | *(gauge + ROI sim)* |

---

## Features

### Analytics
- **College Rankings** — composite performance score weighted by manager rating (40%), acceptance rate (25%), cost efficiency (20%), and intern conversion (15%), with an attrition penalty and a confidence score per college
- **Hiring Funnel** — aggregate Applications → Shortlist → Interview → Offer → Accept visualisation with stage-by-stage conversion rates
- **Cost vs Acceptance Scatter** — bubble chart mapping CTC against acceptance rate, sized by employee count
- **ROI Simulator** — set an offer count and budget, get projected acceptances, attrition, cost-per-hire, and budget fit
- **Outcome Estimator** — semicircle gauge showing success score and confidence for any selected college
- **College Comparison** — radar chart + table comparing up to 3 colleges across acceptance, retention, cost efficiency, and ROI
- **Auto Insights** — 5 auto-generated plain-English findings: top performer, tier averages, funnel bottleneck, highest decline rate, attrition benchmark

### Filtering
- **Tier chips** — toggle Tier 1 / 2 / 3 on or off
- **College multi-select** — scrollable checklist with Select All / Deselect All, rebuilds automatically when tiers change
- **Department filter** — scope all analytics to a single hiring department

### PWA
- Installs to home screen on Android (Chrome) and iOS (Safari)
- Works offline after first load — CDN libraries cached by service worker
- Standalone display mode (no browser chrome)
- 9 icon sizes covering all platforms (48 → 512 px)
- App shortcuts for Rankings and ROI Simulator

### Privacy
- All processing is local — files are parsed in-browser using [SheetJS](https://sheetjs.com/)
- Nothing is uploaded to any server
- No tracking, no analytics, no cookies

---

## Data Format

Campus Hire expects two Excel (`.xlsx`) files.

### College Data

One row per college. Required columns (case-insensitive, extra columns are ignored):

| Column | Description |
|--------|-------------|
| College | College name |
| College Tier | `Tier 1`, `Tier 2`, or `Tier 3` |
| Applications Received from each campus | Total applicant count |
| Roles opened for each campus | Open roles at this campus |
| Shortlisted | Shortlisted count |
| Interviewed | Interviewed count |
| Offers | Offers issued |
| Accepted | Offers accepted |
| Declined | Offers declined |
| PPI offered / PPI accepted | Pre-placement interview counts |
| PPO offered / PPO accepted | Pre-placement offer counts |
| Aggregate Manager Rating | Average rating (0–5 scale) |
| Average CTC Offered | CTC in LPA or in Rupees (auto-detected) |

### Employee Data

One row per employee. Required columns:

| Column | Description |
|--------|-------------|
| employee id | Unique identifier |
| college | College name (matched against College Data) |
| company department | Department the employee joined |
| PPO/PPI Offered | `Yes` or `No` |
| number of months in the company | Tenure in months (< 6 flagged as early attrition) |

> **Name matching** — college names are normalised (lowercased, punctuation stripped) before matching. Minor spelling differences across files are handled automatically.

---

## Scoring Model

### Performance Score (0–100)

```
score = (0.40 × manager_rating_norm
       + 0.25 × acceptance_rate_norm
       + 0.20 × cost_efficiency_norm
       + 0.15 × intern_conversion_norm
       − 0.15 × attrition_rate_norm) × 100
```

All inputs are min-max normalised across the current filtered set.

### Confidence Score (0–100)

```
confidence = (0.45 × log_sample_score + 0.55 × (1 − attrition_norm)) × 100
```

Rewards colleges with more employee history and lower early attrition variance.

### ROI Score

Normalised retained-hire return: `(1 − attrition_rate) / avg_ctc`, then rescaled 0–100 across all colleges.

---

## Tech Stack

| Layer | Library / Tool |
|-------|---------------|
| UI framework | Vanilla HTML/CSS/JS (no build step) |
| Charts | [Chart.js 4.4.1](https://www.chartjs.org/) via CDN |
| Excel parsing | [SheetJS 0.18.5](https://sheetjs.com/) via CDN |
| Typography | Inter, Space Grotesk, JetBrains Mono (Google Fonts) |
| Icons | Custom PNG — generated with Pillow (Python) |
| PWA | Web App Manifest + Service Worker (cache-first CDN, network-first app) |
| Hosting | Any static host — no backend required |

---

## Browser Support

| Browser | Install | Offline |
|---------|---------|---------|
| Chrome (Android) | ✅ Native prompt | ✅ |
| Chrome (Desktop) | ✅ Address bar install | ✅ |
| Safari (iOS 16.4+) | ✅ Share → Add to Home Screen | ✅ |
| Firefox (Android) | ⚠️ Manual Add to Home Screen | ✅ |
| Samsung Internet | ✅ Install prompt | ✅ |
| Edge | ✅ Native prompt | ✅ |

---

## License

@ramesan_sandeep © FTW.

---

<p align="center">made by <strong>FTW.</strong></p>
