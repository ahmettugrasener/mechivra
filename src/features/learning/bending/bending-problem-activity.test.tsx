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

import { BendingProblemActivity } from "@/features/learning/bending/bending-problem-activity";

afterEach(() => {
  cleanup();
});

function fillCorrectNumericAnswers() {
  fireEvent.change(
    screen.getByRole(
      "textbox",
      {
        name:
          "Second moment of area I",
      },
    ),
    {
      target: {
        value:
          "2730.667",
      },
    },
  );

  fireEvent.change(
    screen.getByRole(
      "textbox",
      {
        name:
          "Maximum bending moment",
      },
    ),
    {
      target: {
        value:
          "6",
      },
    },
  );

  fireEvent.change(
    screen.getByRole(
      "textbox",
      {
        name:
          "Maximum bending stress",
      },
    ),
    {
      target: {
        value:
          "17.578",
      },
    },
  );

  fireEvent.change(
    screen.getByRole(
      "textbox",
      {
        name:
          "Maximum deflection",
      },
    ),
    {
      target: {
        value:
          "2.354",
      },
    },
  );
}

describe(
  "BendingProblemActivity",
  () => {
    it(
      "renders four numerical answers and two independent criteria",
      () => {
        render(
          <BendingProblemActivity
            locale="en"
          />,
        );

        expect(
          screen.getAllByRole(
            "textbox",
          ),
        ).toHaveLength(4);

        expect(
          screen.getByText(
            "20 MPa stress criterion",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "2 mm deflection criterion",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "accepts the correct complete solution",
      () => {
        const {
          container,
        } = render(
          <BendingProblemActivity
            locale="en"
          />,
        );

        fillCorrectNumericAnswers();

        const satisfied =
          screen.getAllByRole(
            "radio",
            {
              name:
                "Satisfied",
            },
          );

        const notSatisfied =
          screen.getAllByRole(
            "radio",
            {
              name:
                "Not satisfied",
            },
          );

        fireEvent.click(
          satisfied[0]!,
        );

        fireEvent.click(
          notSatisfied[1]!,
        );

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
          container.querySelector(
            '[data-attempt-correct="true"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          /All calculations and both criteria are correct/i,
        );
      },
    );

    it(
      "accepts Turkish decimal comma",
      () => {
        render(
          <BendingProblemActivity
            locale="tr"
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "textbox",
            {
              name:
                "Maksimum sehim",
            },
          ),
          {
            target: {
              value:
                "2,354",
            },
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Cevapları kontrol et",
            },
          ),
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);