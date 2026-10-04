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

import { ResponseActivityRenderer } from "@/features/learning/renderers/response-activity-renderer";

afterEach(() => {
  cleanup();
});

function getActivity(
  activityId:
    string,
) {
  const activity =
    getActivitiesForModule(
      "module-bending",
    ).find(
      (candidate) =>
        candidate.id ===
        activityId,
    );

  if (!activity) {
    throw new Error(
      `Missing activity ${activityId}.`,
    );
  }

  return activity;
}

describe(
  "Bending assessment integration",
  () => {
    it(
      "renders scientific content and the real prediction",
      () => {
        render(
          <ResponseActivityRenderer
            activity={
              getActivity(
                "activity-bending-03",
              )
            }
            locale="tr"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Önce tahmin et",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "bending-height-prediction",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders the new problem with Engineering-Core-derived grading",
      () => {
        render(
          <ResponseActivityRenderer
            activity={
              getActivity(
                "activity-bending-05",
              )
            }
            locale="en"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Evaluate a new beam case",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "bending-problem-activity",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);