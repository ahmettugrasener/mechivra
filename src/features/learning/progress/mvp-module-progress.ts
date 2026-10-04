import {
  getActivitiesForModule,
  getMvpCatalogItems,
} from "@/content/registry";

import type {
  ProgressRepository,
} from "@/domain/progress";

import {
  aggregateModuleProgress,
} from "@/features/learning/progress/module-progress-aggregation";

import type {
  ModuleProgressAggregation,
} from "@/features/learning/progress/module-progress-aggregation";

export class MvpModuleProgressError
  extends Error {
  constructor(
    message:
      string,
  ) {
    super(
      message,
    );

    this.name =
      "MvpModuleProgressError";
  }
}

export async function getMvpModuleProgress(
  repository:
    ProgressRepository,

  moduleId:
    string,
): Promise<
  ModuleProgressAggregation
> {
  const catalogItem =
    getMvpCatalogItems().find(
      (
        item,
      ) =>
        item.module.id ===
        moduleId,
    );

  if (
    !catalogItem
  ) {
    throw new MvpModuleProgressError(
      `Unknown MVP module "${moduleId}".`,
    );
  }

  const activities =
    getActivitiesForModule(
      moduleId,
    );

  return aggregateModuleProgress(
    repository,
    {
      moduleId:
        catalogItem
          .module
          .id,

      moduleVersion:
        catalogItem
          .module
          .version,

      activities:
        activities.map(
          (
            activity,
          ) => ({
            id:
              activity.id,

            version:
              activity.version,
          }),
        ),
    },
  );
}