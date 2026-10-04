import {
  describe,
  expect,
  it,
} from "vitest";

import {
  OTTO_SUMMARY_ASSUMPTIONS,
  OTTO_SUMMARY_CAPABILITIES,
  OTTO_SUMMARY_INTERPRETATION_RULES,
  OTTO_SUMMARY_LIMITATIONS,
  OTTO_SUMMARY_SOURCES,
  OTTO_SUMMARY_VERSION,
} from "@/content/otto-summary";

function combinedText(
  entries: readonly {
    readonly tr:
      string;

    readonly en:
      string;
  }[],
): string {
  return JSON.stringify(
    entries,
  );
}

describe(
  "Ideal Otto module summary",
  () => {
    it(
      "has a stable summary version",
      () => {
        expect(
          OTTO_SUMMARY_VERSION,
        ).toBe(
          "1.0.0",
        );
      },
    );

    it(
      "summarizes the main module capabilities",
      () => {
        expect(
          OTTO_SUMMARY_CAPABILITIES.length,
        ).toBeGreaterThanOrEqual(
          5,
        );

        const text =
          combinedText(
            OTTO_SUMMARY_CAPABILITIES,
          );

        expect(
          text,
        ).toContain(
          "four thermodynamic states",
        );

        expect(
          text,
        ).toContain(
          "energy balance",
        );

        expect(
          text,
        ).toContain(
          "compression ratio",
        );
      },
    );

    it(
      "states the air-standard ideal-gas constant-specific-heat assumptions",
      () => {
        const text =
          combinedText(
            OTTO_SUMMARY_ASSUMPTIONS,
          );

        expect(
          text,
        ).toContain(
          "hava-standardı",
        );

        expect(
          text,
        ).toContain(
          "ideal gas",
        );

        expect(
          text,
        ).toContain(
          "Specific heats are constant",
        );

        expect(
          text,
        ).toContain(
          "absolute pressures",
        );
      },
    );

    it(
      "states the principal real-engine exclusions",
      () => {
        const text =
          combinedText(
            OTTO_SUMMARY_LIMITATIONS,
          );

        expect(
          text,
        ).toContain(
          "yanma kimyası",
        );

        expect(
          text,
        ).toContain(
          "gas exchange",
        );

        expect(
          text,
        ).toContain(
          "Friction",
        );

        expect(
          text,
        ).toContain(
          "Knock",
        );

        expect(
          text,
        ).toContain(
          "fuel consumption",
        );
      },
    );

    it(
      "does not invent a high-temperature numerical validity threshold",
      () => {
        const text =
          combinedText(
            OTTO_SUMMARY_LIMITATIONS,
          );

        expect(
          text,
        ).toContain(
          "uzman onaylı sayısal bir üst sıcaklık sınırı henüz kodlanmamıştır",
        );

        expect(
          text,
        ).toContain(
          "does not yet encode an expert-approved numerical upper-temperature limit",
        );
      },
    );

    it(
      "preserves the ideal-cycle versus real-four-stroke distinction",
      () => {
        const text =
          combinedText(
            OTTO_SUMMARY_INTERPRETATION_RULES,
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
      "preserves the p-v and specific-work interpretation rules",
      () => {
        const text =
          combinedText(
            OTTO_SUMMARY_INTERPRETATION_RULES,
          );

        expect(
          text,
        ).toContain(
          "p–v",
        );

        expect(
          text,
        ).toContain(
          "kJ/kg",
        );

        expect(
          text,
        ).toContain(
          "kW",
        );
      },
    );

    it(
      "states that qin does not change ideal efficiency at fixed r and gamma",
      () => {
        const text =
          combinedText(
            OTTO_SUMMARY_INTERPRETATION_RULES,
          );

        expect(
          text,
        ).toContain(
          "ideal Otto verimi değişmez",
        );

        expect(
          text,
        ).toContain(
          "ideal Otto efficiency remains unchanged",
        );
      },
    );

    it(
      "contains the approved scientific source record",
      () => {
        expect(
          OTTO_SUMMARY_SOURCES,
        ).toEqual([
          expect.objectContaining({
            id:
              "source-mit-otto-cycle",

            title:
              "Thermodynamics Notes — The Otto Cycle",

            organization:
              "MIT Unified Engineering",
          }),
        ]);
      },
    );
  },
);