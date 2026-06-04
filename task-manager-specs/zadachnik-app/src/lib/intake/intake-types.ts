export type IntakeProvider = "telegram" | "gmail" | "paste";

export type IntakeChoice = {
  id: string;
  provider: IntakeProvider;
  sourceLabel: string;
  title: string;
  preview: string;
  occurredAt: string | null;
  sourceText: string;
};

export type IntakeProviderResult = {
  choices: IntakeChoice[];
  unavailable?: string;
};
