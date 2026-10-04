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

import { PredictionActivity } from "@/features/learning/prediction-activity";

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

describe(
  "PredictionActivity",
  () => {
    it(
      "renders the prediction prompt and options in Turkish",
      () => {
        render(
          <PredictionActivity
            definition={
              getStaticsPrediction()
            }
            locale="tr"
          />,
        );

        expect(
          screen.getByText(
            /yük sağ mesnete doğru hareket ederse/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getAllByRole(
            "button",
          ),
        ).toHaveLength(3);
      },
    );

    it(
      "renders English prediction content",
      () => {
        render(
          <PredictionActivity
            definition={
              getStaticsPrediction()
            }
            locale="en"
          />,
        );

        expect(
          screen.getByText(
            /load moves toward the right support/i,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "does not reveal feedback before a prediction is submitted",
      () => {
        render(
          <PredictionActivity
            definition={
              getStaticsPrediction()
            }
            locale="tr"
          />,
        );

        expect(
          screen.queryByRole(
            "status",
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "submits a prediction when an option is selected",
      () => {
        const {
          container,
        } = render(
          <PredictionActivity
            definition={
              getStaticsPrediction()
            }
            locale="tr"
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /sol mesnet tepkisi azalır/i,
            },
          ),
        );

        expect(
          container.querySelector(
            '[data-prediction-submitted="true"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByRole(
            "status",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "provides explanatory feedback for an incorrect prediction",
      () => {
        render(
          <PredictionActivity
            definition={
              getStaticsPrediction()
            }
            locale="tr"
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /sol mesnet tepkisi artar/i,
            },
          ),
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          /sol mesnet tepkisi artmaz; azalır/i,
        );
      },
    );

    it(
      "locks the submitted prediction instead of allowing post-hoc answer changes",
      () => {
        render(
          <PredictionActivity
            definition={
              getStaticsPrediction()
            }
            locale="en"
          />,
        );

        const buttons =
          screen.getAllByRole(
            "button",
          );

        fireEvent.click(
          buttons[0]!,
        );

        for (
          const button
          of buttons
        ) {
          expect(
            button,
          ).toBeDisabled();
        }
      },
    );

    it(
      "records correctness separately from submission state",
      () => {
        const {
          container,
        } = render(
          <PredictionActivity
            definition={
              getStaticsPrediction()
            }
            locale="en"
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                /both support reactions remain unchanged/i,
            },
          ),
        );

        expect(
          container.querySelector(
            '[data-prediction-submitted="true"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-prediction-correct="false"]',
          ),
        ).not.toBeNull();
      },
    );
  },
);