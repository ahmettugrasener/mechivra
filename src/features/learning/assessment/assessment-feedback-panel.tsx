import {
  getAssessmentFeedbackEntry,
  getAssessmentFeedbackText,
} from "@/content/assessment-feedback";

import {
  createAssessmentFeedbackPlan,
} from "@/domain/assessment";

import type {
  AssessmentResult,
} from "@/domain/assessment";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

interface AssessmentFeedbackPanelProps {
  readonly result:
    AssessmentResult;

  readonly locale:
    SupportedLocale;

  readonly showItemFeedback?:
    boolean;
}

function toneClasses(
  tone:
    "success" |
    "guidance" |
    "warning" |
    "info",
): string {
  switch (
    tone
  ) {
    case "success":
      return "border-success/30 bg-success/5";

    case "warning":
      return "border-warning/30 bg-warning/5";

    case "guidance":
      return "border-brand/20 bg-brand-soft";

    case "info":
    default:
      return "border-border bg-surface-subtle";
  }
}

export function AssessmentFeedbackPanel({
  result,
  locale,
  showItemFeedback = true,
}: AssessmentFeedbackPanelProps) {
  const plan =
    createAssessmentFeedbackPlan(
      result,
      getAssessmentFeedbackEntry,
    );

  const summaryText =
    getAssessmentFeedbackText(
      plan.summary.code,
      locale,
    );

  if (
    !summaryText
  ) {
    throw new Error(
      `Missing localized assessment feedback for "${plan.summary.code}".`,
    );
  }

  return (
    <section
      data-testid="assessment-feedback-panel"
      data-feedback-code={
        plan.summary.code
      }
      data-feedback-reason={
        plan.summary.reason
      }
      data-feedback-tone={
        plan.summary.tone
      }
      className={[
        "rounded-xl border p-4",
        toneClasses(
          plan.summary.tone,
        ),
      ].join(
        " ",
      )}
    >
      <h3 className="font-semibold text-foreground">
        {
          summaryText.title
        }
      </h3>

      <p className="mt-1 text-sm leading-6 text-muted-strong">
        {
          summaryText.message
        }
      </p>

      {showItemFeedback &&
      plan.items.length >
        1 ? (
        <ul className="mt-4 space-y-2 border-t border-border/70 pt-4">
          {plan.items.map(
            (
              item,
            ) => {
              const text =
                getAssessmentFeedbackText(
                  item.feedback
                    .code,
                  locale,
                );

              if (
                !text
              ) {
                throw new Error(
                  `Missing localized assessment item feedback for "${item.feedback.code}".`,
                );
              }

              return (
                <li
                  key={
                    item.itemId
                  }
                  data-assessment-feedback-item={
                    item.itemId
                  }
                  data-feedback-code={
                    item.feedback
                      .code
                  }
                  className="text-sm leading-6 text-muted-strong"
                >
                  <strong className="text-foreground">
                    {
                      item.itemId
                    }
                    :
                  </strong>{" "}
                  {
                    text.message
                  }
                </li>
              );
            },
          )}
        </ul>
      ) : null}
    </section>
  );
}