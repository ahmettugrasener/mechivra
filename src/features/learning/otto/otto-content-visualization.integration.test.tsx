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

import { InteractiveActivityRenderer } from "@/features/learning/renderers/interactive-activity-renderer";

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
      (candidate) =>
        candidate.id ===
        activityId,
    );

  if (!activity) {
    throw new Error(
      `Missing Otto activity ${activityId}.`,
    );
  }

  return activity;
}

describe(
  "Otto content and visualization integration",
  () => {
    it(
      "renders scientific concept content with both visualizations",
      () => {
        render(
          <NarrativeActivityRenderer
            activity={
              getOttoActivity(
                "activity-otto-02",
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
                "Dört durum, dört ideal süreç",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "otto-concept-visualization-panel",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "ideal-otto-pv-diagram",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "otto-temperature-state-diagram",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders Otto prediction preparation content",
      () => {
        render(
          <ResponseActivityRenderer
            activity={
              getOttoActivity(
                "activity-otto-03",
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
                "Predict before calculating",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders Otto interactive preparation content before the explorer is added",
      () => {
        render(
          <InteractiveActivityRenderer
            activity={
              getOttoActivity(
                "activity-otto-04",
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
                "Tek değişkeni değiştir, bütün çevrimi izle",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders the new-problem content without exposing the numerical solution",
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
          screen.getByRole(
            "heading",
            {
              name:
                "Yeni bir Otto çevrimi hesapla",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            /306984/i,
          ),
        ).not.toBeInTheDocument();
      },
    );
  },
);