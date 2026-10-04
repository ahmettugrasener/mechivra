import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getWorkedExampleDefinition,
  getWorkedExampleDefinitions,
} from "@/content/worked-examples";

describe(
  "Worked-example content registry",
  () => {
    it(
      "contains the Statics eccentric-load worked example",
      () => {
        const definition =
          getWorkedExampleDefinition(
            "activity-ssb-02",
          );

        expect(
          definition,
        ).toBeDefined();

        expect(
          definition?.kind,
        ).toBe(
          "beam_statics_worked_example",
        );

        expect(
          definition?.input,
        ).toEqual({
          spanM: 4,
          pointLoadKN: 10,
          loadPositionM: 1,
        });

        expect(
          definition?.steps,
        ).toHaveLength(7);
      },
    );

    it(
      "uses unique definition IDs and activity IDs",
      () => {
        const definitions =
          getWorkedExampleDefinitions();

        expect(
          new Set(
            definitions.map(
              (definition) =>
                definition.id,
            ),
          ).size,
        ).toBe(
          definitions.length,
        );

        expect(
          new Set(
            definitions.map(
              (definition) =>
                definition.activityId,
            ),
          ).size,
        ).toBe(
          definitions.length,
        );
      },
    );

    it(
      "uses unique step and block IDs",
      () => {
        const definition =
          getWorkedExampleDefinition(
            "activity-ssb-02",
          );

        if (!definition) {
          throw new Error(
            "Expected Statics worked example.",
          );
        }

        const stepIds =
          definition.steps.map(
            (step) =>
              step.id,
          );

        const blockIds =
          definition.steps.flatMap(
            (step) =>
              step.contentBlocks.map(
                (block) =>
                  block.id,
              ),
          );

        expect(
          new Set(
            stepIds,
          ).size,
        ).toBe(
          stepIds.length,
        );

        expect(
          new Set(
            blockIds,
          ).size,
        ).toBe(
          blockIds.length,
        );
      },
    );
  },
);