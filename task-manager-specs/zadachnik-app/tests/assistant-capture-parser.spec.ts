import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { interpretTaskCapture } from "../src/lib/assistant-capture/interpret-task-capture";
import {
  closeDb,
  resetAccessToken,
  seedOrganizationDefaults
} from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-three-parser-token";
const now = new Date("2026-05-26T09:00:00.000Z");

const categories = [
  { id: "work", name: "Работа" },
  { id: "personal", name: "Личное" },
  { id: "calls", name: "Звонки" },
  { id: "home", name: "Дом" }
];

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("assistant parser recognizes date category and importance", async () => {
  const result = interpretTaskCapture({
    phrase: "Важно завтра рабочее письмо",
    categories,
    now
  });

  expect(result.draft.title).toContain("письмо");
  expect(result.draft.doDate).toBe("2026-05-27");
  expect(result.draft.dueDate).toBeNull();
  expect(result.draft.categoryId).toBe("work");
  expect(result.draft.importance).toBe("important");
  expect(result.questions.length).toBeLessThanOrEqual(2);
});

test("assistant parser maps deadline words to due date", async () => {
  const result = interpretTaskCapture({
    phrase: "Крайний срок 2026-06-01 подготовить документы",
    categories,
    now
  });

  expect(result.draft.doDate).toBeNull();
  expect(result.draft.dueDate).toBe("2026-06-01");
});

test("assistant parser keeps incomplete task safe", async () => {
  const result = interpretTaskCapture({
    phrase: "Разобрать заметки",
    categories,
    now
  });

  expect(result.draft.title).toBe("Разобрать заметки");
  expect(result.draft.doDate).toBeNull();
  expect(result.draft.categoryId).toBeNull();
  expect(result.draft.importance).toBe("normal");
  expect(result.questions.length).toBeLessThanOrEqual(2);
});

test("interpret endpoint is protected and does not create a task", async ({ page }) => {
  const before = await prisma.task.count();

  const response = await page.request.post("/api/assistant-capture/interpret", {
    data: { phrase: "2026-05-27 важное рабочее письмо" }
  });

  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as {
    interpretation: { draft: { doDate: string | null; importance: string } };
  };

  expect(body.interpretation.draft.doDate).toBe("2026-05-27");
  expect(body.interpretation.draft.importance).toBe("important");
  await expect.poll(async () => prisma.task.count()).toBe(before);
});
