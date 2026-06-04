import type {
  AssistantCategoryOption,
  AssistantCaptureInterpretation
} from "@/lib/assistant-capture/interpret-task-capture";
import { interpretTaskCapture } from "@/lib/assistant-capture/interpret-task-capture";
import { sanitizePreview, sanitizeSourceText } from "@/lib/intake/intake-guards";
import { optionalSourceLabel } from "@/lib/tasks/task-validation";

type PrepareSourceTaskInput = {
  sourceText: unknown;
  sourceLabel: unknown;
  categories: AssistantCategoryOption[];
};

function summarizeSourceText(text: string) {
  const withoutQuotedLines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith(">"))
    .join(" ");

  const compact = withoutQuotedLines
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const sentence = compact.match(/.{24,220}?[.!?](\s|$)/u)?.[0]?.trim();
  return sanitizePreview(sentence || compact, 160);
}

export function prepareSourceTask({
  sourceText,
  sourceLabel,
  categories
}: PrepareSourceTaskInput): AssistantCaptureInterpretation & { sourceLabel: string; sourcePreview: string } {
  const text = sanitizeSourceText(sourceText);
  const label = optionalSourceLabel(sourceLabel);

  if (!label) {
    throw new Error("Нужна текстовая метка источника.");
  }

  const sourcePreview = sanitizePreview(text, 220);
  const summarized = summarizeSourceText(text);
  const interpretation = interpretTaskCapture({ phrase: summarized, categories });

  return {
    ...interpretation,
    originalPhrase: sourcePreview,
    sourceLabel: label,
    sourcePreview
  };
}
