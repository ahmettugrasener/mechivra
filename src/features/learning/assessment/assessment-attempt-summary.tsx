import type {
  AssessmentAttemptHistorySummary,
} from "@/domain/assessment";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

interface AssessmentAttemptSummaryProps {
  readonly summary:
    AssessmentAttemptHistorySummary;

  readonly locale:
    SupportedLocale;
}

function correctnessText(
  value:
    boolean | null,

  locale:
    SupportedLocale,
): string {
  if (
    value ===
    null
  ) {
    return locale ===
      "tr"
      ? "—"
      : "—";
  }

  if (
    value
  ) {
    return locale ===
      "tr"
      ? "doğru"
      : "correct";
  }

  return locale ===
    "tr"
    ? "yanlış"
    : "incorrect";
}

export function AssessmentAttemptSummary({
  summary,
  locale,
}: AssessmentAttemptSummaryProps) {
  return (
    <aside
      data-testid="assessment-attempt-summary"
      data-attempt-count={
        summary.attemptCount
      }
      data-has-correct-attempt={
        summary.hasCorrectAttempt
          ? "true"
          : "false"
      }
      className="rounded-xl border border-border bg-surface-subtle p-4"
    >
      <h3 className="text-sm font-semibold text-foreground">
        {locale ===
        "tr"
          ? "Deneme geçmişi"
          : "Attempt history"}
      </h3>

      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted">
            {locale ===
            "tr"
              ? "Deneme"
              : "Attempts"}
          </dt>

          <dd className="mt-1 font-semibold text-foreground">
            {
              summary.attemptCount
            }
          </dd>
        </div>

        <div>
          <dt className="text-muted">
            {locale ===
            "tr"
              ? "İlk sonuç"
              : "First result"}
          </dt>

          <dd className="mt-1 font-semibold text-foreground">
            {correctnessText(
              summary
                .firstAttemptCorrect,
              locale,
            )}
          </dd>
        </div>

        <div>
          <dt className="text-muted">
            {locale ===
            "tr"
              ? "Son sonuç"
              : "Latest result"}
          </dt>

          <dd className="mt-1 font-semibold text-foreground">
            {correctnessText(
              summary
                .latestAttemptCorrect,
              locale,
            )}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-5 text-muted">
        {locale ===
        "tr"
          ? "Bir soruyu daha sonraki denemede doğru çözmek önceki denemeyi silmez ve tek başına kavramın ustalaşıldığını göstermez."
          : "Solving a problem correctly on a later attempt does not erase earlier attempts and does not by itself establish mastery of the concept."}
      </p>
    </aside>
  );
}