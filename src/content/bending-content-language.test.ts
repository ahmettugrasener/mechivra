import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getBendingActivityContentDefinitions,
} from "@/content/bending-content";

describe(
  "Bending content language integrity",
  () => {
    it(
      "contains non-empty Turkish and English text wherever content is localized",
      () => {
        for (
          const definition
          of getBendingActivityContentDefinitions()
        ) {
          for (
            const block
            of definition.contentBlocks
          ) {
            switch (
              block.type
            ) {
              case "heading":
              case "paragraph":
                expect(
                  block.text.tr
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                expect(
                  block.text.en
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                break;

              case "equation":
                expect(
                  block.expression
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                if (
                  block.description
                ) {
                  expect(
                    block.description.tr
                      .trim().length,
                  ).toBeGreaterThan(
                    0,
                  );

                  expect(
                    block.description.en
                      .trim().length,
                  ).toBeGreaterThan(
                    0,
                  );
                }

                break;

              case "callout":
                expect(
                  block.body.tr
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                expect(
                  block.body.en
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                if (
                  block.title
                ) {
                  expect(
                    block.title.tr
                      .trim().length,
                  ).toBeGreaterThan(
                    0,
                  );

                  expect(
                    block.title.en
                      .trim().length,
                  ).toBeGreaterThan(
                    0,
                  );
                }

                break;

              case "figure":
                expect(
                  block.alt.tr
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                expect(
                  block.alt.en
                    .trim().length,
                ).toBeGreaterThan(
                  0,
                );

                break;
            }
          }
        }
      },
    );
  },
);