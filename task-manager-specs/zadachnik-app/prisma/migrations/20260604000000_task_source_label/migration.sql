-- Add an optional text-only source label for explicit Telegram/Gmail imports.
ALTER TABLE "Task" ADD COLUMN "sourceLabel" TEXT;
