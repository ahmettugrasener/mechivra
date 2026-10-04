import {
  describe,
  expect,
  it,
} from "vitest";

import {
  OTTO_CONTENT_VERSION,
  getOttoActivityContentDefinition,
  getOttoActivityContentDefinitions,
} from "@/content/otto-content";

function stringifyActivity(
  activityId:
    string,
): string {
  const definition =
    getOttoActivityContentDefinition(
      activityId,
    );

  if (!definition) {
    throw new Error(
      `Missing Otto content definition for ${activityId}.`,
    );
  }

  return JSON.stringify(
    definition,
  );
}

describe(
  "Ideal Otto scientific and pedagogical content",
  () => {
    it(
      "contains six Otto learning activities",
      () => {
        expect(
          getOttoActivityContentDefinitions(),
        ).toHaveLength(6);
      },
    );

    it(
      "provides real content blocks for every Otto activity",
      () => {
        for (
          const definition
          of getOttoActivityContentDefinitions()
        ) {
          expect(
            definition.blocks.length,
          ).toBeGreaterThan(
            0,
          );
        }
      },
    );

    it(
      "uses the revised content version consistently",
      () => {
        expect(
          OTTO_CONTENT_VERSION,
        ).toBe(
          "1.1.0",
        );

        for (
          const definition
          of getOttoActivityContentDefinitions()
        ) {
          expect(
            definition.version,
          ).toBe(
            OTTO_CONTENT_VERSION,
          );
        }
      },
    );

    it(
      "uses unique content-block IDs throughout the module",
      () => {
        const ids =
          getOttoActivityContentDefinitions()
            .flatMap(
              (definition) =>
                definition.blocks.map(
                  (block) =>
                    block.id,
                ),
            );

        expect(
          new Set(
            ids,
          ).size,
        ).toBe(
          ids.length,
        );
      },
    );

    it(
      "keeps the ideal cycle distinct from the real four-stroke engine",
      () => {
        const text =
          stringifyActivity(
            "activity-otto-01",
          );

        expect(
          text,
        ).toContain(
          "bire bir aynı değildir",
        );

        expect(
          text,
        ).toContain(
          "not identical",
        );

        expect(
          text,
        ).toContain(
          "egzoz zamanı",
        );
      },
    );

    it(
      "contains all four ideal thermodynamic processes",
      () => {
        const text =
          stringifyActivity(
            "activity-otto-02",
          );

        expect(
          text,
        ).toContain(
          "İzentropik sıkıştırma",
        );

        expect(
          text,
        ).toContain(
          "Sabit hacimde ısı eklenmesi",
        );

        expect(
          text,
        ).toContain(
          "İzentropik genleşme",
        );

        expect(
          text,
        ).toContain(
          "Sabit hacimde ısı atılması",
        );
      },
    );

    it(
      "contains the required state and energy equations",
      () => {
        const concept =
          stringifyActivity(
            "activity-otto-02",
          );

        const summary =
          stringifyActivity(
            "activity-otto-06",
          );

        expect(
          concept,
        ).toContain(
          "T_2 = T_1 r^{\\\\gamma-1}",
        );

        expect(
          concept,
        ).toContain(
          "p_2 = p_1 r^{\\\\gamma}",
        );

        expect(
          concept,
        ).toContain(
          "T_3 = T_2 + \\\\frac{q_{in}}{c_v}",
        );

        expect(
          concept,
        ).toContain(
          "T_4 = \\\\frac{T_3}{r^{\\\\gamma-1}}",
        );

        expect(
          summary,
        ).toContain(
          "w_{net} = q_{in} - q_{out}",
        );

        expect(
          summary,
        ).toContain(
          "\\\\eta = \\\\frac{w_{net}}{q_{in}}",
        );
      },
    );

    it(
      "keeps the prediction activity focused on prediction before revealing the relationship",
      () => {
        const text =
          stringifyActivity(
            "activity-otto-03",
          );

        expect(
          text,
        ).toContain(
          "Önce tahmin et",
        );

        expect(
          text,
        ).not.toContain(
          "verim artar",
        );

        expect(
          text,
        ).not.toContain(
          "efficiency increases",
        );
      },
    );

    it(
      "requires p-v rather than P-V when using specific volume",
      () => {
        const text =
          stringifyActivity(
            "activity-otto-02",
          );

        expect(
          text,
        ).toContain(
          "özgül hacim",
        );

        expect(
          text,
        ).toContain(
          "p–v",
        );

        expect(
          text,
        ).toContain(
          "P–V",
        );
      },
    );

    it(
      "keeps the new problem separate from its numerical answer",
      () => {
        const text =
          stringifyActivity(
            "activity-otto-05",
          );

        expect(
          text,
        ).toContain(
          "r = 6",
        );

        expect(
          text,
        ).toContain(
          "T₁ = 320 K",
        );

        expect(
          text,
        ).toContain(
          "qin = 600 kJ/kg",
        );

        expect(
          text,
        ).not.toContain(
          "1491.492",
        );

        expect(
          text,
        ).not.toContain(
          "306984",
        );

        expect(
          text,
        ).not.toContain(
          "51.164",
        );
      },
    );

    it(
      "states the principal model limitations in the summary",
      () => {
        const text =
          stringifyActivity(
            "activity-otto-06",
          );

        expect(
          text,
        ).toContain(
          "yanma kimyasını",
        );

        expect(
          text,
        ).toContain(
          "gaz değişimini",
        );

        expect(
          text,
        ).toContain(
          "sürtünmeyi",
        );

        expect(
          text,
        ).toContain(
          "vuruntuyu",
        );

        expect(
          text,
        ).toContain(
          "real-engine performance",
        );
      },
    );

    it(
      "does not invent an expert-approved high-temperature limit",
      () => {
        const text =
          stringifyActivity(
            "activity-otto-06",
          );

        expect(
          text,
        ).toContain(
          "sayısal üst sıcaklık sınırı henüz tanımlanmamıştır",
        );

        expect(
          text,
        ).toContain(
          "does not yet encode an expert-approved numerical upper-temperature limit",
        );
      },
    );

    it(
      "keeps the scientific source attached to every Otto activity",
      () => {
        for (
          const definition
          of getOttoActivityContentDefinitions()
        ) {
          expect(
            definition.sourceIds,
          ).toContain(
            "source-mit-otto-cycle",
          );
        }
      },
    );

    it(
      "provides Turkish and English text for every localized block",
      () => {
        for (
          const definition
          of getOttoActivityContentDefinitions()
        ) {
          for (
            const block
            of definition.blocks
          ) {
            if (
              block.type ===
              "equation"
            ) {
              if (
                block.description
              ) {
                expect(
                  block.description
                    .tr.trim(),
                ).not.toBe("");

                expect(
                  block.description
                    .en.trim(),
                ).not.toBe("");
              }

              continue;
            }

            expect(
              block.text.tr.trim(),
            ).not.toBe("");

            expect(
              block.text.en.trim(),
            ).not.toBe("");
          }
        }
      },
    );
  },
);