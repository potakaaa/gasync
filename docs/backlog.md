# Product Backlog: Group Work Contribution Analyzer

## User Stories

### Story 1
As a student, I want to submit a self evaluation so that I can describe my contribution clearly.

- Priority: High
- Story points: 3
- Acceptance criteria:
- I can open a self evaluation form for the active review window.
- I can save and submit my self evaluation.
- I can see whether my self evaluation is submitted or pending.

### Story 2
As a student, I want to rate my teammates so that peer feedback is part of contribution scoring.

- Priority: High
- Story points: 5
- Acceptance criteria:
- I can view all teammates except myself in the peer rating form.
- I can submit one peer rating per teammate in a review cycle.
- The system records submission time and prevents duplicate submissions.

### Story 3
As a PM/Scrum lead, I want to define review periods so that evaluations happen on schedule.

- Priority: High
- Story points: 3
- Acceptance criteria:
- I can create a review period with start and end dates.
- Students can submit evaluations only during an active review period.
- Closed review periods are visible as read-only history.

### Story 4
As a team member, I want to create and update tasks so that work progress is trackable.

- Priority: High
- Story points: 5
- Acceptance criteria:
- I can create a task with title, owner, and due date.
- I can move a task across status states (To Do, In Progress, Done).
- Task updates are saved and visible to the full group.

### Story 5
As a QA lead, I want activity logs for key actions so that contribution evidence is auditable.

- Priority: High
- Story points: 5
- Acceptance criteria:
- The system logs task creation, task status updates, and evaluation submissions.
- Each log entry includes actor, action, and timestamp.
- Logs are viewable per member and per project.

### Story 6
As a PM/Scrum lead, I want an initial contribution score formula so that contribution can be compared fairly.

- Priority: High
- Story points: 8
- Acceptance criteria:
- The score combines self evaluation, peer rating, and activity signals.
- Score inputs and weights are documented in the app.
- Scores recalculate when underlying data changes.

### Story 7
As a student, I want to see my score breakdown so that I understand how my final score was computed.

- Priority: Med
- Story points: 3
- Acceptance criteria:
- I can view my total score and component weights.
- I can see my completed tasks and activity summary.
- Peer feedback is shown with reviewer identity hidden.

### Story 8
As an instructor, I want a team contribution dashboard so that I can quickly detect participation imbalance.

- Priority: Med
- Story points: 8
- Acceptance criteria:
- I can view all members with score, task completion, and activity volume.
- I can sort members by score and completed tasks.
- I can filter the dashboard by review period.

### Story 9
As a Docs lead, I want report export so that sprint review evidence can be shared externally.

- Priority: Low
- Story points: 2
- Acceptance criteria:
- I can export contribution summaries to CSV.
- Exported data includes member name, score, and task summary.
- Exports use the currently selected review period.

### Story 10
As a PM/Scrum lead, I want to flag scoring disputes so that questionable evaluations are reviewed.

- Priority: Low
- Story points: 2
- Acceptance criteria:
- I can create a dispute record for a member and review period.
- A dispute includes reason, status, and owner.
- Resolved disputes remain in audit history.
