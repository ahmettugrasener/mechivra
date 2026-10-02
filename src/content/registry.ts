import type {
  Course,
  Concept,
  LearningModule,
  LearningOutcome,
} from "@/domain/curriculum/types";

import type {
  LearningActivity,
} from "@/domain/learning/types";

import type {
  SourceRecord,
} from "@/domain/sources/types";

import type {
  EntityId,
  LocalizedText,
  SupportedLocale,
} from "@/domain/shared/types";

import {
  rawConcepts,
  rawCourses,
  rawLearningActivities,
  rawLearningOutcomes,
  rawModules,
  rawSources,
} from "@/content/mvp-content";

import {
  conceptSchema,
  courseSchema,
  learningActivitySchema,
  learningModuleSchema,
  learningOutcomeSchema,
  sourceRecordSchema,
} from "@/content/schemas";

export const courses: readonly Course[] =
  courseSchema.array().parse(
    rawCourses,
  );

export const modules: readonly LearningModule[] =
  learningModuleSchema.array().parse(
    rawModules,
  );

export const learningOutcomes: readonly LearningOutcome[] =
  learningOutcomeSchema.array().parse(
    rawLearningOutcomes,
  );

export const concepts: readonly Concept[] =
  conceptSchema.array().parse(
    rawConcepts,
  );

export const learningActivities: readonly LearningActivity[] =
  learningActivitySchema.array().parse(
    rawLearningActivities,
  );

export const sources: readonly SourceRecord[] =
  sourceRecordSchema.array().parse(
    rawSources,
  );

function assertUniqueIds(
  label: string,
  ids: readonly EntityId[],
): void {
  const seen = new Set<EntityId>();

  for (const id of ids) {
    if (seen.has(id)) {
      throw new Error(
        `[content] Duplicate ${label} id: ${id}`,
      );
    }

    seen.add(id);
  }
}

function assertReferencesExist(
  context: string,
  ids: readonly EntityId[],
  validIds: ReadonlySet<EntityId>,
): void {
  for (const id of ids) {
    if (!validIds.has(id)) {
      throw new Error(
        `[content] ${context} references missing entity: ${id}`,
      );
    }
  }
}

export function assertContentIntegrity(): void {
  assertUniqueIds(
    "course",
    courses.map(
      (course) => course.id,
    ),
  );

  assertUniqueIds(
    "module",
    modules.map(
      (moduleItem) =>
        moduleItem.id,
    ),
  );

  assertUniqueIds(
    "learning outcome",
    learningOutcomes.map(
      (outcome) => outcome.id,
    ),
  );

  assertUniqueIds(
    "concept",
    concepts.map(
      (concept) => concept.id,
    ),
  );

  assertUniqueIds(
    "learning activity",
    learningActivities.map(
      (activity) =>
        activity.id,
    ),
  );

  assertUniqueIds(
    "source",
    sources.map(
      (source) => source.id,
    ),
  );

  const allEntityIds = [
    ...courses.map(
      (course) => course.id,
    ),
    ...modules.map(
      (moduleItem) =>
        moduleItem.id,
    ),
    ...learningOutcomes.map(
      (outcome) => outcome.id,
    ),
    ...concepts.map(
      (concept) => concept.id,
    ),
    ...learningActivities.map(
      (activity) =>
        activity.id,
    ),
    ...sources.map(
      (source) => source.id,
    ),
  ];

  assertUniqueIds(
    "global entity",
    allEntityIds,
  );

  const courseIds = new Set(
    courses.map(
      (course) => course.id,
    ),
  );

  const moduleIds = new Set(
    modules.map(
      (moduleItem) =>
        moduleItem.id,
    ),
  );

  const outcomeIds = new Set(
    learningOutcomes.map(
      (outcome) => outcome.id,
    ),
  );

  const conceptIds = new Set(
    concepts.map(
      (concept) => concept.id,
    ),
  );

  const activityIds = new Set(
    learningActivities.map(
      (activity) =>
        activity.id,
    ),
  );

  const sourceIds = new Set(
    sources.map(
      (source) => source.id,
    ),
  );

  const globalIds = new Set(
    allEntityIds,
  );

  for (const course of courses) {
    assertReferencesExist(
      `Course ${course.id} moduleIds`,
      course.moduleIds,
      moduleIds,
    );

    for (
      const moduleId
      of course.moduleIds
    ) {
      const moduleItem =
        modules.find(
          (candidate) =>
            candidate.id ===
            moduleId,
        );

      if (
        moduleItem &&
        moduleItem.courseId !==
          course.id
      ) {
        throw new Error(
          `[content] Course ${course.id} lists module ${moduleId}, but the module belongs to ${moduleItem.courseId}.`,
        );
      }
    }
  }

  for (
    const moduleItem
    of modules
  ) {
    assertReferencesExist(
      `Module ${moduleItem.id} courseId`,
      [moduleItem.courseId],
      courseIds,
    );

    assertReferencesExist(
      `Module ${moduleItem.id} learningOutcomeIds`,
      moduleItem.learningOutcomeIds,
      outcomeIds,
    );

    assertReferencesExist(
      `Module ${moduleItem.id} prerequisiteConceptIds`,
      moduleItem.prerequisiteConceptIds,
      conceptIds,
    );

    assertReferencesExist(
      `Module ${moduleItem.id} conceptIds`,
      moduleItem.conceptIds,
      conceptIds,
    );

    assertReferencesExist(
      `Module ${moduleItem.id} activityIds`,
      moduleItem.activityIds,
      activityIds,
    );

    assertReferencesExist(
      `Module ${moduleItem.id} sourceIds`,
      moduleItem.sourceIds,
      sourceIds,
    );

    const moduleActivities =
      learningActivities
        .filter(
          (activity) =>
            activity.moduleId ===
            moduleItem.id,
        )
        .sort(
          (left, right) =>
            left.order -
            right.order,
        );

    if (
      moduleActivities.length !==
      moduleItem.activityIds.length
    ) {
      throw new Error(
        `[content] Module ${moduleItem.id} activity count does not match its activityIds list.`,
      );
    }

    for (
      let index = 0;
      index <
      moduleActivities.length;
      index += 1
    ) {
      const activity =
        moduleActivities[index];

      const expectedOrder =
        index + 1;

      if (
        activity.order !==
        expectedOrder
      ) {
        throw new Error(
          `[content] Module ${moduleItem.id} activity order must be contiguous from 1. Expected ${expectedOrder}, received ${activity.order}.`,
        );
      }

      if (
        !moduleItem.activityIds.includes(
          activity.id,
        )
      ) {
        throw new Error(
          `[content] Activity ${activity.id} belongs to ${moduleItem.id} but is missing from module.activityIds.`,
        );
      }
    }

    for (
      const outcomeId
      of moduleItem.learningOutcomeIds
    ) {
      const outcome =
        learningOutcomes.find(
          (candidate) =>
            candidate.id ===
            outcomeId,
        );

      if (
        outcome &&
        outcome.moduleId !==
          moduleItem.id
      ) {
        throw new Error(
          `[content] Outcome ${outcomeId} is linked to ${outcome.moduleId}, not ${moduleItem.id}.`,
        );
      }
    }
  }

  for (
    const outcome
    of learningOutcomes
  ) {
    assertReferencesExist(
      `Learning outcome ${outcome.id} moduleId`,
      [outcome.moduleId],
      moduleIds,
    );
  }

  for (
    const concept
    of concepts
  ) {
    assertReferencesExist(
      `Concept ${concept.id} requires`,
      concept.requires,
      conceptIds,
    );

    assertReferencesExist(
      `Concept ${concept.id} relatedTo`,
      concept.relatedTo,
      conceptIds,
    );

    assertReferencesExist(
      `Concept ${concept.id} usedIn`,
      concept.usedIn,
      conceptIds,
    );

    assertReferencesExist(
      `Concept ${concept.id} sourceIds`,
      concept.sourceIds,
      sourceIds,
    );
  }

  for (
    const activity
    of learningActivities
  ) {
    assertReferencesExist(
      `Learning activity ${activity.id} moduleId`,
      [activity.moduleId],
      moduleIds,
    );

    assertReferencesExist(
      `Learning activity ${activity.id} learningOutcomeIds`,
      activity.learningOutcomeIds,
      outcomeIds,
    );

    assertReferencesExist(
      `Learning activity ${activity.id} conceptIds`,
      activity.conceptIds,
      conceptIds,
    );

    assertReferencesExist(
      `Learning activity ${activity.id} sourceIds`,
      activity.sourceIds,
      sourceIds,
    );

    for (
      const outcomeId
      of activity.learningOutcomeIds
    ) {
      const outcome =
        learningOutcomes.find(
          (candidate) =>
            candidate.id ===
            outcomeId,
        );

      if (
        outcome &&
        outcome.moduleId !==
          activity.moduleId
      ) {
        throw new Error(
          `[content] Activity ${activity.id} references outcome ${outcomeId} from another module.`,
        );
      }
    }
  }

  for (
    const source
    of sources
  ) {
    assertReferencesExist(
      `Source ${source.id} relatedEntityIds`,
      source.relatedEntityIds,
      globalIds,
    );
  }
}

assertContentIntegrity();

export function getLocalizedText(
  text: LocalizedText,
  locale: SupportedLocale,
): string {
  return text[locale];
}

export function getCourseBySlug(
  slug: string,
): Course | undefined {
  return courses.find(
    (course) =>
      course.slug === slug,
  );
}

export function getModuleById(
  id: EntityId,
): LearningModule | undefined {
  return modules.find(
    (moduleItem) =>
      moduleItem.id === id,
  );
}

export function getModuleBySlugs(
  courseSlug: string,
  moduleSlug: string,
): LearningModule | undefined {
  const course =
    getCourseBySlug(
      courseSlug,
    );

  if (!course) {
    return undefined;
  }

  return modules.find(
    (moduleItem) =>
      moduleItem.courseId ===
        course.id &&
      moduleItem.slug ===
        moduleSlug,
  );
}

export function getModulesForCourse(
  courseId: EntityId,
): readonly LearningModule[] {
  return modules.filter(
    (moduleItem) =>
      moduleItem.courseId ===
      courseId,
  );
}

export function getActivitiesForModule(
  moduleId: EntityId,
): readonly LearningActivity[] {
  return learningActivities
    .filter(
      (activity) =>
        activity.moduleId ===
        moduleId,
    )
    .sort(
      (left, right) =>
        left.order -
        right.order,
    );
}

export interface MvpCatalogItem {
  readonly course: Course;
  readonly module: LearningModule;
}

export function getMvpCatalogItems(): readonly MvpCatalogItem[] {
  return courses.flatMap(
    (course) =>
      getModulesForCourse(
        course.id,
      ).map(
        (moduleItem) => ({
          course,
          module:
            moduleItem,
        }),
      ),
  );
}

export const contentRegistryStats = {
  courses: courses.length,
  modules: modules.length,
  learningOutcomes:
    learningOutcomes.length,
  concepts: concepts.length,
  learningActivities:
    learningActivities.length,
  sources: sources.length,
} as const;