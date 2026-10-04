import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  BendingHeightPrediction,
} from "@/features/learning/bending/bending-height-prediction";

afterEach(() => {
  cleanup();
});

function getPredictionOptionButtons():
  HTMLButtonElement[] {
  const activity =
    screen.getByTestId(
      "bending-height-prediction",
    );

  return within(
    activity,
  )
    .getAllByRole(
      "button",
    )
    .filter(
      (
        button,
      ): button is HTMLButtonElement =>
        button.hasAttribute(
          "aria-pressed",
        ),
    );
}

describe(
  "BendingHeightPrediction",
  () => {
    it(
      "renders three prediction options without revealing the answer before submission",
      () => {
        render(
          <BendingHeightPrediction
            locale="tr"
          />,
        );

        const activity =
          screen.getByTestId(
            "bending-height-prediction",
          );

        const optionButtons =
          getPredictionOptionButtons();

        expect(
          optionButtons,
        ).toHaveLength(
          3,
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "false",
        );

        expect(
          screen.queryByText(
            "Tahmin doğru",
          ),
        ).not.toBeInTheDocument();

        expect(
          screen.queryByText(
            "Tahmini yeniden düşün",
          ),
        ).not.toBeInTheDocument();

        for (
          const button
          of optionButtons
        ) {
          expect(
            button,
          ).not.toBeDisabled();
        }
      },
    );

    it(
      "accepts the correct h-scaling prediction",
      () => {
        render(
          <BendingHeightPrediction
            locale="tr"
          />,
        );

        const activity =
          screen.getByTestId(
            "bending-height-prediction",
          );

        const optionButtons =
          getPredictionOptionButtons();

        fireEvent.click(
          optionButtons[1],
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "true",
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-prediction-correct",
          "true",
        );

        expect(
          screen.getByText(
            "Tahmin doğru",
          ),
        ).toBeInTheDocument();

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

    it(
      "locks all options after submission while keeping revision available",
      () => {
        render(
          <BendingHeightPrediction
            locale="tr"
          />,
        );

        const activity =
          screen.getByTestId(
            "bending-height-prediction",
          );

        const optionButtons =
          getPredictionOptionButtons();

        fireEvent.click(
          optionButtons[0],
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "true",
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-prediction-correct",
          "false",
        );

        expect(
          screen.getByText(
            "Tahmini yeniden düşün",
          ),
        ).toBeInTheDocument();

        for (
          const button
          of optionButtons
        ) {
          expect(
            button,
          ).toBeDisabled();
        }

        const reviseButton =
          screen.getByRole(
            "button",
            {
              name:
                "Tahmini yeniden dene",
            },
          );

        expect(
          reviseButton,
        ).toBeEnabled();
      },
    );
  },
);