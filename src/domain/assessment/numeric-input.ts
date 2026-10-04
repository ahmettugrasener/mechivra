export type NumericInputLocale =
  | "tr"
  | "en";

export interface NumericInputParseResult {
  readonly raw:
    string;

  readonly value:
    number | null;

  readonly valid:
    boolean;
}

export function parseNumericAssessmentInput(
  raw:
    string,

  locale:
    NumericInputLocale,
): NumericInputParseResult {
  const trimmed =
    raw.trim();

  if (
    trimmed.length ===
    0
  ) {
    return {
      raw,

      value:
        null,

      valid:
        false,
    };
  }

  /*
   * MVP input policy:
   *
   * TR:
   *   1234,56
   *   1234.56 is also accepted as a machine-style decimal.
   *
   * EN:
   *   1234.56
   *
   * Thousands separators are deliberately not interpreted
   * here because strings such as 1.234 are ambiguous across
   * locales. Display formatting and numeric input are kept
   * separate.
   */
  const normalized =
    locale ===
    "tr"
      ? trimmed.replace(
          ",",
          ".",
        )
      : trimmed;

  /*
   * Reject multiple separators or non-numeric tokens rather
   * than letting Number() interpret surprising formats.
   */
  const pattern =
    /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

  if (
    !pattern.test(
      normalized,
    )
  ) {
    return {
      raw,

      value:
        null,

      valid:
        false,
    };
  }

  const value =
    Number(
      normalized,
    );

  if (
    !Number.isFinite(
      value,
    )
  ) {
    return {
      raw,

      value:
        null,

      valid:
        false,
    };
  }

  return {
    raw,

    value,

    valid:
      true,
  };
}