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
  getPredictionDefinition,
} from "@/content/predictions";

import {
  getNumericProblemDefinition,
} from "@/content/statics-problems";

import {
  BendingProblemActivity,
} from "@/features/learning/bending/bending-problem-activity";

import {
  OttoCompressionRatioPrediction,
} from "@/features/learning/otto/otto-compression-ratio-prediction";

import {
  OttoProblemActivity,
} from "@/features/learning/otto/otto-problem-activity";

import {
  PredictionActivity,
} from "@/features/learning/prediction-activity";

import {
  BeamStaticsProblemActivity,
} from "@/features/learning/problems/beam-statics-problem-activity";

afterEach(() => {
  cleanup();
});

function getStaticsPrediction() {
  const definition =
    getPredictionDefinition(
      "activity-ssb-03",
    );

  if (!definition) {
    throw new Error(
      "Expected Statics prediction definition.",
    );
  }

  return definition;
}

function getStaticsProblem() {
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
      "Expected Statics numeric problem definition.",
    );
  }

  return definition;
}

function fillStaticsCorrectAnswers():
  void {
  const answers = [
    [
      "Left support reaction RA",
      "8",
    ],

    [
      "Right support reaction RB",
      "4",
    ],

    [
      "Shear force to the left of the load",
      "8",
    ],

    [
      "Shear force to the right of the load",
      "-4",
    ],

    [
      "Maximum bending moment",
      "16",
    ],

    [
      "Location of maximum moment",
      "2",
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
}

function fillBendingCorrectAnswers():
  void {
  const numericAnswers = [
    [
      "Second moment of area I",
      "2730.667",
    ],

    [
      "Maximum bending moment",
      "6",
    ],

    [
      "Maximum bending stress",
      "17.578",
    ],

    [
      "Maximum deflection",
      "2.354",
    ],
  ] as const;

  for (
    const [
      label,
      value,
    ]
    of numericAnswers
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
}

function fillOttoCorrectAnswers():
  void {
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
}

describe(
  "Assessment Core MVP migration regression",
  () => {
    it(
      "preserves Statics prediction revision as a second evaluated attempt",
      () => {
        render(
          <PredictionActivity
            definition={
              getStaticsPrediction()
            }
            locale="en"
            testId="statics-prediction-regression"
          />,
        );

        const activity =
          screen.getByTestId(
            "statics-prediction-regression",
          );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /The left reaction increases and the right reaction decreases/i,
            },
          ),
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
          activity,
        ).toHaveAttribute(
          "data-attempt-count",
          "1",
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Revise prediction",
            },
          ),
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "false",
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-attempt-count",
          "1",
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /The left reaction decreases and the right reaction increases/i,
            },
          ),
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
          activity,
        ).toHaveAttribute(
          "data-attempt-count",
          "2",
        );
      },
    );

    it(
      "keeps Otto explicit prediction submission separate from selection and preserves revision history",
      () => {
        render(
          <OttoCompressionRatioPrediction
            locale="en"
          />,
        );

        const activity =
          screen.getByTestId(
            "otto-compression-ratio-prediction",
          );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /Ideal efficiency decreases/i,
            },
          ),
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "false",
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-attempt-count",
          "0",
        );

        expect(
          screen.queryByRole(
            "status",
          ),
        ).not.toBeInTheDocument();

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
          activity,
        ).toHaveAttribute(
          "data-attempt-count",
          "1",
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Revise prediction",
            },
          ),
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "false",
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-attempt-count",
          "1",
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /Ideal efficiency increases/i,
            },
          ),
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "false",
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
          activity,
        ).toHaveAttribute(
          "data-prediction-correct",
          "true",
        );

        expect(
          activity,
        ).toHaveAttribute(
          "data-attempt-count",
          "2",
        );
      },
    );

    it(
      "preserves Statics attempt one after a successful second problem attempt",
      () => {
        const {
          container,
        } =
          render(
            <BeamStaticsProblemActivity
              definition={
                getStaticsProblem()
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

        expect(
          container.querySelector(
            '[data-attempt-correct="false"]',
          ),
        ).not.toBeNull();

        fillStaticsCorrectAnswers();

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

    it(
      "preserves Bending attempt one and evaluates four numeric plus two independent criteria on attempt two",
      () => {
        const {
          container,
        } =
          render(
            <BendingProblemActivity
              locale="en"
            />,
          );

        expect(
          screen.getAllByRole(
            "textbox",
          ),
        ).toHaveLength(
          4,
        );

        expect(
          screen.getAllByRole(
            "radio",
          ),
        ).toHaveLength(
          4,
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

        expect(
          container.querySelector(
            '[data-attempt-correct="false"]',
          ),
        ).not.toBeNull();

        fillBendingCorrectAnswers();

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
      "preserves Otto attempt one and evaluates all ten engineering fields on attempt two",
      () => {
        const {
          container,
        } =
          render(
            <OttoProblemActivity
              locale="en"
            />,
          );

        expect(
          screen.getAllByRole(
            "textbox",
          ),
        ).toHaveLength(
          10,
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

        expect(
          container.querySelector(
            '[data-attempt-correct="false"]',
          ),
        ).not.toBeNull();

        fillOttoCorrectAnswers();

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

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          /All results are correct within tolerance/i,
        );
      },
    );
  },
);