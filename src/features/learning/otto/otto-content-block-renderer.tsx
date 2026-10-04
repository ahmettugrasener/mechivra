import katex from "katex";

import type {
  OttoContentBlock,
} from "@/content/otto-content";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

interface OttoContentBlockRendererProps {
  readonly blocks:
    readonly OttoContentBlock[];

  readonly locale:
    SupportedLocale;
}

function renderEquation(
  expression:
    string,
): string {
  return katex.renderToString(
    expression,
    {
      displayMode:
        true,

      throwOnError:
        false,

      strict:
        false,
    },
  );
}

function calloutClassName(
  tone:
    "info" |
    "engineering" |
    "warning",
): string {
  if (
    tone ===
    "warning"
  ) {
    return "border-warning/30 bg-warning/5";
  }

  if (
    tone ===
    "engineering"
  ) {
    return "border-brand/20 bg-brand-soft";
  }

  return "border-border bg-surface-subtle";
}

export function OttoContentBlockRenderer({
  blocks,
  locale,
}: OttoContentBlockRendererProps) {
  return (
    <div
      data-testid="otto-content-block-renderer"
      className="space-y-6"
    >
      {blocks.map(
        (
          block,
        ) => {
          if (
            block.type ===
            "heading"
          ) {
            const text =
              block.text[
                locale
              ];

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
                  className="scroll-mt-24 text-2xl font-semibold tracking-[-0.025em] text-foreground"
                >
                  {text}
                </h2>
              );
            }

            if (
              block.level ===
              4
            ) {
              return (
                <h4
                  key={
                    block.id
                  }
                  id={
                    block.id
                  }
                  className="scroll-mt-24 text-lg font-semibold text-foreground"
                >
                  {text}
                </h4>
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

          if (
            block.type ===
            "paragraph"
          ) {
            return (
              <p
                key={
                  block.id
                }
                id={
                  block.id
                }
                className="max-w-3xl leading-7 text-muted-strong"
              >
                {
                  block.text[
                    locale
                  ]
                }
              </p>
            );
          }

          if (
            block.type ===
            "equation"
          ) {
            return (
              <section
                key={
                  block.id
                }
                id={
                  block.id
                }
                className="overflow-x-auto rounded-xl border border-border bg-background px-4 py-5"
              >
                <div
                  data-testid={`otto-equation-${block.id}`}
                  className="min-w-max text-foreground"
                  dangerouslySetInnerHTML={{
                    __html:
                      renderEquation(
                        block.expression,
                      ),
                  }}
                />

                {block.description ? (
                  <p className="mt-3 text-sm leading-6 text-muted-strong">
                    {
                      block
                        .description[
                        locale
                      ]
                    }
                  </p>
                ) : null}
              </section>
            );
          }

          return (
            <aside
              key={
                block.id
              }
              id={
                block.id
              }
              className={`rounded-xl border p-4 text-sm leading-6 text-muted-strong ${calloutClassName(
                block.tone,
              )}`}
            >
              {
                block.text[
                  locale
                ]
              }
            </aside>
          );
        },
      )}
    </div>
  );
}