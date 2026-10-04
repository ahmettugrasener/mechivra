import {
  describe,
  expect,
  it,
} from "vitest";

import {
  EngineeringCriterionEvaluationError,
  evaluateBeamBendingCriteria,
  evaluateUpperBoundCriterion,
} from "@/domain/engineering/beam/bending/criteria";

import {
  createBeamBendingConfiguration,
} from "@/domain/engineering/beam/bending/state";

function createConfiguration(
  allowableBendingStressPa:
    number | null,

  allowableDeflectionM:
    number | null,
) {
  const result =
    createBeamBendingConfiguration(
      {
        sectionWidthM:
          0.1,

        sectionHeightM:
          0.2,

        elasticModulusPa:
          200e9,

        allowableBendingStressPa,

        allowableDeflectionM,
      },
    );

  if (
    !result.configuration
  ) {
    throw new Error(
      "Expected valid bending configuration.",
    );
  }

  return result.configuration;
}

describe(
  "Engineering criteria",
  () => {
    it(
      "marks an actual value below its upper limit as satisfied",
      () => {
        const result =
          evaluateUpperBoundCriterion(
            15,
            20,
          );

        expect(
          result.status,
        ).toBe(
          "satisfied",
        );

        expect(
          result.utilization,
        ).toBeCloseTo(
          0.75,
          12,
        );
      },
    );

    it(
      "treats equality with the limit as satisfied",
      () => {
        const result =
          evaluateUpperBoundCriterion(
            20,
            20,
          );

        expect(
          result.status,
        ).toBe(
          "satisfied",
        );

        expect(
          result.utilization,
        ).toBe(1);
      },
    );

    it(
      "marks an exceeded upper limit as not satisfied",
      () => {
        const result =
          evaluateUpperBoundCriterion(
            25,
            20,
          );

        expect(
          result.status,
        ).toBe(
          "not_satisfied",
        );

        expect(
          result.utilization,
        ).toBeCloseTo(
          1.25,
          12,
        );
      },
    );

    it(
      "returns undetermined rather than inventing a missing limit",
      () => {
        const result =
          evaluateUpperBoundCriterion(
            15,
            null,
          );

        expect(
          result,
        ).toEqual({
          status:
            "undetermined",

          actualValue:
            15,

          limitValue:
            null,

          utilization:
            null,
        });
      },
    );

    it(
      "evaluates bending stress and deflection independently",
      () => {
        const result =
          evaluateBeamBendingCriteria(
            15e6,
            0.001,
            createConfiguration(
              20e6,
              0.0005,
            ),
          );

        expect(
          result.bendingStress
            .status,
        ).toBe(
          "satisfied",
        );

        expect(
          result.deflection
            .status,
        ).toBe(
          "not_satisfied",
        );
      },
    );

    it(
      "keeps both criteria undetermined when limits are absent",
      () => {
        const result =
          evaluateBeamBendingCriteria(
            15e6,
            0.001,
            createConfiguration(
              null,
              null,
            ),
          );

        expect(
          result.bendingStress
            .status,
        ).toBe(
          "undetermined",
        );

        expect(
          result.deflection
            .status,
        ).toBe(
          "undetermined",
        );
      },
    );

    it(
      "rejects invalid actual or limit values",
      () => {
        expect(
          () =>
            evaluateUpperBoundCriterion(
              -1,
              20,
            ),
        ).toThrow(
          EngineeringCriterionEvaluationError,
        );

        expect(
          () =>
            evaluateUpperBoundCriterion(
              1,
              0,
            ),
        ).toThrow(
          EngineeringCriterionEvaluationError,
        );
      },
    );
  },
);