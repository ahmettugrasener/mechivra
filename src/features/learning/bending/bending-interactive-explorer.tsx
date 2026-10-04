"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import {
  evaluateBendingInteractiveState,
} from "@/features/learning/bending/bending-interactive-adapter";

import { DeflectedBeamDiagram } from "@/visualization/bending/deflected-beam-diagram";

import { RectangularStressSectionDiagram } from "@/visualization/bending/rectangular-stress-section-diagram";

interface BendingInteractiveExplorerProps {
  readonly locale:
    SupportedLocale;
}

type InteractiveParameter =
  | "width"
  | "height"
  | "elastic_modulus"
  | "load_position";

interface SliderDefinition {
  readonly parameter:
    InteractiveParameter;

  readonly labelTr:
    string;

  readonly labelEn:
    string;

  readonly min:
    number;

  readonly max:
    number;

  readonly step:
    number;

  readonly unit:
    string;
}

const sliderDefinitions:
  readonly SliderDefinition[] =
  [
    {
      parameter:
        "width",

      labelTr:
        "Kesit genişliği b",

      labelEn:
        "Section width b",

      min:
        60,

      max:
        200,

      step:
        10,

      unit:
        "mm",
    },

    {
      parameter:
        "height",

      labelTr:
        "Kesit yüksekliği h",

      labelEn:
        "Section height h",

      min:
        100,

      max:
        300,

      step:
        10,

      unit:
        "mm",
    },

    {
      parameter:
        "elastic_modulus",

      labelTr:
        "Elastisite modülü E",

      labelEn:
        "Elastic modulus E",

      min:
        50,

      max:
        220,

      step:
        10,

      unit:
        "GPa",
    },

    {
      parameter:
        "load_position",

      labelTr:
        "Yükün soldan konumu a",

      labelEn:
        "Load position from the left a",

      min:
        0.5,

      max:
        3.5,

      step:
        0.1,

      unit:
        "m",
    },
  ];

function criterionLabel(
  status:
    "satisfied" |
    "not_satisfied" |
    "undetermined",

  locale:
    SupportedLocale,
): string {
  switch (
    status
  ) {
    case "satisfied":
      return locale === "tr"
        ? "Sağlandı"
        : "Satisfied";

    case "not_satisfied":
      return locale === "tr"
        ? "Sağlanmadı"
        : "Not satisfied";

    case "undetermined":
      return locale === "tr"
        ? "Belirlenemedi"
        : "Undetermined";
  }
}

export function BendingInteractiveExplorer({
  locale,
}: BendingInteractiveExplorerProps) {
  const [
    sectionWidthMm,
    setSectionWidthMm,
  ] =
    useState(
      100,
    );

  const [
    sectionHeightMm,
    setSectionHeightMm,
  ] =
    useState(
      200,
    );

  const [
    elasticModulusGPa,
    setElasticModulusGPa,
  ] =
    useState(
      200,
    );

  const [
    loadPositionM,
    setLoadPositionM,
  ] =
    useState(
      2,
    );

  const [
    interactionCount,
    setInteractionCount,
  ] =
    useState(
      0,
    );

  const [
    activeParameter,
    setActiveParameter,
  ] =
    useState<
      InteractiveParameter |
      null
    >(
      null,
    );

  const output =
    useMemo(
      () =>
        evaluateBendingInteractiveState(
          {
            spanM:
              4,

            pointLoadKN:
              10,

            loadPositionM,

            sectionWidthMm,

            sectionHeightMm,

            elasticModulusGPa,
          },
        ),
      [
        elasticModulusGPa,
        loadPositionM,
        sectionHeightMm,
        sectionWidthMm,
      ],
    );

  const formatter =
    useMemo(
      () =>
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
        ),
      [
        locale,
      ],
    );

  function updateParameter(
    parameter:
      InteractiveParameter,

    value:
      number,
  ) {
    switch (
      parameter
    ) {
      case "width":
        setSectionWidthMm(
          value,
        );

        break;

      case "height":
        setSectionHeightMm(
          value,
        );

        break;

      case "elastic_modulus":
        setElasticModulusGPa(
          value,
        );

        break;

      case "load_position":
        setLoadPositionM(
          value,
        );

        break;
    }

    setActiveParameter(
      parameter,
    );

    setInteractionCount(
      (
        current,
      ) =>
        current +
        1,
    );
  }

  function getCurrentValue(
    parameter:
      InteractiveParameter,
  ): number {
    switch (
      parameter
    ) {
      case "width":
        return sectionWidthMm;

      case "height":
        return sectionHeightMm;

      case "elastic_modulus":
        return elasticModulusGPa;

      case "load_position":
        return loadPositionM;
    }
  }

  return (
    <section
      data-testid="bending-interactive-explorer"
      data-interactive-kind="beam_bending_rectangular_explorer"
      data-meaningful-interaction={
        interactionCount >
        0
      }
      data-interaction-count={
        interactionCount
      }
      data-active-parameter={
        activeParameter ??
        "none"
      }
      className="mt-8 space-y-6"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {locale === "tr"
            ? "Etkileşimli deney"
            : "Interactive experiment"}
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground">
          {locale === "tr"
            ? "Geometri, rijitlik ve yük konumunu değiştir"
            : "Change geometry, stiffness, and load position"}
        </h3>

        <p className="mt-2 max-w-3xl leading-7 text-muted-strong">
          {locale === "tr"
            ? "Açıklık 4 m ve yük 10 kN sabittir. Tek bir değişkeni değiştirerek moment, gerilme ve sehim üzerindeki etkisini ayırmaya çalış."
            : "The span is fixed at 4 m and the load at 10 kN. Change one variable at a time to isolate its effect on moment, stress, and deflection."}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sliderDefinitions.map(
          (
            slider,
          ) => {
            const currentValue =
              getCurrentValue(
                slider.parameter,
              );

            const label =
              locale === "tr"
                ? slider.labelTr
                : slider.labelEn;

            return (
              <label
                key={
                  slider.parameter
                }
                className="rounded-xl border border-border bg-surface-subtle p-4"
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-foreground">
                    {label}
                  </span>

                  <span
                    className="font-mono text-sm font-semibold text-brand"
                    data-testid={`${slider.parameter}-value`}
                  >
                    {formatter.format(
                      currentValue,
                    )}{" "}
                    {
                      slider.unit
                    }
                  </span>
                </span>

                <input
                  type="range"
                  aria-label={
                    label
                  }
                  min={
                    slider.min
                  }
                  max={
                    slider.max
                  }
                  step={
                    slider.step
                  }
                  value={
                    currentValue
                  }
                  onChange={(
                    event,
                  ) => {
                    updateParameter(
                      slider.parameter,
                      Number(
                        event
                          .currentTarget
                          .value,
                      ),
                    );
                  }}
                  className="mt-4 w-full accent-current"
                />
              </label>
            );
          },
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">
            Mmax
          </p>

          <p
            data-testid="bending-interactive-moment"
            className="mt-2 font-mono text-lg font-semibold text-foreground"
          >
            {formatter.format(
              output.maximumMomentKNm,
            )}{" "}
            kN·m
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">
            I
          </p>

          <p
            data-testid="bending-interactive-second-moment"
            className="mt-2 font-mono text-lg font-semibold text-foreground"
          >
            {formatter.format(
              output.secondMomentAreaCm4,
            )}{" "}
            cm⁴
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">
            |σ|max
          </p>

          <p
            data-testid="bending-interactive-stress"
            className="mt-2 font-mono text-lg font-semibold text-foreground"
          >
            {formatter.format(
              output.maximumAbsoluteStressMPa,
            )}{" "}
            MPa
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">
            |δ|max
          </p>

          <p
            data-testid="bending-interactive-deflection"
            className="mt-2 font-mono text-lg font-semibold text-foreground"
          >
            {formatter.format(
              output.maximumAbsoluteDeflectionMm,
            )}{" "}
            mm
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <RectangularStressSectionDiagram
          widthM={
            sectionWidthMm /
            1000
          }
          heightM={
            sectionHeightMm /
            1000
          }
          topStressMPa={
            output.topStressMPa
          }
          bottomStressMPa={
            output.bottomStressMPa
          }
          locale={
            locale
          }
        />

        <DeflectedBeamDiagram
          spanM={4}
          loadPositionM={
            loadPositionM
          }
          maximumMomentPositionM={
            output.maximumMomentPositionM
          }
          maximumDeflectionPositionM={
            output.maximumDeflectionPositionM
          }
          maximumAbsoluteDeflectionMm={
            output.maximumAbsoluteDeflectionMm
          }
          curvePoints={
            output.curvePoints
          }
          locale={
            locale
          }
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <p className="text-sm font-semibold text-foreground">
            {locale === "tr"
              ? "Eğilme gerilmesi ölçütü"
              : "Bending-stress criterion"}
          </p>

          <p
            data-testid="bending-stress-criterion"
            className="mt-2 text-sm text-muted-strong"
          >
            {criterionLabel(
              output.stressCriterion,
              locale,
            )}{" "}
            · 20 MPa
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <p className="text-sm font-semibold text-foreground">
            {locale === "tr"
              ? "Sehim ölçütü"
              : "Deflection criterion"}
          </p>

          <p
            data-testid="bending-deflection-criterion"
            className="mt-2 text-sm text-muted-strong"
          >
            {criterionLabel(
              output.deflectionCriterion,
              locale,
            )}{" "}
            · 2 mm
          </p>
        </div>
      </div>

      <p
        role="status"
        className="rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm leading-6 text-muted-strong"
      >
        {interactionCount ===
        0
          ? locale ===
            "tr"
            ? "Bir parametreyi değiştir ve tüm temsillerin aynı anda nasıl güncellendiğini izle."
            : "Change a parameter and observe how every representation updates together."
          : locale ===
            "tr"
            ? `Senkron durum güncellendi. Toplam anlamlı değişiklik: ${interactionCount}.`
            : `Synchronized state updated. Meaningful changes: ${interactionCount}.`}
      </p>
    </section>
  );
}