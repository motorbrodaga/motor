import { readFile } from "node:fs/promises";
import path from "node:path";
import type { IntakeChoice, IntakeProviderResult } from "@/lib/intake/intake-types";
import { sanitizePreview } from "@/lib/intake/intake-guards";

type ImportedInboxItem = {
  id?: unknown;
  createdAt?: unknown;
  date?: unknown;
  body?: unknown;
  text?: unknown;
  message?: unknown;
};

function candidateFiles() {
  return [
    path.join(process.cwd(), "data", "chief-agent.json"),
    path.join(process.cwd(), "..", "data", "chief-agent.json"),
    path.join(process.cwd(), "..", "..", "data", "chief-agent.json")
  ];
}

async function readImportedTelegramData() {
  for (const file of candidateFiles()) {
    try {
      const raw = await readFile(file, "utf8");
      return JSON.parse(raw) as { inbox?: ImportedInboxItem[] };
    } catch {
      // Try the next known project layout.
    }
  }

  return null;
}

function textFromItem(item: ImportedInboxItem) {
  for (const value of [item.body, item.text, item.message]) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function dateFromItem(item: ImportedInboxItem) {
  for (const value of [item.createdAt, item.date]) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

export async function getTelegramMotorcodexChoices(limit: number): Promise<IntakeProviderResult> {
  const data = await readImportedTelegramData();

  if (!data?.inbox || !Array.isArray(data.inbox)) {
    return {
      choices: [],
      unavailable: "Не нашел локальный импорт Telegram. Можно вставить текст вручную."
    };
  }

  const choices = data.inbox
    .flatMap((item, index): IntakeChoice[] => {
      const sourceText = textFromItem(item);

      if (!sourceText) {
        return [];
      }

      const occurredAt = dateFromItem(item);
      const preview = sanitizePreview(sourceText);

      return [{
        id: String(item.id ?? `telegram-${index}`),
        provider: "telegram",
        sourceLabel: "from Telegram Motorcodex_bot",
        title: preview,
        preview,
        occurredAt,
        sourceText
      }];
    })
    .sort((a, b) => String(b.occurredAt ?? "").localeCompare(String(a.occurredAt ?? "")))
    .slice(0, limit);

  return { choices };
}
