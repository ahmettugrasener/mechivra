"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
} from "react";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import {
  evaluateOttoInteractiveState,
} from "@/features/learning/otto/otto-interactive-adapter";

import { IdealOttoPvDiagram } from "@/visualization/thermodynamics/otto/ideal-otto-pv-diagram";

import { OttoTemperatureStateDiagram } from "@/visualization/thermodynamics/otto/otto-temperature-state-diagram";

interface OttoInteractiveExplorerProps {
  readonly locale:
    SupportedLocale;
}

const INITIAL_COMPRESSION_RATIO =
  8;

const INITIAL_HEAT_INPUT_KJ_PER_KG =
  800;

export function OttoInteractiveExplorer({
  locale,
}: OttoInteractiveExplorerProps) {
  const [
    compressionRatio,
    setCompressionRatio,
  ] =
    useState(
      INITIAL_COMPRESSION_RATIO,
    );

  const [
    heatInputKJPerKg,
    setHeatInputKJPerKg,
  ] =
    useState(
      INITIAL_HEAT_INPUT_KJ_PER_KG,
    );

  const [
    hasMeaningfulInteraction,
    setHasMeaningfulInteraction,
  ] =
    useState(
      false,
    );

  const result =
    useMemo(
      () =>
        evaluateOttoInteractiveState(
          {
            compressionRatio,

            heatInputKJPerKg,
          },
        ),
      [
        compressionRatio,
        heatInputKJPerKg,
      ],
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

  function handleCompressionRatioChange(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const nextValue =
      Number(
        event.currentTarget
          .value,
      );

    if (
      nextValue !==
      compressionRatio
    ) {
      setHasMeaningfulInteraction(
        true,
      );
    }

    setCompressionRatio(
      nextValue,
    );
  }

  function handleHeatInputChange(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const nextValue =
      Number(
        event.currentTarget
          .value,
      );

    if (
      nextValue !==
      heatInputKJPerKg
    ) {
      setHasMeaningfulInteraction(
        true,
      );
    }

    setHeatInputKJPerKg(
      nextValue,
    );
  }

  const changedCompressionRatio =
    compressionRatio !==
    INITIAL_COMPRESSION_RATIO;

  const changedHeatInput =
    heatInputKJPerKg !==
    INITIAL_HEAT_INPUT_KJ_PER_KG;

  const stateRows = [
    result.states.state1,
    result.states.state2,
    result.states.state3,
    result.states.state4,
  ];

  return (
    <section
      data-testid="otto-interactive-explorer"
      data-meaningful-interaction={
        hasMeaningfulInteraction
          ? "true"
          : "false"
      }
      className="mt-8 space-y-6"
    >
      <div className="rounded-2xl border border-border bg-surface-subtle p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            {locale === "tr"
              ? "İnteraktif ideal çevrim"
              : "Interactive ideal cycle"}
          </p>

          <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground">
            {locale === "tr"
              ? "Bir değişkeni değiştir ve bütün çevrimi izle"
              : "Change one variable and observe the whole cycle"}
          </h3>

          <p className="mt-2 max-w-3xl leading-7 text-muted-strong">
            {locale === "tr"
              ? "Başlangıç durumu T₁ = 300 K ve p₁ = 100 kPa olarak sabittir. Gaz özellik setinde γ = 1,4'tür. Önce yalnız r'yi, sonra yalnız qin değerini değiştirerek sonuçları karşılaştır."
              : "The initial state is fixed at T₁ = 300 K and p₁ = 100 kPa. The gas property set uses γ = 1.4. First vary only r, then vary only qin and compare the results."}
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <label className="block">
            <span className="flex items-center justify-between gap-4 text-sm font-semibold text-foreground">
              <span>
                {locale === "tr"
                  ? "Sıkıştırma oranı r"
                  : "Compression ratio r"}
              </span>

              <strong
                data-testid="compression-ratio-value"
                className="font-mono text-brand"
              >
                {numberFormatter.format(
                  compressionRatio,
                )}
              </strong>
            </span>

            <input
              type="range"
              min="6"
              max="12"
              step="1"
              value={
                compressionRatio
              }
              onChange={
                handleCompressionRatioChange
              }
              aria-label={
                locale === "tr"
                  ? "Sıkıştırma oranı r"
                  : "Compression ratio r"
              }
              className="mt-3 w-full"
            />

            <span className="mt-2 block text-xs leading-5 text-muted">
              {locale === "tr"
                ? "Eğitim kontrol aralığı: 6–12. Bu aralık modelin evrensel fiziksel geçerlilik sınırı değildir."
                : "Teaching control range: 6–12. This range is not a universal physical-validity limit of the model."}
            </span>
          </label>

          <label className="block">
            <span className="flex items-center justify-between gap-4 text-sm font-semibold text-foreground">
              <span>
                {locale === "tr"
                  ? "Özgül ısı girişi qin"
                  : "Specific heat input qin"}
              </span>

              <strong
                data-testid="heat-input-value"
                className="font-mono text-brand"
              >
                {numberFormatter.format(
                  heatInputKJPerKg,
                )}{" "}
                kJ/kg
              </strong>
            </span>

            <input
              type="range"
              min="400"
              max="1000"
              step="100"
              value={
                heatInputKJPerKg
              }
              onChange={
                handleHeatInputChange
              }
              aria-label={
                locale === "tr"
                  ? "Özgül ısı girişi qin"
                  : "Specific heat input qin"
              }
              className="mt-3 w-full"
            />

            <span className="mt-2 block text-xs leading-5 text-muted">
              {locale === "tr"
                ? "Eğitim kontrol aralığı: 400–1000 kJ/kg. Bu sınırlar uzman onaylı model geçerlilik sınırı olarak yorumlanmamalıdır."
                : "Teaching control range: 400–1000 kJ/kg. These limits must not be interpreted as expert-approved model-validity boundaries."}
            </span>
          </label>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted">
            {locale === "tr"
              ? "İdeal ısıl verim"
              : "Ideal thermal efficiency"}
          </p>

          <p
            data-testid="otto-interactive-efficiency"
            className="mt-1 font-mono text-lg font-semibold text-foreground"
          >
            {numberFormatter.format(
              result
                .thermalEfficiencyPercent,
            )}{" "}
            %
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted">
            {locale === "tr"
              ? "Net özgül iş"
              : "Net specific work"}
          </p>

          <p
            data-testid="otto-interactive-net-work"
            className="mt-1 font-mono text-lg font-semibold text-foreground"
          >
            {numberFormatter.format(
              result
                .netWorkKJPerKg,
            )}{" "}
            kJ/kg
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted">
            qout
          </p>

          <p
            data-testid="otto-interactive-heat-rejected"
            className="mt-1 font-mono text-lg font-semibold text-foreground"
          >
            {numberFormatter.format(
              result
                .heatRejectedKJPerKg,
            )}{" "}
            kJ/kg
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted">
            T₃
          </p>

          <p
            data-testid="otto-interactive-state3-temperature"
            className="mt-1 font-mono text-lg font-semibold text-foreground"
          >
            {numberFormatter.format(
              result.states
                .state3
                .temperatureK,
            )}{" "}
            K
          </p>
        </div>
      </div>

      <div
        data-testid="otto-interactive-interpretation"
        className="rounded-xl border border-brand/20 bg-brand-soft p-4 text-sm leading-6 text-muted-strong"
      >
        {!changedCompressionRatio &&
        !changedHeatInput
          ? locale === "tr"
            ? "Başlangıç durumundasın. Önce yalnız bir parametreyi değiştirerek nedensel etkiyi daha temiz gözlemle."
            : "You are at the initial state. Change only one parameter first so that the causal effect is easier to interpret."
          : changedCompressionRatio &&
              !changedHeatInput
            ? locale === "tr"
              ? "Yalnız sıkıştırma oranını değiştirdin. Sabit γ kullanılan ideal Otto modelinde verim r ile değişir."
              : "You changed only the compression ratio. In the constant-γ ideal Otto model, efficiency changes with r."
            : !changedCompressionRatio &&
                changedHeatInput
              ? locale === "tr"
                ? "Yalnız qin değerini değiştirdin. r ve γ sabit olduğundan sıcaklıklar ve özgül işler değişirken ideal verim aynı kalır."
                : "You changed only qin. Because r and γ are fixed, temperatures and specific work change while ideal efficiency remains unchanged."
              : locale === "tr"
                ? "İki girdiyi birden değiştirdin. Sonuç farkını yalnız r'ye veya yalnız qin'e bağlama; tek değişkenli iki ayrı deneme yap."
                : "You changed both inputs. Do not attribute the result difference to r alone or qin alone; run two separate single-variable comparisons."}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <IdealOttoPvDiagram
          curves={
            result.curves
          }
          locale={
            locale
          }
        />

        <OttoTemperatureStateDiagram
          temperaturesK={{
            state1:
              result.states
                .state1
                .temperatureK,

            state2:
              result.states
                .state2
                .temperatureK,

            state3:
              result.states
                .state3
                .temperatureK,

            state4:
              result.states
                .state4
                .temperatureK,
          }}
          locale={
            locale
          }
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead className="bg-surface-subtle">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">
                {locale === "tr"
                  ? "Durum"
                  : "State"}
              </th>

              <th className="px-4 py-3 text-right font-semibold text-foreground">
                T (K)
              </th>

              <th className="px-4 py-3 text-right font-semibold text-foreground">
                p (kPa)
              </th>

              <th className="px-4 py-3 text-right font-semibold text-foreground">
                v (m³/kg)
              </th>
            </tr>
          </thead>

          <tbody>
            {stateRows.map(
              (
                state,
              ) => (
                <tr
                  key={
                    state.id
                  }
                  data-testid={`otto-interactive-state-row-${state.id}`}
                  className="border-t border-border"
                >
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {state.id}
                  </td>

                  <td className="px-4 py-3 text-right font-mono text-muted-strong">
                    {numberFormatter.format(
                      state.temperatureK,
                    )}
                  </td>

                  <td className="px-4 py-3 text-right font-mono text-muted-strong">
                    {numberFormatter.format(
                      state.pressureKPa,
                    )}
                  </td>

                  <td className="px-4 py-3 text-right font-mono text-muted-strong">
                    {numberFormatter.format(
                      state.specificVolumeM3PerKg,
                    )}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs leading-5 text-muted">
        {locale === "tr"
          ? "Bu etkileşim sabit özgül ısı kullanılan ideal hava-standardı Otto çevrimini gösterir. Gerçek yanma, sürtünme, gaz değişimi, vuruntu ve gerçek motor performansı hesaplanmaz."
          : "This interaction represents the constant-specific-heat ideal air-standard Otto cycle. Real combustion, friction, gas exchange, knock, and real-engine performance are not calculated."}
      </p>
    </section>
  );
}