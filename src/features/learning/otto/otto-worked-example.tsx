import type {
  SupportedLocale,
} from "@/domain/shared/types";

import {
  createOttoWorkedExampleSnapshot,
} from "@/features/learning/otto/otto-worked-example-adapter";

interface OttoWorkedExampleProps {
  readonly locale:
    SupportedLocale;
}

export function OttoWorkedExample({
  locale,
}: OttoWorkedExampleProps) {
  const result =
    createOttoWorkedExampleSnapshot();

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

  const steps =
    locale === "tr"
      ? [
          {
            title:
              "1. Gaz özelliklerini tutarlı kur",

            body:
              `R = ${formatter.format(
                result.gasConstantJPerKgK,
              )} J/(kg·K), γ = ${formatter.format(
                result.gamma,
              )}. Buradan cv = ${formatter.format(
                result.cvJPerKgK,
              )} J/(kg·K) ve cp = ${formatter.format(
                result.cpJPerKgK,
              )} J/(kg·K).`,
          },

          {
            title:
              "2. Durum 1 ve özgül hacim",

            body:
              `T₁ = ${formatter.format(
                result.initialTemperatureK,
              )} K ve p₁ = ${formatter.format(
                result.initialPressureKPa,
              )} kPa. İdeal gaz bağıntısından v₁ = ${formatter.format(
                result.states
                  .state1
                  .specificVolumeM3PerKg,
              )} m³/kg.`,
          },

          {
            title:
              "3. 1 → 2 izentropik sıkıştırma",

            body:
              `r = ${formatter.format(
                result.compressionRatio,
              )}. T₂ = ${formatter.format(
                result.states
                  .state2
                  .temperatureK,
              )} K, p₂ = ${formatter.format(
                result.states
                  .state2
                  .pressureKPa,
              )} kPa ve v₂ = ${formatter.format(
                result.states
                  .state2
                  .specificVolumeM3PerKg,
              )} m³/kg.`,
          },

          {
            title:
              "4. 2 → 3 sabit hacimde ısı eklenmesi",

            body:
              `qin = ${formatter.format(
                result.heatInputKJPerKg,
              )} kJ/kg. Sonuçta T₃ = ${formatter.format(
                result.states
                  .state3
                  .temperatureK,
              )} K ve p₃ = ${formatter.format(
                result.states
                  .state3
                  .pressureKPa,
              )} kPa. Sabit hacim nedeniyle v₃ = v₂.`,
          },

          {
            title:
              "5. 3 → 4 izentropik genleşme",

            body:
              `T₄ = ${formatter.format(
                result.states
                  .state4
                  .temperatureK,
              )} K, p₄ = ${formatter.format(
                result.states
                  .state4
                  .pressureKPa,
              )} kPa ve v₄ = ${formatter.format(
                result.states
                  .state4
                  .specificVolumeM3PerKg,
              )} m³/kg. Böylece v₄ = v₁.`,
          },

          {
            title:
              "6. Enerji dengesi ve verim",

            body:
              `qout = ${formatter.format(
                result.heatRejectedKJPerKg,
              )} kJ/kg ve wnet = ${formatter.format(
                result.netWorkKJPerKg,
              )} kJ/kg. η = wnet/qin = ${formatter.format(
                result.thermalEfficiencyPercent,
              )} %. Sıkıştırma oranı bağıntısı da aynı verimi vermelidir.`,
          },
        ]
      : [
          {
            title:
              "1. Build a consistent gas-property set",

            body:
              `R = ${formatter.format(
                result.gasConstantJPerKgK,
              )} J/(kg·K), γ = ${formatter.format(
                result.gamma,
              )}. This gives cv = ${formatter.format(
                result.cvJPerKgK,
              )} J/(kg·K) and cp = ${formatter.format(
                result.cpJPerKgK,
              )} J/(kg·K).`,
          },

          {
            title:
              "2. State 1 and specific volume",

            body:
              `T₁ = ${formatter.format(
                result.initialTemperatureK,
              )} K and p₁ = ${formatter.format(
                result.initialPressureKPa,
              )} kPa. The ideal-gas relation gives v₁ = ${formatter.format(
                result.states
                  .state1
                  .specificVolumeM3PerKg,
              )} m³/kg.`,
          },

          {
            title:
              "3. 1 → 2 isentropic compression",

            body:
              `r = ${formatter.format(
                result.compressionRatio,
              )}. T₂ = ${formatter.format(
                result.states
                  .state2
                  .temperatureK,
              )} K, p₂ = ${formatter.format(
                result.states
                  .state2
                  .pressureKPa,
              )} kPa, and v₂ = ${formatter.format(
                result.states
                  .state2
                  .specificVolumeM3PerKg,
              )} m³/kg.`,
          },

          {
            title:
              "4. 2 → 3 constant-volume heat addition",

            body:
              `qin = ${formatter.format(
                result.heatInputKJPerKg,
              )} kJ/kg. This gives T₃ = ${formatter.format(
                result.states
                  .state3
                  .temperatureK,
              )} K and p₃ = ${formatter.format(
                result.states
                  .state3
                  .pressureKPa,
              )} kPa. Because volume is constant, v₃ = v₂.`,
          },

          {
            title:
              "5. 3 → 4 isentropic expansion",

            body:
              `T₄ = ${formatter.format(
                result.states
                  .state4
                  .temperatureK,
              )} K, p₄ = ${formatter.format(
                result.states
                  .state4
                  .pressureKPa,
              )} kPa, and v₄ = ${formatter.format(
                result.states
                  .state4
                  .specificVolumeM3PerKg,
              )} m³/kg. Therefore v₄ = v₁.`,
          },

          {
            title:
              "6. Energy balance and efficiency",

            body:
              `qout = ${formatter.format(
                result.heatRejectedKJPerKg,
              )} kJ/kg and wnet = ${formatter.format(
                result.netWorkKJPerKg,
              )} kJ/kg. η = wnet/qin = ${formatter.format(
                result.thermalEfficiencyPercent,
              )} %. The compression-ratio relation must give the same efficiency.`,
          },
        ];

  return (
    <section
      data-testid="otto-worked-example"
      className="mt-10 space-y-5 border-t border-border pt-8"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {locale === "tr"
            ? "Çözümlü örnek"
            : "Worked example"}
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground">
          {locale === "tr"
            ? "r = 8 ideal Otto çevrimini adım adım çöz"
            : "Solve the r = 8 ideal Otto cycle step by step"}
        </h3>
      </div>

      <div className="space-y-3">
        {steps.map(
          (
            step,
          ) => (
            <article
              key={
                step.title
              }
              data-otto-worked-example-step
              className="rounded-xl border border-border bg-background p-4"
            >
              <h4 className="font-semibold text-foreground">
                {
                  step.title
                }
              </h4>

              <p className="mt-2 text-sm leading-6 text-muted-strong">
                {
                  step.body
                }
              </p>
            </article>
          ),
        )}
      </div>

      <div className="rounded-xl border border-brand/20 bg-brand-soft p-4 text-sm leading-6 text-muted-strong">
        {locale === "tr"
          ? "Bu çözüm ideal hava-standardı, ideal gaz ve sabit özgül ısı modeline aittir. Enerji dengesi ile sıkıştırma-oranı verim bağıntısının aynı sonucu vermesi model içi bir kontroldür; gerçek motor validasyonu değildir."
          : "This solution belongs to the ideal air-standard, ideal-gas, constant-specific-heat model. Agreement between the energy balance and compression-ratio efficiency relation is an internal model check, not validation of a real engine."}
      </div>
    </section>
  );
}