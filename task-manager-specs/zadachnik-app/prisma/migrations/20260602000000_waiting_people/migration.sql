ALTER TABLE "Task" ADD COLUMN "waitingDirection" TEXT;
ALTER TABLE "Task" ADD COLUMN "responseDueDate" DATETIME;
ALTER TABLE "Task" ADD COLUMN "waitingSince" DATETIME;

CREATE INDEX "Task_waitingDirection_idx" ON "Task"("waitingDirection");
CREATE INDEX "Task_responseDueDate_idx" ON "Task"("responseDueDate");
