import type {
  IdealOttoPvProcessCurve,
} from "@/domain/engineering/thermodynamics/otto";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import {
  OTTO_PV_PLOT_BOTTOM,
  OTTO_PV_PLOT_LEFT,
  OTTO_PV_PLOT_RIGHT,
  OTTO_PV_PLOT_TOP,
  OTTO_PV_VIEWBOX_HEIGHT,
  OTTO_PV_VIEWBOX_WIDTH,
  createIdealOttoPvDiagramGeometry,
} from "@/visualization/thermodynamics/otto/pv-diagram-geometry";

interface IdealOttoPvDiagramProps {
  readonly curves:
    readonly IdealOttoPvProcessCurve[];

  readonly locale:
    SupportedLocale;
}

const processClasses = {
  "process-1-2":
    "text-brand",

  "process-2-3":
    "text-danger",

  "process-3-4":
    "text-success",

  "process-4-1":
    "text-warning",
} as const;

export function IdealOttoPvDiagram({
  curves,
  locale,
}: IdealOttoPvDiagramProps) {
  const geometry =
    createIdealOttoPvDiagramGeometry(
      curves,
    );

  const numberFormatter =
    new Intl.NumberFormat(
      locale === "tr"
        ? "tr-TR"
        : "en-US",
      {
        maximumFractionDigits:
          3,
      },
    );

  const stateEntries = [
    [
      "1",
      geometry.states
        .state1,
    ],

    [
      "2",
      geometry.states
        .state2,
    ],

    [
      "3",
      geometry.states
        .state3,
    ],

    [
      "4",
      geometry.states
        .state4,
    ],
  ] as const;

  const pressureTickRatios = [
    0,
    0.25,
    0.5,
    0.75,
    1,
  ];

  const volumeTickRatios =
    pressureTickRatios;

  return (
    <figure
      data-testid="ideal-otto-pv-diagram"
      className="overflow-hidden rounded-xl border border-border bg-background"
    >
      <svg
        role="img"
        aria-label={
          locale === "tr"
            ? "İdeal Otto çevrimi p–v diyagramı"
            : "Ideal Otto cycle p–v diagram"
        }
        viewBox={`0 0 ${OTTO_PV_VIEWBOX_WIDTH} ${OTTO_PV_VIEWBOX_HEIGHT}`}
        className="block h-auto w-full"
      >
        <title>
          {locale === "tr"
            ? "İdeal Otto çevrimi p–v diyagramı"
            : "Ideal Otto cycle p–v diagram"}
        </title>

        <defs>
          <marker
            id="otto-pv-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path
              d="M 0 0 L 8 4 L 0 8 z"
              fill="currentColor"
            />
          </marker>
        </defs>

        <g className="text-border-strong">
          <line
            x1={
              OTTO_PV_PLOT_LEFT
            }
            y1={
              OTTO_PV_PLOT_BOTTOM
            }
            x2={
              OTTO_PV_PLOT_RIGHT
            }
            y2={
              OTTO_PV_PLOT_BOTTOM
            }
            stroke="currentColor"
            strokeWidth="2"
          />

          <line
            x1={
              OTTO_PV_PLOT_LEFT
            }
            y1={
              OTTO_PV_PLOT_BOTTOM
            }
            x2={
              OTTO_PV_PLOT_LEFT
            }
            y2={
              OTTO_PV_PLOT_TOP
            }
            stroke="currentColor"
            strokeWidth="2"
          />
        </g>

        {volumeTickRatios.map(
          (ratio) => {
            const x =
              OTTO_PV_PLOT_LEFT +
              (
                OTTO_PV_PLOT_RIGHT -
                OTTO_PV_PLOT_LEFT
              ) *
                ratio;

            const value =
              geometry
                .maximumSpecificVolumeM3PerKg *
              ratio;

            return (
              <g
                key={`v-${ratio}`}
                className="text-muted"
              >
                <line
                  x1={x}
                  y1={
                    OTTO_PV_PLOT_BOTTOM
                  }
                  x2={x}
                  y2={
                    OTTO_PV_PLOT_BOTTOM +
                    7
                  }
                  stroke="currentColor"
                />

                <text
                  x={x}
                  y={
                    OTTO_PV_PLOT_BOTTOM +
                    27
                  }
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="12"
                >
                  {numberFormatter.format(
                    value,
                  )}
                </text>
              </g>
            );
          },
        )}

        {pressureTickRatios.map(
          (ratio) => {
            const y =
              OTTO_PV_PLOT_BOTTOM -
              (
                OTTO_PV_PLOT_BOTTOM -
                OTTO_PV_PLOT_TOP
              ) *
                ratio;

            const pressureKPa =
              (
                geometry
                  .maximumPressurePa *
                ratio
              ) /
              1000;

            return (
              <g
                key={`p-${ratio}`}
                className="text-muted"
              >
                <line
                  x1={
                    OTTO_PV_PLOT_LEFT -
                    7
                  }
                  y1={y}
                  x2={
                    OTTO_PV_PLOT_LEFT
                  }
                  y2={y}
                  stroke="currentColor"
                />

                <text
                  x={
                    OTTO_PV_PLOT_LEFT -
                    12
                  }
                  y={
                    y +
                    4
                  }
                  textAnchor="end"
                  fill="currentColor"
                  fontSize="12"
                >
                  {numberFormatter.format(
                    pressureKPa,
                  )}
                </text>
              </g>
            );
          },
        )}

        {geometry.curves.map(
          (curve) => (
            <polyline
              key={
                curve.processId
              }
              data-process-id={
                curve.processId
              }
              points={
                curve.svgPoints
              }
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
              markerEnd="url(#otto-pv-arrow)"
              className={
                processClasses[
                  curve.processId
                ]
              }
            />
          ),
        )}

        {stateEntries.map(
          (
            [
              stateId,
              point,
            ],
          ) => (
            <g
              key={
                stateId
              }
              data-state-id={
                stateId
              }
              className="text-foreground"
            >
              <circle
                cx={
                  point.x
                }
                cy={
                  point.y
                }
                r="7"
                fill="currentColor"
              />

              <circle
                cx={
                  point.x
                }
                cy={
                  point.y
                }
                r="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              <text
                x={
                  point.x +
                  15
                }
                y={
                  point.y -
                  12
                }
                fill="currentColor"
                fontSize="18"
                fontWeight="700"
              >
                {stateId}
              </text>
            </g>
          ),
        )}

        <text
          x={
            (
              OTTO_PV_PLOT_LEFT +
              OTTO_PV_PLOT_RIGHT
            ) /
            2
          }
          y="470"
          textAnchor="middle"
          fill="currentColor"
          fontSize="16"
          fontWeight="600"
          className="text-foreground"
        >
          {locale === "tr"
            ? "Özgül hacim, v (m³/kg)"
            : "Specific volume, v (m³/kg)"}
        </text>

        <text
          x="25"
          y={
            (
              OTTO_PV_PLOT_TOP +
              OTTO_PV_PLOT_BOTTOM
            ) /
            2
          }
          transform={`rotate(-90 25 ${
            (
              OTTO_PV_PLOT_TOP +
              OTTO_PV_PLOT_BOTTOM
            ) /
            2
          })`}
          textAnchor="middle"
          fill="currentColor"
          fontSize="16"
          fontWeight="600"
          className="text-foreground"
        >
          {locale === "tr"
            ? "Basınç, p (kPa)"
            : "Pressure, p (kPa)"}
        </text>
      </svg>

      <figcaption className="border-t border-border px-4 py-3 text-xs leading-5 text-muted">
        {locale === "tr"
          ? "Eksenlerde özgül hacim kullanıldığı için bu bir p–v diyagramıdır. Eksen ölçekleri mevcut çevrime göre düzenlenmiştir; nicel yorumda eksen ve durum değerleri esas alınmalıdır."
          : "Because the horizontal axis uses specific volume, this is a p–v diagram. The axes are scaled to the current cycle; quantitative interpretation should use the axis and state values."}
      </figcaption>
    </figure>
  );
}