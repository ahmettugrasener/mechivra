import {
  getActivitiesForModule,
} from "@/content/registry";

import type {
  LearningActivity,
} from "@/domain/learning/types";

import type {
  EntityId,
} from "@/domain/shared/types";

export interface LearningActivityNavigation {
  readonly current:
    LearningActivity;

  readonly previous:
    LearningActivity | null;

  readonly next:
    LearningActivity | null;

  readonly position: number;
  readonly total: number;
}

export function getLearningActivityNavigation(
  moduleId: EntityId,
  activityId: EntityId,
): LearningActivityNavigation | undefined {
  const activities =
    getActivitiesForModule(
      moduleId,
    );

  const currentIndex =
    activities.findIndex(
      (activity) =>
        activity.id ===
        activityId,
    );

  if (currentIndex < 0) {
    return undefined;
  }

  const current =
    activities[currentIndex];

  if (!current) {
    return undefined;
  }

  return {
    current,

    previous:
      currentIndex > 0
        ? activities[
            currentIndex - 1
          ] ?? null
        : null,

    next:
      currentIndex <
      activities.length - 1
        ? activities[
            currentIndex + 1
          ] ?? null
        : null,

    position:
      currentIndex + 1,

    total:
      activities.length,
  };
}