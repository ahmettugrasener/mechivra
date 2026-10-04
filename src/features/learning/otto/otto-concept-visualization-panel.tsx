import {
  createIdealOttoInputState,
  createIdealOttoPvProcessCurves,
  evaluateIdealOttoCycle,
} from "@/domain/engineering/thermodynamics/otto";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { IdealOttoPvDiagram } from "@/visualization/thermodynamics/otto/ideal-otto-pv-diagram";

import { OttoTemperatureStateDiagram } from "@/visualization/thermodynamics/otto/otto-temperature-state-diagram";

interface OttoConceptVisualizationPanelProps {
  readonly locale:
    SupportedLocale;
}

export function OttoConceptVisualizationPanel({
  locale,
}: OttoConceptVisualizationPanelProps) {
  const inputResult =
    createIdealOttoInputState(
      {
        compressionRatio:
          8,

        initialTemperatureK:
          300,

        initialPressurePa:
          100_000,

        heatInputJPerKg:
          800_000,
      },
    );

  if (
    !inputResult.state
  ) {
    throw new Error(
      "Otto concept reference input is invalid.",
    );
  }

  const analysis =
    evaluateIdealOttoCycle(
      inputResult.state,
    );

  if (
    !analysis.values
  ) {
    throw new Error(
      "Otto concept reference analysis is invalid.",
    );
  }

  const values =
    analysis.values;

  const curves =
    createIdealOttoPvProcessCurves(
      values.states,
      values
        .gasProperties
        .gamma,
    );

  const formatter =
    new Intl.NumberFormat(
      locale === "tr"
        ? "tr-TR"
        : "en-US",
      {
        maximumFractionDigits:
          3,
      },
    );

  const stateRows = [
    values.states.state1,
    values.states.state2,
    values.states.state3,
    values.states.state4,
  ];

  /*
   * These are display-only scale changes.
   * The canonical Engineering Core values remain SI.
   */
  const heatInputKJPerKg =
    values.energy
      .heatInputJPerKg /
    1000;

  const netWorkKJPerKg =
    values.energy
      .netWorkJPerKg /
    1000;

  const efficiencyPercent =
    values.energy
      .thermalEfficiencyFromEnergyBalance *
    100;

  return (
    <section
      data-testid="otto-concept-visualization-panel"
      className="mt-10 space-y-6 border-t border-border pt-8"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {locale === "tr"
            ? "Doğrulanmış referans çevrim"
            : "Verified reference cycle"}
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground">
          {locale === "tr"
            ? "Dört durumu aynı çevrim üzerinde gör"
            : "See all four states on the same cycle"}
        </h3>

        <p className="mt-2 max-w-3xl leading-7 text-muted-strong">
          {locale === "tr"
            ? "Aşağıdaki bütün sayısal değerler Otto Engineering Core tarafından aynı fiziksel durumdan üretilir. Görseller kendi başına ayrı bir termodinamik hesap yapmaz."
            : "All numerical values below are produced by the Otto Engineering Core from the same physical state. The visualizations do not perform a separate thermodynamic calculation."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <p className="text-xs text-muted">
            {locale === "tr"
              ? "Sıkıştırma oranı"
              : "Compression ratio"}
          </p>

          <p
            data-testid="otto-concept-compression-ratio"
            className="mt-1 font-mono text-lg font-semibold text-foreground"
          >
            r = 8
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <p className="text-xs text-muted">
            γ
          </p>

          <p className="mt-1 font-mono text-lg font-semibold text-foreground">
            {formatter.format(
              values
                .gasProperties
                .gamma,
            )}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <p className="text-xs text-muted">
            qin
          </p>

          <p
            data-testid="otto-concept-heat-input"
            className="mt-1 font-mono text-lg font-semibold text-foreground"
          >
            {formatter.format(
              heatInputKJPerKg,
            )}{" "}
            kJ/kg
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <p className="text-xs text-muted">
            {locale === "tr"
              ? "İdeal ısıl verim"
              : "Ideal thermal efficiency"}
          </p>

          <p
            data-testid="otto-concept-efficiency"
            className="mt-1 font-mono text-lg font-semibold text-foreground"
          >
            {formatter.format(
              efficiencyPercent,
            )}{" "}
            %
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <IdealOttoPvDiagram
          curves={
            curves
          }
          locale={
            locale
          }
        />

        <OttoTemperatureStateDiagram
          temperaturesK={{
            state1:
              values.states
                .state1
                .temperatureK,

            state2:
              values.states
                .state2
                .temperatureK,

            state3:
              values.states
                .state3
                .temperatureK,

            state4:
              values.states
                .state4
                .temperatureK,
          }}
          locale={
            locale
          }
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[620px] border-collapse text-sm">
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
              ) => {
                const pressureKPa =
                  state.pressurePa /
                  1000;

                return (
                  <tr
                    key={
                      state.id
                    }
                    data-testid={`otto-state-row-${state.id}`}
                    className="border-t border-border"
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {state.id}
                    </td>

                    <td className="px-4 py-3 text-right font-mono text-muted-strong">
                      {formatter.format(
                        state.temperatureK,
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-mono text-muted-strong">
                      {formatter.format(
                        pressureKPa,
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-mono text-muted-strong">
                      {formatter.format(
                        state.specificVolumeM3PerKg,
                      )}
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-brand/20 bg-brand-soft p-4 text-sm leading-6 text-muted-strong">
        {locale === "tr"
          ? `Bu ideal çevrimde net özgül iş ${formatter.format(
              netWorkKJPerKg,
            )} kJ/kg'dır. Bu değer gerçek bir motorun güç veya performans tahmini değildir.`
          : `The net specific work of this ideal cycle is ${formatter.format(
              netWorkKJPerKg,
            )} kJ/kg. This value is not a power or performance prediction for a real engine.`}
      </div>
    </section>
  );
}