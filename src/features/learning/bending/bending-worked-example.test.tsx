import {
  cleanup,
  render,
  screen,
} from "@testing-library/react";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  centeredPointLoadReference,
  isWithinBeamBendingReferenceTolerance,
} from "@/reference/engineering/beam-bending";

import { createBendingWorkedExampleResult } from "@/features/learning/bending/bending-worked-example-adapter";

import { BendingWorkedExample } from "@/features/learning/bending/bending-worked-example";

afterEach(() => {
  cleanup();
});

describe(
  "Bending worked example",
  () => {
    it(
      "matches the independent centered-load benchmark",
      () => {
        const result =
          createBendingWorkedExampleResult();

        const reference =
          centeredPointLoadReference;

        expect(
          isWithinBeamBendingReferenceTolerance(
            result.maximumMomentKNm *
              1000,

            reference.expected
              .maximumMomentNm,

            reference.tolerance
              .maximumMomentNm,
          ),
        ).toBe(true);

        expect(
          isWithinBeamBendingReferenceTolerance(
            result.maximumStressMPa *
              1e6,

            reference.expected
              .maximumAbsoluteStressPa,

            reference.tolerance
              .stressPa,
          ),
        ).toBe(true);

        expect(
          isWithinBeamBendingReferenceTolerance(
            result.maximumDeflectionMm /
              1000,

            reference.expected
              .maximumAbsoluteDeflectionM,

            reference.tolerance
              .deflectionM,
          ),
        ).toBe(true);
      },
    );

    it(
      "renders six ordered solution steps",
      () => {
        const {
          container,
        } = render(
          <BendingWorkedExample
            locale="tr"
          />,
        );

        expect(
          container.querySelectorAll(
            "[data-bending-worked-example-step]",
          ),
        ).toHaveLength(6);

        expect(
          screen.getByText(
            /Gerilme sınırı sağlanırken/i,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders stress and deflection visualizations",
      () => {
        render(
          <BendingWorkedExample
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "rectangular-stress-section-diagram",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "deflected-beam-diagram",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);