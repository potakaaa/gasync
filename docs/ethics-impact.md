# Ethics & Impact Assessment

> **Week 12 deliverable** — last updated: 2025-05

---

## 1. Purpose of This Document

This document identifies the stakeholders affected by **gasync**, analyses potential harms, and records the mitigations in place (or planned). It is a living document and should be updated whenever the product scope changes.

---

## 2. What Is gasync?

gasync is a read-only commodity-price dashboard that displays real-time and historical futures prices for Natural Gas, Brent Crude, and WTI Crude Oil. It fetches data from a third-party Commodity Price API, renders charts, and presents percentage changes versus previous session closes. There is no user authentication, no social feature, and no transactional capability in the current release.

---

## 3. Stakeholders

| Stakeholder | Relationship to the product | Potential interests |
|---|---|---|
| **End users (general public)** | Browse the dashboard | Access to accurate, timely price information |
| **Energy sector professionals** | May use as a quick reference | Reliability of data; source transparency |
| **Commodity Price API provider** | Data supplier | Correct attribution; compliance with ToS |
| **Developer / maintainer** | Builder and operator | Regulatory compliance; reputational risk |
| **Search engines / scrapers** | Index or consume the public page | Structured, accessible markup |
| **Open-source community** | May fork or contribute | Clear licensing; documented design decisions |

---

## 4. Potential Harms & Mitigations

### 4.1 Financial Decision Risk

| Aspect | Detail |
|---|---|
| **Harm** | A user could interpret the dashboard as financial advice and make trading or investment decisions based solely on it. |
| **Likelihood** | Medium — commodity prices are inherently financial data. |
| **Severity** | High — financial losses are possible. |
| **Mitigation (current)** | No "buy/sell" language or recommendations appear in the UI. |
| **Mitigation (planned)** | Add a visible disclaimer: *"For informational purposes only. Not financial advice."* on every price-display page. |

### 4.2 Data Accuracy & Staleness

| Aspect | Detail |
|---|---|
| **Harm** | Stale or incorrect prices displayed as current could mislead users. |
| **Likelihood** | Low-Medium — depends on upstream API reliability and caching strategy. |
| **Severity** | Medium |
| **Mitigation** | Display the data timestamp alongside each price. Show a clear error/loading state when the API is unreachable. Document the polling interval in the UI. |

### 4.3 Upstream API Dependency & Vendor Lock-in

| Aspect | Detail |
|---|---|
| **Harm** | If the Commodity Price API changes its schema, raises prices, or shuts down, the dashboard silently breaks or becomes unavailable. |
| **Likelihood** | Medium over a long time horizon. |
| **Severity** | Medium |
| **Mitigation** | The `commodity-types.ts` contract layer isolates the API shape; an adapter can be swapped without UI changes. The `/api/commodity/latest` route is the single integration point. |

### 4.4 Environmental Impact

| Aspect | Detail |
|---|---|
| **Harm** | Server-side rendering and frequent API polling contribute to compute/energy consumption. |
| **Likelihood** | Low — traffic is expected to be minimal at demo stage. |
| **Severity** | Low |
| **Mitigation** | Use appropriate cache headers and revalidation intervals. Avoid polling intervals shorter than necessary. |

### 4.5 Accessibility Exclusion

| Aspect | Detail |
|---|---|
| **Harm** | Users relying on screen readers or keyboard navigation could be excluded. |
| **Likelihood** | Medium — charts are inherently visual. |
| **Severity** | Medium |
| **Mitigation** | Provide text alternatives for chart data (tabular fallback or `aria-label`). Follow WCAG 2.1 AA for colour contrast in price direction indicators. |

---

## 5. Ethical Principles Applied

- **Transparency** — data sources and timestamps are visible; no hidden logic affects what prices are shown.
- **Non-maleficence** — the product does not recommend actions; it only presents data.
- **Accessibility** — the product should be usable by people with disabilities.
- **Accountability** — the maintainer is named in the LICENSE and takes responsibility for the product.

---

## 6. Open Questions

- [ ] Should a disclaimer banner be added before the first meaningful content paint?
- [ ] Should the data source (API provider name) be disclosed in the UI footer?
- [ ] Is the current polling/revalidation interval appropriate for the data freshness users expect?
