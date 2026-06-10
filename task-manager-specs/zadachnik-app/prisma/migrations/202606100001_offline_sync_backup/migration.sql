-- CreateTable
CREATE TABLE "AppliedMutation" (
    "clientMutationId" TEXT NOT NULL PRIMARY KEY,
    "operation" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "localEntityId" TEXT,
    "clientUpdatedAt" DATETIME NOT NULL,
    "serverAppliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultJson" TEXT
);

-- CreateTable
CREATE TABLE "BackupRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "fileName" TEXT,
    "filePath" TEXT,
    "entityCountsJson" TEXT,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME
);

-- CreateIndex
CREATE INDEX "BackupRun_createdAt_idx" ON "BackupRun"("createdAt");

-- CreateIndex
CREATE INDEX "BackupRun_status_idx" ON "BackupRun"("status");
