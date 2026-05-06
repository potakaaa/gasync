# IP & Attribution

> **Week 12 deliverable** — last updated: 2025-05

This document lists all third-party libraries, frameworks, fonts, icons, and other assets used in **gasync**, along with their licenses and required attributions.

---

## 1. Runtime Dependencies

| Package | Version | License | Notes |
|---|---|---|---|
| [Next.js](https://nextjs.org) | 16.2.3 | MIT | Framework |
| [React](https://react.dev) | 19.2.4 | MIT | UI library |
| [react-dom](https://react.dev) | 19.2.4 | MIT | DOM renderer |
| [Recharts](https://recharts.org) | 3.8.0 | MIT | Chart rendering |
| [Radix UI](https://www.radix-ui.com) | ^1.4.3 | MIT | Accessible primitives |
| [shadcn/ui](https://ui.shadcn.com) | ^4.2.0 | MIT | Component collection built on Radix |
| [Lucide React](https://lucide.dev) | ^1.8.0 | ISC | Icon set |
| [next-themes](https://github.com/pacocoursey/next-themes) | ^0.4.6 | MIT | Dark/light theme switching |
| [clsx](https://github.com/lukeed/clsx) | ^2.1.1 | MIT | Conditional class names |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | ^3.5.0 | MIT | Tailwind class deduplication |
| [class-variance-authority](https://cva.style) | ^0.7.1 | Apache-2.0 | Variant-based component styling |
| [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) | ^1.4.0 | MIT | Tailwind animation utilities |

---

## 2. Development Dependencies

| Package | Version | License | Notes |
|---|---|---|---|
| [TypeScript](https://www.typescriptlang.org) | ^5 | Apache-2.0 | Type system |
| [Tailwind CSS](https://tailwindcss.com) | ^4 | MIT | Utility-first CSS |
| [ESLint](https://eslint.org) | ^9 | MIT | Linting |
| [eslint-config-next](https://nextjs.org/docs/app/building-your-application/configuring/eslint) | 16.2.3 | MIT | Next.js ESLint ruleset |
| [Vitest](https://vitest.dev) | ^4.1.4 | MIT | Unit/integration testing |
| [jsdom](https://github.com/jsdom/jsdom) | ^29.0.2 | MIT | DOM simulation for tests |
| [@testing-library/react](https://testing-library.com) | ^16.3.2 | MIT | React component testing |
| [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) | ^6.9.1 | MIT | Custom DOM matchers |
| [Husky](https://typicode.github.io/husky) | (via .husky/) | MIT | Git hooks |

---

## 3. Data Sources

| Source | Usage | License / ToS |
|---|---|---|
| **Commodity Price API** (third-party, via `COMMODITY_PRICE_API_*` env vars) | Real-time and historical futures prices for NG-FUT, BRENTOIL-FUT, WTIOIL-FUT | Subject to the provider's Terms of Service. API key must not be exposed client-side. Data must not be redistributed or resold. |

> **Action required:** insert the exact API provider name and link to their ToS once confirmed.

---

## 4. Fonts & Visual Assets

| Asset | Source | License |
|---|---|---|
| **Geist** (sans + mono) | [Vercel](https://vercel.com/font) via `next/font` | SIL Open Font License 1.1 |
| `public/next.svg` | Next.js branding | © Vercel — used for demo/development only; remove before production |
| `public/vercel.svg` | Vercel branding | © Vercel — used for demo/development only; remove before production |
| `public/file.svg`, `public/globe.svg`, `public/window.svg` | Next.js scaffold | MIT (part of create-next-app template) |

---

## 5. AI-Assisted Development

Portions of this codebase were developed with the assistance of AI tools (e.g., GitHub Copilot, Claude by Anthropic). All AI-generated code was reviewed, tested, and accepted by the human developer. The developer retains full authorship and responsibility for the final code.

---

## 6. License Summary

This project is released under the **MIT License** (see [`LICENSE`](../LICENSE)). All dependencies listed above are compatible with MIT distribution. The `class-variance-authority` and `TypeScript` packages use the Apache-2.0 license, which is also permissive and compatible with this project's MIT license for distribution purposes.
