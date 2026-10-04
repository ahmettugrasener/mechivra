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

import type {
  LearningActivity,
  LearningActivityType,
} from "@/domain/learning/types";

import { LearningActivityRenderer } from "@/features/learning/learning-activity-renderer";

afterEach(() => {
  cleanup();
});

function createActivity(
  type:
    LearningActivityType,
): LearningActivity {
  return {
    id:
      `activity-test-${type}`,

    version:
      "1.0.0",

    moduleId:
      "module-test",

    type,

    order: 1,

    title: {
      tr:
        "Test etkinliği",
      en:
        "Test activity",
    },

    learningOutcomeIds: [],
    conceptIds: [],
    sourceIds: [],

    contentBlocks: [
      {
        id:
          `block-test-${type}`,

        type:
          "paragraph",

        text: {
          tr:
            "Türkçe test içeriği.",
          en:
            "English test content.",
        },
      },
    ],

    completionRule: {
      type:
        "reached_end",
    },

    status:
      "draft",
  };
}

describe(
  "LearningActivityRenderer",
  () => {
    it(
      "uses the narrative renderer for a concept activity",
      () => {
        const {
          container,
        } = render(
          <LearningActivityRenderer
            activity={
              createActivity(
                "concept",
              )
            }
            locale="tr"
          />,
        );

        expect(
          container.querySelector(
            '[data-activity-renderer="narrative"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-activity-type="concept"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByText(
            "Türkçe test içeriği.",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "uses the response renderer for prediction activities",
      () => {
        const {
          container,
        } = render(
          <LearningActivityRenderer
            activity={
              createActivity(
                "prediction",
              )
            }
            locale="en"
          />,
        );

        expect(
          container.querySelector(
            '[data-activity-renderer="response"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByText(
            "English test content.",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "uses the response renderer for problem activities",
      () => {
        const {
          container,
        } = render(
          <LearningActivityRenderer
            activity={
              createActivity(
                "problem",
              )
            }
            locale="tr"
          />,
        );

        expect(
          container.querySelector(
            '[data-activity-renderer="response"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "uses the interactive renderer for interactive activities",
      () => {
        const {
          container,
        } = render(
          <LearningActivityRenderer
            activity={
              createActivity(
                "interactive",
              )
            }
            locale="tr"
          />,
        );

        expect(
          container.querySelector(
            '[data-activity-renderer="interactive"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "uses the design renderer for design tasks",
      () => {
        const {
          container,
        } = render(
          <LearningActivityRenderer
            activity={
              createActivity(
                "design_task",
              )
            }
            locale="tr"
          />,
        );

        expect(
          container.querySelector(
            '[data-activity-renderer="design"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "passes the activity content through the selected renderer",
      () => {
        render(
          <LearningActivityRenderer
            activity={
              createActivity(
                "summary",
              )
            }
            locale="en"
          />,
        );

        expect(
          screen.getByText(
            "English test content.",
          ),
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Türkçe test içeriği.",
          ),
        ).not.toBeInTheDocument();
      },
    );
  },
);