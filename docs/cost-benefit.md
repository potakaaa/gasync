# Cost–Benefit Analysis and Cost Estimation

Date: 2026-05-06

**Summary**
This document contains Year‑1 cost and benefit estimates derived from the project repository and CI configuration. Key repo observations used as inputs:
- The project is a Next.js app with CI/CD deploying to Vercel (see `.github/workflows/ci.yml`).
- The codebase contains a moderate set of UI components and tests, indicating a small feature scope suitable for a 1–2 person initial effort.

Below are reasonable, repo‑informed assumptions and recomputed values for Year‑1 evaluation. These are still estimates — replace with actual org numbers where available.

**Assumptions (repo-informed estimates)**
- Development effort: 320 hours (≈ 8 weeks of focused work) — based on number of components, pages, and tests.
- Developer rate (fully loaded): $90 / hour — reasonable mid-market fully‑loaded cost.
- Hosting: Vercel team/pro pattern — estimated $100 / month (small team/project).
- Maintenance: 0.15 FTE at $130,000 / year (fully loaded) — small ongoing maintenance and ops time.
- Working days per year: 260

**Development Cost (one-time, Year‑0/Year‑1)**
- Formula: Dev cost = total_hours × rate
- Computation: 320 h × $90/h = $28,800

**Operational Cost (Yearly)**
- Hosting: $100/mo × 12 = $1,200 / year
- Maintenance effort: 0.15 FTE × $130,000 = $19,500 / year
- Total ops (Yearly) = $1,200 + $19,500 = $20,700 / year

**Year‑1 Total Cost**
- Year‑1 cost = Development (one-time) + Ops (yearly)
- Computation: $28,800 + $20,700 = $49,500

**Tangible Benefits (repo‑based scenario)**
- Estimated active engineering user set: 4 engineers (small product team working on the repo)
- Time saved per engineer: 15 minutes / workday (streamlined UX and dashboards in this project)
  - Hours saved/year = 4 × (15/60) × 260 = 260 hours
  - Monetized value (time saved) = 260 × $90/h = $23,400
- Reduced errors / rework: estimated $15,000 / year (fewer rollbacks, faster fixes)
- Total tangible benefits (yearly) = $23,400 + $15,000 = $38,400

**Intangible Benefits**
- Improved developer UX and morale
- Faster decision-making from clearer dashboards and charts
- Fewer escalations and improved external/customer satisfaction
- Smoother onboarding for new contributors

**ROI (Year‑1)**
- ROI = (Benefits − Costs) / Costs
- Computation: ($38,400 − $49,500) / $49,500 = −0.224 = −22.4%
- Interpretation: Under these conservative, repo‑informed assumptions, Year‑1 ROI is negative because one‑time development cost is not fully offset by first‑year benefits. This is common for small projects with upfront implementation effort.

**Recommendation**
Proceed with a time‑boxed pilot and additional instrumentation rather than full rollout.
- Rationale: Year‑1 ROI is negative but the project has low ops costs and scales well; with broader adoption and measured time‑savings the ROI becomes positive.
- Suggested actions:
  1. Run a 3‑month pilot with 4–8 engineers.
  2. Instrument task durations and error rates (baseline 2 weeks pre‑pilot, measure during pilot).
  3. Recompute benefits with measured time saved; if annualized benefits exceed total annualized cost, proceed to rollout.

**Short Case Study (scaled impact)**
If this system is used by 50 users and each user saves 10 minutes per workday on average:
- Annual hours saved = 50 × (10/60) × 260 = 2,166.7 hours
- Monetized savings ≈ 2,166.7 × $90/h = $195,000 / year
- Impact: at this scale, annual benefits far exceed Year‑1 costs and ROI becomes strongly positive.

Prepared by: Analysis agent

