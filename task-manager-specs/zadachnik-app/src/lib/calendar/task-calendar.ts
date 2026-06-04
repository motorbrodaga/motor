import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";

export type CalendarLinkInput = {
  mode?: unknown;
  startsAt?: unknown;
  endsAt?: unknown;
  includeDescription?: unknown;
  includeNotes?: unknown;
};

function cleanText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function parseDate(value: unknown) {
  const text = cleanText(value);

  if (!text) {
    return null;
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Некорректная дата для календаря.");
  }

  return date;
}

function nextDay(date: Date) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + 1);
  return copy;
}

export function validateCalendarLinkInput(input: CalendarLinkInput) {
  const allDay = input.mode !== "timed";
  const startsAt = parseDate(input.startsAt);

  if (!startsAt) {
    throw new Error("Укажите дату для календаря.");
  }

  const endsAt =
    parseDate(input.endsAt) ??
    (allDay ? nextDay(startsAt) : new Date(startsAt.getTime() + 60 * 60_000));

  if (endsAt <= startsAt) {
    throw new Error("Окончание события должно быть позже начала.");
  }

  return {
    allDay,
    startsAt,
    endsAt,
    includeDescription: input.includeDescription !== false,
    includeNotes: input.includeNotes === true
  };
}

export function createCalendarLinkData(
  taskId: string,
  input: CalendarLinkInput
): Prisma.TaskCalendarLinkCreateInput {
  const data = validateCalendarLinkInput(input);

  return {
    task: { connect: { id: taskId } },
    eventUid: `${taskId}-${randomUUID()}@zadachnik.local`,
    ...data
  };
}

export function shouldBumpCalendarSequence(payload: Record<string, unknown>) {
  return ["title", "description", "status", "doDate", "dueDate", "archivedAt"].some(
    (key) => key in payload
  );
}
