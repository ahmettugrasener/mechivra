import {
  describe,
  expect,
  it,
} from "vitest";

import {
  courseSchema,
  learningActivitySchema,
  localizedTextSchema,
} from "@/content/schemas";

describe(
  "Content schemas",
  () => {
    it(
      "accepts complete TR/EN localized text",
      () => {
        const result =
          localizedTextSchema.safeParse(
            {
              tr: "Statik",
              en: "Statics",
            },
          );

        expect(
          result.success,
        ).toBe(true);
      },
    );

    it(
      "rejects localized text when English is missing",
      () => {
        const result =
          localizedTextSchema.safeParse(
            {
              tr: "Statik",
            },
          );

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects localized text when Turkish is missing",
      () => {
        const result =
          localizedTextSchema.safeParse(
            {
              en: "Statics",
            },
          );

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "accepts a valid course",
      () => {
        const result =
          courseSchema.safeParse({
            id: "course-test",
            version: "1.0.0",
            slug: "test-course",

            title: {
              tr: "Test Dersi",
              en: "Test Course",
            },

            description: {
              tr: "Türkçe açıklama.",
              en: "English description.",
            },

            moduleIds: [
              "module-test",
            ],

            status: "draft",
          });

        expect(
          result.success,
        ).toBe(true);
      },
    );

    it(
      "rejects invalid semantic versions",
      () => {
        const result =
          courseSchema.safeParse({
            id: "course-test",
            version: "1",

            slug: "test-course",

            title: {
              tr: "Test Dersi",
              en: "Test Course",
            },

            description: {
              tr: "Türkçe açıklama.",
              en: "English description.",
            },

            moduleIds: [],

            status: "draft",
          });

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "accepts a valid learning activity",
      () => {
        const result =
          learningActivitySchema.safeParse(
            {
              id: "activity-test-01",
              version: "1.0.0",

              moduleId:
                "module-test",

              type: "concept",
              order: 1,

              title: {
                tr: "Kavram",
                en: "Concept",
              },

              learningOutcomeIds: [
                "outcome-test-01",
              ],

              conceptIds: [
                "concept-test",
              ],

              sourceIds: [
                "source-test",
              ],

              contentBlocks: [
                {
                  id: "block-test-01",
                  type: "paragraph",

                  text: {
                    tr: "Türkçe içerik.",
                    en: "English content.",
                  },
                },
              ],

              completionRule: {
                type: "reached_end",
              },

              status: "draft",
            },
          );

        expect(
          result.success,
        ).toBe(true);
      },
    );
  },
);