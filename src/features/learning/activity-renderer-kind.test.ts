import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getLearningActivityRendererKind,
} from "@/features/learning/activity-renderer-kind";

import type {
  LearningActivityType,
} from "@/domain/learning/types";

describe(
  "Learning activity renderer classification",
  () => {
    it.each([
      "problem_context",
      "concept",
      "worked_example",
      "interpretation",
      "reflection",
      "summary",
    ] satisfies readonly LearningActivityType[])(
      "maps %s to the narrative renderer",
      (
        activityType,
      ) => {
        expect(
          getLearningActivityRendererKind(
            activityType,
          ),
        ).toBe(
          "narrative",
        );
      },
    );

    it.each([
      "prediction",
      "problem",
      "quiz",
    ] satisfies readonly LearningActivityType[])(
      "maps %s to the response renderer",
      (
        activityType,
      ) => {
        expect(
          getLearningActivityRendererKind(
            activityType,
          ),
        ).toBe(
          "response",
        );
      },
    );

    it.each([
      "interactive",
      "lab",
    ] satisfies readonly LearningActivityType[])(
      "maps %s to the interactive renderer",
      (
        activityType,
      ) => {
        expect(
          getLearningActivityRendererKind(
            activityType,
          ),
        ).toBe(
          "interactive",
        );
      },
    );

    it(
      "maps design tasks to the design renderer",
      () => {
        expect(
          getLearningActivityRendererKind(
            "design_task",
          ),
        ).toBe(
          "design",
        );
      },
    );
  },
);