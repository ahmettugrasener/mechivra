import {
  describe,
  expect,
  it,
} from "vitest";

import {
  assertContentIntegrity,
  contentRegistryStats,
  getActivitiesForModule,
  getCourseBySlug,
  getLocalizedText,
  getModuleBySlugs,
  getModulesForCourse,
} from "@/content/registry";

describe(
  "Mechivra content registry",
  () => {
    it(
      "passes content integrity validation",
      () => {
        expect(
          () =>
            assertContentIntegrity(),
        ).not.toThrow();
      },
    );

    it(
      "contains the expected MVP inventory",
      () => {
        expect(
          contentRegistryStats,
        ).toEqual({
          courses: 3,
          modules: 3,
          learningOutcomes: 14,
          concepts: 17,
          learningActivities: 18,
          sources: 3,
        });
      },
    );

    it(
      "resolves the Statics course and its module",
      () => {
        const course =
          getCourseBySlug(
            "statics",
          );

        expect(course).toBeDefined();

        if (!course) {
          throw new Error(
            "Statics course was not found.",
          );
        }

        expect(course.id).toBe(
          "course-statics",
        );

        const modules =
          getModulesForCourse(
            course.id,
          );

        expect(
          modules,
        ).toHaveLength(1);

        expect(
          modules[0]?.id,
        ).toBe(
          "module-simply-supported-beam",
        );
      },
    );

    it(
      "resolves a module from course and module slugs",
      () => {
        const moduleItem =
          getModuleBySlugs(
            "mechanics-of-materials",
            "bending",
          );

        expect(
          moduleItem?.id,
        ).toBe(
          "module-bending",
        );
      },
    );

    it(
      "returns activities in defined order",
      () => {
        const moduleItem =
          getModuleBySlugs(
            "statics",
            "simply-supported-beam",
          );

        expect(
          moduleItem,
        ).toBeDefined();

        if (!moduleItem) {
          throw new Error(
            "Beam module was not found.",
          );
        }

        const activities =
          getActivitiesForModule(
            moduleItem.id,
          );

        expect(
          activities,
        ).toHaveLength(6);

        expect(
          activities.map(
            (activity) =>
              activity.order,
          ),
        ).toEqual([
          1,
          2,
          3,
          4,
          5,
          6,
        ]);

        expect(
          activities[0]?.id,
        ).toBe(
          "activity-ssb-01",
        );

        expect(
          activities[5]?.id,
        ).toBe(
          "activity-ssb-06",
        );
      },
    );

    it(
      "returns localized content from the same entity",
      () => {
        const course =
          getCourseBySlug(
            "statics",
          );

        expect(course).toBeDefined();

        if (!course) {
          throw new Error(
            "Statics course was not found.",
          );
        }

        expect(
          getLocalizedText(
            course.title,
            "tr",
          ),
        ).toBe("Statik");

        expect(
          getLocalizedText(
            course.title,
            "en",
          ),
        ).toBe("Statics");
      },
    );

    it(
      "does not resolve unknown course or module slugs",
      () => {
        expect(
          getCourseBySlug(
            "unknown-course",
          ),
        ).toBeUndefined();

        expect(
          getModuleBySlugs(
            "statics",
            "unknown-module",
          ),
        ).toBeUndefined();
      },
    );
  },
);