import type { TaskView } from "@/features/tasks/task-types";
import { WAITING_FOR_ME } from "@/lib/waiting/waiting-tasks";

export type DailyFocusSuggestion = {
  task: TaskView;
  score: number;
  reasons: string[];
};

export type DailyFocusRanking = {
  suggestions: DailyFocusSuggestion[];
  otherForToday: TaskView[];
};

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDate(value: string | null) {
  return value ? new Date(value) : null;
}

function isInRange(value: string | null, start: Date, end: Date) {
  const date = toDate(value);
  return Boolean(date && date >= start && date < end);
}

function isBefore(value: string | null, date: Date) {
  const candidate = toDate(value);
  return Boolean(candidate && candidate < date);
}

function isWaitingForMeWithResponseDate(task: TaskView) {
  return task.waitingDirection === WAITING_FOR_ME && Boolean(task.personLabel && task.responseDueDate);
}

function compactReasons(task: TaskView, todayStart: Date, tomorrowStart: Date) {
  const reasons: string[] = [];

  if (task.isUrgent) {
    reasons.push("срочно");
  }

  if (isInRange(task.dueDate, todayStart, tomorrowStart)) {
    reasons.push("дедлайн сегодня");
  }

  if (isBefore(task.dueDate, todayStart)) {
    reasons.push("просрочено");
  }

  if (isWaitingForMeWithResponseDate(task)) {
    if (isInRange(task.responseDueDate, todayStart, tomorrowStart)) {
      reasons.push("ответить сегодня");
    } else if (isBefore(task.responseDueDate, todayStart)) {
      reasons.push("ждут ответа");
    }
  }

  if (task.importance === "important") {
    reasons.push("важное");
  }

  if (isInRange(task.doDate, todayStart, tomorrowStart)) {
    reasons.push("на сегодня");
  }

  return reasons.length > 0 ? reasons : ["открытая задача"];
}

function scoreTask(task: TaskView, todayStart: Date, tomorrowStart: Date) {
  let score = 0;

  if (task.isUrgent) {
    score += 1000;
  }

  if (task.importance === "important") {
    score += 500;
  }

  if (isWaitingForMeWithResponseDate(task)) {
    if (isBefore(task.responseDueDate, todayStart)) {
      score += 260;
    } else if (isInRange(task.responseDueDate, todayStart, tomorrowStart)) {
      score += 240;
    }
  }

  if (isInRange(task.dueDate, todayStart, tomorrowStart)) {
    score += 220;
  }

  if (isBefore(task.dueDate, todayStart)) {
    score += 180;
  }

  if (isInRange(task.doDate, todayStart, tomorrowStart)) {
    score += 140;
  }

  return score;
}

function isEligibleForSuggestion(task: TaskView, todayStart: Date) {
  const overdue = isBefore(task.dueDate, todayStart);

  if (overdue && !task.isUrgent && task.importance !== "important") {
    return false;
  }

  return true;
}

export function rankDailyFocusTasks(
  openTasks: TaskView[],
  todayTasks: TaskView[],
  now = new Date()
): DailyFocusRanking {
  const todayStart = startOfLocalDay(now);
  const tomorrowStart = addDays(todayStart, 1);

  const suggestions = openTasks
    .filter((task) => isEligibleForSuggestion(task, todayStart))
    .map((task) => ({
      task,
      score: scoreTask(task, todayStart, tomorrowStart),
      reasons: compactReasons(task, todayStart, tomorrowStart)
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.task.title.localeCompare(right.task.title, "ru");
    })
    .slice(0, 3);

  const suggestedIds = new Set(suggestions.map(({ task }) => task.id));

  return {
    suggestions,
    otherForToday: todayTasks.filter((task) => !suggestedIds.has(task.id))
  };
}
