ALTER TABLE "Task" ADD COLUMN "reminderAt" DATETIME;
ALTER TABLE "Task" ADD COLUMN "reminderSentAt" DATETIME;

CREATE TABLE "CalendarFeedToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "CalendarFeedToken_token_key" ON "CalendarFeedToken"("token");

CREATE TABLE "TaskCalendarLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "eventUid" TEXT NOT NULL,
    "allDay" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME,
    "includeDescription" BOOLEAN NOT NULL DEFAULT true,
    "includeNotes" BOOLEAN NOT NULL DEFAULT false,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "lastSyncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TaskCalendarLink_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "TaskCalendarLink_taskId_key" ON "TaskCalendarLink"("taskId");
CREATE UNIQUE INDEX "TaskCalendarLink_eventUid_key" ON "TaskCalendarLink"("eventUid");
CREATE INDEX "TaskCalendarLink_startsAt_idx" ON "TaskCalendarLink"("startsAt");

CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "label" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

CREATE TABLE "NotificationPreference" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "time" TEXT,
    "updatedAt" DATETIME NOT NULL
);

CREATE INDEX "Task_reminderAt_idx" ON "Task"("reminderAt");
