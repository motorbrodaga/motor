type CalendarNote = {
  body: string;
  createdAt: Date | string;
};

export type CalendarTaskEvent = {
  eventUid: string;
  title: string;
  description: string | null;
  status: string;
  archivedAt: Date | string | null;
  startsAt: Date | string;
  endsAt: Date | string | null;
  allDay: boolean;
  includeDescription: boolean;
  includeNotes: boolean;
  sequence: number;
  updatedAt: Date | string;
  lastSyncedAt: Date | string;
  notes?: CalendarNote[];
};

function asDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatUtc(value: Date | string) {
  const date = asDate(value);
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate())
  ].join("") + "T" + [
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds())
  ].join("") + "Z";
}

function formatDate(value: Date | string) {
  const date = asDate(value);
  return [date.getUTCFullYear(), pad(date.getUTCMonth() + 1), pad(date.getUTCDate())].join("");
}

function addDays(value: Date | string, days: number) {
  const date = asDate(value);
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

export function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export function foldIcsLine(line: string) {
  const chunks: string[] = [];
  let current = line;

  while (Buffer.byteLength(current, "utf8") > 75) {
    let index = 73;
    while (index > 0 && Buffer.byteLength(current.slice(0, index), "utf8") > 73) {
      index -= 1;
    }
    chunks.push(current.slice(0, index));
    current = ` ${current.slice(index)}`;
  }

  chunks.push(current);
  return chunks.join("\r\n");
}

function descriptionFor(event: CalendarTaskEvent) {
  const parts: string[] = [];

  if (event.includeDescription && event.description) {
    parts.push(event.description);
  }

  if (event.includeNotes && event.notes?.length) {
    parts.push(
      event.notes
        .map((note) => `Заметка ${new Intl.DateTimeFormat("ru-RU").format(asDate(note.createdAt))}: ${note.body}`)
        .join("\n\n")
    );
  }

  return parts.join("\n\n");
}

export function buildEventLines(event: CalendarTaskEvent) {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${event.eventUid}`,
    `DTSTAMP:${formatUtc(event.lastSyncedAt)}`,
    `LAST-MODIFIED:${formatUtc(event.updatedAt)}`,
    `SEQUENCE:${event.sequence}`,
    `SUMMARY:${escapeIcsText(event.title)}`
  ];

  if (event.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${formatDate(event.startsAt)}`);
    lines.push(`DTEND;VALUE=DATE:${formatDate(event.endsAt ?? addDays(event.startsAt, 1))}`);
  } else {
    lines.push(`DTSTART:${formatUtc(event.startsAt)}`);
    lines.push(`DTEND:${formatUtc(event.endsAt ?? addDays(event.startsAt, 0))}`);
  }

  const description = descriptionFor(event);
  if (description) {
    lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
  }

  if (event.status === "done" || event.archivedAt) {
    lines.push("STATUS:CANCELLED");
  }

  lines.push("END:VEVENT");
  return lines;
}

export function buildCalendarFeed(events: CalendarTaskEvent[]) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Zadachnik//Task Calendar//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Задачник",
    "X-WR-CALDESC:Задачи из Задачника"
  ];

  for (const event of events) {
    lines.push(...buildEventLines(event));
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}
