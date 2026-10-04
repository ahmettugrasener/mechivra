"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  evaluatePredictionAssessment,
} from "@/domain/assessment";

import type {
  PredictionAssessmentDefinition,
  PredictionAssessmentResponse,
} from "@/domain/assessment";

import type {
  PredictionDefinition,
} from "@/domain/learning/prediction";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import {
  AssessmentAttemptSummary,
  AssessmentFeedbackPanel,
  useAssessmentSession,
} from "@/features/learning/assessment";

type PredictionSubmissionMode =
  | "immediate"
  | "explicit";

interface PredictionActivityProps {
  readonly definition:
    PredictionDefinition;

  readonly locale:
    SupportedLocale;

  readonly submissionMode?:
    PredictionSubmissionMode;

  readonly testId?:
    string;
}

export function PredictionActivity({
  definition,
  locale,
  submissionMode = "immediate",
  testId,
}: PredictionActivityProps) {
  const [
    selectedOptionId,
    setSelectedOptionId,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const assessmentDefinition =
    useMemo<
      PredictionAssessmentDefinition
    >(
      () => ({
        id:
          `${definition.activityId}-assessment`,

        kind:
          "prediction",

        options:
          definition.options.map(
            (
              option,
            ) => ({
              id:
                option.id,
            }),
          ),

        correctOptionId:
          definition.correctOptionId,

        maxScore:
          1,
      }),
      [
        definition,
      ],
    );

  const session =
    useAssessmentSession<
      PredictionAssessmentResponse
    >({
      activityId:
        definition.activityId,

      activityVersion:
        "1.0.0",

      assessmentId:
        `${definition.activityId}-assessment`,

      assessmentVersion:
        "1.0.0",

      persistence:
        "browser",

      evaluate:
        (
          response,
        ) =>
          evaluatePredictionAssessment(
            assessmentDefinition,
            response,
          ).result,
    });

  /*
   * When an existing attempt history is restored from
   * IndexedDB, restore the option selection used by the
   * latest attempt as well.
   *
   * A newly-created revision has response=null and therefore
   * correctly restores an empty prediction selection.
   */
  useEffect(
    () => {
      if (
        !session.isHydrated
      ) {
        return;
      }

      const response =
        session.latestAttempt
          .response;

      setSelectedOptionId(
        response
          ?.selectedOptionId ??
          null,
      );
    },
    [
      session.isHydrated,
      session.latestAttempt
        .identity
        .attemptId,
      session.latestAttempt
        .response,
    ],
  );

  const latestResult =
    session.latestAttempt
      .result;

  const hasSubmitted =
    session.latestAttempt
      .status ===
      "evaluated" &&
    latestResult !==
      null;

  const isCorrect =
    latestResult?.correct ===
    true;

  const selectedOption =
    definition.options.find(
      (
        option,
      ) =>
        option.id ===
        selectedOptionId,
    );

  function submitPrediction(
    optionId:
      string,
  ): void {
    if (
      !session.canSubmit
    ) {
      return;
    }

    setSelectedOptionId(
      optionId,
    );

    session.submit({
      selectedOptionId:
        optionId,
    });
  }

  function selectPrediction(
    optionId:
      string,
  ): void {
    if (
      !session.isHydrated ||
      hasSubmitted
    ) {
      return;
    }

    if (
      submissionMode ===
      "immediate"
    ) {
      submitPrediction(
        optionId,
      );

      return;
    }

    setSelectedOptionId(
      optionId,
    );
  }

  function submitSelectedPrediction():
    void {
    if (
      submissionMode !==
        "explicit" ||
      selectedOptionId ===
        null ||
      !session.canSubmit
    ) {
      return;
    }

    session.submit({
      selectedOptionId,
    });
  }

  function revisePrediction():
    void {
    if (
      !session.canRevise ||
      isCorrect
    ) {
      return;
    }

    session.revise();

    setSelectedOptionId(
      null,
    );
  }

  return (
    <div
      data-testid={
        testId
      }
      data-prediction-activity={
        definition.activityId
      }
      data-assessment-hydrated={
        session.isHydrated
          ? "true"
          : "false"
      }
      data-prediction-submitted={
        hasSubmitted
          ? "true"
          : "false"
      }
      data-prediction-correct={
        hasSubmitted &&
        isCorrect
          ? "true"
          : "false"
      }
      data-attempt-count={
        session.summary
          .evaluatedAttemptCount
      }
      className="space-y-5"
    >
      <p className="max-w-3xl text-lg font-semibold leading-8 text-foreground">
        {
          definition.prompt[
            locale
          ]
        }
      </p>

      <div
        role="group"
        aria-label={
          definition.prompt[
            locale
          ]
        }
        className="grid gap-3"
      >
        {definition.options.map(
          (
            option,
            index,
          ) => {
            const isSelected =
              selectedOptionId ===
              option.id;

            return (
              <button
                key={
                  option.id
                }
                type="button"
                disabled={
                  !session.isHydrated ||
                  hasSubmitted
                }
                aria-pressed={
                  isSelected
                }
                onClick={() =>
                  selectPrediction(
                    option.id,
                  )
                }
                className={[
                  "flex w-full items-start gap-4 rounded-xl border px-4 py-4 text-left transition-colors",

                  isSelected
                    ? "border-brand bg-brand-soft text-foreground"
                    : "border-border-strong bg-surface hover:border-brand hover:bg-brand-soft",

                  hasSubmitted &&
                  !isSelected
                    ? "cursor-default opacity-60"
                    : "",
                ].join(
                  " ",
                )}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-current text-xs font-bold">
                  {String.fromCharCode(
                    65 +
                    index,
                  )}
                </span>

                <span className="leading-6">
                  {
                    option.label[
                      locale
                    ]
                  }
                </span>
              </button>
            );
          },
        )}
      </div>

      {submissionMode ===
        "explicit" &&
      !hasSubmitted ? (
        <button
          type="button"
          disabled={
            selectedOptionId ===
              null ||
            !session.canSubmit
          }
          onClick={
            submitSelectedPrediction
          }
          className="min-h-11 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {locale ===
          "tr"
            ? "Tahmini gönder"
            : "Submit prediction"}
        </button>
      ) : null}

      {hasSubmitted &&
      selectedOption ? (
        <div
          role="status"
          className={[
            "rounded-xl border p-4 text-sm leading-6",

            isCorrect
              ? "border-success/30 bg-success/5 text-muted-strong"
              : "border-warning/30 bg-warning/5 text-muted-strong",
          ].join(
            " ",
          )}
        >
          <p className="font-semibold text-foreground">
            {isCorrect
              ? locale ===
                "tr"
                ? "Tahmin doğru"
                : "Prediction correct"
              : locale ===
                "tr"
                ? "Tahmini yeniden düşün"
                : "Reconsider the prediction"}
          </p>

          <p className="mt-1">
            {
              selectedOption
                .feedback[
                locale
              ]
            }
          </p>
        </div>
      ) : null}

      {latestResult &&
      hasSubmitted ? (
        <AssessmentFeedbackPanel
          result={
            latestResult
          }
          locale={
            locale
          }
          showItemFeedback={
            false
          }
        />
      ) : null}

      {hasSubmitted ? (
        <AssessmentAttemptSummary
          summary={
            session.summary
          }
          locale={
            locale
          }
        />
      ) : null}

      {hasSubmitted &&
      !isCorrect &&
      session.canRevise ? (
        <button
          type="button"
          onClick={
            revisePrediction
          }
          className="min-h-11 rounded-lg border border-brand px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
        >
          {locale ===
          "tr"
            ? "Tahmini yeniden dene"
            : "Revise prediction"}
        </button>
      ) : null}

      {session.persistenceError ? (
        <p
          role="alert"
          className="text-sm text-warning"
        >
          {locale ===
          "tr"
            ? "İlerleme bu oturumda cihazda saklanamadı."
            : "Progress could not be stored on this device for this session."}
        </p>
      ) : null}
    </div>
  );
}