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

import {
  getNumericProblemDefinition,
} from "@/content/statics-problems";

import { BeamStaticsProblemActivity } from "@/features/learning/problems/beam-statics-problem-activity";

afterEach(() => {
  cleanup();
});

function getDefinition() {
  const definition =
    getNumericProblemDefinition(
      "activity-ssb-05",
    );

  if (
    !definition ||
    definition.kind !==
      "beam_statics_numeric_problem"
  ) {
    throw new Error(
      "Expected Statics numeric problem.",
    );
  }

  return definition;
}

function enterCorrectAnswers():
  void {
  fireEvent.change(
    screen.getByRole(
      "textbox",
      {
        name:
          "Left support reaction RA",
      },
    ),
    {
      target: {
        value: "8",
      },
    },
  );

  fireEvent.change(
    screen.getByRole(
      "textbox",
      {
        name:
          "Right support reaction RB",
      },
    ),
    {
      target: {
        value: "4",
      },
    },
  );

  fireEvent.change(
    screen.getByRole(
      "textbox",
      {
        name:
          "Shear force to the left of the load",
      },
    ),
    {
      target: {
        value: "8",
      },
    },
  );

  fireEvent.change(
    screen.getByRole(
      "textbox",
      {
        name:
          "Shear force to the right of the load",
      },
    ),
    {
      target: {
        value: "-4",
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
        value: "16",
      },
    },
  );

  fireEvent.change(
    screen.getByRole(
      "textbox",
      {
        name:
          "Location of maximum moment",
      },
    ),
    {
      target: {
        value: "2",
      },
    },
  );
}

describe(
  "BeamStaticsProblemActivity",
  () => {
    it(
      "renders six answer fields and the problem givens",
      () => {
        render(
          <BeamStaticsProblemActivity
            definition={
              getDefinition()
            }
            locale="en"
          />,
        );

        expect(
          screen.getAllByRole(
            "textbox",
          ),
        ).toHaveLength(6);

        expect(
          screen.getByText(
            "12 kN",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "6 m",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "records an incorrect submission without marking the problem correct",
      () => {
        const {
          container,
        } = render(
          <BeamStaticsProblemActivity
            definition={
              getDefinition()
            }
            locale="en"
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "textbox",
            {
              name:
                "Right support reaction RB",
            },
          ),
          {
            target: {
              value: "8",
            },
          },
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
            '[data-attempt-submitted="true"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-attempt-correct="false"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByText(
            /Take moments about A/i,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "accepts the complete Engineering Core solution",
      () => {
        const {
          container,
        } = render(
          <BeamStaticsProblemActivity
            definition={
              getDefinition()
            }
            locale="en"
          />,
        );

        enterCorrectAnswers();

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
          /All six results agree/i,
        );

        expect(
          screen.queryByRole(
            "button",
            {
              name:
                "Check again",
            },
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "accepts Turkish decimal-comma input",
      () => {
        render(
          <BeamStaticsProblemActivity
            definition={
              getDefinition()
            }
            locale="tr"
          />,
        );

        const fields =
          screen.getAllByRole(
            "textbox",
          );

        const values = [
          "8,0",
          "4,0",
          "8,0",
          "-4,0",
          "16,0",
          "2,0",
        ];

        for (
          let index = 0;
          index <
          fields.length;
          index += 1
        ) {
          fireEvent.change(
            fields[index]!,
            {
              target: {
                value:
                  values[index],
              },
            },
          );
        }

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Sonuçları kontrol et",
            },
          ),
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          /Altı sonuç da/i,
        );
      },
    );

    it(
      "allows revision and a second attempt after an incorrect submission",
      () => {
        const {
          container,
        } = render(
          <BeamStaticsProblemActivity
            definition={
              getDefinition()
            }
            locale="en"
          />,
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
            '[data-attempt-count="1"]',
          ),
        ).not.toBeNull();

        enterCorrectAnswers();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Check again",
            },
          ),
        );

        expect(
          container.querySelector(
            '[data-attempt-count="2"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-attempt-correct="true"]',
          ),
        ).not.toBeNull();
      },
    );
  },
);