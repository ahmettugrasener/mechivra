import type {
  SupportedLocale,
} from "@/domain/shared/types";

import {
  createBeamSceneGeometry,
  BEAM_SCENE_VIEWBOX_HEIGHT,
  BEAM_SCENE_VIEWBOX_WIDTH,
} from "@/visualization/beam/geometry";

import type {
  BeamInteractionParameter,
} from "@/visualization/beam/interaction-state";

import {
  createReactionArrowVisual,
} from "@/visualization/beam/reaction-visual";

interface BeamStaticsSceneProps {
  readonly spanM:
    number;

  readonly pointLoadKN:
    number;

  readonly loadPositionM:
    number;

  readonly leftReactionKN:
    number;

  readonly rightReactionKN:
    number;

  readonly locale:
    SupportedLocale;

  readonly ariaLabel:
    string;

  readonly syncRevision?:
    number;

  readonly activeParameter?:
    BeamInteractionParameter | null;
}

export function BeamStaticsScene({
  spanM,
  pointLoadKN,
  loadPositionM,
  leftReactionKN,
  rightReactionKN,
  locale,
  ariaLabel,
  syncRevision = 0,
  activeParameter = null,
}: BeamStaticsSceneProps) {
  const geometry =
    createBeamSceneGeometry(
      spanM,
      loadPositionM,
    );

  const leftReactionVisual =
    createReactionArrowVisual(
      leftReactionKN,
      pointLoadKN,
    );

  const rightReactionVisual =
    createReactionArrowVisual(
      rightReactionKN,
      pointLoadKN,
    );

  const numberFormatter =
    new Intl.NumberFormat(
      locale === "tr"
        ? "tr-TR"
        : "en-US",
      {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      },
    );

  const {
    beamLeftX,
    beamRightX,
    beamY,
    loadX,
    loadPositionRatio,
  } = geometry;

  const supportTopY =
    beamY + 9;

  const supportBottomY =
    beamY + 47;

  const loadArrowStartY =
    30;

  const loadArrowEndY =
    beamY - 8;

  const reactionArrowEndY =
    beamY - 9;

  const leftReactionArrowStartY =
    reactionArrowEndY +
    leftReactionVisual.arrowLength;

  const rightReactionArrowStartY =
    reactionArrowEndY +
    rightReactionVisual.arrowLength;

  const reactionLabelOffset =
    16;

  const partialDimensionY =
    220;

  const spanDimensionY =
    272;

  const loadIsActive =
    activeParameter ===
    "point_load";

  const positionIsActive =
    activeParameter ===
    "load_position";

  return (
    <div
      data-sync-revision={
        syncRevision
      }
      data-active-parameter={
        activeParameter ??
        "none"
      }
      className="overflow-hidden rounded-xl border border-border bg-background"
    >
      <svg
        role="img"
        aria-label={
          ariaLabel
        }
        viewBox={`0 0 ${BEAM_SCENE_VIEWBOX_WIDTH} ${BEAM_SCENE_VIEWBOX_HEIGHT}`}
        className="block h-auto w-full"
        data-testid="beam-statics-scene"
        data-load-position-ratio={
          loadPositionRatio
        }
      >
        <title>
          {ariaLabel}
        </title>

        {syncRevision >
        0 ? (
          <animate
            key={
              `scene-${syncRevision}`
            }
            attributeName="opacity"
            values="0.78;1"
            dur="0.18s"
            fill="freeze"
          />
        ) : null}

        <defs>
          <marker
            id="beam-load-arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              fill="currentColor"
            />
          </marker>

          <marker
            id="beam-dimension-arrow-start"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path
              d="M 8 0 L 0 4 L 8 8 z"
              fill="currentColor"
            />
          </marker>

          <marker
            id="beam-dimension-arrow-end"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M 0 0 L 8 4 L 0 8 z"
              fill="currentColor"
            />
          </marker>
        </defs>

        {/* Point load */}
        <g
          className="text-danger"
          data-testid="beam-load"
          data-load-x={
            loadX
          }
          data-active={
            loadIsActive ||
            positionIsActive
              ? "true"
              : "false"
          }
        >
          <line
            x1={
              loadX
            }
            y1={
              loadArrowStartY
            }
            x2={
              loadX
            }
            y2={
              loadArrowEndY
            }
            stroke="currentColor"
            strokeWidth={
              loadIsActive ||
              positionIsActive
                ? 5
                : 4
            }
            markerEnd="url(#beam-load-arrowhead)"
          />

          <text
            x={
              loadX
            }
            y="20"
            textAnchor="middle"
            fill="currentColor"
            fontSize={
              loadIsActive
                ? "19"
                : "18"
            }
            fontWeight="600"
          >
            P ={" "}
            {numberFormatter.format(
              pointLoadKN,
            )}{" "}
            kN
          </text>
        </g>

        {/* Beam */}
        <g className="text-foreground">
          <line
            x1={
              beamLeftX
            }
            y1={
              beamY
            }
            x2={
              beamRightX
            }
            y2={
              beamY
            }
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
          />

          <circle
            cx={
              loadX
            }
            cy={
              beamY
            }
            r={
              positionIsActive
                ? "8"
                : "7"
            }
            fill="currentColor"
          />
        </g>

        {/* Left reaction */}
        <g
          className="text-success"
          data-testid="left-reaction-arrow"
          data-reaction-ratio={
            leftReactionVisual.magnitudeRatio
          }
        >
          {leftReactionVisual.arrowLength >
          0 ? (
            <line
              x1={
                beamLeftX
              }
              y1={
                leftReactionArrowStartY
              }
              x2={
                beamLeftX
              }
              y2={
                reactionArrowEndY
              }
              stroke="currentColor"
              strokeWidth="4"
            />
          ) : null}

          <text
            x={
              beamLeftX -
              reactionLabelOffset
            }
            y={
              leftReactionArrowStartY -
              7
            }
            textAnchor="end"
            fill="currentColor"
            fontSize="16"
            fontWeight="600"
          >
            R_A ={" "}
            {numberFormatter.format(
              leftReactionKN,
            )}{" "}
            kN
          </text>
        </g>

        {/* Right reaction */}
        <g
          className="text-success"
          data-testid="right-reaction-arrow"
          data-reaction-ratio={
            rightReactionVisual.magnitudeRatio
          }
        >
          {rightReactionVisual.arrowLength >
          0 ? (
            <line
              x1={
                beamRightX
              }
              y1={
                rightReactionArrowStartY
              }
              x2={
                beamRightX
              }
              y2={
                reactionArrowEndY
              }
              stroke="currentColor"
              strokeWidth="4"
            />
          ) : null}

          <text
            x={
              beamRightX +
              reactionLabelOffset
            }
            y={
              rightReactionArrowStartY -
              7
            }
            textAnchor="start"
            fill="currentColor"
            fontSize="16"
            fontWeight="600"
          >
            R_B ={" "}
            {numberFormatter.format(
              rightReactionKN,
            )}{" "}
            kN
          </text>
        </g>

        {/* Left pin support */}
        <g
          className="text-muted-strong"
          data-testid="left-pin-support"
        >
          <path
            d={`
              M ${beamLeftX} ${supportTopY}
              L ${beamLeftX - 27} ${supportBottomY}
              L ${beamLeftX + 27} ${supportBottomY}
              Z
            `}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <line
            x1={
              beamLeftX - 38
            }
            y1={
              supportBottomY + 5
            }
            x2={
              beamLeftX + 38
            }
            y2={
              supportBottomY + 5
            }
            stroke="currentColor"
            strokeWidth="3"
          />

          <text
            x={
              beamLeftX
            }
            y={
              supportBottomY +
              30
            }
            textAnchor="middle"
            fill="currentColor"
            fontSize="17"
            fontWeight="600"
          >
            A
          </text>
        </g>

        {/* Right roller support */}
        <g
          className="text-muted-strong"
          data-testid="right-roller-support"
        >
          <path
            d={`
              M ${beamRightX} ${supportTopY}
              L ${beamRightX - 27} ${supportBottomY - 7}
              L ${beamRightX + 27} ${supportBottomY - 7}
              Z
            `}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <circle
            cx={
              beamRightX - 14
            }
            cy={
              supportBottomY + 2
            }
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />

          <circle
            cx={
              beamRightX + 14
            }
            cy={
              supportBottomY + 2
            }
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />

          <line
            x1={
              beamRightX - 38
            }
            y1={
              supportBottomY + 11
            }
            x2={
              beamRightX + 38
            }
            y2={
              supportBottomY + 11
            }
            stroke="currentColor"
            strokeWidth="3"
          />

          <text
            x={
              beamRightX
            }
            y={
              supportBottomY +
              36
            }
            textAnchor="middle"
            fill="currentColor"
            fontSize="17"
            fontWeight="600"
          >
            B
          </text>
        </g>

        {/* Load-position dimension a */}
        <g
          className={
            positionIsActive
              ? "text-brand"
              : "text-brand"
          }
          data-active={
            positionIsActive
              ? "true"
              : "false"
          }
        >
          <line
            x1={
              beamLeftX
            }
            y1={
              partialDimensionY
            }
            x2={
              loadX
            }
            y2={
              partialDimensionY
            }
            stroke="currentColor"
            strokeWidth={
              positionIsActive
                ? 3
                : 2
            }
            markerStart="url(#beam-dimension-arrow-start)"
            markerEnd="url(#beam-dimension-arrow-end)"
          />

          <line
            x1={
              beamLeftX
            }
            y1={
              supportBottomY +
              15
            }
            x2={
              beamLeftX
            }
            y2={
              partialDimensionY +
              8
            }
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          <line
            x1={
              loadX
            }
            y1={
              beamY +
              12
            }
            x2={
              loadX
            }
            y2={
              partialDimensionY +
              8
            }
            stroke="currentColor"
            strokeWidth={
              positionIsActive
                ? 2
                : 1
            }
            strokeDasharray="4 4"
          />

          <text
            x={
              (
                beamLeftX +
                loadX
              ) / 2
            }
            y={
              partialDimensionY -
              10
            }
            textAnchor="middle"
            fill="currentColor"
            fontSize={
              positionIsActive
                ? "17"
                : "16"
            }
            fontWeight="600"
          >
            a ={" "}
            {numberFormatter.format(
              loadPositionM,
            )}{" "}
            m
          </text>
        </g>

        {/* Full-span dimension L */}
        <g className="text-muted">
          <line
            x1={
              beamLeftX
            }
            y1={
              spanDimensionY
            }
            x2={
              beamRightX
            }
            y2={
              spanDimensionY
            }
            stroke="currentColor"
            strokeWidth="2"
            markerStart="url(#beam-dimension-arrow-start)"
            markerEnd="url(#beam-dimension-arrow-end)"
          />

          <line
            x1={
              beamLeftX
            }
            y1={
              partialDimensionY +
              18
            }
            x2={
              beamLeftX
            }
            y2={
              spanDimensionY +
              7
            }
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          <line
            x1={
              beamRightX
            }
            y1={
              supportBottomY +
              18
            }
            x2={
              beamRightX
            }
            y2={
              spanDimensionY +
              7
            }
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          <text
            x={
              (
                beamLeftX +
                beamRightX
              ) / 2
            }
            y={
              spanDimensionY -
              10
            }
            textAnchor="middle"
            fill="currentColor"
            fontSize="16"
            fontWeight="600"
          >
            L ={" "}
            {numberFormatter.format(
              spanM,
            )}{" "}
            m
          </text>
        </g>
      </svg>

      <p className="border-t border-border px-4 py-2.5 text-xs leading-5 text-muted">
        {locale === "tr"
          ? "Reaksiyon çizgilerinin uzunluğu göreli büyüklüğü gösterir; sayısal kN değerleri esas alınmalıdır."
          : "Reaction-line lengths indicate relative magnitude; use the numerical kN values for quantitative interpretation."}
      </p>
    </div>
  );
}