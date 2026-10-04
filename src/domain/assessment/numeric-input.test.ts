import {
  describe,
  expect,
  it,
} from "vitest";

import {
  parseNumericAssessmentInput,
} from "@/domain/assessment/numeric-input";

describe(
  "Numeric assessment input parser",
  () => {
    it(
      "parses Turkish decimal comma",
      () => {
        expect(
          parseNumericAssessmentInput(
            "51,164",
            "tr",
          ),
        ).toEqual({
          raw:
            "51,164",

          value:
            51.164,

          valid:
            true,
        });
      },
    );

    it(
      "parses English decimal point",
      () => {
        expect(
          parseNumericAssessmentInput(
            "51.164",
            "en",
          ),
        ).toEqual({
          raw:
            "51.164",

          value:
            51.164,

          valid:
            true,
        });
      },
    );

    it(
      "accepts machine-style decimal point in Turkish input",
      () => {
        const result =
          parseNumericAssessmentInput(
            "0.127556",
            "tr",
          );

        expect(
          result.valid,
        ).toBe(true);

        expect(
          result.value,
        ).toBeCloseTo(
          0.127556,
          12,
        );
      },
    );

    it(
      "supports signs and scientific notation",
      () => {
        expect(
          parseNumericAssessmentInput(
            "-1.5e3",
            "en",
          ).value,
        ).toBe(
          -1500,
        );

        expect(
          parseNumericAssessmentInput(
            "1,5e3",
            "tr",
          ).value,
        ).toBe(
          1500,
        );
      },
    );

    it(
      "rejects empty input",
      () => {
        expect(
          parseNumericAssessmentInput(
            "   ",
            "tr",
          ),
        ).toEqual({
          raw:
            "   ",

          value:
            null,

          valid:
            false,
        });
      },
    );

    it(
      "rejects ambiguous thousands-separated values",
      () => {
        expect(
          parseNumericAssessmentInput(
            "1.234,56",
            "tr",
          ).valid,
        ).toBe(false);

        expect(
          parseNumericAssessmentInput(
            "1,234.56",
            "en",
          ).valid,
        ).toBe(false);
      },
    );

    it(
      "rejects non-numeric and non-finite values",
      () => {
        for (
          const raw
          of [
            "abc",
            "Infinity",
            "NaN",
            "12 N",
            "--4",
          ]
        ) {
          expect(
            parseNumericAssessmentInput(
              raw,
              "en",
            ).valid,
          ).toBe(false);
        }
      },
    );
  },
);