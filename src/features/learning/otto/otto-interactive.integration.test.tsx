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

afterEach(() => {
  cleanup();
});

describe(
  "Otto interactive learning integration",
  () => {
    it(
      "renders activity-otto-04 with the synchronized Otto explorer",
      () => {
        const activity =
          getActivitiesForModule(
            "module-ideal-otto-cycle",
          ).find(
            (candidate) =>
              candidate.id ===
              "activity-otto-04",
          );

        if (!activity) {
          throw new Error(
            "Missing activity-otto-04.",
          );
        }

        render(
          <InteractiveActivityRenderer
            activity={
              activity
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

        expect(
          screen.getByTestId(
            "otto-interactive-explorer",
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
  },
);