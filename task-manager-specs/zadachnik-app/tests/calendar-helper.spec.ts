import { expect, test } from "@playwright/test";
import { buildCalendarFeed, escapeIcsText } from "@/lib/calendar/ical";

test("escapes iCalendar text fields", () => {
  expect(escapeIcsText("A, B; C\\D\nE")).toBe("A\\, B\\; C\\\\D\\nE");
});

test("builds all-day calendar event with stable sequence", () => {
  const feed = buildCalendarFeed([
    {
      eventUid: "task-1@zadachnik.local",
      title: "Важное письмо",
      description: "Ответить спокойно",
      status: "todo",
      archivedAt: null,
      startsAt: "2026-06-06T00:00:00.000Z",
      endsAt: "2026-06-07T00:00:00.000Z",
      allDay: true,
      includeDescription: true,
      includeNotes: false,
      sequence: 2,
      updatedAt: "2026-06-05T10:00:00.000Z",
      lastSyncedAt: "2026-06-05T10:00:00.000Z"
    }
  ]);

  expect(feed).toContain("BEGIN:VCALENDAR");
  expect(feed).toContain("UID:task-1@zadachnik.local");
  expect(feed).toContain("DTSTART;VALUE=DATE:20260606");
  expect(feed).toContain("SEQUENCE:2");
  expect(feed).toContain("DESCRIPTION:Ответить спокойно");
});
