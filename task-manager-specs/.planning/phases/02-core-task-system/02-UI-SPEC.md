---
phase: 2
slug: core-task-system
status: approved
shadcn_initialized: false
preset: none
created: 2026-05-24
---

# Phase 2 - UI Design Contract

> Visual and interaction contract for Phase 2 task creation, task lists, task details, organization screens, notes, and quick actions.

## Product Posture

Задачник is a quiet personal task tool, not a project-management dashboard. Phase 2 UI must feel fast on a phone, dense enough for repeated daily use, and calm enough that the user can capture a thought without first organizing it.

The first-screen priority is usable work, not explanation. Do not add marketing copy, onboarding panels, decorative hero areas, or extra top-level navigation. Reuse the Phase 1 shell and the locked nav: `Панель`, `Входящие`, `Ожидания`, `Обзор`, `Еще`.

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | none |
| Icon library | lucide-react |
| Font | Inter, system UI fallback |
| Styling | existing global CSS tokens plus scoped feature classes |
| Radius | 8px maximum for cards, panels, buttons, inputs |

Do not introduce shadcn, Radix, Base UI, or a new design system in Phase 2. Use semantic HTML, existing shell patterns, and focused local components.

## Screens In Scope

| Surface | Contract |
|---------|----------|
| Dashboard | Show real task summary and a small open-task preview only. No top-3 ranking or Phase 4 prioritization. |
| Inbox | Primary task list and fastest manual creation path. New title-only tasks appear here by default. |
| Task card | Repeated item card with title, status, category color, dates, importance, urgency, and compact quick actions. |
| Task create/edit | Mobile-first form with title first and advanced fields grouped below. |
| Task detail | Full task fields, notes feed, complete/archive actions, and quick metadata edits. |
| More | May link to category, context, and project management screens. No new bottom-nav item for categories or all tasks. |
| Waiting | Do not implement waiting workflows in Phase 2. If shown, it may remain an empty/placeholder shell from Phase 1. |
| Review | Do not implement weekly review behavior in Phase 2. |

## Layout Contract

Use the existing shell:

- Desktop keeps the left sidebar and centered content width.
- Mobile keeps fixed bottom navigation with safe-area padding.
- Main content uses `16px` side padding on mobile and the existing responsive desktop padding.
- Primary task list content should fit within `min(100%, 920px)` unless a management table needs a slightly wider desktop layout.
- Do not put cards inside cards. Task cards are repeated cards; page sections remain unframed layouts or simple bands.

Mobile order:

1. Page title and one primary action.
2. Fast create field or summary strip.
3. Active filters/status tabs when needed.
4. Task list.
5. Secondary management actions.

Desktop order may use two columns only when it improves scanning. Avoid dense multi-panel dashboards in Phase 2.

## Spacing Scale

Declared values must stay multiples of 4.

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, badge gaps, compact metadata gaps |
| sm | 8px | Button/icon gaps, card internal micro-spacing |
| md | 16px | Default field gaps, card padding on mobile |
| lg | 24px | Section gaps, modal/panel padding on desktop |
| xl | 32px | Page section breaks |
| 2xl | 48px | Rare desktop-only major spacing |

Exceptions: existing `BottomNav` `6px` padding may remain; it already exists from Phase 1. Do not introduce new arbitrary spacing values unless they are needed for safe-area handling.

## Typography

Do not scale font size with viewport width for compact task controls. The existing dashboard/page headings may keep their current responsive clamp, but task cards and forms should use fixed, predictable sizes.

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 15px | 400 | 1.45 |
| Label | 13px | 700 | 1.25 |
| Metadata | 12px | 650 | 1.2 |
| Card title | 16px | 750 | 1.3 |
| Section heading | 18px | 750 | 1.25 |
| Page heading | 32px mobile, 40px desktop max | 800 | 1.05 |

Rules:

- Letter spacing stays `0`.
- Task titles can wrap to two lines on cards.
- Long titles must not overlap quick actions; action rows move below metadata on narrow screens.
- Button text must remain readable and not shrink below 13px.

## Color

Base palette should extend the current Phase 1 tokens, with enough variation to avoid an all-beige or single-hue interface.

| Role | Value | Usage |
|------|-------|-------|
| App background | `#f7f3ea` | Existing page background |
| Primary surface | `#fffdf7` | Cards, panels, forms |
| Soft surface | `#efe7d6` | Active nav, selected filters |
| Text | `#17211f` | Main content |
| Muted text | `#67736f` | Metadata, helper text |
| Border | `#ded6c7` | Card/input boundaries |
| Primary accent | `#1f6f5f` | Primary CTA, selected important action |
| Primary accent strong | `#174f46` | Active text, pressed state |
| Focus | `#2b7fff` | Focus outline only |
| Destructive | `#a6423a` | Archive/delete destructive actions only |
| Warning/urgent | `#b45309` | Urgent badges and overdue signals |
| Done | `#3f7d46` | Completed status signal |
| Waiting | `#6d5bd0` | Waiting status signal only, no waiting workflow |

Accent reserved for:

- Primary submit/save buttons.
- Active filter/status.
- Main floating/quick capture action.
- Focused selected state where selection matters.

Do not make every interactive element green. Secondary buttons stay neutral. Destructive actions use the destructive color only.

Default category colors:

| Category | Color | UI Signal |
|----------|-------|-----------|
| Работа | `#2f6fbb` | Blue swatch |
| Личное | `#8a5fbf` | Violet swatch |
| Звонки | `#c27a22` | Amber swatch |
| Дом | `#3f7d46` | Green swatch |

Category colors appear as small swatches/side strips/badges, not as full-card backgrounds.

## Component Contracts

### Fast Create

- Primary field label: `Новая задача`
- Placeholder: `Что нужно не забыть?`
- Primary CTA: `Добавить`
- Only title is required.
- Submit button remains visible on mobile without scrolling within the capture panel.
- Empty title error: `Введите название задачи.`
- Success should place the new task in Inbox without navigating away unless the user explicitly opens details.

### Task Card

Required visible parts:

- Completion checkbox or icon button.
- Task title.
- Status label.
- Category swatch and category name when present.
- Due date and do date signals when present.
- Importance signal when `important`.
- Urgent signal when `isUrgent`.
- Compact quick actions.

Card layout:

- Mobile card padding: `16px`.
- Desktop card padding: `18px`.
- Minimum tap target: `44px` for action buttons.
- Quick actions may use lucide icons with accessible labels/tooltips. Ambiguous actions need text or icon+text.
- No nested card inside task card.

Quick action labels:

- Complete: `Выполнить`
- Reschedule: `Перенести`
- Change importance: `Важность`
- Add note: `Заметка`
- Assign person: `Человек`

### Reschedule Menu

Options:

- `Завтра`
- `Через неделю`
- `Выбрать дату`

Default target is `doDate`. If changing `dueDate`, the UI must say `Изменить крайний срок`.

### Task Form

Top fields:

1. Title.
2. Save action.
3. Status.

Advanced grouped fields:

- Dates: `День выполнения`, `Крайний срок`.
- Priority: `Важность`, `Срочно`.
- Time: `План, мин`, `Факт, мин`.
- Organization: `Категория`, `Контексты`, `Проект`, `Человек`.
- Text: `Описание`.

Controls:

- Status: segmented control or select on very narrow mobile.
- Importance: segmented control: `Обычная`, `Важная`.
- Urgency: toggle/checkbox: `Срочно`.
- Dates: native date inputs.
- Time: numeric minute inputs.
- Category color: swatch plus label.
- Contexts: checkbox list or compact multi-select pattern.

### Notes Feed

- Add note CTA: `Добавить заметку`.
- Empty state heading: `Заметок пока нет`.
- Empty state body: `Добавляйте сюда уточнения, решения и ход работы.`
- Notes display newest or oldest consistently; choose one and label timestamps clearly.
- A note is appended, not used as an editable replacement for description.

### Organization Management

Category/context/project management belongs under `Еще`.

Category form:

- Name input.
- Color swatch picker.
- Save CTA: `Сохранить категорию`.

Context form:

- Name input.
- Save CTA: `Сохранить контекст`.

Project form:

- Name input.
- Optional description.
- Save CTA: `Сохранить проект`.

Keep management screens simple list-plus-form pages. Avoid project dashboards, milestones, or team concepts.

## Copywriting Contract

Visible UI must be Russian-only.

| Element | Copy |
|---------|------|
| Primary task CTA | `Добавить задачу` |
| Fast create CTA | `Добавить` |
| Save task CTA | `Сохранить задачу` |
| Empty inbox heading | `Входящие пусты` |
| Empty inbox body | `Добавьте задачу короткой фразой, детали можно заполнить позже.` |
| Empty dashboard heading | `Пока нет открытых задач` |
| Empty dashboard body | `Добавьте первую задачу, и она появится во входящих.` |
| Generic form error | `Проверьте поля и попробуйте еще раз.` |
| Task title error | `Введите название задачи.` |
| Archive confirmation | `Скрыть задачу? Ее можно будет вернуть позже через данные, но отдельного архива пока нет.` |
| Complete action | `Выполнить` |
| Completed state | `Выполнено` |
| Archived state | `Скрыто` |

Tone:

- Short, direct, calm.
- No motivational slogans.
- No explanations of app features inside the app unless the state is empty or an action failed.
- Avoid technical words such as `CRUD`, `schema`, `sync`, `archive table`.

## Accessibility And Interaction

- All interactive controls have visible focus states.
- Icon-only buttons must have accessible names.
- Hit targets on mobile are at least `44px`.
- Form errors appear next to the related field and in an accessible status area when needed.
- Color is never the only signal for urgency, status, or category.
- Dates must be shown with text labels, not only colored dots.
- Cards remain keyboard reachable on desktop.

## Responsive Checkpoints

The executor must visually check:

- Mobile: `390x844` or iPhone-like viewport.
- Desktop: `1280x800`.

Required checks:

- Bottom navigation does not cover the last task card.
- Fast create and save controls are reachable without horizontal scroll.
- Long task titles wrap cleanly.
- Quick action buttons do not overlap metadata.
- Category swatches and badges remain legible.
- Notes feed does not push the primary save action off-screen inside a fixed panel.

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not required |
| third-party | none | do not use in Phase 2 |

## Phase 2 UI Verification Checklist

- [x] Dimension 1 Copywriting: PASS - Russian-only contract, explicit empty/error/destructive copy.
- [x] Dimension 2 Visuals: PASS - mobile-first task surfaces, no decorative or marketing UI.
- [x] Dimension 3 Color: PASS - existing palette extended with constrained status/category colors.
- [x] Dimension 4 Typography: PASS - fixed task typography and wrapping rules.
- [x] Dimension 5 Spacing: PASS - 4px scale, stable mobile targets, no nested cards.
- [x] Dimension 6 Registry Safety: PASS - no new registry or component-library dependency.

**Approval:** approved 2026-05-24

