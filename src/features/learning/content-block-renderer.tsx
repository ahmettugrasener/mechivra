import katex from "katex";

import "katex/dist/katex.min.css";

import {
  getLocalizedText,
} from "@/content/registry";

import type {
  CalloutTone,
  EquationContentBlock,
  FigureContentBlock,
  LearningContentBlock,
} from "@/domain/learning/types";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

interface ContentBlockRendererProps {
  readonly blocks:
    readonly LearningContentBlock[];

  readonly locale:
    SupportedLocale;
}

interface EquationBlockViewProps {
  readonly block:
    EquationContentBlock;

  readonly locale:
    SupportedLocale;
}

interface FigureBlockViewProps {
  readonly block:
    FigureContentBlock;

  readonly locale:
    SupportedLocale;
}

const calloutClasses: Record<
  CalloutTone,
  string
> = {
  info:
    "border-border-strong bg-surface-subtle",

  engineering:
    "border-brand/30 bg-brand-soft",

  warning:
    "border-warning/40 bg-warning/10",
};

function assertNever(
  value: never,
): never {
  throw new Error(
    `Unsupported learning content block: ${JSON.stringify(
      value,
    )}`,
  );
}

function EquationBlockView({
  block,
  locale,
}: EquationBlockViewProps) {
  const html =
    katex.renderToString(
      block.expression,
      {
        displayMode: true,
        throwOnError: false,
        strict: "warn",
        output:
          "htmlAndMathml",
      },
    );

  return (
    <figure className="overflow-x-auto rounded-xl border border-border bg-background px-4 py-5 sm:px-6">
      <div
        className="min-w-max text-center"
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />

      {block.description ? (
        <figcaption className="mt-3 text-center text-sm leading-6 text-muted">
          {getLocalizedText(
            block.description,
            locale,
          )}
        </figcaption>
      ) : null}
    </figure>
  );
}

function FigureBlockView({
  block,
  locale,
}: FigureBlockViewProps) {
  const alt =
    getLocalizedText(
      block.alt,
      locale,
    );

  return (
    <figure
      data-asset-id={
        block.assetId
      }
      className="overflow-hidden rounded-xl border border-border bg-background"
    >
      <div className="grid min-h-48 place-items-center px-6 py-10 text-center">
        <div>
          <p className="text-sm font-medium text-muted-strong">
            {alt}
          </p>

          <p
            aria-hidden="true"
            className="mt-2 font-mono text-xs text-muted"
          >
            {block.assetId}
          </p>
        </div>
      </div>

      {block.caption ? (
        <figcaption className="border-t border-border px-4 py-3 text-sm leading-6 text-muted sm:px-6">
          {getLocalizedText(
            block.caption,
            locale,
          )}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function ContentBlockRenderer({
  blocks,
  locale,
}: ContentBlockRendererProps) {
  if (
    blocks.length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-6">
      {blocks.map(
        (block) => {
          switch (
            block.type
          ) {
            case "heading": {
              const text =
                getLocalizedText(
                  block.text,
                  locale,
                );

              if (
                block.level ===
                2
              ) {
                return (
                  <h2
                    key={
                      block.id
                    }
                    id={
                      block.id
                    }
                    className="scroll-mt-24 text-2xl font-bold tracking-[-0.025em] text-foreground"
                  >
                    {text}
                  </h2>
                );
              }

              return (
                <h3
                  key={
                    block.id
                  }
                  id={
                    block.id
                  }
                  className="scroll-mt-24 text-xl font-semibold tracking-[-0.02em] text-foreground"
                >
                  {text}
                </h3>
              );
            }

            case "paragraph":
              return (
                <p
                  key={
                    block.id
                  }
                  className="max-w-3xl text-base leading-7 text-muted-strong"
                >
                  {getLocalizedText(
                    block.text,
                    locale,
                  )}
                </p>
              );

            case "equation":
              return (
                <EquationBlockView
                  key={
                    block.id
                  }
                  block={
                    block
                  }
                  locale={
                    locale
                  }
                />
              );

            case "callout":
              return (
                <aside
                  key={
                    block.id
                  }
                  data-tone={
                    block.tone
                  }
                  className={[
                    "rounded-xl border-l-4 px-5 py-4",
                    calloutClasses[
                      block.tone
                    ],
                  ].join(
                    " ",
                  )}
                >
                  {block.title ? (
                    <p className="font-semibold text-foreground">
                      {getLocalizedText(
                        block.title,
                        locale,
                      )}
                    </p>
                  ) : null}

                  <p
                    className={[
                      "leading-7 text-muted-strong",
                      block.title
                        ? "mt-2"
                        : "",
                    ].join(
                      " ",
                    )}
                  >
                    {getLocalizedText(
                      block.body,
                      locale,
                    )}
                  </p>
                </aside>
              );

            case "figure":
              return (
                <FigureBlockView
                  key={
                    block.id
                  }
                  block={
                    block
                  }
                  locale={
                    locale
                  }
                />
              );

            default:
              return assertNever(
                block,
              );
          }
        },
      )}
    </div>
  );
}