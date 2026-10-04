import {
  createSimplySupportedBeamStateFromDisplayInput,
  fromSI,
} from "@/domain/engineering";

import {
  createBeamBendingConfiguration,
  evaluateBeamBendingStress,
} from "@/domain/engineering/beam/bending";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { RectangularStressSectionDiagram } from "@/visualization/bending/rectangular-stress-section-diagram";

interface BendingConceptVisualizationPanelProps {
  readonly locale:
    SupportedLocale;
}

export function BendingConceptVisualizationPanel({
  locale,
}: BendingConceptVisualizationPanelProps) {
  const beamStateResult =
    createSimplySupportedBeamStateFromDisplayInput(
      {
        span: {
          value:
            4,

          unit:
            "m",
        },

        pointLoad: {
          value:
            10,

          unit:
            "kN",
        },

        loadPosition: {
          value:
            2,

          unit:
            "m",
        },
      },
    );

  if (
    !beamStateResult.state
  ) {
    throw new Error(
      "Bending concept reference beam state is invalid.",
    );
  }

  const configurationResult =
    createBeamBendingConfiguration(
      {
        sectionWidthM:
          0.1,

        sectionHeightM:
          0.2,

        elasticModulusPa:
          200e9,
      },
    );

  if (
    !configurationResult.configuration
  ) {
    throw new Error(
      "Bending concept configuration is invalid.",
    );
  }

  const result =
    evaluateBeamBendingStress(
      beamStateResult.state,
      configurationResult.configuration,
    );

  if (
    !result.values
  ) {
    throw new Error(
      "Bending concept visualization did not produce engineering values.",
    );
  }

  const maximumMomentKNm =
    fromSI(
      "moment",
      result.values
        .maximumMomentNm,
      "kN_m",
    );

  const secondMomentAreaCm4 =
    fromSI(
      "second_moment_area",
      result.values
        .section
        .secondMomentAreaM4,
      "cm4",
    );

  const topStressMPa =
    fromSI(
      "stress",
      result.values
        .stress
        .topFiberStressPa,
      "MPa",
    );

  const bottomStressMPa =
    fromSI(
      "stress",
      result.values
        .stress
        .bottomFiberStressPa,
      "MPa",
    );

  const maximumStressMPa =
    fromSI(
      "stress",
      result.values
        .stress
        .maximumAbsoluteStressPa,
      "MPa",
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

  return (
    <section
      data-testid="bending-concept-visualization-panel"
      className="mt-8 space-y-5"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {locale === "tr"
            ? "Doğrulanmış örnek durum"
            : "Verified example state"}
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground">
          {locale === "tr"
            ? "Momentten kesit gerilmesine"
            : "From moment to section stress"}
        </h3>

        <p className="mt-2 max-w-3xl leading-7 text-muted-strong">
          {locale === "tr"
            ? "Aşağıdaki görselde M ve gerilme değerleri ayrı bir görsel denklemle hesaplanmaz; doğrudan Engineering Core sonucundan çizilir."
            : "In the visualization below, M and stress are not recalculated with separate visual equations; the diagram is drawn directly from the Engineering Core result."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <p className="text-sm text-muted">
            Mmax
          </p>

          <p
            data-testid="bending-concept-moment"
            className="mt-2 font-mono text-xl font-semibold text-foreground"
          >
            {formatter.format(
              maximumMomentKNm,
            )}{" "}
            kN·m
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <p className="text-sm text-muted">
            I
          </p>

          <p
            data-testid="bending-concept-second-moment"
            className="mt-2 font-mono text-xl font-semibold text-foreground"
          >
            {formatter.format(
              secondMomentAreaCm4,
            )}{" "}
            cm⁴
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <p className="text-sm text-muted">
            |σ|max
          </p>

          <p
            data-testid="bending-concept-maximum-stress"
            className="mt-2 font-mono text-xl font-semibold text-foreground"
          >
            {formatter.format(
              maximumStressMPa,
            )}{" "}
            MPa
          </p>
        </div>
      </div>

      <RectangularStressSectionDiagram
        widthM={
          configurationResult
            .configuration
            .section
            .widthM
        }
        heightM={
          configurationResult
            .configuration
            .section
            .heightM
        }
        topStressMPa={
          topStressMPa
        }
        bottomStressMPa={
          bottomStressMPa
        }
        locale={
          locale
        }
      />

      <div className="rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm leading-6 text-muted-strong">
        {locale === "tr"
          ? "Pozitif sagging moment için üst lif basmadadır, nötr eksende σ = 0'dır ve alt lif çekmededir. Gerilme büyüklüğü nötr eksenden uzaklıkla doğrusal artar."
          : "For positive sagging moment, the top fiber is in compression, σ = 0 at the neutral axis, and the bottom fiber is in tension. Stress magnitude increases linearly with distance from the neutral axis."}
      </div>
    </section>
  );
}