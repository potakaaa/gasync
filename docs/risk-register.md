# Risk Register: Gas Price Viewer

Scoring rule: Score = Likelihood x Impact.

| Risk | Likelihood (1-5) | Impact (1-5) | Score | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- |
| Upstream gas price API has outages during market volatility spikes. | 4 | 5 | 20 | Integrate fallback data provider, cache recent prices, and display provider status in UI. | Hans Del Mundo |
| Prices become stale during breaking geopolitical events, misleading users. | 4 | 5 | 20 | Enforce freshness thresholds, show staleness warnings, and prioritize rapid refresh for affected regions. | Ira Narisma |
| Event feed includes unverified claims that reduce user trust. | 3 | 5 | 15 | Allow only vetted sources, require citations, and add editorial review before publishing event cards. | Vin Gerebise |
| Currency and unit conversion errors produce incorrect comparisons. | 3 | 4 | 12 | Centralize conversion logic, test against known benchmarks, and monitor anomalies. | Rald Helbiro |
| Alert notifications are delayed and fail to warn users before a price jump. | 3 | 5 | 15 | Add queue retries, latency monitoring, and user-visible delivery status for alerts. | Hans Del Mundo |
| Sudden regional taxes or policy changes are not reflected promptly. | 4 | 4 | 16 | Add policy-update ingestion checks and manual override workflow for urgent corrections. | Ira Narisma |
| Map and trend queries slow down under high traffic during crisis news cycles. | 3 | 4 | 12 | Add caching, query limits, and autoscaling rules for peak demand windows. | Rald Helbiro |
| Event impact tags are inconsistent across editors. | 3 | 3 | 9 | Publish tagging rubric, train editors, and run periodic QA consistency audits. | Vin Gerebise |
| Data licensing restrictions limit redistribution of station-level prices. | 2 | 5 | 10 | Review provider contracts, limit restricted exports, and include licensing notice in downloads. | Ira Narisma |
