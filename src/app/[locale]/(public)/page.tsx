import { useTranslations } from "next-intl";

import { ButtonLink } from "@/components/ui/button-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageContainer } from "@/components/ui/page-container";
import { Surface } from "@/components/ui/surface";

export default function HomePage() {
  const homeT =
    useTranslations("Home");

  const commonT =
    useTranslations("Common");

  const coursesT =
    useTranslations("Courses");

  const learningSteps = [
    {
      number: "01",
      title: homeT("learnTitle"),
      description: homeT(
        "learnDescription",
      ),
    },
    {
      number: "02",
      title: homeT(
        "experimentTitle",
      ),
      description: homeT(
        "experimentDescription",
      ),
    },
    {
      number: "03",
      title: homeT("solveTitle"),
      description: homeT(
        "solveDescription",
      ),
    },
  ] as const;

  return (
    <>
      <PageContainer className="py-20 sm:py-24 lg:py-28">
        <section className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Eyebrow>
              {homeT("eyebrow")}
            </Eyebrow>

            <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.04] tracking-[-0.05em] sm:text-6xl">
              {homeT(
                "sloganLine1",
              )}
              <br />

              <span className="text-brand">
                {homeT(
                  "sloganLine2",
                )}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-strong">
              {homeT("description")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/app">
                {commonT(
                  "startLearning",
                )}
              </ButtonLink>

              <ButtonLink
                href="/courses"
                variant="secondary"
              >
                {commonT(
                  "exploreCourses",
                )}
              </ButtonLink>
            </div>

            <p className="mt-5 text-sm text-muted">
              {homeT("mvp")}
            </p>
          </div>

          <Surface className="overflow-hidden">
            <div className="border-b border-border bg-surface-subtle px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    {homeT(
                      "workspace",
                    )}
                  </p>

                  <p className="mt-1 font-semibold">
                    {coursesT(
                      "simplySupportedBeam",
                    )}
                  </p>
                </div>

                <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                  {homeT(
                    "interactive",
                  )}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="rounded-xl border border-border bg-background p-6">
                <div className="flex min-h-52 items-center justify-center">
                  <div className="w-full max-w-lg">
                    <div className="flex justify-center">
                      <div className="text-brand">
                        ↓ 10 kN
                      </div>
                    </div>

                    <div className="mt-3 h-2 rounded-full bg-foreground" />

                    <div className="mt-2 flex justify-between text-xl">
                      <span>
                        ▲
                      </span>

                      <span>
                        ○
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-brand-soft p-3">
                        <p className="text-muted">
                          Rₐ
                        </p>

                        <p className="mt-1 font-semibold text-brand">
                          5.00 kN
                        </p>
                      </div>

                      <div className="rounded-lg bg-brand-soft p-3">
                        <p className="text-muted">
                          Rᵦ
                        </p>

                        <p className="mt-1 font-semibold text-brand">
                          5.00 kN
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-muted">
                {homeT(
                  "previewNote",
                )}
              </p>
            </div>
          </Surface>
        </section>
      </PageContainer>

      <section className="border-y border-border bg-surface">
        <PageContainer className="py-16">
          <Eyebrow>
            {homeT(
              "learningModel",
            )}
          </Eyebrow>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em]">
            {homeT(
              "learningModelHeading",
            )}
          </h2>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {learningSteps.map(
              (step) => (
                <div
                  key={step.number}
                  className="border-t-2 border-brand pt-5"
                >
                  <p className="text-xs font-semibold text-brand">
                    {
                      step.number
                    }
                  </p>

                  <h3 className="mt-3 text-xl font-semibold">
                    {
                      step.title
                    }
                  </h3>

                  <p className="mt-2 leading-7 text-muted-strong">
                    {
                      step.description
                    }
                  </p>
                </div>
              ),
            )}
          </div>
        </PageContainer>
      </section>
    </>
  );
}