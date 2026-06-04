import type { IntakeChoice, IntakeProviderResult } from "@/lib/intake/intake-types";
import { sanitizePreview } from "@/lib/intake/intake-guards";

type GmailFixtureItem = {
  id?: string;
  subject?: string;
  from?: string;
  date?: string;
  snippet?: string;
  body?: string;
};

function readFixtureItems(): GmailFixtureItem[] {
  const raw = process.env.GMAIL_INTAKE_FIXTURE_JSON;

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as GmailFixtureItem[]) : [];
  } catch {
    return [];
  }
}

export async function searchGmailChoices(query: string, limit: number): Promise<IntakeProviderResult> {
  const items = readFixtureItems();

  if (items.length === 0) {
    return {
      choices: [],
      unavailable: "Gmail еще не подключен к приложению. Поиск готов, но нужны ключи доступа для runtime."
    };
  }

  const normalizedQuery = query.toLocaleLowerCase("ru-RU");
  const choices: IntakeChoice[] = items
    .filter((item) =>
      [item.subject, item.from, item.snippet, item.body]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("ru-RU")
        .includes(normalizedQuery)
    )
    .slice(0, limit)
    .map((item, index) => {
      const subject = item.subject?.trim() || "Письмо Gmail";
      const body = item.body?.trim() || item.snippet?.trim() || subject;
      const preview = sanitizePreview(`${subject}. ${item.snippet ?? body}`);

      return {
        id: item.id ?? `gmail-${index}`,
        provider: "gmail",
        sourceLabel: "from Gmail",
        title: subject,
        preview,
        occurredAt: item.date ?? null,
        sourceText: body
      };
    });

  return { choices };
}
