import type {
  SupportedLocale,
} from "@/domain/shared/types";

import {
  DEFLECTED_BEAM_BASELINE_Y,
  DEFLECTED_BEAM_LEFT_X,
  DEFLECTED_BEAM_RIGHT_X,
  DEFLECTED_BEAM_VIEWBOX_HEIGHT,
  DEFLECTED_BEAM_VIEWBOX_WIDTH,
  createDeflectedBeamGeometry,
  interpolateVisualYAtX,
  mapBeamXToVisualX,
} from "@/visualization/bending/deflected-beam-geometry";

import type {
  DeflectionCurvePoint,
} from "@/visualization/bending/deflected-beam-geometry";

interface DeflectedBeamDiagramProps {
  readonly spanM:
    number;

  readonly loadPositionM:
    number;

  readonly maximumMomentPositionM:
    number;

  readonly maximumDeflectionPositionM:
    number;

  readonly maximumAbsoluteDeflectionMm:
    number;

  readonly curvePoints:
    readonly DeflectionCurvePoint[];

  readonly locale:
    SupportedLocale;
}

export function DeflectedBeamDiagram({
  spanM,
  loadPositionM,
  maximumMomentPositionM,
  maximumDeflectionPositionM,
  maximumAbsoluteDeflectionMm,
  curvePoints,
  locale,
}: DeflectedBeamDiagramProps) {
  const geometry =
    createDeflectedBeamGeometry(
      spanM,
      curvePoints,
    );

  const formatter =
    new Intl.NumberFormat(
      locale === "tr"
        ? "tr-TR"
        : "en-US",
      {
        maximumFractionDigits:
          3,

        minimumFractionDigits:
          0,
      },
    );

  const loadX =
    mapBeamXToVisualX(
      loadPositionM,
      spanM,
    );

  const maximumMomentX =
    mapBeamXToVisualX(
      maximumMomentPositionM,
      spanM,
    );

  const maximumDeflectionX =
    mapBeamXToVisualX(
      maximumDeflectionPositionM,
      spanM,
    );

  const maximumDeflectionY =
    interpolateVisualYAtX(
      geometry.points,
      maximumDeflectionPositionM,
    );

  const title =
    locale === "tr"
      ? "Kirişin sehim eğrisi"
      : "Beam deflection curve";

  return (
    <figure
      data-testid="deflected-beam-diagram"
      data-load-position-ratio={
        loadPositionM /
        spanM
      }
      data-maximum-moment-position-ratio={
        maximumMomentPositionM /
        spanM
      }
      data-maximum-deflection-position-ratio={
        maximumDeflectionPositionM /
        spanM
      }
      className="overflow-hidden rounded-xl border border-border bg-background"
    >
      <div className="border-b border-border px-4 py-3 sm:px-5">
        <h4 className="font-semibold text-foreground">
          {title}
        </h4>

        <p className="mt-1 text-xs leading-5 text-muted">
          {locale === "tr"
            ? "Kesikli çizgi deformasyonsuz ekseni, sürekli eğri ise hesaplanan sehim biçimini gösterir."
            : "The dashed line shows the undeformed axis; the solid curve shows the calculated deflected shape."}
        </p>
      </div>

      <svg
        role="img"
        aria-label={
          title
        }
        viewBox={`0 0 ${DEFLECTED_BEAM_VIEWBOX_WIDTH} ${DEFLECTED_BEAM_VIEWBOX_HEIGHT}`}
        className="block h-auto w-full"
      >
        <title>
          {title}
        </title>

        {/* Undeformed beam */}
        <line
          x1={
            DEFLECTED_BEAM_LEFT_X
          }
          y1={
            DEFLECTED_BEAM_BASELINE_Y
          }
          x2={
            DEFLECTED_BEAM_RIGHT_X
          }
          y2={
            DEFLECTED_BEAM_BASELINE_Y
          }
          stroke="currentColor"
          className="text-muted"
          strokeWidth="2"
          strokeDasharray="8 7"
        />

        {/* Simple supports */}
        <path
          d={`M ${DEFLECTED_BEAM_LEFT_X} ${DEFLECTED_BEAM_BASELINE_Y + 5} L ${DEFLECTED_BEAM_LEFT_X - 15} ${DEFLECTED_BEAM_BASELINE_Y + 31} L ${DEFLECTED_BEAM_LEFT_X + 15} ${DEFLECTED_BEAM_BASELINE_Y + 31} Z`}
          fill="none"
          stroke="currentColor"
          className="text-muted-strong"
          strokeWidth="2"
        />

        <path
          d={`M ${DEFLECTED_BEAM_RIGHT_X} ${DEFLECTED_BEAM_BASELINE_Y + 5} L ${DEFLECTED_BEAM_RIGHT_X - 15} ${DEFLECTED_BEAM_BASELINE_Y + 31} L ${DEFLECTED_BEAM_RIGHT_X + 15} ${DEFLECTED_BEAM_BASELINE_Y + 31} Z`}
          fill="none"
          stroke="currentColor"
          className="text-muted-strong"
          strokeWidth="2"
        />

        {/* Load position */}
        <line
          x1={
            loadX
          }
          y1="35"
          x2={
            loadX
          }
          y2={
            DEFLECTED_BEAM_BASELINE_Y -
            10
          }
          stroke="currentColor"
          className="text-danger"
          strokeWidth="3"
        />

        <path
          d={`M ${loadX - 7} ${DEFLECTED_BEAM_BASELINE_Y - 18} L ${loadX} ${DEFLECTED_BEAM_BASELINE_Y - 7} L ${loadX + 7} ${DEFLECTED_BEAM_BASELINE_Y - 18} Z`}
          fill="currentColor"
          className="text-danger"
        />

        <text
          x={
            loadX
          }
          y="24"
          textAnchor="middle"
          fill="currentColor"
          className="text-danger"
          fontSize="14"
          fontWeight="600"
        >
          P
        </text>

        {/* Deflected curve */}
        <path
          d={
            geometry.path
          }
          fill="none"
          stroke="currentColor"
          className="text-brand"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-testid="deflected-beam-curve"
        />

        {/* Maximum moment position */}
        <circle
          cx={
            maximumMomentX
          }
          cy={
            DEFLECTED_BEAM_BASELINE_Y
          }
          r="5"
          fill="currentColor"
          className="text-warning"
          data-testid="maximum-moment-position-marker"
        />

        <text
          x={
            maximumMomentX
          }
          y={
            DEFLECTED_BEAM_BASELINE_Y -
            16
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-warning"
          fontSize="13"
          fontWeight="600"
          data-testid="maximum-moment-position-text"
        >
          xM ={" "}
          {formatter.format(
            maximumMomentPositionM,
          )}{" "}
          m
        </text>

        {/* Maximum deflection position */}
        <circle
          cx={
            maximumDeflectionX
          }
          cy={
            maximumDeflectionY
          }
          r="6"
          fill="currentColor"
          className="text-brand"
          data-testid="maximum-deflection-position-marker"
        />

        <text
          x={
            maximumDeflectionX
          }
          y={
            maximumDeflectionY +
            28
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-brand"
          fontSize="13"
          fontWeight="600"
          data-testid="maximum-deflection-position-text"
        >
          xδ ={" "}
          {formatter.format(
            maximumDeflectionPositionM,
          )}{" "}
          m
        </text>

        <text
          x={
            (
              DEFLECTED_BEAM_LEFT_X +
              DEFLECTED_BEAM_RIGHT_X
            ) /
            2
          }
          y="270"
          textAnchor="middle"
          fill="currentColor"
          className="text-muted-strong"
          fontSize="15"
          fontWeight="600"
          data-testid="maximum-deflection-value"
        >
          |δ|max ={" "}
          {formatter.format(
            maximumAbsoluteDeflectionMm,
          )}{" "}
          mm
        </text>
      </svg>

      <p className="border-t border-border px-4 py-2.5 text-xs leading-5 text-muted">
        {locale === "tr"
          ? "Sehim şekli görsel olarak büyütülmüş ve her durumda normalize edilmiştir. Nicel yorumda mm değeri esas alınmalıdır."
          : "The deflected shape is visually exaggerated and normalized for each state. Use the numerical mm value for quantitative interpretation."}
      </p>
    </figure>
  );
}