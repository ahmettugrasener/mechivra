import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import { OttoCompressionRatioPrediction } from "@/features/learning/otto/otto-compression-ratio-prediction";

afterEach(() => {
  cleanup();
});

describe(
  "OttoCompressionRatioPrediction",
  () => {
    it(
      "does not reveal the answer before submission",
      () => {
        render(
          <OttoCompressionRatioPrediction
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "otto-compression-ratio-prediction",
          ),
        ).toHaveAttribute(
          "data-prediction-submitted",
          "false",
        );

        expect(
          screen.queryByRole(
            "status",
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "accepts the correct compression-ratio prediction",
      () => {
        render(
          <OttoCompressionRatioPrediction
            locale="en"
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /Ideal efficiency increases; T₂ and p₂ increase, while v₂ decreases/i,
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Submit prediction",
            },
          ),
        );

        expect(
          screen.getByTestId(
            "otto-compression-ratio-prediction",
          ),
        ).toHaveAttribute(
          "data-prediction-correct",
          "true",
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          /Prediction correct/i,
        );
      },
    );

    it(
      "locks all choices after submission",
      () => {
        render(
          <OttoCompressionRatioPrediction
            locale="tr"
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /İdeal verim artar; T₂ ve p₂ artar, v₂ azalır/i,
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Tahmini gönder",
            },
          ),
        );

        const optionButtons =
          screen
            .getAllByRole(
              "button",
            )
            .filter(
              (
                button,
              ) =>
                button.textContent?.startsWith(
                  "A",
                ) ||
                button.textContent?.startsWith(
                  "B",
                ) ||
                button.textContent?.startsWith(
                  "C",
                ),
            );

        expect(
          optionButtons,
        ).toHaveLength(3);

        for (
          const button
          of optionButtons
        ) {
          expect(
            button,
          ).toBeDisabled();
        }
      },
    );
  },
);