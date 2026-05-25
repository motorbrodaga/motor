# Requirements: Задачник

**Defined:** 2026-05-22
**Core Value:** Не дать задачам потеряться.

## v1 Requirements

### Access

- [x] **ACCS-01**: User can open the app from phone and desktop against the same task database.
- [x] **ACCS-02**: User can access the MVP through a private personal link.
- [x] **ACCS-03**: User can regenerate the private access link.
- [ ] **ACCS-04**: User can keep working with tasks on the phone while offline.
- [ ] **ACCS-05**: When offline edits conflict, the latest change wins.
- [ ] **ACCS-06**: System creates automatic backups so task data is recoverable.

### Tasks

- [x] **TASK-01**: User can quickly create a task from a short title without filling project, due date, or priority.
- [x] **TASK-02**: User can edit an existing task.
- [x] **TASK-03**: User can mark a task complete.
- [x] **TASK-04**: User can delete or archive a task without exposing a separate archive workflow in the MVP UI.
- [x] **TASK-05**: User can set task status: inbox, to do, in progress, waiting, complete.
- [x] **TASK-06**: User can set task importance separately from urgency.
- [x] **TASK-07**: User can set urgency as a binary urgent / not urgent field.
- [x] **TASK-08**: User can set a due date that means the deadline for completion.
- [x] **TASK-09**: User can set a do date that means the day the user plans to work on the task.
- [x] **TASK-10**: User can set estimated task duration manually.
- [x] **TASK-11**: User can record actual time spent manually after or during task work.
- [x] **TASK-12**: User can add and edit a task description.
- [x] **TASK-13**: User can add notes as a chronological notes/comments feed on the task.
- [x] **TASK-14**: User can leave unknown task fields empty after confirming the task.
- [x] **TASK-15**: User can use quick actions on a task card: complete, reschedule, change importance, add note, assign person.
- [x] **TASK-16**: User can reschedule a task with quick options: tomorrow, in a week, or choose date.

### Organization

- [x] **ORGN-01**: User can use default categories: work, personal, calls, household.
- [x] **ORGN-02**: User can create custom categories.
- [x] **ORGN-03**: User can assign a visible color to each category.
- [x] **ORGN-04**: User can assign one or more contexts to a task.
- [x] **ORGN-05**: User can use default contexts: call, computer, home, on the go, with person.
- [x] **ORGN-06**: User can create custom contexts.
- [x] **ORGN-07**: User can optionally associate a task with a project without requiring heavy project methodology.

### Assistant Capture

- [ ] **CAPT-01**: User can create a task through assistant dialogue as a primary capture path.
- [ ] **CAPT-02**: Assistant clarifies missing task details or shows its understanding before saving.
- [ ] **CAPT-03**: Assistant saves a task only after user confirmation.
- [ ] **CAPT-04**: Assistant can ask about what needs to be done, category, due date, do date, estimated time, importance, waiting person, and waiting direction.
- [ ] **CAPT-05**: Assistant can prepare a task card from incomplete information and ask the user to confirm before saving.

### Dashboard

- [x] **DASH-01**: User sees a main dashboard as the first screen.
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

- [x] **MOBL-01**: Phone UI feels app-like as far as the selected stack allows.
- [x] **MOBL-02**: Mobile bottom navigation includes Dashboard, Inbox, Waiting, Review, More.
- [x] **MOBL-03**: More section does not include separate "All tasks" and "Categories" items in the MVP.
- [x] **MOBL-04**: Quick task capture is available from the mobile experience.

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
| ACCS-01 | Phase 1 | Complete |
| ACCS-02 | Phase 1 | Complete |
| ACCS-03 | Phase 1 | Complete |
| DASH-01 | Phase 1 | Complete |
| MOBL-01 | Phase 1 | Complete |
| MOBL-02 | Phase 1 | Complete |
| MOBL-03 | Phase 1 | Complete |
| MOBL-04 | Phase 1 | Complete |
| TASK-01 | Phase 2 | Complete |
| TASK-02 | Phase 2 | Complete |
| TASK-03 | Phase 2 | Complete |
| TASK-04 | Phase 2 | Complete |
| TASK-05 | Phase 2 | Complete |
| TASK-06 | Phase 2 | Complete |
| TASK-07 | Phase 2 | Complete |
| TASK-08 | Phase 2 | Complete |
| TASK-09 | Phase 2 | Complete |
| TASK-10 | Phase 2 | Complete |
| TASK-11 | Phase 2 | Complete |
| TASK-12 | Phase 2 | Complete |
| TASK-13 | Phase 2 | Complete |
| TASK-14 | Phase 2 | Complete |
| TASK-15 | Phase 2 | Complete |
| TASK-16 | Phase 2 | Complete |
| ORGN-01 | Phase 2 | Complete |
| ORGN-02 | Phase 2 | Complete |
| ORGN-03 | Phase 2 | Complete |
| ORGN-04 | Phase 2 | Complete |
| ORGN-05 | Phase 2 | Complete |
| ORGN-06 | Phase 2 | Complete |
| ORGN-07 | Phase 2 | Complete |
| CAPT-01 | Phase 3 | Pending |
| CAPT-02 | Phase 3 | Pending |
| CAPT-03 | Phase 3 | Pending |
| CAPT-04 | Phase 3 | Pending |
| CAPT-05 | Phase 3 | Pending |
| DASH-02 | Phase 4 | Pending |
| DASH-03 | Phase 4 | Pending |
| DASH-04 | Phase 4 | Pending |
| DASH-05 | Phase 4 | Pending |
| DASH-06 | Phase 4 | Pending |
| DASH-07 | Phase 4 | Pending |
| DASH-08 | Phase 4 | Pending |
| DASH-09 | Phase 4 | Pending |
| DASH-10 | Phase 4 | Pending |
| DASH-11 | Phase 4 | Pending |
| WAIT-01 | Phase 5 | Pending |
| WAIT-02 | Phase 5 | Pending |
| WAIT-03 | Phase 5 | Pending |
| WAIT-04 | Phase 5 | Pending |
| WAIT-05 | Phase 5 | Pending |
| REVW-01 | Phase 6 | Pending |
| REVW-02 | Phase 6 | Pending |
| REVW-03 | Phase 6 | Pending |
| REVW-04 | Phase 6 | Pending |
| REVW-05 | Phase 6 | Pending |
| REVW-06 | Phase 6 | Pending |
| REVW-07 | Phase 6 | Pending |
| REVW-08 | Phase 6 | Pending |
| REVW-09 | Phase 6 | Pending |
| HIST-01 | Phase 7 | Pending |
| HIST-02 | Phase 7 | Pending |
| HIST-03 | Phase 7 | Pending |
| HIST-04 | Phase 7 | Pending |
| HIST-05 | Phase 7 | Pending |
| INTG-01 | Phase 8 | Pending |
| INTG-02 | Phase 8 | Pending |
| INTG-03 | Phase 8 | Pending |
| INTG-04 | Phase 8 | Pending |
| INTG-05 | Phase 8 | Pending |
| INTG-06 | Phase 8 | Pending |
| INTG-07 | Phase 8 | Pending |
| INTG-08 | Phase 8 | Pending |
| INTG-09 | Phase 8 | Pending |
| INTG-10 | Phase 8 | Pending |
| INTG-11 | Phase 8 | Pending |
| CALN-01 | Phase 9 | Pending |
| CALN-02 | Phase 9 | Pending |
| CALN-03 | Phase 9 | Pending |
| CALN-04 | Phase 9 | Pending |
| CALN-05 | Phase 9 | Pending |
| NOTF-01 | Phase 9 | Pending |
| NOTF-02 | Phase 9 | Pending |
| NOTF-03 | Phase 9 | Pending |
| ACCS-04 | Phase 10 | Pending |
| ACCS-05 | Phase 10 | Pending |
| ACCS-06 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 87 total
- Mapped to phases: 87
- Unmapped: 0

---
*Requirements defined: 2026-05-22*
*Last updated: 2026-05-22 after roadmap creation*
