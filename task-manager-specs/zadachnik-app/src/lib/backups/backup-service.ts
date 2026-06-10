import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";

const BACKUP_SCHEMA_VERSION = 1;
const DEFAULT_RETENTION = 20;

export type BackupPayload = {
  schemaVersion: number;
  createdAt: string;
  entityCounts: Record<string, number>;
  data: {
    tasks: unknown[];
    taskNotes: unknown[];
    categories: unknown[];
    contexts: unknown[];
    taskContexts: unknown[];
    projects: unknown[];
    dailyFocusSelections: unknown[];
    taskCalendarLinks: unknown[];
    notificationPreferences: unknown[];
    appSettings: unknown[];
  };
};

function backupDir() {
  return process.env.BACKUP_DIR
    ? path.resolve(process.env.BACKUP_DIR)
    : path.join(process.cwd(), "data", "backups", "zadachnik");
}

function timestampName(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, "-");
}

async function pruneBackups(dir: string, keep = DEFAULT_RETENTION) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const backups = entries
    .filter((entry) => entry.isFile() && /^zadachnik-backup-.*\.json$/.test(entry.name))
    .map((entry) => entry.name)
    .sort()
    .reverse();

  for (const fileName of backups.slice(keep)) {
    await rm(path.join(dir, fileName), { force: true });
  }
}

function countData(data: BackupPayload["data"]) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, Array.isArray(value) ? value.length : 0])
  );
}

async function readRecoverableData(): Promise<BackupPayload["data"]> {
  const [
    tasks,
    taskNotes,
    categories,
    contexts,
    taskContexts,
    projects,
    dailyFocusSelections,
    taskCalendarLinks,
    notificationPreferences,
    appSettings
  ] = await Promise.all([
    prisma.task.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.taskNote.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.category.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.context.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.taskContext.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.project.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.dailyFocusSelection.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.taskCalendarLink.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.notificationPreference.findMany({ orderBy: { key: "asc" } }),
    prisma.appSetting.findMany({ orderBy: { key: "asc" } })
  ]);

  return {
    tasks,
    taskNotes,
    categories,
    contexts,
    taskContexts,
    projects,
    dailyFocusSelections,
    taskCalendarLinks,
    notificationPreferences,
    appSettings
  };
}

export async function createBackup() {
  const run = await prisma.backupRun.create({
    data: { status: "running" }
  });

  try {
    const dir = backupDir();
    await mkdir(dir, { recursive: true });

    const data = await readRecoverableData();
    const payload: BackupPayload = {
      schemaVersion: BACKUP_SCHEMA_VERSION,
      createdAt: new Date().toISOString(),
      entityCounts: countData(data),
      data
    };
    const fileName = `zadachnik-backup-${timestampName()}.json`;
    const filePath = path.join(dir, fileName);

    await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    await pruneBackups(dir);

    return prisma.backupRun.update({
      where: { id: run.id },
      data: {
        status: "success",
        fileName,
        filePath,
        entityCountsJson: JSON.stringify(payload.entityCounts),
        completedAt: new Date()
      }
    });
  } catch (error) {
    return prisma.backupRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        error: error instanceof Error ? error.message : "Не удалось создать бэкап.",
        completedAt: new Date()
      }
    });
  }
}

export async function getLatestBackupRun() {
  return prisma.backupRun.findFirst({
    orderBy: { createdAt: "desc" }
  });
}

export async function validateBackupFile(filePath: string) {
  const raw = await readFile(filePath, "utf8");
  const payload = JSON.parse(raw) as Partial<BackupPayload>;

  if (payload.schemaVersion !== BACKUP_SCHEMA_VERSION) {
    throw new Error("Версия бэкапа не поддерживается.");
  }

  if (!payload.createdAt || !payload.data || !payload.entityCounts) {
    throw new Error("В бэкапе нет обязательных разделов.");
  }

  for (const key of Object.keys(payload.data) as Array<keyof BackupPayload["data"]>) {
    if (!Array.isArray(payload.data[key])) {
      throw new Error(`Раздел ${key} поврежден.`);
    }
  }

  return payload as BackupPayload;
}
