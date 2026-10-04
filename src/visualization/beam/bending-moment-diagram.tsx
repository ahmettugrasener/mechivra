import type {
  SupportedLocale,
} from "@/domain/shared/types";

import type {
  BeamInteractionParameter,
} from "@/visualization/beam/interaction-state";

import {
  MOMENT_DIAGRAM_HEIGHT,
  MOMENT_DIAGRAM_WIDTH,
  createMomentDiagramGeometry,
} from "@/visualization/beam/moment-diagram-geometry";

interface BendingMomentDiagramProps {
  readonly spanM:
    number;

  readonly maximumMomentPositionM:
    number;

  readonly maximumMomentKNm:
    number;

  readonly locale:
    SupportedLocale;

  readonly syncRevision?:
    number;

  readonly activeParameter?:
    BeamInteractionParameter | null;
}

export function BendingMomentDiagram({
  spanM,
  maximumMomentPositionM,
  maximumMomentKNm,
  locale,
  syncRevision = 0,
  activeParameter = null,
}: BendingMomentDiagramProps) {
  const geometry =
    createMomentDiagramGeometry(
      spanM,
      maximumMomentPositionM,
      maximumMomentKNm,
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
    xMaximum,
    zeroY,
    maximumMomentY,
    maximumPositionRatio,
  } = geometry;

  const diagramPath = [
    `M ${xLeft} ${zeroY}`,
    `L ${xMaximum} ${maximumMomentY}`,
    `L ${xRight} ${zeroY}`,
  ].join(" ");

  const areaPath = [
    `M ${xLeft} ${zeroY}`,
    `L ${xMaximum} ${maximumMomentY}`,
    `L ${xRight} ${zeroY}`,
    "Z",
  ].join(" ");

  const title =
    locale === "tr"
      ? "Eğilme momenti diyagramı M(x)"
      : "Bending-moment diagram M(x)";

  const description =
    locale === "tr"
      ? "Bu modelde moment mesnetlerde sıfırdır ve maksimum değer noktasal yükün altında oluşur."
      : "For this model, moment is zero at the supports and reaches its maximum beneath the point load.";

  const positionIsActive =
    activeParameter ===
    "load_position";

  return (
    <figure
      data-testid="bending-moment-diagram"
      data-moment-maximum-position-ratio={
        maximumPositionRatio
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
        viewBox={`0 0 ${MOMENT_DIAGRAM_WIDTH} ${MOMENT_DIAGRAM_HEIGHT}`}
        className="block h-auto w-full"
      >
        <title>
          {title}
        </title>

        {syncRevision >
        0 ? (
          <animate
            key={
              `moment-${syncRevision}`
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

        <path
          d={
            areaPath
          }
          fill="currentColor"
          className="text-brand"
          opacity={
            maximumMomentKNm ===
            0
              ? 0
              : 0.12
          }
        />

        <path
          d={
            diagramPath
          }
          fill="none"
          stroke="currentColor"
          className="text-brand"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          data-testid="moment-diagram-path"
        />

        <line
          x1={
            xMaximum
          }
          y1={
            maximumMomentY
          }
          x2={
            xMaximum
          }
          y2={
            zeroY
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

        {maximumMomentKNm >
        0 ? (
          <circle
            cx={
              xMaximum
            }
            cy={
              maximumMomentY
            }
            r={
              positionIsActive
                ? "7"
                : "6"
            }
            fill="currentColor"
            className="text-brand"
          />
        ) : null}

        <text
          x={
            xMaximum
          }
          y={
            maximumMomentY -
            16
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-foreground"
          fontSize="15"
          fontWeight="600"
          data-testid="maximum-moment-label"
        >
          Mmax ={" "}
          {numberFormatter.format(
            maximumMomentKNm,
          )}{" "}
          kN·m
        </text>

        <text
          x={
            xMaximum
          }
          y={
            zeroY + 35
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
          data-testid="maximum-moment-position-label"
        >
          x ={" "}
          {numberFormatter.format(
            maximumMomentPositionM,
          )}{" "}
          m
        </text>

        <text
          x={
            xLeft
          }
          y={
            zeroY - 12
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-muted"
          fontSize="13"
        >
          0
        </text>

        <text
          x={
            xRight
          }
          y={
            zeroY - 12
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-muted"
          fontSize="13"
        >
          0
        </text>

        <text
          x={
            xLeft
          }
          y={
            MOMENT_DIAGRAM_HEIGHT -
            18
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
            MOMENT_DIAGRAM_HEIGHT -
            18
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

      <p className="border-t border-border px-4 py-2.5 text-xs leading-5 text-muted">
        {locale === "tr"
          ? "Diyagramın dikey yüksekliği görsel olarak normalize edilmiştir; nicel yorumda kN·m değeri esas alınmalıdır."
          : "The vertical diagram height is visually normalized; use the numerical kN·m value for quantitative interpretation."}
      </p>
    </figure>
  );
}