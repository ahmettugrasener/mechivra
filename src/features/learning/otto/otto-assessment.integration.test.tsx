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
  getActivitiesForModule,
} from "@/content/registry";

import { NarrativeActivityRenderer } from "@/features/learning/renderers/narrative-activity-renderer";

import { ResponseActivityRenderer } from "@/features/learning/renderers/response-activity-renderer";

afterEach(() => {
  cleanup();
});

function getOttoActivity(
  activityId:
    string,
) {
  const activity =
    getActivitiesForModule(
      "module-ideal-otto-cycle",
    ).find(
      (
        candidate,
      ) =>
        candidate.id ===
        activityId,
    );

  if (
    !activity
  ) {
    throw new Error(
      `Missing Otto activity ${activityId}.`,
    );
  }

  return activity;
}

describe(
  "Otto assessment learning integration",
  () => {
    it(
      "renders prediction activity with the custom Otto predictor",
      () => {
        render(
          <ResponseActivityRenderer
            activity={
              getOttoActivity(
                "activity-otto-03",
              )
            }
            locale="tr"
          />,
        );

        expect(
          screen.getByTestId(
            "otto-compression-ratio-prediction",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders the worked example in the Otto concept activity",
      () => {
        render(
          <NarrativeActivityRenderer
            activity={
              getOttoActivity(
                "activity-otto-02",
              )
            }
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "otto-worked-example",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders the new Otto numeric problem",
      () => {
        render(
          <ResponseActivityRenderer
            activity={
              getOttoActivity(
                "activity-otto-05",
              )
            }
            locale="tr"
          />,
        );

        expect(
          screen.getByTestId(
            "otto-problem-activity",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getAllByRole(
            "textbox",
          ),
        ).toHaveLength(10);
      },
    );
  },
);