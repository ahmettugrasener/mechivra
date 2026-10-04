"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  beamStaticsModel,
  createSimplySupportedBeamStateFromDisplayInput,
  fromSI,
} from "@/domain/engineering";

import {
  createInteractiveEngagement,
  recordMeaningfulInteraction,
} from "@/domain/learning/interactive";

import type {
  BeamStaticsPointLoadExplorerDefinition,
} from "@/domain/learning/interactive";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { BeamStaticsScene } from "@/visualization/beam/beam-statics-scene";

import { BendingMomentDiagram } from "@/visualization/beam/bending-moment-diagram";

import type {
  BeamInteractionParameter,
} from "@/visualization/beam/interaction-state";

import { ShearForceDiagram } from "@/visualization/beam/shear-force-diagram";

interface BeamStaticsPointLoadExplorerProps {
  readonly definition:
    BeamStaticsPointLoadExplorerDefinition;

  readonly locale:
    SupportedLocale;
}

export function BeamStaticsPointLoadExplorer({
  definition,
  locale,
}: BeamStaticsPointLoadExplorerProps) {
  const [
    pointLoadKN,
    setPointLoadKN,
  ] = useState(
    definition.configuration
      .pointLoad.initial,
  );

  const [
    loadPositionM,
    setLoadPositionM,
  ] = useState(
    definition.configuration
      .loadPosition.initial,
  );

  const [
    engagement,
    setEngagement,
  ] = useState(
    createInteractiveEngagement,
  );

  const [
    syncRevision,
    setSyncRevision,
  ] = useState(0);

  const [
    activeParameter,
    setActiveParameter,
  ] =
    useState<
      BeamInteractionParameter | null
    >(null);

  const numberFormatter =
    useMemo(
      () =>
        new Intl.NumberFormat(
          locale === "tr"
            ? "tr-TR"
            : "en-US",
          {
            maximumFractionDigits:
              2,

            minimumFractionDigits:
              0,
          },
        ),
      [locale],
    );

  const values =
    useMemo(
      () => {
        const stateResult =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value:
                  definition.configuration
                    .spanM,

                unit: "m",
              },

              pointLoad: {
                value:
                  pointLoadKN,

                unit: "kN",
              },

              loadPosition: {
                value:
                  loadPositionM,

                unit: "m",
              },
            },
          );

        if (
          !stateResult.state
        ) {
          return null;
        }

        const result =
          beamStaticsModel.evaluate(
            stateResult.state,
          );

        return result.values;
      },
      [
        definition.configuration
          .spanM,
        pointLoadKN,
        loadPositionM,
      ],
    );

  function markInteraction(
    parameter:
      BeamInteractionParameter,
  ): void {
    setEngagement(
      (
        current,
      ) =>
        recordMeaningfulInteraction(
          current,
        ),
    );

    setActiveParameter(
      parameter,
    );

    setSyncRevision(
      (
        current,
      ) =>
        current + 1,
    );
  }

  function updatePointLoad(
    value: number,
  ): void {
    if (
      value ===
      pointLoadKN
    ) {
      return;
    }

    setPointLoadKN(
      value,
    );

    markInteraction(
      "point_load",
    );
  }

  function updateLoadPosition(
    value: number,
  ): void {
    if (
      value ===
      loadPositionM
    ) {
      return;
    }

    setLoadPositionM(
      value,
    );

    markInteraction(
      "load_position",
    );
  }

  if (!values) {
    return (
      <div
        data-interactive-invalid="true"
        className="rounded-xl border border-danger/30 bg-danger/10 p-5"
      >
        <p className="text-sm font-medium text-danger">
          Interactive engineering state is invalid.
        </p>
      </div>
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

  const maximumMomentLocation =
    values.moment.maximum
      .location;

  if (
    maximumMomentLocation.type !==
    "point"
  ) {
    return (
      <div
        data-interactive-invalid="true"
        className="rounded-xl border border-danger/30 bg-danger/10 p-5"
      >
        <p className="text-sm font-medium text-danger">
          Interactive moment state does not have a unique maximum location.
        </p>
      </div>
    );
  }

  const sceneAriaLabel =
    locale === "tr"
      ? "Tek düşey noktasal yüklü basit mesnetli kiriş şeması"
      : "Simply supported beam with a single vertical point load";

  const synchronizationMessage =
    activeParameter ===
    "point_load"
      ? locale === "tr"
        ? "Yük büyüklüğü değişti. Kiriş tepkileri, V(x) ve M(x) aynı fiziksel duruma göre birlikte güncellendi."
        : "Load magnitude changed. Support reactions, V(x), and M(x) were updated together for the same physical state."
      : activeParameter ===
          "load_position"
        ? locale === "tr"
          ? "Yük konumu değişti. Yük noktası, mesnet tepkileri, kesme sıçraması ve maksimum moment konumu birlikte güncellendi."
          : "Load position changed. The load point, support reactions, shear discontinuity, and maximum-moment position were updated together."
        : locale === "tr"
          ? "Bir parametreyi değiştir. Kiriş, mesnet tepkileri, V(x) ve M(x) aynı fiziksel durumu birlikte gösterecek."
          : "Change a parameter. The beam, support reactions, V(x), and M(x) will represent the same physical state together.";

  return (
    <div
      data-interactive-kind={
        definition.kind
      }
      data-meaningful-interaction={
        engagement.hasMeaningfulInteraction
          ? "true"
          : "false"
      }
      data-interaction-count={
        engagement.interactionCount
      }
      data-sync-revision={
        syncRevision
      }
      data-active-parameter={
        activeParameter ??
        "none"
      }
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
          {
            definition.title[
              locale
            ]
          }
        </h3>

        <p className="mt-2 max-w-3xl leading-7 text-muted-strong">
          {
            definition.instructions[
              locale
            ]
          }
        </p>
      </div>

      <BeamStaticsScene
        spanM={
          definition.configuration
            .spanM
        }
        pointLoadKN={
          pointLoadKN
        }
        loadPositionM={
          loadPositionM
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
        syncRevision={
          syncRevision
        }
        activeParameter={
          activeParameter
        }
      />

      <div className="rounded-xl border border-border bg-background p-5">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <span className="text-sm text-muted">
            {
              definition.labels
                .fixedSpan[
                locale
              ]
            }
          </span>

          <strong className="font-mono text-sm text-foreground">
            {numberFormatter.format(
              definition.configuration
                .spanM,
            )}{" "}
            m
          </strong>
        </div>

        <div className="space-y-7">
          <label
            className={[
              "block rounded-lg transition-colors",
              activeParameter ===
              "point_load"
                ? "bg-brand-soft/60 p-3"
                : "",
            ].join(" ")}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="font-medium text-foreground">
                {
                  definition.configuration
                    .pointLoad.label[
                    locale
                  ]
                }
              </span>

              <strong
                data-testid="point-load-value"
                className="font-mono text-sm text-brand"
              >
                {numberFormatter.format(
                  pointLoadKN,
                )}{" "}
                {
                  definition.configuration
                    .pointLoad.unitSymbol
                }
              </strong>
            </div>

            <input
              aria-label={
                definition.configuration
                  .pointLoad.label[
                  locale
                ]
              }
              type="range"
              min={
                definition.configuration
                  .pointLoad.minimum
              }
              max={
                definition.configuration
                  .pointLoad.maximum
              }
              step={
                definition.configuration
                  .pointLoad.step
              }
              value={
                pointLoadKN
              }
              onChange={(
                event,
              ) =>
                updatePointLoad(
                  Number(
                    event.target
                      .value,
                  ),
                )
              }
              className="w-full accent-[var(--brand)]"
            />
          </label>

          <label
            className={[
              "block rounded-lg transition-colors",
              activeParameter ===
              "load_position"
                ? "bg-brand-soft/60 p-3"
                : "",
            ].join(" ")}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="font-medium text-foreground">
                {
                  definition.configuration
                    .loadPosition
                    .label[
                    locale
                  ]
                }
              </span>

              <strong
                data-testid="load-position-value"
                className="font-mono text-sm text-brand"
              >
                {numberFormatter.format(
                  loadPositionM,
                )}{" "}
                {
                  definition.configuration
                    .loadPosition
                    .unitSymbol
                }
              </strong>
            </div>

            <input
              aria-label={
                definition.configuration
                  .loadPosition.label[
                  locale
                ]
              }
              type="range"
              min={
                definition.configuration
                  .loadPosition.minimum
              }
              max={
                definition.configuration
                  .loadPosition.maximum
              }
              step={
                definition.configuration
                  .loadPosition.step
              }
              value={
                loadPositionM
              }
              onChange={(
                event,
              ) =>
                updateLoadPosition(
                  Number(
                    event.target
                      .value,
                  ),
                )
              }
              className="w-full accent-[var(--brand)]"
            />
          </label>
        </div>
      </div>

      <div
        role="status"
        data-testid="synchronized-feedback"
        className="rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm leading-6 text-muted-strong"
      >
        {
          synchronizationMessage
        }
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <p className="text-sm text-muted">
            {
              definition.labels
                .leftReaction[
                locale
              ]
            }
          </p>

          <p
            data-testid="left-reaction-value"
            className="mt-2 font-mono text-xl font-semibold text-foreground"
          >
            {numberFormatter.format(
              leftReactionKN,
            )}{" "}
            kN
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <p className="text-sm text-muted">
            {
              definition.labels
                .rightReaction[
                locale
              ]
            }
          </p>

          <p
            data-testid="right-reaction-value"
            className="mt-2 font-mono text-xl font-semibold text-foreground"
          >
            {numberFormatter.format(
              rightReactionKN,
            )}{" "}
            kN
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <p className="text-sm text-muted">
            {
              definition.labels
                .maximumMoment[
                locale
              ]
            }
          </p>

          <p
            data-testid="maximum-moment-value"
            className="mt-2 font-mono text-xl font-semibold text-foreground"
          >
            {numberFormatter.format(
              maximumMomentKNm,
            )}{" "}
            kN·m
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ShearForceDiagram
          spanM={
            definition.configuration
              .spanM
          }
          loadPositionM={
            loadPositionM
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
          syncRevision={
            syncRevision
          }
          activeParameter={
            activeParameter
          }
        />

        <BendingMomentDiagram
          spanM={
            definition.configuration
              .spanM
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
          syncRevision={
            syncRevision
          }
          activeParameter={
            activeParameter
          }
        />
      </div>
    </div>
  );
}