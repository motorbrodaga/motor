export type CategoryOption = {
  id: string;
  name: string;
  color: string;
};

export type ContextOption = {
  id: string;
  name: string;
};

export type ProjectOption = {
  id: string;
  name: string;
  description: string | null;
};

export type TaskView = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  importance: string;
  isUrgent: boolean;
  dueDate: string | null;
  doDate: string | null;
  estimatedMinutes: number | null;
  actualMinutes: number | null;
  sourceLabel?: string | null;
  personLabel: string | null;
  waitingDirection: string | null;
  responseDueDate: string | null;
  waitingSince: string | null;
  reminderAt?: string | null;
  reminderSentAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  completedAt: string | null;
  archivedAt: string | null;
  category: CategoryOption | null;
  project: ProjectOption | null;
  contexts: Array<{ context: ContextOption }>;
  notes?: Array<{
    id: string;
    body: string;
    createdAt: string;
  }>;
  calendarLink?: {
    id: string;
    allDay: boolean;
    startsAt: string;
    endsAt: string | null;
    includeDescription: boolean;
    includeNotes: boolean;
    sequence: number;
    lastSyncedAt: string;
  } | null;
};
