CREATE TABLE IF NOT EXISTS "DailyFocusSelection" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "focusDate" DATETIME NOT NULL,
  "slot" INTEGER NOT NULL,
  "taskId" TEXT NOT NULL,
  "confirmedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DailyFocusSelection_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "DailyFocusSelection_focusDate_slot_key" ON "DailyFocusSelection"("focusDate", "slot");
CREATE UNIQUE INDEX IF NOT EXISTS "DailyFocusSelection_focusDate_taskId_key" ON "DailyFocusSelection"("focusDate", "taskId");
CREATE INDEX IF NOT EXISTS "DailyFocusSelection_taskId_idx" ON "DailyFocusSelection"("taskId");
