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

function getBendingInteractiveActivity() {
  const activity =
    getActivitiesForModule(
      "module-bending",
    ).find(
      (candidate) =>
        candidate.id ===
        "activity-bending-04",
    );

  if (!activity) {
    throw new Error(
      "Expected Bending interactive activity.",
    );
  }

  return activity;
}

describe(
  "Bending interactive integration",
  () => {
    it(
      "renders the 5.5 learning content and the real interactive together",
      () => {
        render(
          <InteractiveActivityRenderer
            activity={
              getBendingInteractiveActivity()
            }
            locale="tr"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Tek değişkeni değiştir, sonucu izle",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "bending-interactive-explorer",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "rectangular-stress-section-diagram",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "deflected-beam-diagram",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);