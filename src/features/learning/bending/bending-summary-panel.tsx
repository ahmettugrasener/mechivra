import {
  bendingModuleSummary,
} from "@/content/bending-summary";

import type {
  LocalizedSummaryText,
} from "@/content/bending-summary";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

interface BendingSummaryPanelProps {
  readonly locale:
    SupportedLocale;
}

interface SummaryListProps {
  readonly items:
    readonly LocalizedSummaryText[];

  readonly locale:
    SupportedLocale;
}

function SummaryList({
  items,
  locale,
}: SummaryListProps) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map(
        (
          item,
          index,
        ) => (
          <li
            key={
              `${index}-${item.en}`
            }
            className="flex gap-3 text-sm leading-6 text-muted-strong"
          >
            <span
              aria-hidden="true"
              className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
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
  );
}

export function BendingSummaryPanel({
  locale,
}: BendingSummaryPanelProps) {
  const summary =
    bendingModuleSummary;

  return (
    <section
      data-testid="bending-summary-panel"
      className="mt-10 space-y-6 border-t border-border pt-8"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {locale === "tr"
            ? "Modül kapanışı"
            : "Module closure"}
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground">
          {locale === "tr"
            ? "Eğilme modelini doğru sınırlar içinde kullan"
            : "Use the bending model within its proper limits"}
        </h3>

        <p className="mt-2 max-w-3xl leading-7 text-muted-strong">
          {locale === "tr"
            ? "Bu modül yük, moment, kesit geometrisi, eğilme gerilmesi, rijitlik ve sehim arasındaki temel ilişkiyi kurar. Sonuçlar yalnız aşağıdaki varsayımlar ve sınırlar içinde yorumlanmalıdır."
            : "This module connects loading, bending moment, cross-section geometry, bending stress, stiffness, and deflection. Results must be interpreted only within the assumptions and limits listed below."}
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-background p-5">
          <h4 className="text-lg font-semibold text-foreground">
            {locale === "tr"
              ? "Bu modülden sonra ne yapabilirsin?"
              : "What can you do after this module?"}
          </h4>

          <SummaryList
            items={
              summary.capabilities
            }
            locale={
              locale
            }
          />
        </section>

        <section className="rounded-xl border border-border bg-background p-5">
          <h4 className="text-lg font-semibold text-foreground">
            {locale === "tr"
              ? "Model varsayımları"
              : "Model assumptions"}
          </h4>

          <SummaryList
            items={
              summary.assumptions
            }
            locale={
              locale
            }
          />
        </section>
      </div>

      <section className="rounded-xl border border-warning/30 bg-warning/5 p-5">
        <h4 className="text-lg font-semibold text-foreground">
          {locale === "tr"
            ? "Model sınırları"
            : "Model limitations"}
        </h4>

        <SummaryList
          items={
            summary.limitations
          }
          locale={
            locale
          }
        />
      </section>

      <section className="rounded-xl border border-brand/20 bg-brand-soft p-5">
        <h4 className="text-lg font-semibold text-foreground">
          {locale === "tr"
            ? "Sonuçları yorumlarken"
            : "When interpreting the results"}
        </h4>

        <SummaryList
          items={
            summary.interpretationRules
          }
          locale={
            locale
          }
        />
      </section>

      <section className="rounded-xl border border-border bg-background p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            {locale === "tr"
              ? "Bilimsel izlenebilirlik"
              : "Scientific traceability"}
          </p>

          <h4 className="mt-2 text-lg font-semibold text-foreground">
            {locale === "tr"
              ? "Bu modülde kullanılan temel kaynaklar"
              : "Core sources used in this module"}
          </h4>
        </div>

        <div className="mt-4 grid gap-4">
          {summary.sources.map(
            (
              source,
            ) => (
              <article
                key={
                  source.sourceId
                }
                data-source-id={
                  source.sourceId
                }
                className="rounded-lg border border-border bg-surface-subtle p-4"
              >
                <h5 className="font-semibold text-foreground">
                  {
                    source.title
                  }
                </h5>

                <p className="mt-1 text-sm text-muted-strong">
                  {source.authors.join(
                    ", ",
                  )}
                  {" · "}
                  {
                    source.organization
                  }
                  {" · "}
                  {
                    source.year
                  }
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-strong">
                  {
                    source.role[
                      locale
                    ]
                  }
                </p>

                <p className="mt-2 font-mono text-xs text-muted">
                  {
                    source.sourceId
                  }
                </p>
              </article>
            ),
          )}
        </div>

        <p className="mt-4 text-xs leading-5 text-muted">
          {locale === "tr"
            ? "Kaynaklar bilimsel referans amacıyla kayıtlıdır. Dış materyallerin metin, şekil veya diğer varlıklarının yeniden kullanım hakları ayrıca değerlendirilmelidir."
            : "The sources are recorded for scientific-reference purposes. Reuse rights for external text, figures, or other assets must be evaluated separately."}
        </p>
      </section>

      <section className="rounded-xl border border-border bg-surface-subtle p-5">
        <h4 className="font-semibold text-foreground">
          {locale === "tr"
            ? "Statik → Mukavemet bağlantısı"
            : "Statics → Mechanics of Materials connection"}
        </h4>

        <p className="mt-2 text-sm leading-6 text-muted-strong">
          {locale === "tr"
            ? "Bu modülde eğilme momenti ayrı bir fizik hesabıyla yeniden üretilmedi. Statik modülündeki doğrulanmış kiriş durumu ve moment sonucu, kesit ve malzeme bilgileri eklenerek Mukavemet hesabına taşındı."
            : "Bending moment was not regenerated through a separate physics calculation in this module. The verified beam state and moment result from Statics were carried into Mechanics of Materials and extended with section and material information."}
        </p>
      </section>
    </section>
  );
}