import {
  describe,
  expect,
  it,
} from "vitest";

import {
  bendingModuleSummary,
} from "@/content/bending-summary";

describe(
  "Bending module summary",
  () => {
    it(
      "summarizes the main Bending capabilities",
      () => {
        expect(
          bendingModuleSummary
            .capabilities.length,
        ).toBeGreaterThanOrEqual(
          6,
        );

        const text =
          JSON.stringify(
            bendingModuleSummary
              .capabilities,
          );

        expect(
          text,
        ).toContain(
          "I = bh³/12",
        );

        expect(
          text,
        ).toContain(
          "σx = -My/I",
        );

        expect(
          text,
        ).toContain(
          "maximum deflection",
        );
      },
    );

    it(
      "states the required model assumptions",
      () => {
        const text =
          JSON.stringify(
            bendingModuleSummary
              .assumptions,
          );

        expect(
          text,
        ).toContain(
          "homojen",
        );

        expect(
          text,
        ).toContain(
          "prizmatik",
        );

        expect(
          text,
        ).toContain(
          "doğrusal elastik",
        );

        expect(
          text,
        ).toContain(
          "küçük",
        );

        expect(
          text,
        ).toContain(
          "Euler–Bernoulli",
        );
      },
    );

    it(
      "states the critical model limitations",
      () => {
        const text =
          JSON.stringify(
            bendingModuleSummary
              .limitations,
          );

        expect(
          text,
        ).toContain(
          "Plastik",
        );

        expect(
          text,
        ).toContain(
          "Yorulma",
        );

        expect(
          text,
        ).toContain(
          "Burkulma",
        );

        expect(
          text,
        ).toContain(
          "yerel gerilme yığılmaları",
        );

        expect(
          text,
        ).toContain(
          "structural-safety assessment",
        );
      },
    );

    it(
      "prevents criterion results from becoming a global safety verdict",
      () => {
        const text =
          JSON.stringify(
            bendingModuleSummary
              .interpretationRules,
          );

        expect(
          text,
        ).toContain(
          "'kiriş güvenlidir'",
        );

        expect(
          text,
        ).toContain(
          "does not establish that the beam is 'safe'",
        );
      },
    );

    it(
      "retains both scientific source records",
      () => {
        expect(
          bendingModuleSummary
            .sources.map(
              (source) =>
                source.sourceId,
            ),
        ).toEqual([
          "source-mit-mechanics-lecture-13",
          "source-mit-beam-displacements",
        ]);
      },
    );

    it(
      "keeps Turkish and English summary text complete",
      () => {
        const localizedItems = [
          ...bendingModuleSummary
            .capabilities,
          ...bendingModuleSummary
            .assumptions,
          ...bendingModuleSummary
            .limitations,
          ...bendingModuleSummary
            .interpretationRules,
          ...bendingModuleSummary
            .sources.map(
              (source) =>
                source.role,
            ),
        ];

        for (
          const item
          of localizedItems
        ) {
          expect(
            item.tr.trim().length,
          ).toBeGreaterThan(
            0,
          );

          expect(
            item.en.trim().length,
          ).toBeGreaterThan(
            0,
          );
        }
      },
    );
  },
);