import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { applySyncMutation } from "../src/lib/sync/task-sync";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();

test.beforeEach(async () => {
  await resetAccessToken("offline-sync-token");
  await seedOrganizationDefaults();
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("latest task mutation wins and replay is idempotent", async () => {
  const task = await prisma.task.create({
    data: {
      title: "Исходная задача",
      updatedAt: new Date("2026-06-10T10:00:00.000Z")
    }
  });

  const stale = await applySyncMutation({
    clientMutationId: "stale-title-change",
    operation: "task.patch",
    taskId: task.id,
    payload: { title: "Старое изменение" },
    clientUpdatedAt: "2026-06-10T09:00:00.000Z"
  });

  expect(stale.result.status).toBe("ignored_stale");
  await expect(prisma.task.findUniqueOrThrow({ where: { id: task.id } })).resolves.toMatchObject({
    title: "Исходная задача"
  });

  const fresh = await applySyncMutation({
    clientMutationId: "fresh-title-change",
    operation: "task.patch",
    taskId: task.id,
    payload: { title: "Новое изменение" },
    clientUpdatedAt: "2026-06-10T11:00:00.000Z"
  });

  expect(fresh.result.status).toBe("applied");
  await expect(prisma.task.findUniqueOrThrow({ where: { id: task.id } })).resolves.toMatchObject({
    title: "Новое изменение"
  });

  const replay = await applySyncMutation({
    clientMutationId: "fresh-title-change",
    operation: "task.patch",
    taskId: task.id,
    payload: { title: "Дубль" },
    clientUpdatedAt: "2026-06-10T12:00:00.000Z"
  });

  expect(replay.result.status).toBe("duplicate");
  await expect(prisma.task.findUniqueOrThrow({ where: { id: task.id } })).resolves.toMatchObject({
    title: "Новое изменение"
  });
});

test("local task id is mapped after offline create sync", async () => {
  const created = await applySyncMutation({
    clientMutationId: "create-local-task",
    operation: "task.create",
    localTaskId: "local-task-1",
    payload: { title: "Офлайн задача" },
    clientUpdatedAt: "2026-06-10T10:00:00.000Z"
  });

  expect(created.result.status).toBe("applied");
  expect(created.result.taskId).toBeTruthy();

  const patched = await applySyncMutation({
    clientMutationId: "patch-local-task",
    operation: "task.patch",
    localTaskId: "local-task-1",
    payload: { title: "Офлайн задача после правки" },
    clientUpdatedAt: "2026-06-10T10:01:00.000Z"
  });

  expect(patched.result.status).toBe("applied");
  await expect(prisma.task.findUniqueOrThrow({ where: { id: created.result.taskId } })).resolves.toMatchObject({
    title: "Офлайн задача после правки"
  });
});
