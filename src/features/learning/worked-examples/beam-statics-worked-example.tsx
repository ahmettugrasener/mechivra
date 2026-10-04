import {
  beamStaticsModel,
  createSimplySupportedBeamStateFromDisplayInput,
  fromSI,
} from "@/domain/engineering";

import type {
  BeamStaticsWorkedExampleDefinition,
} from "@/domain/learning/worked-example";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { ContentBlockRenderer } from "@/features/learning/content-block-renderer";

import { BeamStaticsScene } from "@/visualization/beam/beam-statics-scene";

import { BendingMomentDiagram } from "@/visualization/beam/bending-moment-diagram";

import { ShearForceDiagram } from "@/visualization/beam/shear-force-diagram";

interface BeamStaticsWorkedExampleProps {
  readonly definition:
    BeamStaticsWorkedExampleDefinition;

  readonly locale:
    SupportedLocale;
}

export function BeamStaticsWorkedExample({
  definition,
  locale,
}: BeamStaticsWorkedExampleProps) {
  const stateResult =
    createSimplySupportedBeamStateFromDisplayInput(
      {
        span: {
          value:
            definition.input.spanM,
          unit: "m",
        },

        pointLoad: {
          value:
            definition.input
              .pointLoadKN,
          unit: "kN",
        },

        loadPosition: {
          value:
            definition.input
              .loadPositionM,
          unit: "m",
        },
      },
    );

  if (!stateResult.state) {
    throw new Error(
      `Worked example "${definition.id}" contains an invalid beam state.`,
    );
  }

  const result =
    beamStaticsModel.evaluate(
      stateResult.state,
    );

  if (!result.values) {
    throw new Error(
      `Worked example "${definition.id}" did not produce valid engineering values.`,
    );
  }

  const values =
    result.values;

  const maximumMomentLocation =
    values.moment.maximum
      .location;

  if (
    maximumMomentLocation.type !==
    "point"
  ) {
    throw new Error(
      `Worked example "${definition.id}" requires a unique maximum-moment location.`,
    );
  }

  const leftReactionKN =
    fromSI(
      "force",
      values.leftReactionN,
      "kN",
    );

  const rightReactionKN =
    fromSI(
      "force",
      values.rightReactionN,
      "kN",
    );

  const leftShearKN =
    fromSI(
      "force",
      values.shear
        .leftOfLoadN,
      "kN",
    );

  const rightShearKN =
    fromSI(
      "force",
      values.shear
        .rightOfLoadN,
      "kN",
    );

  const maximumMomentKNm =
    fromSI(
      "moment",
      values.moment.maximum
        .valueNm,
      "kN_m",
    );

  const sceneAriaLabel =
    locale === "tr"
      ? "Çözümlü örnek için basit mesnetli kiriş şeması"
      : "Simply supported beam diagram for the worked example";

  return (
    <section
      data-testid="beam-statics-worked-example"
      className="mt-10 space-y-8 border-t border-border pt-8"
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {locale === "tr"
            ? "Çözümlü örnek"
            : "Worked example"}
        </p>

        <h3 className="mt-2 text-2xl font-bold tracking-[-0.025em] text-foreground">
          {
            definition.title[
              locale
            ]
          }
        </h3>

        <p className="mt-3 max-w-3xl leading-7 text-muted-strong">
          {
            definition.introduction[
              locale
            ]
          }
        </p>
      </header>

      <BeamStaticsScene
        spanM={
          definition.input.spanM
        }
        pointLoadKN={
          definition.input
            .pointLoadKN
        }
        loadPositionM={
          definition.input
            .loadPositionM
        }
        leftReactionKN={
          leftReactionKN
        }
        rightReactionKN={
          rightReactionKN
        }
        locale={
          locale
        }
        ariaLabel={
          sceneAriaLabel
        }
      />

      <div className="space-y-6">
        {definition.steps.map(
          (
            step,
            index,
          ) => (
            <section
              key={
                step.id
              }
              data-worked-example-step={
                step.kind
              }
              className="rounded-xl border border-border bg-surface-subtle p-5 sm:p-6"
            >
              <div className="mb-5 flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white"
                >
                  {index + 1}
                </span>

                <h4 className="pt-1 text-lg font-semibold text-foreground">
                  {
                    step.title[
                      locale
                    ]
                  }
                </h4>
              </div>

              <ContentBlockRenderer
                blocks={
                  step.contentBlocks
                }
                locale={
                  locale
                }
              />
            </section>
          ),
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ShearForceDiagram
          spanM={
            definition.input.spanM
          }
          loadPositionM={
            definition.input
              .loadPositionM
          }
          leftShearKN={
            leftShearKN
          }
          rightShearKN={
            rightShearKN
          }
          locale={
            locale
          }
        />

        <BendingMomentDiagram
          spanM={
            definition.input.spanM
          }
          maximumMomentPositionM={
            maximumMomentLocation
              .xM
          }
          maximumMomentKNm={
            maximumMomentKNm
          }
          locale={
            locale
          }
        />
      </div>
    </section>
  );
}