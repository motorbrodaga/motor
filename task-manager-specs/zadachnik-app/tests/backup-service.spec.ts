import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import {
  createBackup,
  validateBackupFile,
  type BackupPayload
} from "../src/lib/backups/backup-service";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
let backupDir: string;

test.beforeEach(async () => {
  backupDir = await mkdtemp(path.join(tmpdir(), "zadachnik-backup-test-"));
  process.env.BACKUP_DIR = backupDir;
  await resetAccessToken("backup-token");
  await seedOrganizationDefaults();
});

test.afterEach(async () => {
  delete process.env.BACKUP_DIR;
  await rm(backupDir, { recursive: true, force: true });
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("backup file is created, valid, and excludes private token tables", async () => {
  await prisma.task.create({
    data: {
      title: "Задача для бэкапа",
      notes: {
        create: { body: "Важная заметка" }
      }
    }
  });

  const run = await createBackup();

  expect(run.status).toBe("success");
  expect(run.filePath).toBeTruthy();

  const backup = await validateBackupFile(run.filePath!);
  expect(backup.entityCounts.tasks).toBe(1);
  expect(backup.entityCounts.taskNotes).toBe(1);
  expect(backup.data.tasks).toEqual(
    expect.arrayContaining([expect.objectContaining({ title: "Задача для бэкапа" })])
  );
  expect(backup.data).not.toHaveProperty("accessTokens");
  expect(backup.data).not.toHaveProperty("calendarFeedTokens");
  expect(backup.data).not.toHaveProperty("pushSubscriptions");
});

test("backup validation rejects incompatible files", async () => {
  const filePath = path.join(backupDir, "bad.json");
  await import("node:fs/promises").then(({ writeFile }) =>
    writeFile(filePath, JSON.stringify({ schemaVersion: 999 }), "utf8")
  );

  await expect(validateBackupFile(filePath)).rejects.toThrow("Версия бэкапа не поддерживается");
});
