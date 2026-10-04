import type {
  SupportedLocale,
} from "@/domain/shared/types";

import {
  STRESS_SECTION_VIEWBOX_HEIGHT,
  STRESS_SECTION_VIEWBOX_WIDTH,
  createStressSectionGeometry,
} from "@/visualization/bending/stress-section-geometry";

import type {
  StressSign,
} from "@/visualization/bending/stress-section-geometry";

interface RectangularStressSectionDiagramProps {
  readonly widthM:
    number;

  readonly heightM:
    number;

  readonly topStressMPa:
    number;

  readonly bottomStressMPa:
    number;

  readonly locale:
    SupportedLocale;
}

function getStressSignLabel(
  sign:
    StressSign,

  locale:
    SupportedLocale,
): string {
  switch (
    sign
  ) {
    case "compression":
      return locale ===
        "tr"
        ? "Basma"
        : "Compression";

    case "tension":
      return locale ===
        "tr"
        ? "Çekme"
        : "Tension";

    case "neutral":
      return locale ===
        "tr"
        ? "Sıfır gerilme"
        : "Zero stress";
  }
}

function formatSignedStress(
  stress:
    number,

  formatter:
    Intl.NumberFormat,
): string {
  if (
    stress === 0 ||
    Object.is(
      stress,
      -0,
    )
  ) {
    return "0";
  }

  const magnitude =
    formatter.format(
      Math.abs(
        stress,
      ),
    );

  return stress > 0
    ? `+${magnitude}`
    : `−${magnitude}`;
}

export function RectangularStressSectionDiagram({
  widthM,
  heightM,
  topStressMPa,
  bottomStressMPa,
  locale,
}: RectangularStressSectionDiagramProps) {
  const geometry =
    createStressSectionGeometry(
      widthM,
      heightM,
      topStressMPa,
      bottomStressMPa,
    );

  const formatter =
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
    sectionLeftX,
    sectionRightX,
    sectionTopY,
    sectionBottomY,
    neutralAxisY,
    stressAxisX,
    topStressX,
    bottomStressX,
    topStressSign,
    bottomStressSign,
  } = geometry;

  const widthMm =
    widthM *
    1000;

  const heightMm =
    heightM *
    1000;

  const title =
    locale === "tr"
      ? "Dikdörtgen kesitte eğilme gerilmesi dağılımı"
      : "Bending-stress distribution in a rectangular section";

  const neutralAxisLabel =
    locale === "tr"
      ? "Nötr eksen"
      : "Neutral axis";

  const topAreaPath = [
    `M ${stressAxisX} ${sectionTopY}`,
    `L ${topStressX} ${sectionTopY}`,
    `L ${stressAxisX} ${neutralAxisY}`,
    "Z",
  ].join(
    " ",
  );

  const bottomAreaPath = [
    `M ${stressAxisX} ${neutralAxisY}`,
    `L ${bottomStressX} ${sectionBottomY}`,
    `L ${stressAxisX} ${sectionBottomY}`,
    "Z",
  ].join(
    " ",
  );

  const distributionPath = [
    `M ${topStressX} ${sectionTopY}`,
    `L ${stressAxisX} ${neutralAxisY}`,
    `L ${bottomStressX} ${sectionBottomY}`,
  ].join(
    " ",
  );

  return (
    <figure
      data-testid="rectangular-stress-section-diagram"
      data-top-stress-sign={
        topStressSign
      }
      data-bottom-stress-sign={
        bottomStressSign
      }
      className="overflow-hidden rounded-xl border border-border bg-background"
    >
      <div className="border-b border-border px-4 py-3 sm:px-5">
        <h4 className="font-semibold text-foreground">
          {title}
        </h4>

        <p className="mt-1 text-xs leading-5 text-muted">
          {locale === "tr"
            ? "Kesit geometrisi ile doğrusal σ(y) dağılımı aynı fiziksel durum için gösterilir."
            : "Section geometry and the linear σ(y) distribution are shown for the same physical state."}
        </p>
      </div>

      <svg
        role="img"
        aria-label={
          title
        }
        viewBox={`0 0 ${STRESS_SECTION_VIEWBOX_WIDTH} ${STRESS_SECTION_VIEWBOX_HEIGHT}`}
        className="block h-auto w-full"
      >
        <title>
          {title}
        </title>

        {/* Section */}
        <rect
          x={
            sectionLeftX
          }
          y={
            sectionTopY
          }
          width={
            sectionRightX -
            sectionLeftX
          }
          height={
            sectionBottomY -
            sectionTopY
          }
          fill="currentColor"
          className="text-brand"
          opacity="0.08"
        />

        <rect
          x={
            sectionLeftX
          }
          y={
            sectionTopY
          }
          width={
            sectionRightX -
            sectionLeftX
          }
          height={
            sectionBottomY -
            sectionTopY
          }
          fill="none"
          stroke="currentColor"
          className="text-foreground"
          strokeWidth="3"
        />

        {/* Neutral axis */}
        <line
          x1={
            sectionLeftX -
            35
          }
          y1={
            neutralAxisY
          }
          x2={
            stressAxisX +
            25
          }
          y2={
            neutralAxisY
          }
          stroke="currentColor"
          className="text-brand"
          strokeWidth="2"
          strokeDasharray="7 6"
          data-testid="neutral-axis"
        />

        <text
          x={
            sectionLeftX -
            42
          }
          y={
            neutralAxisY +
            5
          }
          textAnchor="end"
          fill="currentColor"
          className="text-brand"
          fontSize="14"
          fontWeight="600"
        >
          {neutralAxisLabel}
        </text>

        <text
          x={
            (
              sectionLeftX +
              sectionRightX
            ) /
            2
          }
          y={
            neutralAxisY -
            10
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-muted-strong"
          fontSize="13"
        >
          σ = 0
        </text>

        {/* Width dimension */}
        <line
          x1={
            sectionLeftX
          }
          y1={
            sectionBottomY +
            38
          }
          x2={
            sectionRightX
          }
          y2={
            sectionBottomY +
            38
          }
          stroke="currentColor"
          className="text-muted"
          strokeWidth="2"
        />

        <line
          x1={
            sectionLeftX
          }
          y1={
            sectionBottomY +
            28
          }
          x2={
            sectionLeftX
          }
          y2={
            sectionBottomY +
            48
          }
          stroke="currentColor"
          className="text-muted"
          strokeWidth="2"
        />

        <line
          x1={
            sectionRightX
          }
          y1={
            sectionBottomY +
            28
          }
          x2={
            sectionRightX
          }
          y2={
            sectionBottomY +
            48
          }
          stroke="currentColor"
          className="text-muted"
          strokeWidth="2"
        />

        <text
          x={
            (
              sectionLeftX +
              sectionRightX
            ) /
            2
          }
          y={
            sectionBottomY +
            68
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-muted-strong"
          fontSize="15"
          fontWeight="600"
          data-testid="section-width-label"
        >
          b ={" "}
          {formatter.format(
            widthMm,
          )}{" "}
          mm
        </text>

        {/* Height dimension */}
        <line
          x1={
            sectionLeftX -
            48
          }
          y1={
            sectionTopY
          }
          x2={
            sectionLeftX -
            48
          }
          y2={
            sectionBottomY
          }
          stroke="currentColor"
          className="text-muted"
          strokeWidth="2"
        />

        <line
          x1={
            sectionLeftX -
            58
          }
          y1={
            sectionTopY
          }
          x2={
            sectionLeftX -
            38
          }
          y2={
            sectionTopY
          }
          stroke="currentColor"
          className="text-muted"
          strokeWidth="2"
        />

        <line
          x1={
            sectionLeftX -
            58
          }
          y1={
            sectionBottomY
          }
          x2={
            sectionLeftX -
            38
          }
          y2={
            sectionBottomY
          }
          stroke="currentColor"
          className="text-muted"
          strokeWidth="2"
        />

        <text
          x={
            sectionLeftX -
            68
          }
          y={
            neutralAxisY
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-muted-strong"
          fontSize="15"
          fontWeight="600"
          transform={`rotate(-90 ${sectionLeftX - 68} ${neutralAxisY})`}
          data-testid="section-height-label"
        >
          h ={" "}
          {formatter.format(
            heightMm,
          )}{" "}
          mm
        </text>

        {/* Stress axis */}
        <line
          x1={
            stressAxisX
          }
          y1={
            sectionTopY -
            25
          }
          x2={
            stressAxisX
          }
          y2={
            sectionBottomY +
            25
          }
          stroke="currentColor"
          className="text-border-strong"
          strokeWidth="2"
        />

        <text
          x={
            stressAxisX
          }
          y={
            sectionTopY -
            42
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-muted-strong"
          fontSize="15"
          fontWeight="600"
        >
          σx
        </text>

        {/* Stress areas */}
        <path
          d={
            topAreaPath
          }
          fill="currentColor"
          className="text-danger"
          opacity="0.12"
          data-testid="top-stress-area"
        />

        <path
          d={
            bottomAreaPath
          }
          fill="currentColor"
          className="text-brand"
          opacity="0.12"
          data-testid="bottom-stress-area"
        />

        <path
          d={
            distributionPath
          }
          fill="none"
          stroke="currentColor"
          className="text-foreground"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-testid="stress-distribution-line"
        />

        {/* Top stress */}
        <circle
          cx={
            topStressX
          }
          cy={
            sectionTopY
          }
          r="5"
          fill="currentColor"
          className="text-danger"
        />

        <text
          x={
            topStressX
          }
          y={
            sectionTopY -
            14
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-foreground"
          fontSize="14"
          fontWeight="600"
          data-testid="top-stress-label"
        >
          σtop ={" "}
          {formatSignedStress(
            topStressMPa,
            formatter,
          )}{" "}
          MPa
        </text>

        <text
          x={
            stressAxisX -
            145
          }
          y={
            sectionTopY +
            25
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-danger"
          fontSize="14"
          fontWeight="600"
        >
          {getStressSignLabel(
            topStressSign,
            locale,
          )}
        </text>

        {/* Bottom stress */}
        <circle
          cx={
            bottomStressX
          }
          cy={
            sectionBottomY
          }
          r="5"
          fill="currentColor"
          className="text-brand"
        />

        <text
          x={
            bottomStressX
          }
          y={
            sectionBottomY +
            23
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-foreground"
          fontSize="14"
          fontWeight="600"
          data-testid="bottom-stress-label"
        >
          σbottom ={" "}
          {formatSignedStress(
            bottomStressMPa,
            formatter,
          )}{" "}
          MPa
        </text>

        <text
          x={
            stressAxisX +
            145
          }
          y={
            sectionBottomY -
            18
          }
          textAnchor="middle"
          fill="currentColor"
          className="text-brand"
          fontSize="14"
          fontWeight="600"
        >
          {getStressSignLabel(
            bottomStressSign,
            locale,
          )}
        </text>
      </svg>

      <p className="border-t border-border px-4 py-2.5 text-xs leading-5 text-muted">
        {locale === "tr"
          ? "Gerilme ekseni nötr eksende sıfırdır. Yatay gerilme uzunluğu göreli dağılımı gösterir; nicel yorumda MPa değerleri esas alınmalıdır."
          : "Stress is zero at the neutral axis. Horizontal stress length shows the relative distribution; use the numerical MPa values for quantitative interpretation."}
      </p>
    </figure>
  );
}