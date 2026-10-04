import {
  describe,
  expect,
  it,
} from "vitest";

import {
  BEAM_STATICS_MODEL_ID,
} from "@/domain/engineering";

import {
  getInteractiveDefinition,
  getInteractiveDefinitions,
} from "@/content/interactives";

describe(
  "Interactive content registry",
  () => {
    it(
      "contains the Statics point-load explorer",
      () => {
        const definition =
          getInteractiveDefinition(
            "activity-ssb-04",
          );

        expect(
          definition,
        ).toBeDefined();

        expect(
          definition?.kind,
        ).toBe(
          "beam_statics_point_load_explorer",
        );

        expect(
          definition?.engineeringModelId,
        ).toBe(
          BEAM_STATICS_MODEL_ID,
        );
      },
    );

    it(
      "uses the verified centered beam state as the initial configuration",
      () => {
        const definition =
          getInteractiveDefinition(
            "activity-ssb-04",
          );

        if (
          !definition ||
          definition.kind !==
            "beam_statics_point_load_explorer"
        ) {
          throw new Error(
            "Expected beam statics interactive definition.",
          );
        }

        expect(
          definition.configuration
            .spanM,
        ).toBe(4);

        expect(
          definition.configuration
            .pointLoad.initial,
        ).toBe(10);

        expect(
          definition.configuration
            .loadPosition.initial,
        ).toBe(2);
      },
    );

    it(
      "uses unique definition and activity IDs",
      () => {
        const definitions =
          getInteractiveDefinitions();

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
      "returns undefined for a non-interactive activity",
      () => {
        expect(
          getInteractiveDefinition(
            "activity-ssb-01",
          ),
        ).toBeUndefined();
      },
    );
  },
);