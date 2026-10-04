import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_CRITERION_OPTION_IDS,
  createEngineeringCriterionOptions,
  isEngineeringCriterionStatus,
} from "@/domain/assessment/criterion";

describe(
  "Engineering assessment criterion statuses",
  () => {
    it(
      "defines four distinct criterion states",
      () => {
        expect(
          ENGINEERING_CRITERION_OPTION_IDS,
        ).toEqual([
          "pass",
          "fail",
          "unknown",
          "not_evaluated",
        ]);
      },
    );

    it(
      "creates choice options from the canonical criterion states",
      () => {
        expect(
          createEngineeringCriterionOptions(),
        ).toEqual([
          {
            id:
              "pass",
          },

          {
            id:
              "fail",
          },

          {
            id:
              "unknown",
          },

          {
            id:
              "not_evaluated",
          },
        ]);
      },
    );

    it(
      "recognizes valid criterion statuses",
      () => {
        expect(
          isEngineeringCriterionStatus(
            "pass",
          ),
        ).toBe(true);

        expect(
          isEngineeringCriterionStatus(
            "fail",
          ),
        ).toBe(true);

        expect(
          isEngineeringCriterionStatus(
            "unknown",
          ),
        ).toBe(true);

        expect(
          isEngineeringCriterionStatus(
            "not_evaluated",
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects unsupported criterion statuses",
      () => {
        expect(
          isEngineeringCriterionStatus(
            "safe",
          ),
        ).toBe(false);

        expect(
          isEngineeringCriterionStatus(
            "approved",
          ),
        ).toBe(false);

        expect(
          isEngineeringCriterionStatus(
            "maybe",
          ),
        ).toBe(false);
      },
    );
  },
);