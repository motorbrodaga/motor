# Roadmap: Задачник

## Overview

This roadmap builds Задачник as a vertical MVP: first a usable personal task shell, then core task management, assistant capture, daily focus, waiting workflows, reviews, history, integrations, calendar/notifications, and finally reliability hardening. Each phase delivers an observable user capability and maps every v1 requirement to exactly one phase.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Personal App Shell** - Open Задачник from phone/desktop, access it privately, and navigate the mobile app shell. (completed 2026-05-22)
- [x] **Phase 2: Core Task System** - Create, edit, organize, schedule, and act on tasks with categories, contexts, projects, and notes. (completed 2026-05-25)
- [x] **Phase 3: Assistant Capture** - Capture tasks through assistant dialogue with confirmation before save. (completed 2026-05-25)
- [x] **Phase 4: Daily Focus Dashboard** - Show today's work, propose 3 main tasks, and let the user confirm or adjust them. (completed 2026-06-01)
- [x] **Phase 5: Waiting And People** - Track people-related tasks in both waiting directions. (completed 2026-06-02)
- [x] **Phase 6: Soft Reviews** - Bring back forgotten, stale, unscheduled, and waiting tasks through weekly review. (completed 2026-06-02)
- [x] **Phase 7: Completion History** - Show completed work and simple progress statistics. (completed 2026-06-03)
- [x] **Phase 8: Telegram And Gmail Intake** - Create confirmed tasks from selected Telegram messages and Gmail emails. (completed 2026-06-04)
- [x] **Phase 9: Calendar And Notifications** - Send tasks to iPhone calendar and configure optional push notifications. (completed 2026-06-05)
- [x] **Phase 10: Offline, Conflicts, And Backups** - Make the MVP resilient with offline support, simple conflict handling, and backups. (completed 2026-06-10)

## Phase Details

### Phase 1: Personal App Shell

**Goal**: Deliver a private, mobile-first app shell that opens on phone and desktop and gives the user the main navigation path into Задачник.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: [ACCS-01, ACCS-02, ACCS-03, DASH-01, MOBL-01, MOBL-02, MOBL-03, MOBL-04]
**Success Criteria** (what must be TRUE):

  1. User can open Задачник from phone and desktop with the same app entry point.
  2. User can access the app through a private personal link and regenerate that link.
  3. Phone UI has app-like bottom navigation: Dashboard, Inbox, Waiting, Review, More.
  4. User can reach quick task capture from the mobile shell.

**Plans**: 4 plans

Plans:
**Wave 1**

- [x] 01-01: Choose app foundation and persistence approach for the initial shell

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02: Build private-link access and regeneration
- [x] 01-03: Build responsive app shell and bottom navigation

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-04: Add dashboard entry and quick capture entry point

### Phase 2: Core Task System

**Goal**: Make tasks real: create, edit, complete, archive/delete, categorize, schedule, add contexts, use projects lightly, and manage task notes.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: [TASK-01, TASK-02, TASK-03, TASK-04, TASK-05, TASK-06, TASK-07, TASK-08, TASK-09, TASK-10, TASK-11, TASK-12, TASK-13, TASK-14, TASK-15, TASK-16, ORGN-01, ORGN-02, ORGN-03, ORGN-04, ORGN-05, ORGN-06, ORGN-07]
**Success Criteria** (what must be TRUE):

  1. User can create a task quickly from a short title and leave unknown fields empty after confirmation.
  2. User can manage task status, importance, urgency, due date, do date, estimated time, actual time, description, and notes.
  3. User can organize tasks with default/custom colored categories and default/custom contexts.
  4. User can use task-card quick actions: complete, reschedule, change importance, add note, assign person.
  5. User can optionally associate tasks with projects without heavy project management.

**Plans**: 5 plans

Plans:

**Wave 1**

- [x] 02-01: Define task, category, context, project, and note data model

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 02-02: Implement task CRUD, status, archive/delete, and completion
- [x] 02-04: Implement categories, contexts, and lightweight projects

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 02-03: Implement scheduling fields, urgency/importance, estimated and actual time

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 02-05: Implement task-card quick actions and notes feed

### Phase 3: Assistant Capture

**Goal**: Let the user create tasks through assistant dialogue that clarifies missing details and saves only after confirmation.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: [CAPT-01, CAPT-02, CAPT-03, CAPT-04, CAPT-05]
**Success Criteria** (what must be TRUE):

  1. User can start task creation through an assistant-style dialogue.
  2. Assistant asks for missing details or shows a task-card interpretation.
  3. Assistant does not save a task after the first phrase without user confirmation.
  4. Confirmed assistant-created tasks use the same task model as manual tasks.

**Plans**: 3 plans

Plans:

**Wave 1**

- [x] 03-01: Design assistant capture flow and confirmation contract

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 03-02: Implement clarification and task-card preparation

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 03-03: Save confirmed assistant-created tasks into the core task system

### Phase 4: Daily Focus Dashboard

**Goal**: Make the dashboard answer "what must not be forgotten today?" with sections, top-3 suggestions, and user confirmation.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: [DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DASH-07, DASH-08, DASH-09, DASH-10, DASH-11]
**Success Criteria** (what must be TRUE):

  1. Dashboard shows today, overdue, waiting, important without due date, and category sections.
  2. System proposes 3 main tasks using urgency, importance, overdue state, and people-waiting weight.
  3. User can confirm or manually replace proposed main tasks.
  4. Unconfirmed top-3 tasks remain suggestions, and "other for today" remains visible.

**Plans**: 4 plans

Plans:

**Wave 1**

- [x] 04-01: Build dashboard sections and empty states

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 04-02: Implement top-3 ranking rules

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 04-03: Implement confirmation and manual replacement of top-3 tasks

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 04-04: Add "other for today" behavior and dashboard polish

### Phase 5: Waiting And People

**Goal**: Track tasks connected to other people, including both "they wait for me" and "I wait for them" workflows.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: [WAIT-01, WAIT-02, WAIT-03, WAIT-04, WAIT-05]
**Success Criteria** (what must be TRUE):

  1. User can associate a task with a person.
  2. User can set waiting direction as "they wait for me" or "I wait for them".
  3. Tasks where someone waits for the user can have a response due date.
  4. Tasks where the user waits for someone else without a date return after one week.
  5. Waiting is derived from person and direction without a separate waiting tag.

**Plans**: 3 plans

Plans:

**Wave 1**

- [x] 05-01: Implement people and waiting-direction model

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 05-02: Build waiting UI and response due-date handling

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 05-03: Add one-week follow-up behavior for waiting-on-others tasks

**Cross-cutting constraints:**

- D-04: The two user-facing directions are ждут от меня and я жду.
- D-05: Waiting state should be derived from person plus waiting direction, not from a separate tag.
- D-12: The waiting screen should separate or clearly distinguish ждут от меня from я жду.
- D-13: The screen should stay mobile-first and Russian-only, matching the existing app style.

### Phase 6: Soft Reviews

**Goal**: Bring lost tasks back into attention through weekly review and soft resurfacing rules.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: [REVW-01, REVW-02, REVW-03, REVW-04, REVW-05, REVW-06, REVW-07, REVW-08, REVW-09]
**Success Criteria** (what must be TRUE):

  1. Tasks without due dates return to attention once per week.
  2. User can open a Monday weekly review.
  3. Weekly review shows forgotten, stale, no-due-date, no-do-date, and waiting-without-movement items.
  4. Weekly review shows categories with accumulated open tasks.
  5. Weekly review is visibly separate from the morning review.

**Plans**: 4 plans

Plans:

**Wave 1**

- [x] 06-01: Implement soft resurfacing dates for no-due-date tasks

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 06-02: Implement stale task detection and forgotten-task grouping

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 06-03: Build weekly review screen and category accumulation view

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 06-04: Separate weekly review from morning review in navigation and state

**Cross-cutting constraints:**

- D-01: The weekly review should feel like a soft list, not a checklist audit or performance report.
- D-04: The tone should be very soft and pressure-free.
- D-13: The weekly review must be visibly separate from the morning Dashboard.
- D-10: The review must include forgotten, stale, no-due-date, no-do-date, waiting-without-movement, and category accumulation groups.

### Phase 7: Completion History

**Goal**: Give the user a lightweight memory of what was completed today and this week.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: [HIST-01, HIST-02, HIST-03, HIST-04, HIST-05]
**Success Criteria** (what must be TRUE):

  1. User can view completed tasks for today.
  2. User can view completed tasks for the week.
  3. Completion history shows task count and category distribution.
  4. Completion history includes manually entered actual time spent.

**Plans**: 3 plans

Plans:

**Wave 1**

- [x] 07-01: Build completion history queries and views

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 07-02: Add completion statistics by count, category, and time
- [x] 07-03: Connect history to task completion and manual actual-time entry

**Cross-cutting constraints:**

- D-02: The primary mental model is history as a calm reference view, not a mandatory step in the daily workflow.
- D-05: Show completed tasks as a day-based list: today, yesterday, and this week.
- D-06: The list matters in MVP because the user wants a lightweight memory of what actually got done, not only summary numbers.

### Phase 8: Telegram And Gmail Intake

**Goal**: Create confirmed tasks from Telegram and Gmail only when the user explicitly asks.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: [INTG-01, INTG-02, INTG-03, INTG-04, INTG-05, INTG-06, INTG-07, INTG-08, INTG-09, INTG-10, INTG-11]
**Success Criteria** (what must be TRUE):

  1. User can ask to create a task from Telegram `Motorcodex_bot` and choose from 20 latest messages.
  2. User can ask to create a task from Gmail and choose from up to 20 matching emails.
  3. Assistant prepares a task card for confirmation from the selected source.
  4. Imported tasks store a text source label and do not need source links.
  5. System never automatically scans all Telegram/Gmail content into tasks.

**Plans**: 5 plans

Plans:

**Wave 1**

- [x] 08-04: Store source labels without source links
- [x] 08-05: Add privacy and explicit-request safeguards

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 08-01: Implement Telegram Motorcodex_bot selection flow
- [x] 08-02: Implement Gmail search and 20-result selection flow

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 08-03: Convert selected Telegram/Gmail source into confirmed task cards

### Phase 9: Calendar And Notifications

**Goal**: As a personal task manager user, I want to connect dated tasks to my iPhone calendar and control optional reminders, so that time-bound tasks return to my attention without feeling overwhelming.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: [CALN-01, CALN-02, CALN-03, CALN-04, CALN-05, NOTF-01, NOTF-02, NOTF-03]
**Success Criteria** (what must be TRUE):

  1. User can add a dated/timed task to iPhone calendar.
  2. User is asked for date/time before calendar export when the task lacks it.
  3. Calendar event uses task title and can include description/notes.
  4. Linked calendar events update when tasks change.
  5. User can enable/disable push notifications for morning review and other reminders.

**Plans**: 5 plans

Plans:

**Wave 1**

- [x] 09-01: Choose and implement iPhone calendar integration strategy
- [x] 09-04: Add notification preferences for morning review and other reminders

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 09-02: Create calendar events from tasks with date/time
- [x] 09-05: Keep reminder behavior soft in UI and notification copy

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 09-03: Update linked calendar events after task changes

### Phase 10: Offline, Conflicts, And Backups

**Goal**: Make the MVP trustworthy by supporting offline phone usage, simple conflict handling, and automatic backups.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: [ACCS-04, ACCS-05, ACCS-06]
**Success Criteria** (what must be TRUE):

  1. User can keep working with tasks on the phone while offline.
  2. Offline edits sync back with latest-change-wins conflict behavior.
  3. Automatic backups exist and can be used to recover task data.

**Plans**: 3 plans

Plans:

**Wave 1**

- [x] 10-01: Implement offline task storage and sync queue

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 10-02: Implement latest-change-wins conflict resolution

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 10-03: Implement automatic backup and recovery path

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Personal App Shell | 4/4 | Complete    | 2026-05-22 |
| 2. Core Task System | 5/5 | Complete    | 2026-05-25 |
| 3. Assistant Capture | 3/3 | Complete    | 2026-05-27 |
| 4. Daily Focus Dashboard | 4/4 | Complete    | 2026-06-01 |
| 5. Waiting And People | 3/3 | Complete    | 2026-06-02 |
| 6. Soft Reviews | 4/4 | Complete    | 2026-06-02 |
| 7. Completion History | 3/3 | Complete    | 2026-06-03 |
| 8. Telegram And Gmail Intake | 5/5 | Complete    | 2026-06-04 |
| 9. Calendar And Notifications | 6/6 | Complete   | 2026-06-06 |
| 10. Offline, Conflicts, And Backups | 3/3 | Complete | 2026-06-10 |
