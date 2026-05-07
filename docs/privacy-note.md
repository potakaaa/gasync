# Privacy Note

> **Week 12 deliverable** — last updated: 2025-05
> **Current stage:** Demo / academic project. No production user base.

---

## 1. Overview

**gasync** is a read-only commodity-price dashboard. It does not require user registration, login, or any form of account creation. This document explains what data — if any — is collected, why, how long it is retained, and what rights users have.

---

## 2. Data Collected

### 2.1 Data We Do NOT Collect

- No personally identifiable information (PII) — names, email addresses, phone numbers.
- No authentication credentials of any kind.
- No payment or financial account information.
- No device identifiers stored by the application itself.

### 2.2 Data Incidentally Processed

| Data type | When | Why | Retained? |
|---|---|---|---|
| **IP address** | Every HTTP request to the Next.js server | Standard web server operation; required for routing responses | Not stored by the application. May appear in transient server/hosting logs (see §3). |
| **HTTP request metadata** (path, method, user-agent, referrer) | Every HTTP request | Same as above | Not stored by the application. May appear in transient server/hosting logs (see §3). |

### 2.3 Client-Side Storage

The application does **not** set any cookies, `localStorage` entries, or `sessionStorage` entries for tracking or analytics purposes. The only browser storage used is any default caching performed by the browser itself (standard HTTP caching).

---

## 3. Third-Party Services

| Service | Purpose | Their privacy policy |
|---|---|---|
| **Commodity Price API** (upstream data provider) | Fetching futures price data | Requests are made server-side; the user's IP address is not forwarded to the API provider. Governed by the API provider's own ToS/privacy policy. |
| **Hosting provider** (e.g., Vercel — if deployed there) | Serving the application | Vercel retains access logs per their [Privacy Policy](https://vercel.com/legal/privacy-policy). Edge logs are typically retained for a short period (days). |

> **Note:** If the deployment platform changes, this section must be updated.

---

## 4. Cookies

gasync does **not** issue any first-party cookies. The theme preference (light/dark) is managed by `next-themes` using `localStorage` only, not cookies. No third-party analytics or advertising cookies are set.

---

## 5. Analytics & Tracking

There is currently **no analytics, telemetry, or behavioural tracking** integrated into this project. If analytics are added in the future, this document will be updated and a visible notice will be added to the UI before the feature is deployed.

---

## 6. Data Retention

The application does not maintain its own database or persistent storage. No user data is retained by the application layer. Hosting-provider access logs are subject to the hosting provider's own retention policy (typically 30 days or less).

---

## 7. User Rights

Because gasync does not collect or store personal data, there is no personal data to access, correct, export, or delete. If a user believes that data about them has been inadvertently collected, they may contact the maintainer (see §8) and a response will be provided within 30 days.

---

## 8. Contact

For privacy-related enquiries, open an issue in the project repository or contact the maintainer directly via GitHub (`@raldhelbiro`).

---

## 9. Changes to This Notice

This notice will be updated whenever the data practices described above change. The "last updated" date at the top of this document will reflect the most recent revision.
