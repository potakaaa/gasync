# Product Backlog: Group Work Contribution Analyzer

Product goal: help group project teams measure and discuss individual contribution using self evaluation, peer evaluation, and activity logs.

## User Stories

| ID | User story | Priority | Points | Acceptance criteria |
| --- | --- | --- | --- | --- |
| 1 | As a team member, I want to submit a self evaluation so that I can describe my own contribution to the project. | P1 | 3 | A self evaluation form is available; responses can be saved; submission status is visible; the user can edit before the review window closes. |
| 2 | As a team member, I want to rate my peers so that the team can capture shared feedback on contribution. | P1 | 5 | A peer rating form lists all teammates; ratings can be submitted once per review period; ratings are stored with timestamps; duplicate submissions are prevented. |
| 3 | As a project lead, I want to define the project team and review cycle so that evaluations are collected for the correct group and timeframe. | P1 | 5 | A team can be created or imported; members can be added and removed; review start and end dates can be configured; the system prevents submissions outside the active window. |
| 4 | As a project lead, I want to track tasks and ownership so that contribution can be compared against assigned work. | P1 | 8 | Tasks can be created with owner, due date, and status; tasks can be updated as work progresses; the activity log records task changes; task data is available in contribution reports. |
| 5 | As a student, I want my activity log to capture meaningful actions so that the contribution score has evidence beyond ratings. | P1 | 8 | The system records task creation, updates, completions, and review submissions; activity entries include user, action, and timestamp; logged events appear in the contribution timeline. |
| 6 | As a project lead, I want the system to calculate a contribution score so that I can compare team members consistently. | P1 | 8 | A score is generated from self evaluation, peer ratings, and activity logs; the formula is documented; recalculation happens when inputs change; the score is visible per member. |
| 7 | As a project lead, I want to view a contribution dashboard so that I can quickly identify balanced or uneven participation. | P2 | 5 | The dashboard shows each member’s score, task completion, peer feedback, and activity summary; users can sort and filter members; the view loads without missing data for reviewed members. |
| 8 | As a student, I want to see my own contribution summary so that I understand how I am being evaluated. | P2 | 3 | Each member can open a personal summary; the summary shows their score breakdown; feedback is readable; private peer identities are masked where required. |
| 9 | As an instructor, I want to export contribution reports so that I can use them in grading and review meetings. | P2 | 5 | Reports can be exported as PDF or CSV; exported files include scores, task data, and key feedback; exports respect the selected team and review cycle. |
| 10 | As a project lead, I want to flag contribution disputes so that low-confidence ratings can be reviewed manually. | P3 | 5 | A dispute can be created for a member or review cycle; the dispute captures notes and status; flagged records are highlighted in reports; manual overrides are tracked. |

## Prioritization Notes

- P1 items establish the minimum viable workflow: collect evaluations, track work, and compute a score.
- P2 items improve visibility for students and instructors.
- P3 items support exception handling and administrative follow-up.
