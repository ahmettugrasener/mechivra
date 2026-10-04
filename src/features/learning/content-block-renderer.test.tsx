import {
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import { ContentBlockRenderer } from "@/features/learning/content-block-renderer";

import type {
  LearningContentBlock,
} from "@/domain/learning/types";

describe(
  "ContentBlockRenderer",
  () => {
    it(
      "renders localized headings and paragraphs",
      () => {
        const blocks: LearningContentBlock[] =
          [
            {
              id:
                "block-heading",
              type:
                "heading",
              level: 2,

              text: {
                tr:
                  "Denge denklemleri",
                en:
                  "Equilibrium equations",
              },
            },

            {
              id:
                "block-paragraph",
              type:
                "paragraph",

              text: {
                tr:
                  "Bir kiriş dengedeyken kuvvetlerin toplamı sıfırdır.",
                en:
                  "For a beam in equilibrium, the sum of forces is zero.",
              },
            },
          ];

        render(
          <ContentBlockRenderer
            blocks={
              blocks
            }
            locale="tr"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              level: 2,
              name:
                "Denge denklemleri",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Bir kiriş dengedeyken kuvvetlerin toplamı sıfırdır.",
          ),
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Equilibrium equations",
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "renders English localized content",
      () => {
        const blocks: LearningContentBlock[] =
          [
            {
              id:
                "block-paragraph",
              type:
                "paragraph",

              text: {
                tr:
                  "Türkçe içerik",
                en:
                  "English content",
              },
            },
          ];

        render(
          <ContentBlockRenderer
            blocks={
              blocks
            }
            locale="en"
          />,
        );

        expect(
          screen.getByText(
            "English content",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders equations with KaTeX and keeps the source expression out of application logic",
      () => {
        const blocks: LearningContentBlock[] =
          [
            {
              id:
                "block-equation",
              type:
                "equation",

              expression:
                "R_A + R_B - P = 0",

              description: {
                tr:
                  "Düşey kuvvet dengesi",
                en:
                  "Vertical force equilibrium",
              },
            },
          ];

        const {
          container,
        } = render(
          <ContentBlockRenderer
            blocks={
              blocks
            }
            locale="en"
          />,
        );

        expect(
          container.querySelector(
            ".katex",
          ),
        ).not.toBeNull();

        expect(
          screen.getByText(
            "Vertical force equilibrium",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders callout title, body, and tone",
      () => {
        const blocks: LearningContentBlock[] =
          [
            {
              id:
                "block-callout",
              type:
                "callout",

              tone:
                "engineering",

              title: {
                tr:
                  "Mühendislik notu",
                en:
                  "Engineering note",
              },

              body: {
                tr:
                  "İşaret kuralını hesap boyunca değiştirme.",
                en:
                  "Keep the sign convention consistent throughout the calculation.",
              },
            },
          ];

        const {
          container,
        } = render(
          <ContentBlockRenderer
            blocks={
              blocks
            }
            locale="tr"
          />,
        );

        expect(
          screen.getByText(
            "Mühendislik notu",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "İşaret kuralını hesap boyunca değiştirme.",
          ),
        ).toBeInTheDocument();

        expect(
          container.querySelector(
            '[data-tone="engineering"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "preserves figure asset metadata and localized caption",
      () => {
        const blocks: LearningContentBlock[] =
          [
            {
              id:
                "block-figure",
              type:
                "figure",

              assetId:
                "asset-beam-free-body",

              alt: {
                tr:
                  "Basit mesnetli kiriş serbest cisim diyagramı",
                en:
                  "Simply supported beam free-body diagram",
              },

              caption: {
                tr:
                  "Kiriş, mesnetler ve noktasal yük.",
                en:
                  "Beam, supports, and point load.",
              },
            },
          ];

        const {
          container,
        } = render(
          <ContentBlockRenderer
            blocks={
              blocks
            }
            locale="en"
          />,
        );

        expect(
          container.querySelector(
            '[data-asset-id="asset-beam-free-body"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByText(
            "Simply supported beam free-body diagram",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Beam, supports, and point load.",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders nothing for an empty block collection",
      () => {
        const {
          container,
        } = render(
          <ContentBlockRenderer
            blocks={[]}
            locale="tr"
          />,
        );

        expect(
          container,
        ).toBeEmptyDOMElement();
      },
    );
  },
);