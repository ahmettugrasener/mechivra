import {
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import { Surface } from "@/components/ui/surface";

describe(
  "Surface",
  () => {
    it(
      "renders its children",
      () => {
        render(
          <Surface>
            <p>
              Engineering content
            </p>
          </Surface>,
        );

        expect(
          screen.getByText(
            "Engineering content",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "accepts additional class names",
      () => {
        const {
          container,
        } = render(
          <Surface className="test-surface">
            Content
          </Surface>,
        );

        const surface =
          container.firstElementChild;

        expect(
          surface,
        ).toHaveClass(
          "test-surface",
        );

        expect(
          surface,
        ).toHaveClass(
          "bg-surface",
        );
      },
    );
  },
);