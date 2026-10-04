import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getActivitiesForModule,
  getMvpCatalogItems,
} from "@/content/registry";

import {
  isCompletionRuleCompatibleWithActivityType,
} from "@/domain/learning/completion";

describe(
  "Learning completion content integrity",
  () => {
    it(
      "uses a compatible completion rule for every MVP learning activity",
      () => {
        const activities =
          getMvpCatalogItems().flatMap(
            ({
              module:
                learningModule,
            }) =>
              getActivitiesForModule(
                learningModule.id,
              ),
          );

        expect(
          activities.length,
        ).toBeGreaterThan(0);

        for (
          const activity
          of activities
        ) {
          expect(
            isCompletionRuleCompatibleWithActivityType(
              activity.type,
              activity.completionRule
                .type,
            ),
            `${activity.id}: ${activity.type} must not use completion rule ${activity.completionRule.type}`,
          ).toBe(true);
        }
      },
    );
  },
);