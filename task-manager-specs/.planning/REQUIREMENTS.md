# Requirements: Задачник

**Defined:** 2026-05-22
**Core Value:** Не дать задачам потеряться.

## v1 Requirements

### Access

- [ ] **ACCS-01**: User can open the app from phone and desktop against the same task database.
- [ ] **ACCS-02**: User can access the MVP through a private personal link.
- [ ] **ACCS-03**: User can regenerate the private access link.
- [ ] **ACCS-04**: User can keep working with tasks on the phone while offline.
- [ ] **ACCS-05**: When offline edits conflict, the latest change wins.
- [ ] **ACCS-06**: System creates automatic backups so task data is recoverable.

### Tasks

- [ ] **TASK-01**: User can quickly create a task from a short title without filling project, due date, or priority.
- [ ] **TASK-02**: User can edit an existing task.
- [ ] **TASK-03**: User can mark a task complete.
- [ ] **TASK-04**: User can delete or archive a task without exposing a separate archive workflow in the MVP UI.
- [ ] **TASK-05**: User can set task status: inbox, to do, in progress, waiting, complete.
- [ ] **TASK-06**: User can set task importance separately from urgency.
- [ ] **TASK-07**: User can set urgency as a binary urgent / not urgent field.
- [ ] **TASK-08**: User can set a due date that means the deadline for completion.
- [ ] **TASK-09**: User can set a do date that means the day the user plans to work on the task.
- [ ] **TASK-10**: User can set estimated task duration manually.
- [ ] **TASK-11**: User can record actual time spent manually after or during task work.
- [ ] **TASK-12**: User can add and edit a task description.
- [ ] **TASK-13**: User can add notes as a chronological notes/comments feed on the task.
- [ ] **TASK-14**: User can leave unknown task fields empty after confirming the task.
- [ ] **TASK-15**: User can use quick actions on a task card: complete, reschedule, change importance, add note, assign person.
- [ ] **TASK-16**: User can reschedule a task with quick options: tomorrow, in a week, or choose date.

### Organization

- [ ] **ORGN-01**: User can use default categories: work, personal, calls, household.
- [ ] **ORGN-02**: User can create custom categories.
- [ ] **ORGN-03**: User can assign a visible color to each category.
- [ ] **ORGN-04**: User can assign one or more contexts to a task.
- [ ] **ORGN-05**: User can use default contexts: call, computer, home, on the go, with person.
- [ ] **ORGN-06**: User can create custom contexts.
- [ ] **ORGN-07**: User can optionally associate a task with a project without requiring heavy project methodology.

### Assistant Capture

- [ ] **CAPT-01**: User can create a task through assistant dialogue as a primary capture path.
- [ ] **CAPT-02**: Assistant clarifies missing task details or shows its understanding before saving.
- [ ] **CAPT-03**: Assistant saves a task only after user confirmation.
- [ ] **CAPT-04**: Assistant can ask about what needs to be done, category, due date, do date, estimated time, importance, waiting person, and waiting direction.
- [ ] **CAPT-05**: Assistant can prepare a task card from incomplete information and ask the user to confirm before saving.

### Dashboard

- [ ] **DASH-01**: User sees a main dashboard as the first screen.
- [ ] **DASH-02**: Dashboard shows today, overdue, waiting, important without due date, and category sections.
- [ ] **DASH-03**: Morning dashboard proposes 3 main tasks for the day.
- [ ] **DASH-04**: User can confirm the proposed 3 main tasks.
- [ ] **DASH-05**: User can manually replace any proposed main task.
- [ ] **DASH-06**: Unconfirmed proposed main tasks remain suggestions and are not treated as selected.
- [ ] **DASH-07**: Dashboard includes an "other for today" block alongside the 3 main tasks.
- [ ] **DASH-08**: System ranks main task suggestions with urgency above importance.
- [ ] **DASH-09**: System gives extra ranking weight to tasks where another person is waiting for the user.
- [ ] **DASH-10**: System includes overdue tasks in the top 3 only when they are important or urgent.
- [ ] **DASH-11**: Task size does not exclude a task from main-task suggestions.

### Waiting

- [ ] **WAIT-01**: User can associate a task with a person.
- [ ] **WAIT-02**: User can mark waiting direction as "they are waiting for me" or "I am waiting for them".
- [ ] **WAIT-03**: User can set a response due date for tasks where someone is waiting for the user.
- [ ] **WAIT-04**: For "I am waiting for them" tasks without a date, system reminds the user to check status after one week.
- [ ] **WAIT-05**: Waiting state is derived from person plus waiting direction, without a separate "person is waiting" tag.

### Reviews

- [ ] **REVW-01**: System softly returns tasks without a due date to attention once per week.
- [ ] **REVW-02**: User can open a weekly review on Mondays.
- [ ] **REVW-03**: Weekly review shows forgotten tasks.
- [ ] **REVW-04**: Weekly review shows stale tasks with no changes for 7 days.
- [ ] **REVW-05**: Weekly review shows tasks without due date.
- [ ] **REVW-06**: Weekly review shows tasks without do date.
- [ ] **REVW-07**: Weekly review shows waiting items without movement.
- [ ] **REVW-08**: Weekly review shows categories with accumulated open tasks.
- [ ] **REVW-09**: Weekly review is a separate block, not mixed into the morning review.

### History

- [ ] **HIST-01**: User can view completed tasks for today.
- [ ] **HIST-02**: User can view completed tasks for the week.
- [ ] **HIST-03**: Completion history shows task count.
- [ ] **HIST-04**: Completion history shows distribution by category.
- [ ] **HIST-05**: Completion history shows manually entered actual time spent.

### Integrations

- [ ] **INTG-01**: User can explicitly ask the system to create a task from Telegram.
- [ ] **INTG-02**: Telegram task import uses the `https://t.me/Motorcodex_bot` chat as the MVP source.
- [ ] **INTG-03**: Telegram import shows 20 latest messages for user selection.
- [ ] **INTG-04**: Assistant summarizes the selected Telegram message into task content instead of copying it verbatim.
- [ ] **INTG-05**: User can explicitly ask the system to create a task from Gmail.
- [ ] **INTG-06**: Gmail import can search for a relevant email based on the user's request.
- [ ] **INTG-07**: If multiple Gmail messages match, system shows up to 20 options for user selection.
- [ ] **INTG-08**: Assistant prepares a task card for confirmation from the selected Gmail email.
- [ ] **INTG-09**: Imported tasks store a text source label such as "from Gmail" or "from Telegram Motorcodex_bot".
- [ ] **INTG-10**: Imported tasks do not need to store links to original messages or emails.
- [ ] **INTG-11**: System never automatically scans all Telegram/Gmail content to create tasks without explicit user request.

### Calendar

- [ ] **CALN-01**: User can add a task with date/time to the iPhone calendar.
- [ ] **CALN-02**: If a task has no date/time, user is asked for date/time before adding it to calendar.
- [ ] **CALN-03**: Calendar event title contains the task title.
- [ ] **CALN-04**: Calendar event description can include task description or notes.
- [ ] **CALN-05**: When a task changes in Задачник, the linked iPhone calendar event updates.

### Notifications

- [ ] **NOTF-01**: User can enable or disable push notifications for the morning review.
- [ ] **NOTF-02**: User can enable or disable push notifications for other task reminders.
- [ ] **NOTF-03**: MVP favors soft reminders through reviews, highlighting, and grouping over hard exact-time notification flows.

### Mobile UI

- [ ] **MOBL-01**: Phone UI feels app-like as far as the selected stack allows.
- [ ] **MOBL-02**: Mobile bottom navigation includes Dashboard, Inbox, Waiting, Review, More.
- [ ] **MOBL-03**: More section does not include separate "All tasks" and "Categories" items in the MVP.
- [ ] **MOBL-04**: Quick task capture is available from the mobile experience.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Recurrence

- **RECR-01**: User can create repeating tasks.
- **RECR-02**: User can start with weekly recurrence and change the interval.
- **RECR-03**: System creates the next task copy on schedule.
- **RECR-04**: Editing a recurring task changes only the current task by default.

### Subtasks

- **SUBT-01**: Assistant can help split a large task into subtasks through dialogue.
- **SUBT-02**: Subtasks do not complicate quick creation of a simple task.

### Collaboration

- **COLL-01**: Multiple users can share task spaces.
- **COLL-02**: Team roles and permissions can be configured.
- **COLL-03**: Tasks can be assigned in a team workflow.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Team roles in MVP | First version is only for one user |
| Shared multi-user access in MVP | Personal task system is the core first problem |
| Heavy project management methodology | Would slow down the first useful version |
| Tags | Explicitly excluded from first version |
| Attachments | Explicitly excluded from MVP |
| Phone voice input | Not needed in first version |
| Start/stop timer | Actual time is entered manually |
| Separate completed-task archive UI | Completion history is enough |
| Separate "person is waiting" tag | Waiting is derived from person and direction |
| Automatic Telegram/Gmail scanning | Tasks from communications require explicit user request |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ACCS-01 | TBD | Pending |
| ACCS-02 | TBD | Pending |
| ACCS-03 | TBD | Pending |
| ACCS-04 | TBD | Pending |
| ACCS-05 | TBD | Pending |
| ACCS-06 | TBD | Pending |
| TASK-01 | TBD | Pending |
| TASK-02 | TBD | Pending |
| TASK-03 | TBD | Pending |
| TASK-04 | TBD | Pending |
| TASK-05 | TBD | Pending |
| TASK-06 | TBD | Pending |
| TASK-07 | TBD | Pending |
| TASK-08 | TBD | Pending |
| TASK-09 | TBD | Pending |
| TASK-10 | TBD | Pending |
| TASK-11 | TBD | Pending |
| TASK-12 | TBD | Pending |
| TASK-13 | TBD | Pending |
| TASK-14 | TBD | Pending |
| TASK-15 | TBD | Pending |
| TASK-16 | TBD | Pending |
| ORGN-01 | TBD | Pending |
| ORGN-02 | TBD | Pending |
| ORGN-03 | TBD | Pending |
| ORGN-04 | TBD | Pending |
| ORGN-05 | TBD | Pending |
| ORGN-06 | TBD | Pending |
| ORGN-07 | TBD | Pending |
| CAPT-01 | TBD | Pending |
| CAPT-02 | TBD | Pending |
| CAPT-03 | TBD | Pending |
| CAPT-04 | TBD | Pending |
| CAPT-05 | TBD | Pending |
| DASH-01 | TBD | Pending |
| DASH-02 | TBD | Pending |
| DASH-03 | TBD | Pending |
| DASH-04 | TBD | Pending |
| DASH-05 | TBD | Pending |
| DASH-06 | TBD | Pending |
| DASH-07 | TBD | Pending |
| DASH-08 | TBD | Pending |
| DASH-09 | TBD | Pending |
| DASH-10 | TBD | Pending |
| DASH-11 | TBD | Pending |
| WAIT-01 | TBD | Pending |
| WAIT-02 | TBD | Pending |
| WAIT-03 | TBD | Pending |
| WAIT-04 | TBD | Pending |
| WAIT-05 | TBD | Pending |
| REVW-01 | TBD | Pending |
| REVW-02 | TBD | Pending |
| REVW-03 | TBD | Pending |
| REVW-04 | TBD | Pending |
| REVW-05 | TBD | Pending |
| REVW-06 | TBD | Pending |
| REVW-07 | TBD | Pending |
| REVW-08 | TBD | Pending |
| REVW-09 | TBD | Pending |
| HIST-01 | TBD | Pending |
| HIST-02 | TBD | Pending |
| HIST-03 | TBD | Pending |
| HIST-04 | TBD | Pending |
| HIST-05 | TBD | Pending |
| INTG-01 | TBD | Pending |
| INTG-02 | TBD | Pending |
| INTG-03 | TBD | Pending |
| INTG-04 | TBD | Pending |
| INTG-05 | TBD | Pending |
| INTG-06 | TBD | Pending |
| INTG-07 | TBD | Pending |
| INTG-08 | TBD | Pending |
| INTG-09 | TBD | Pending |
| INTG-10 | TBD | Pending |
| INTG-11 | TBD | Pending |
| CALN-01 | TBD | Pending |
| CALN-02 | TBD | Pending |
| CALN-03 | TBD | Pending |
| CALN-04 | TBD | Pending |
| CALN-05 | TBD | Pending |
| NOTF-01 | TBD | Pending |
| NOTF-02 | TBD | Pending |
| NOTF-03 | TBD | Pending |
| MOBL-01 | TBD | Pending |
| MOBL-02 | TBD | Pending |
| MOBL-03 | TBD | Pending |
| MOBL-04 | TBD | Pending |

**Coverage:**
- v1 requirements: 82 total
- Mapped to phases: 0
- Unmapped: 82

---
*Requirements defined: 2026-05-22*
*Last updated: 2026-05-22 after initial definition*
