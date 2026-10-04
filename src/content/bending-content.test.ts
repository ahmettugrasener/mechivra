import {
  describe,
  expect,
  it,
} from "vitest";

import {
  BENDING_CONTENT_VERSION,
  getBendingActivityContentDefinition,
  getBendingActivityContentDefinitions,
} from "@/content/bending-content";

function getDefinition(
  activityId: string,
) {
  const definition =
    getBendingActivityContentDefinition(
      activityId,
    );

  if (!definition) {
    throw new Error(
      `Missing Bending content for "${activityId}".`,
    );
  }

  return definition;
}

describe(
  "Bending scientific and pedagogical content",
  () => {
    it(
      "contains content for all six Bending activities",
      () => {
        expect(
          getBendingActivityContentDefinitions()
            .map(
              (definition) =>
                definition.activityId,
            ),
        ).toEqual([
          "activity-bending-01",
          "activity-bending-02",
          "activity-bending-03",
          "activity-bending-04",
          "activity-bending-05",
          "activity-bending-06",
        ]);
      },
    );

    it(
      "uses the revised Bending content version",
      () => {
        for (
          const definition
          of getBendingActivityContentDefinitions()
        ) {
          expect(
            definition.contentVersion,
          ).toBe(
            BENDING_CONTENT_VERSION,
          );

          expect(
            definition.contentVersion,
          ).toBe(
            "1.1.0",
          );
        }
      },
    );

    it(
      "provides real content blocks for every activity",
      () => {
        for (
          const definition
          of getBendingActivityContentDefinitions()
        ) {
          expect(
            definition.contentBlocks.length,
            `${definition.activityId} should contain learning content`,
          ).toBeGreaterThan(
            0,
          );
        }
      },
    );

    it(
      "uses unique content-block IDs across the Bending module",
      () => {
        const blockIds =
          getBendingActivityContentDefinitions()
            .flatMap(
              (definition) =>
                definition.contentBlocks.map(
                  (block) =>
                    block.id,
                ),
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

    it(
      "contains the required rectangular-section and bending-stress equations",
      () => {
        const concept =
          getDefinition(
            "activity-bending-02",
          );

        const equations =
          concept.contentBlocks
            .filter(
              (block) =>
                block.type ===
                "equation",
            )
            .map(
              (block) =>
                block.expression,
            );

        expect(
          equations,
        ).toContain(
          "I = \\frac{b h^3}{12}",
        );

        expect(
          equations,
        ).toContain(
          "\\sigma_x = -\\frac{M y}{I}",
        );

        expect(
          equations,
        ).toContain(
          "|\\sigma|_{\\max} = \\frac{|M| (h/2)}{I}",
        );
      },
    );

    it(
      "states the elastic-modulus distinction explicitly",
      () => {
        const concept =
          getDefinition(
            "activity-bending-02",
          );

        const text =
          JSON.stringify(
            concept.contentBlocks,
          );

        expect(
          text,
        ).toContain(
          "E'yi değiştirmek M veya eğilme gerilmesini doğrudan değiştirmez",
        );

        expect(
          text,
        ).toContain(
          "changing E does not directly change M or the bending stress",
        );

        expect(
          text,
        ).toContain(
          "sehim değişir",
        );

        expect(
          text,
        ).toContain(
          "deflection changes",
        );
      },
    );

    it(
      "marks PL cubed over 48EI as a midspan-load special case",
      () => {
        const concept =
          getDefinition(
            "activity-bending-02",
          );

        const text =
          JSON.stringify(
            concept.contentBlocks,
          );

        expect(
          text,
        ).toContain(
          "\\frac{P L^3}{48 E I}",
        );

        expect(
          text,
        ).toContain(
          "yalnız ortasından noktasal yüklenen",
        );

        expect(
          text,
        ).toContain(
          "special case",
        );
      },
    );

    it(
      "keeps the prediction activity free of the numerical answer",
      () => {
        const prediction =
          getDefinition(
            "activity-bending-03",
          );

        expect(
          prediction.contentBlocks.some(
            (block) =>
              block.type ===
              "equation",
          ),
        ).toBe(false);

        const text =
          JSON.stringify(
            prediction.contentBlocks,
          );

        expect(
          text,
        ).not.toContain(
          "dörtte",
        );

        expect(
          text,
        ).not.toContain(
          "sekizde",
        );

        expect(
          text,
        ).not.toContain(
          "factor of four",
        );

        expect(
          text,
        ).not.toContain(
          "factor of eight",
        );
      },
    );

    it(
      "defines a new problem without embedding worked answers",
      () => {
        const problem =
          getDefinition(
            "activity-bending-05",
          );

        const equations =
          problem.contentBlocks
            .filter(
              (block) =>
                block.type ===
                "equation",
            )
            .map(
              (block) =>
                block.expression,
            );

        expect(
          equations,
        ).toContain(
          "L=3\\ \\mathrm{m},\\quad P=8\\ \\mathrm{kN},\\quad a=1.5\\ \\mathrm{m}",
        );

        expect(
          equations,
        ).toContain(
          "b=80\\ \\mathrm{mm},\\quad h=160\\ \\mathrm{mm},\\quad E=70\\ \\mathrm{GPa}",
        );

        expect(
          equations.some(
            (equation) =>
              equation.includes(
                "17.578",
              ) ||
              equation.includes(
                "2.354",
              ),
          ),
        ).toBe(false);
      },
    );

    it(
      "states explicit model limitations in the summary",
      () => {
        const summary =
          getDefinition(
            "activity-bending-06",
          );

        const text =
          JSON.stringify(
            summary.contentBlocks,
          );

        expect(
          text,
        ).toContain(
          "Plastik analiz",
        );

        expect(
          text,
        ).toContain(
          "yorulma",
        );

        expect(
          text,
        ).toContain(
          "burkulma",
        );

        expect(
          text,
        ).toContain(
          "yerel gerilme yığılmaları",
        );

        expect(
          text,
        ).toContain(
          "does not establish that the structure is generally safe",
        );
      },
    );

    it(
      "keeps scientific source traceability on every activity",
      () => {
        for (
          const definition
          of getBendingActivityContentDefinitions()
        ) {
          expect(
            definition.sourceIds.length,
          ).toBeGreaterThan(
            0,
          );

          for (
            const sourceId
            of definition.sourceIds
          ) {
            expect([
              "source-mit-beam-displacements",
              "source-mit-mechanics-lecture-13",
            ]).toContain(
              sourceId,
            );
          }
        }
      },
    );
  },
);