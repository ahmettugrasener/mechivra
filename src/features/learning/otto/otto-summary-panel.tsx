import {
  OTTO_SUMMARY_ASSUMPTIONS,
  OTTO_SUMMARY_CAPABILITIES,
  OTTO_SUMMARY_INTERPRETATION_RULES,
  OTTO_SUMMARY_LIMITATIONS,
  OTTO_SUMMARY_SOURCES,
} from "@/content/otto-summary";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

interface OttoSummaryPanelProps {
  readonly locale:
    SupportedLocale;
}

interface SummaryListProps {
  readonly title:
    string;

  readonly items:
    readonly {
      readonly tr:
        string;

      readonly en:
        string;
    }[];

  readonly locale:
    SupportedLocale;
}

function SummaryList({
  title,
  items,
  locale,
}: SummaryListProps) {
  return (
    <section className="rounded-xl border border-border bg-background p-5">
      <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
        {title}
      </h3>

      <ul className="mt-4 space-y-3">
        {items.map(
          (
            item,
            index,
          ) => (
            <li
              key={
                `${title}-${index}`
              }
              className="flex gap-3 text-sm leading-6 text-muted-strong"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
              />

              <span>
                {
                  item[
                    locale
                  ]
                }
              </span>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}

export function OttoSummaryPanel({
  locale,
}: OttoSummaryPanelProps) {
  return (
    <section
      data-testid="otto-summary-panel"
      className="mt-10 space-y-6 border-t border-border pt-8"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {locale === "tr"
            ? "Modül özeti"
            : "Module summary"}
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground">
          {locale === "tr"
            ? "İdeal modeli doğru sınırlar içinde yorumla"
            : "Interpret the ideal model within its proper limits"}
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-muted-strong">
          {locale === "tr"
            ? "Bu modülün amacı yalnız çevrim denklemlerini çalıştırmak değil; hangi sonucun ideal modelden geldiğini ve hangi gerçek motor sorularının bu model tarafından cevaplanmadığını ayırt etmektir."
            : "The goal of this module is not only to run the cycle equations, but to distinguish which conclusions follow from the ideal model and which real-engine questions the model does not answer."}
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SummaryList
          title={
            locale === "tr"
              ? "Bu modülden sonra ne yapabilirsin?"
              : "What can you do after this module?"
          }
          items={
            OTTO_SUMMARY_CAPABILITIES
          }
          locale={
            locale
          }
        />

        <SummaryList
          title={
            locale === "tr"
              ? "Model varsayımları"
              : "Model assumptions"
          }
          items={
            OTTO_SUMMARY_ASSUMPTIONS
          }
          locale={
            locale
          }
        />

        <SummaryList
          title={
            locale === "tr"
              ? "Model sınırları"
              : "Model limitations"
          }
          items={
            OTTO_SUMMARY_LIMITATIONS
          }
          locale={
            locale
          }
        />

        <SummaryList
          title={
            locale === "tr"
              ? "Sonuçları yorumlarken"
              : "When interpreting results"
          }
          items={
            OTTO_SUMMARY_INTERPRETATION_RULES
          }
          locale={
            locale
          }
        />
      </div>

      <section className="rounded-xl border border-brand/20 bg-brand-soft p-5">
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
          {locale === "tr"
            ? "İdeal çevrim ≠ gerçek motor"
            : "Ideal cycle ≠ real engine"}
        </h3>

        <p className="mt-3 text-sm leading-6 text-muted-strong">
          {locale === "tr"
            ? "İdeal Otto çevriminde daha yüksek r değerinin daha yüksek ideal verim üretmesi; gerçek motorda aynı değişikliğin vuruntu, malzeme sıcaklığı, mekanik yükler, ısı transferi veya diğer gerçek sistem sınırları açısından uygun olduğunu göstermez."
            : "A higher r producing a higher ideal efficiency in the ideal Otto cycle does not show that the same change is acceptable in a real engine with respect to knock, material temperature, mechanical loading, heat transfer, or other real-system limits."}
        </p>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
            {locale === "tr"
              ? "Bilimsel izlenebilirlik"
              : "Scientific traceability"}
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-strong">
            {locale === "tr"
              ? "Bu modülün temel süreç ve verim ilişkileri aşağıdaki bilimsel referans kaydına bağlıdır. Kaynağı bilimsel referans olarak kullanmak, dış materyalin metin veya görsellerini üründe yeniden kullanma hakkı anlamına gelmez."
              : "The core process and efficiency relations in this module are linked to the scientific reference record below. Using a source as a scientific reference does not grant permission to reuse its external text or visual material in the product."}
          </p>
        </div>

        <div className="grid gap-4">
          {OTTO_SUMMARY_SOURCES.map(
            (
              source,
            ) => (
              <article
                key={
                  source.id
                }
                data-source-id={
                  source.id
                }
                className="rounded-xl border border-border bg-background p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand">
                  {locale === "tr"
                    ? "Temel kaynak"
                    : "Core source"}
                </p>

                <h4 className="mt-2 text-lg font-semibold text-foreground">
                  {
                    source.title
                  }
                </h4>

                <p className="mt-1 text-sm text-muted-strong">
                  {
                    source.organization
                  }
                </p>

                <p className="mt-3 text-sm leading-6 text-muted-strong">
                  {
                    source
                      .usageNote[
                      locale
                    ]
                  }
                </p>

                <p className="mt-3 text-xs leading-5 text-muted">
                  {locale === "tr"
                    ? "Hak durumu: Yalnız bilimsel referans; belirli dış materyalin yeniden kullanım hakları ayrıca incelenmelidir."
                    : "Rights status: Scientific reference only; reuse rights for specific external material must be reviewed separately."}
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface-subtle p-5">
        <h3 className="text-lg font-semibold text-foreground">
          {locale === "tr"
            ? "Modülü kapatmadan önce"
            : "Before leaving the module"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-strong">
          {locale === "tr"
            ? "Kendine şu üç soruyu sor: r değiştiğinde neden verim değişiyor? qin değiştiğinde neden aynı r ve γ için ideal verim değişmiyor? Bu ideal çevrimden gerçek bir motorun güvenliği veya performansı hakkında hangi sonuçları çıkaramam?"
            : "Ask yourself three questions: Why does efficiency change when r changes? Why does ideal efficiency remain unchanged when qin changes at fixed r and γ? Which conclusions about real-engine safety or performance cannot be drawn from this ideal cycle?"}
        </p>
      </section>
    </section>
  );
}