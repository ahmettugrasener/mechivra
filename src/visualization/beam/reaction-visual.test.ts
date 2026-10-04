import {
  describe,
  expect,
  it,
} from "vitest";

import {
  REACTION_ARROW_MAX_LENGTH,
  REACTION_ARROW_MIN_LENGTH,
  ReactionVisualError,
  createReactionArrowVisual,
} from "@/visualization/beam/reaction-visual";

describe(
  "Reaction arrow visualization",
  () => {
    it(
      "maps a half-load reaction to a mid-range arrow",
      () => {
        const visual =
          createReactionArrowVisual(
            5,
            10,
          );

        expect(
          visual.magnitudeRatio,
        ).toBe(0.5);

        expect(
          visual.arrowLength,
        ).toBeCloseTo(
          (
            REACTION_ARROW_MIN_LENGTH +
            REACTION_ARROW_MAX_LENGTH
          ) /
            2,
          12,
        );
      },
    );

    it(
      "produces a longer arrow for a larger reaction",
      () => {
        const smaller =
          createReactionArrowVisual(
            2.5,
            10,
          );

        const larger =
          createReactionArrowVisual(
            7.5,
            10,
          );

        expect(
          larger.arrowLength,
        ).toBeGreaterThan(
          smaller.arrowLength,
        );
      },
    );

    it(
      "maps a full-load reaction to the maximum visual length",
      () => {
        const visual =
          createReactionArrowVisual(
            10,
            10,
          );

        expect(
          visual.magnitudeRatio,
        ).toBe(1);

        expect(
          visual.arrowLength,
        ).toBe(
          REACTION_ARROW_MAX_LENGTH,
        );
      },
    );

    it(
      "maps a zero reaction to no visible arrow length",
      () => {
        const visual =
          createReactionArrowVisual(
            0,
            10,
          );

        expect(
          visual,
        ).toEqual({
          magnitudeRatio: 0,
          arrowLength: 0,
        });
      },
    );

    it(
      "handles a zero-load state without division by zero",
      () => {
        const visual =
          createReactionArrowVisual(
            0,
            0,
          );

        expect(
          visual,
        ).toEqual({
          magnitudeRatio: 0,
          arrowLength: 0,
        });
      },
    );

    it(
      "rejects invalid reaction values",
      () => {
        expect(
          () =>
            createReactionArrowVisual(
              -1,
              10,
            ),
        ).toThrow(
          ReactionVisualError,
        );

        expect(
          () =>
            createReactionArrowVisual(
              Number.NaN,
              10,
            ),
        ).toThrow(
          ReactionVisualError,
        );
      },
    );
  },
);