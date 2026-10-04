import {
  describe,
  expect,
  it,
} from "vitest";

import { createBendingProblemAnswerKey } from "@/features/learning/bending/bending-problem-adapter";

describe(
  "Bending problem answer key",
  () => {
    it(
      "derives the answer key from the Engineering Core",
      () => {
        const key =
          createBendingProblemAnswerKey();

        expect(
          key.numeric
            .second_moment_area,
        ).toBeCloseTo(
          2730.6666667,
          5,
        );

        expect(
          key.numeric
            .maximum_moment,
        ).toBeCloseTo(
          6,
          10,
        );

        expect(
          key.numeric
            .maximum_stress,
        ).toBeCloseTo(
          17.578125,
          8,
        );

        expect(
          key.numeric
            .maximum_deflection,
        ).toBeCloseTo(
          2.35421317,
          8,
        );

        expect(
          key.decisions
            .stress_criterion,
        ).toBe(
          "satisfied",
        );

        expect(
          key.decisions
            .deflection_criterion,
        ).toBe(
          "not_satisfied",
        );
      },
    );
  },
);