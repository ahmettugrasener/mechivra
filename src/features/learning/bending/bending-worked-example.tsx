import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { createBendingWorkedExampleResult } from "@/features/learning/bending/bending-worked-example-adapter";

import { DeflectedBeamDiagram } from "@/visualization/bending/deflected-beam-diagram";

import { RectangularStressSectionDiagram } from "@/visualization/bending/rectangular-stress-section-diagram";

interface BendingWorkedExampleProps {
  readonly locale:
    SupportedLocale;
}

export function BendingWorkedExample({
  locale,
}: BendingWorkedExampleProps) {
  const result =
    createBendingWorkedExampleResult();

  const formatter =
    new Intl.NumberFormat(
      locale === "tr"
        ? "tr-TR"
        : "en-US",
      {
        maximumFractionDigits:
          4,

        minimumFractionDigits:
          0,
      },
    );

  const steps =
    locale === "tr"
      ? [
          {
            title:
              "1. Verilenler",

            body:
              "L = 4 m, P = 10 kN, a = 2 m, b = 100 mm, h = 200 mm ve E = 200 GPa. Eğilme gerilmesi sınırı 20 MPa, sehim sınırı 0,5 mm.",
          },

          {
            title:
              "2. Statikten maksimum moment",

            body:
              `Yük orta noktadadır. Doğrulanmış Statics Engineering Core sonucu Mmax = ${formatter.format(result.maximumMomentKNm)} kN·m ve xM = ${formatter.format(result.maximumMomentPositionM)} m'dir.`,
          },

          {
            title:
              "3. Kesit geometrisi",

            body:
              `Dikdörtgen kesitte I = bh³/12. Bu kesit için I = ${formatter.format(result.secondMomentAreaCm4)} cm⁴'tür.`,
          },

          {
            title:
              "4. Eğilme gerilmesi",

            body:
              `σx = -My/I bağıntısıyla üst lif ${formatter.format(result.topStressMPa)} MPa, alt lif +${formatter.format(result.bottomStressMPa)} MPa'dır. Maksimum gerilme büyüklüğü ${formatter.format(result.maximumStressMPa)} MPa olduğundan 20 MPa gerilme ölçütü sağlanır.`,
          },

          {
            title:
              "5. Sehim",

            body:
              `Yük orta noktada olduğu için PL³/(48EI) özel sonucu geçerlidir. Maksimum sehim ${formatter.format(result.maximumDeflectionMm)} mm ve xδ = ${formatter.format(result.maximumDeflectionPositionM)} m'dir.`,
          },

          {
            title:
              "6. İki kriter aynı sonucu vermek zorunda değildir",

            body:
              "Gerilme sınırı sağlanırken 0,5 mm sehim sınırı sağlanmaz. Bu nedenle sonucu tek bir 'güvenli/güvensiz' etiketine indirmiyoruz.",
          },
        ]
      : [
          {
            title:
              "1. Given data",

            body:
              "L = 4 m, P = 10 kN, a = 2 m, b = 100 mm, h = 200 mm, and E = 200 GPa. The bending-stress limit is 20 MPa and the deflection limit is 0.5 mm.",
          },

          {
            title:
              "2. Maximum moment from Statics",

            body:
              `The load is at midspan. The verified Statics Engineering Core gives Mmax = ${formatter.format(result.maximumMomentKNm)} kN·m at xM = ${formatter.format(result.maximumMomentPositionM)} m.`,
          },

          {
            title:
              "3. Section geometry",

            body:
              `For a rectangular section, I = bh³/12. Here, I = ${formatter.format(result.secondMomentAreaCm4)} cm⁴.`,
          },

          {
            title:
              "4. Bending stress",

            body:
              `Using σx = -My/I, the top fiber is at ${formatter.format(result.topStressMPa)} MPa and the bottom fiber at +${formatter.format(result.bottomStressMPa)} MPa. The maximum stress magnitude is ${formatter.format(result.maximumStressMPa)} MPa, so the 20 MPa stress criterion is satisfied.`,
          },

          {
            title:
              "5. Deflection",

            body:
              `Because the load is at midspan, the PL³/(48EI) special case applies. Maximum deflection is ${formatter.format(result.maximumDeflectionMm)} mm at xδ = ${formatter.format(result.maximumDeflectionPositionM)} m.`,
          },

          {
            title:
              "6. The two criteria need not agree",

            body:
              "The stress criterion is satisfied, while the 0.5 mm deflection criterion is not. Therefore, the result is not reduced to one general 'safe/unsafe' label.",
          },
        ];

  return (
    <section
      data-testid="bending-worked-example"
      className="mt-10 space-y-6 border-t border-border pt-8"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {locale === "tr"
            ? "Çözümlü örnek"
            : "Worked example"}
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground">
          {locale === "tr"
            ? "Aynı kirişte gerilme ve sehim kriterleri"
            : "Stress and deflection criteria in the same beam"}
        </h3>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <RectangularStressSectionDiagram
          widthM={0.1}
          heightM={0.2}
          topStressMPa={
            result.topStressMPa
          }
          bottomStressMPa={
            result.bottomStressMPa
          }
          locale={
            locale
          }
        />

        <DeflectedBeamDiagram
          spanM={4}
          loadPositionM={2}
          maximumMomentPositionM={
            result.maximumMomentPositionM
          }
          maximumDeflectionPositionM={
            result.maximumDeflectionPositionM
          }
          maximumAbsoluteDeflectionMm={
            result.maximumDeflectionMm
          }
          curvePoints={
            result.curvePoints
          }
          locale={
            locale
          }
        />
      </div>

      <div className="space-y-3">
        {steps.map(
          (
            step,
            index,
          ) => (
            <article
              key={
                step.title
              }
              data-bending-worked-example-step={
                index +
                1
              }
              className="rounded-xl border border-border bg-background p-5"
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
    </section>
  );
}