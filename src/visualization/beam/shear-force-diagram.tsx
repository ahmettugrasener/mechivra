import type {
  SupportedLocale,
} from "@/domain/shared/types";

import type {
  BeamInteractionParameter,
} from "@/visualization/beam/interaction-state";

import {
  SHEAR_DIAGRAM_HEIGHT,
  SHEAR_DIAGRAM_WIDTH,
  createShearDiagramGeometry,
} from "@/visualization/beam/shear-diagram-geometry";

interface ShearForceDiagramProps {
  readonly spanM:
    number;

  readonly loadPositionM:
    number;

  readonly leftShearKN:
    number;

  readonly rightShearKN:
    number;

  readonly locale:
    SupportedLocale;

  readonly syncRevision?:
    number;

  readonly activeParameter?:
    BeamInteractionParameter | null;
}

function formatSignedNumber(
  value: number,
  formatter: Intl.NumberFormat,
): string {
  if (
    Object.is(
      value,
      -0,
    ) ||
    value === 0
  ) {
    return "0";
  }

  const formatted =
    formatter.format(
      Math.abs(
        value,
      ),
    );

  return value > 0
    ? `+${formatted}`
    : `−${formatted}`;
}

export function ShearForceDiagram({
  spanM,
  loadPositionM,
  leftShearKN,
  rightShearKN,
  locale,
  syncRevision = 0,
  activeParameter = null,
}: ShearForceDiagramProps) {
  const geometry =
    createShearDiagramGeometry(
      spanM,
      loadPositionM,
      leftShearKN,
      rightShearKN,
    );

  const numberFormatter =
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
    );

  const {
    xLeft,
    xRight,
    xLoad,
    zeroY,
    leftShearY,
    rightShearY,
    loadPositionRatio,
  } = geometry;

  const leftAreaPath = [
    `M ${xLeft} ${zeroY}`,
    `L ${xLeft} ${leftShearY}`,
    `L ${xLoad} ${leftShearY}`,
    `L ${xLoad} ${zeroY}`,
    "Z",
  ].join(" ");

  const rightAreaPath = [
    `M ${xLoad} ${zeroY}`,
    `L ${xLoad} ${rightShearY}`,
    `L ${xRight} ${rightShearY}`,
    `L ${xRight} ${zeroY}`,
    "Z",
  ].join(" ");

  const shearPath = [
    `M ${xLeft} ${zeroY}`,
    `L ${xLeft} ${leftShearY}`,
    `L ${xLoad} ${leftShearY}`,
    `L ${xLoad} ${rightShearY}`,
    `L ${xRight} ${rightShearY}`,
    `L ${xRight} ${zeroY}`,
  ].join(" ");

  const title =
    locale === "tr"
      ? "Kesme kuvveti diyagramı V(x)"
      : "Shear-force diagram V(x)";

  const description =
    locale === "tr"
      ? "Pozitif değerler sıfır ekseninin üzerinde, negatif değerler altında gösterilir."
      : "Positive values are shown above the zero axis and negative values below it.";

  const positionIsActive =
    activeParameter ===
    "load_position";

  return (
    <figure
      data-testid="shear-force-diagram"
      data-shear-load-position-ratio={
        loadPositionRatio
      }
      data-sync-revision={
        syncRevision
      }
      data-active-parameter={
        activeParameter ??
        "none"
      }
      className="overflow-hidden rounded-xl border border-border bg-background"
    >
      <div className="border-b border-border px-4 py-3 sm:px-5">
        <h4 className="font-semibold text-foreground">
          {title}
        </h4>

        <p className="mt-1 text-xs leading-5 text-muted">
          {description}
        </p>
      </div>

      <svg
        role="img"
        aria-label={
          title
        }
        viewBox={`0 0 ${SHEAR_DIAGRAM_WIDTH} ${SHEAR_DIAGRAM_HEIGHT}`}
        className="block h-auto w-full"
      >
        <title>
          {title}
        </title>

        {syncRevision >
        0 ? (
          <animate
            key={
              `shear-${syncRevision}`
            }
            attributeName="opacity"
            values="0.72;1"
            dur="0.18s"
            fill="freeze"
          />
        ) : null}

        <line
          x1={
            xLeft - 22
          }
          y1={
            zeroY
          }
          x2={
            xRight + 22
          }
          y2={
            zeroY
          }
          stroke="currentColor"
          className="text-border-strong"
          strokeWidth="2"
        />

        <text
          x={
            xLeft - 30
          }
          y={
            zeroY + 5
          }
          textAnchor="end"
          fill="currentColor"
          className="text-muted"
          fontSize="13"
        >
          0
        </text>

        <line
          x1={
            xLoad
          }
          y1="28"
          x2={
            xLoad
          }
          y2={
            SHEAR_DIAGRAM_HEIGHT -
            38
          }
          stroke="currentColor"
          className={
            positionIsActive
              ? "text-brand"
              : "text-border-strong"
          }
          strokeWidth={
            positionIsActive
              ? 2.5
              : 1.5
          }
          strokeDasharray="5 5"
        />

        <text
          x={
            xLoad
          }
          y={
            SHEAR_DIAGRAM_HEIGHT -
            17
          }
          textAnchor="middle"
          fill="currentColor"
          className={
            positionIsActive
              ? "text-brand"
              : "text-muted"
          }
          fontSize={
            positionIsActive
              ? "14"
              : "13"
          }
          fontWeight={
            positionIsActive
              ? "600"
              : "400"
          }
        >
          x ={" "}
          {numberFormatter.format(
            loadPositionM,
          )}{" "}
          m
        </text>

        <path
          d={
            leftAreaPath
          }
          fill="currentColor"
          className="text-brand"
          opacity="0.12"
        />

        <path
          d={
            rightAreaPath
          }
          fill="currentColor"
          className="text-brand"
          opacity="0.12"
        />

        <path
          d={
            shearPath
          }
          fill="none"
          stroke="currentColor"
          className="text-brand"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          data-testid="shear-diagram-path"
        />

        <text
          x={
            (
              xLeft +
              xLoad
            ) / 2
          }
          y={
            leftShearY <
            zeroY
              ? leftShearY -
                13
              : leftShearY +
                24
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-foreground"
          fontSize="15"
          fontWeight="600"
          data-testid="left-shear-label"
        >
          V ={" "}
          {formatSignedNumber(
            leftShearKN,
            numberFormatter,
          )}{" "}
          kN
        </text>

        <text
          x={
            (
              xLoad +
              xRight
            ) / 2
          }
          y={
            rightShearY <
            zeroY
              ? rightShearY -
                13
              : rightShearY +
                24
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-foreground"
          fontSize="15"
          fontWeight="600"
          data-testid="right-shear-label"
        >
          V ={" "}
          {formatSignedNumber(
            rightShearKN,
            numberFormatter,
          )}{" "}
          kN
        </text>

        <text
          x={
            xLeft
          }
          y={
            SHEAR_DIAGRAM_HEIGHT -
            17
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-muted-strong"
          fontSize="14"
          fontWeight="600"
        >
          A
        </text>

        <text
          x={
            xRight
          }
          y={
            SHEAR_DIAGRAM_HEIGHT -
            17
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-muted-strong"
          fontSize="14"
          fontWeight="600"
        >
          B
        </text>
      </svg>
    </figure>
  );
}