import {
  getSourcesByIds,
} from "@/content/source-access";

import {
  staticsSummaryDefinition,
} from "@/content/statics-summary";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

interface StaticsSummaryPanelProps {
  readonly locale:
    SupportedLocale;
}

export function StaticsSummaryPanel({
  locale,
}: StaticsSummaryPanelProps) {
  const sources =
    getSourcesByIds(
      staticsSummaryDefinition
        .sourceIds,
    );

  return (
    <section
      data-testid="statics-summary-panel"
      className="mt-10 space-y-8 border-t border-border pt-8"
    >
      <section>
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
          {locale === "tr"
            ? "Bu modülden sonra ne yapabilirsin?"
            : "What can you do after this module?"}
        </h3>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {staticsSummaryDefinition.capabilities.map(
            (
              capability,
              index,
            ) => (
              <div
                key={
                  capability.id
                }
                className="flex gap-3 rounded-xl border border-success/25 bg-success/5 p-4"
              >
                <span
                  aria-hidden="true"
                  className="grid size-7 shrink-0 place-items-center rounded-full bg-success text-sm font-bold text-white"
                >
                  ✓
                </span>

                <p className="text-sm leading-6 text-muted-strong">
                  {
                    capability.text[
                      locale
                    ]
                  }
                </p>

                <span
                  className="sr-only"
                >
                  {index + 1}
                </span>
              </div>
            ),
          )}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
          {locale === "tr"
            ? "Model varsayımları"
            : "Model assumptions"}
        </h3>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          {locale === "tr"
            ? "Aşağıdaki varsayımlar, bu modülde kullandığın Engineering Core modelinin geçerli olduğu fiziksel çerçeveyi tanımlar."
            : "The assumptions below define the physical framework in which the Engineering Core model used in this module is valid."}
        </p>

        <ul className="mt-4 space-y-3">
          {staticsSummaryDefinition.assumptions.map(
            (assumption) => (
              <li
                key={
                  assumption.id
                }
                className="flex gap-3 rounded-lg border border-border bg-surface-subtle px-4 py-3"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
                />

                <span className="text-sm leading-6 text-muted-strong">
                  {
                    assumption.text[
                      locale
                    ]
                  }
                </span>
              </li>
            ),
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-warning/30 bg-warning/5 p-5 sm:p-6">
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
          {locale === "tr"
            ? "Model sınırları"
            : "Model limitations"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-strong">
          {locale === "tr"
            ? "Bu sınırların dışındaki bir problemi çözmek için modeli genişletmek veya farklı bir mühendislik modeli kullanmak gerekir."
            : "Problems outside these limits require an extended or different engineering model."}
        </p>

        <ul className="mt-4 space-y-3">
          {staticsSummaryDefinition.limitations.map(
            (limitation) => (
              <li
                key={
                  limitation.id
                }
                className="flex gap-3"
              >
                <span
                  aria-hidden="true"
                  className="mt-1 font-bold text-warning"
                >
                  !
                </span>

                <span className="text-sm leading-6 text-muted-strong">
                  {
                    limitation.text[
                      locale
                    ]
                  }
                </span>
              </li>
            ),
          )}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
          {locale === "tr"
            ? "Bilimsel kaynak"
            : "Scientific source"}
        </h3>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          {locale === "tr"
            ? "Bu kaynak Mechivra'daki kavramsal açıklamalar ve mühendislik modelinin bilimsel referanslarından biridir."
            : "This source is one of the scientific references supporting the conceptual explanations and engineering model used in Mechivra."}
        </p>

        <div className="mt-4 space-y-3">
          {sources.map(
            (source) => {
              const year =
                "year" in
                  source
                  ? source.year
                  : undefined;

              return (
                <article
                  key={
                    source.id
                  }
                  data-source-id={
                    source.id
                  }
                  className="rounded-xl border border-border bg-background p-5"
                >
                  <p className="font-semibold text-foreground">
                    {
                      source.title
                    }
                  </p>

                  {source.authors.length >
                  0 ? (
                    <p className="mt-2 text-sm text-muted-strong">
                      {source.authors.join(
                        ", ",
                      )}
                    </p>
                  ) : null}

                  <p className="mt-1 text-sm text-muted">
                    {
                      source.organization
                    }
                    {typeof year ===
                    "number"
                      ? ` · ${year}`
                      : ""}
                  </p>

                  <p className="mt-3 text-xs leading-5 text-muted">
                    {locale === "tr"
                      ? "Kullanım: bilimsel referans, mühendislik modeli ve içerik referansı."
                      : "Usage: scientific reference, engineering-model reference, and content reference."}
                  </p>
                </article>
              );
            },
          )}
        </div>
      </section>

      <section className="rounded-xl border border-brand/25 bg-brand-soft p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-foreground">
          {locale === "tr"
            ? "Sıradaki bağlantı"
            : "Next connection"}
        </h3>

        <p className="mt-2 leading-7 text-muted-strong">
          {locale === "tr"
            ? "Statik sana yüklerin kiriş içinde hangi kesme kuvveti ve eğilme momentini oluşturduğunu gösterdi. Mukavemet — Eğilme modülünde aynı moment bilgisini kesit geometrisi, gerilme, elastisite modülü ve sehim ile ilişkilendireceksin."
            : "Statics showed how external loads create shear force and bending moment inside the beam. In Mechanics of Materials — Bending, you will connect that same moment information to section geometry, stress, elastic modulus, and deflection."}
        </p>
      </section>
    </section>
  );
}