# Risk Register: Group Work Contribution Analyzer

Scoring rule: Score = Likelihood x Impact.

| Risk | Likelihood (1-5) | Impact (1-5) | Score | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- |
| Peer ratings are biased or inconsistent across teammates. | 4 | 5 | 20 | Provide rating rubric examples, run calibration at review start, and flag outlier ratings for QA review. | Vin Gerebise |
| Self evaluations are inflated and distort final scores. | 4 | 4 | 16 | Cap self-evaluation weight and show score breakdown so users can audit influence by component. | Rald Helbiro |
| Task updates are not kept current, reducing evidence quality. | 3 | 4 | 12 | Add required status updates at checkpoint dates and weekly PM/Scrum follow-up for stale tasks. | Hans Del Mundo |
| Review window opens late or closes early due to configuration errors. | 3 | 5 | 15 | Add validation for dates, timezone checks, and QA sign-off before activating each review cycle. | Ira Narisma |
| Configurable weight settings are misconfigured and produce unfair scores. | 4 | 5 | 20 | Enforce total weight = 100, keep versioned weight history, and require PM/Scrum approval for weight changes. | Ira Narisma |
| Role-based access is too broad and exposes peer feedback details. | 2 | 5 | 10 | Apply least-privilege permissions and mask reviewer identity in student-facing views. | Vin Gerebise |
| Score recalculation fails after data or weight changes. | 3 | 5 | 15 | Add recalculation regression tests, retry queue for failures, and alerting on stale score snapshots. | Hans Del Mundo |
| Sprint scope churn from change requests causes delivery slippage. | 4 | 4 | 16 | Use change control checkpoints and swap equal-size stories instead of adding net-new sprint points. | Rald Helbiro |
| Exported reports omit recent updates due to caching delays. | 2 | 4 | 8 | Refresh cache before export and include generation timestamp and source period metadata in report headers. | Ira Narisma |
