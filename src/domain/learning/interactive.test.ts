import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createInteractiveEngagement,
  recordMeaningfulInteraction,
} from "@/domain/learning/interactive";

describe(
  "Interactive learning engagement",
  () => {
    it(
      "starts without a meaningful interaction",
      () => {
        const engagement =
          createInteractiveEngagement();

        expect(
          engagement,
        ).toEqual({
          hasMeaningfulInteraction:
            false,

          interactionCount: 0,
        });
      },
    );

    it(
      "records the first meaningful interaction separately from correctness",
      () => {
        const initial =
          createInteractiveEngagement();

        const updated =
          recordMeaningfulInteraction(
            initial,
          );

        expect(
          updated.hasMeaningfulInteraction,
        ).toBe(true);

        expect(
          updated.interactionCount,
        ).toBe(1);
      },
    );

    it(
      "increments repeated meaningful interactions deterministically",
      () => {
        const first =
          recordMeaningfulInteraction(
            createInteractiveEngagement(),
          );

        const second =
          recordMeaningfulInteraction(
            first,
          );

        expect(
          second.hasMeaningfulInteraction,
        ).toBe(true);

        expect(
          second.interactionCount,
        ).toBe(2);
      },
    );
  },
);