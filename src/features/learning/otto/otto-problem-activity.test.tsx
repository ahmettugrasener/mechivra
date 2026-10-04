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

import { OttoProblemActivity } from "@/features/learning/otto/otto-problem-activity";

afterEach(() => {
  cleanup();
});

describe(
  "OttoProblemActivity",
  () => {
    it(
      "renders ten engineering answer fields",
      () => {
        render(
          <OttoProblemActivity
            locale="en"
          />,
        );

        expect(
          screen.getAllByRole(
            "textbox",
          ),
        ).toHaveLength(10);

        expect(
          screen.getByText(
            /r = 6/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /qin = 600 kJ\/kg/i,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "accepts the complete verified solution",
      () => {
        render(
          <OttoProblemActivity
            locale="en"
          />,
        );

        const answers = [
          [
            "State-2 temperature T₂",
            "655.255",
          ],

          [
            "State-2 pressure p₂",
            "1474.324",
          ],

          [
            "State-2 specific volume v₂",
            "0.127556",
          ],

          [
            "State-3 temperature T₃",
            "1491.492",
          ],

          [
            "State-3 pressure p₃",
            "3355.857",
          ],

          [
            "State-4 temperature T₄",
            "728.384",
          ],

          [
            "State-4 pressure p₄",
            "273.144",
          ],

          [
            "Specific heat rejected qout",
            "293.016",
          ],

          [
            "Net specific work wnet",
            "306.984",
          ],

          [
            "Ideal thermal efficiency η",
            "51.164",
          ],
        ] as const;

        for (
          const [
            label,
            value,
          ]
          of answers
        ) {
          fireEvent.change(
            screen.getByRole(
              "textbox",
              {
                name:
                  label,
              },
            ),
            {
              target: {
                value,
              },
            },
          );
        }

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Check answers",
            },
          ),
        );

        expect(
          screen.getByTestId(
            "otto-problem-activity",
          ),
        ).toHaveAttribute(
          "data-attempt-correct",
          "true",
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          /All results are correct within tolerance/i,
        );
      },
    );

    it(
      "accepts Turkish decimal commas",
      () => {
        render(
          <OttoProblemActivity
            locale="tr"
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "textbox",
            {
              name:
                "İdeal ısıl verim η",
            },
          ),
          {
            target: {
              value:
                "51,164",
            },
          },
        );

        expect(
          screen.getByRole(
            "textbox",
            {
              name:
                "İdeal ısıl verim η",
            },
          ),
        ).toHaveValue(
          "51,164",
        );
      },
    );
  },
);