"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  evaluateEngineeringProblem,
  parseNumericAssessmentInput,
} from "@/domain/assessment";

import type {
  AssessmentResult,
} from "@/domain/assessment";

import type {
  BeamStaticsNumericProblemDefinition,
  NumericProblemSubmittedValues,
} from "@/domain/assessment/numeric-problem";

import type {
  ProgressRepository,
} from "@/domain/progress";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import {
  AssessmentAttemptSummary,
  AssessmentFeedbackPanel,
  useAssessmentSession,
} from "@/features/learning/assessment";

import {
  createBeamStaticsEngineeringProblemDefinition,
  createBeamStaticsEngineeringProblemResponse,
} from "@/features/learning/problems/beam-statics-problem-adapter";

interface BeamStaticsProblemActivityProps {
  readonly definition:
    BeamStaticsNumericProblemDefinition;

  readonly locale:
    SupportedLocale;

  readonly repository?:
    ProgressRepository;
}

type BeamStaticsProblemResponse =
  NumericProblemSubmittedValues;

type NumericFieldEvaluationStatus =
  | "missing"
  | "invalid"
  | "correct"
  | "incorrect";

interface NumericFieldEvaluation {
  readonly fieldId:
    string;

  readonly submittedValue:
    number | null;

  readonly status:
    NumericFieldEvaluationStatus;
}

interface NumericProblemUiEvaluation {
  readonly fields:
    readonly NumericFieldEvaluation[];

  readonly allAnswered:
    boolean;

  readonly allCorrect:
    boolean;
}

function parseNumericInput(
  value:
    string,

  locale:
    SupportedLocale,
): number | null {
  const trimmed =
    value.trim();

  /*
   * UI projection still distinguishes an empty field from
   * an invalid non-empty numeric value.
   */
  if (
    trimmed.length ===
    0
  ) {
    return null;
  }

  const parsed =
    parseNumericAssessmentInput(
      value,
      locale,
    );

  if (
    !parsed.valid ||
    parsed.value ===
      null
  ) {
    return Number.NaN;
  }

  return parsed.value;
}

function formatRestoredNumericValue(
  value:
    number | null | undefined,

  locale:
    SupportedLocale,
): string {
  if (
    value ===
      null ||
    value ===
      undefined ||
    !Number.isFinite(
      value,
    )
  ) {
    return "";
  }

  const machineValue =
    String(
      value,
    );

  return locale ===
    "tr"
    ? machineValue.replace(
        ".",
        ",",
      )
    : machineValue;
}

function getStatusClasses(
  status:
    NumericFieldEvaluationStatus | undefined,
): string {
  switch (
    status
  ) {
    case "correct":
      return "border-success/50 bg-success/5";

    case "incorrect":
    case "missing":
    case "invalid":
      return "border-warning/50 bg-warning/5";

    default:
      return "border-border bg-background";
  }
}

function createUiEvaluation(
  definition:
    BeamStaticsNumericProblemDefinition,

  submittedValues:
    BeamStaticsProblemResponse,

  result:
    AssessmentResult,
): NumericProblemUiEvaluation {
  const resultByFieldId =
    new Map(
      result.items.map(
        (
          item,
        ) => [
          item.id,
          item,
        ],
      ),
    );

  const fields =
    definition.fields.map(
      (
        field,
      ): NumericFieldEvaluation => {
        const submittedValue =
          submittedValues[
            field.id
          ];

        let status:
          NumericFieldEvaluationStatus;

        if (
          submittedValue ===
            null ||
          submittedValue ===
            undefined
        ) {
          status =
            "missing";
        } else if (
          !Number.isFinite(
            submittedValue,
          )
        ) {
          status =
            "invalid";
        } else {
          const coreStatus =
            resultByFieldId.get(
              field.id,
            )?.status;

          switch (
            coreStatus
          ) {
            case "correct":
              status =
                "correct";
              break;

            case "incorrect":
              status =
                "incorrect";
              break;

            default:
              status =
                "invalid";
              break;
          }
        }

        return {
          fieldId:
            field.id,

          submittedValue:
            submittedValue ??
            null,

          status,
        };
      },
    );

  return {
    fields,

    allAnswered:
      fields.every(
        (
          field,
        ) =>
          field.status !==
            "missing" &&
          field.status !==
            "invalid",
      ),

    allCorrect:
      result.correct,
  };
}

export function BeamStaticsProblemActivity({
  definition,
  locale,
  repository,
}: BeamStaticsProblemActivityProps) {
  const initialInputs =
    useMemo(
      () =>
        Object.fromEntries(
          definition.fields.map(
            (
              field,
            ) => [
              field.id,
              "",
            ],
          ),
        ) as Record<
          string,
          string
        >,
      [
        definition.fields,
      ],
    );

  const [
    inputs,
    setInputs,
  ] =
    useState<
      Record<
        string,
        string
      >
    >(
      initialInputs,
    );

  const [
    evaluation,
    setEvaluation,
  ] =
    useState<
      NumericProblemUiEvaluation | null
    >(
      null,
    );

  const engineeringDefinition =
    useMemo(
      () =>
        createBeamStaticsEngineeringProblemDefinition(
          definition,
        ),
      [
        definition,
      ],
    );

  const session =
    useAssessmentSession<
      BeamStaticsProblemResponse
    >({
      activityId:
        "activity-ssb-05",

      activityVersion:
        "1.0.0",

      assessmentId:
        "activity-ssb-05-assessment",

      assessmentVersion:
        "1.0.0",

      persistence:
        "browser",

      repository,

      evaluate:
        (
          response,
        ) =>
          evaluateEngineeringProblem(
            engineeringDefinition,

            createBeamStaticsEngineeringProblemResponse(
              definition,
              response,
            ),
          ).result,
    });

  /*
   * Rehydrate local UI state exactly once for each
   * assessment identity / locale mount.
   *
   * This guard is important: later session.revise() calls
   * must not overwrite the field the user has just edited.
   */
  const restoredSessionKeyRef =
    useRef<
      string | null
    >(
      null,
    );

  useEffect(
    () => {
      if (
        !session.isHydrated
      ) {
        return;
      }

      const restoreKey =
        [
          "activity-ssb-05",
          "1.0.0",
          "activity-ssb-05-assessment",
          "1.0.0",
          locale,
        ].join(
          ":",
        );

      if (
        restoredSessionKeyRef
          .current ===
        restoreKey
      ) {
        return;
      }

      restoredSessionKeyRef.current =
        restoreKey;

      /*
       * If the latest attempt is a draft revision its
       * response is intentionally null.
       *
       * In that case restore the most recent submitted
       * response as the editable starting point while
       * leaving evaluation hidden.
       */
      const responseAttempt =
        [
          ...session.history
            .attempts,
        ]
          .reverse()
          .find(
            (
              attempt,
            ) =>
              attempt.response !==
              null,
          );

      if (
        responseAttempt
          ?.response
      ) {
        setInputs(
          Object.fromEntries(
            definition.fields.map(
              (
                field,
              ) => [
                field.id,

                formatRestoredNumericValue(
                  responseAttempt
                    .response?.[
                    field.id
                  ],

                  locale,
                ),
              ],
            ),
          ) as Record<
            string,
            string
          >,
        );
      } else {
        setInputs(
          initialInputs,
        );
      }

      const latestAttempt =
        session.latestAttempt;

      if (
        latestAttempt.status ===
          "evaluated" &&
        latestAttempt.response !==
          null &&
        latestAttempt.result !==
          null
      ) {
        setEvaluation(
          createUiEvaluation(
            definition,
            latestAttempt.response,
            latestAttempt.result,
          ),
        );

        return;
      }

      setEvaluation(
        null,
      );
    },
    [
      definition,
      initialInputs,
      locale,
      session.history
        .attempts,
      session.isHydrated,
      session.latestAttempt,
    ],
  );

  const latestResult =
    session.latestAttempt
      .result;

  const isSolved =
    evaluation?.allCorrect ===
    true;

  function beginRevision():
    void {
    if (
      evaluation !==
        null &&
      session.canRevise
    ) {
      session.revise();
    }

    setEvaluation(
      null,
    );
  }

  function updateInput(
    fieldId:
      string,

    value:
      string,
  ): void {
    if (
      !session.isHydrated ||
      isSolved
    ) {
      return;
    }

    if (
      evaluation !==
      null
    ) {
      beginRevision();
    }

    setInputs(
      (
        current,
      ) => ({
        ...current,

        [fieldId]:
          value,
      }),
    );
  }

  function submitAttempt(
    event:
      React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    if (
      !session.canSubmit
    ) {
      return;
    }

    const submittedValues =
      Object.fromEntries(
        definition.fields.map(
          (
            field,
          ) => [
            field.id,

            parseNumericInput(
              inputs[
                field.id
              ] ?? "",

              locale,
            ),
          ],
        ),
      ) as BeamStaticsProblemResponse;

    const engineeringEvaluation =
      evaluateEngineeringProblem(
        engineeringDefinition,

        createBeamStaticsEngineeringProblemResponse(
          definition,
          submittedValues,
        ),
      );

    setEvaluation(
      createUiEvaluation(
        definition,
        submittedValues,
        engineeringEvaluation.result,
      ),
    );

    session.submit(
      submittedValues,
    );
  }

  const evaluationByField =
    new Map(
      evaluation?.fields.map(
        (
          field,
        ) => [
          field.fieldId,
          field,
        ],
      ) ?? [],
    );

  const attemptCount =
    session.summary
      .evaluatedAttemptCount;

  return (
    <section
      data-testid="beam-statics-problem-activity"
      data-assessment-hydrated={
        session.isHydrated
          ? "true"
          : "false"
      }
      data-assessment-persisting={
        session.isPersisting
          ? "true"
          : "false"
      }
      data-attempt-submitted={
        evaluation
          ? "true"
          : "false"
      }
      data-attempt-correct={
        evaluation
          ? evaluation.allCorrect
            ? "true"
            : "false"
          : "unknown"
      }
      data-attempt-count={
        attemptCount
      }
      className="mt-8 rounded-2xl border border-border bg-surface-subtle p-5 sm:p-6"
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {locale ===
          "tr"
            ? "Problem çalışma alanı"
            : "Problem workspace"}
        </p>

        <h3 className="mt-2 text-xl font-semibold text-foreground">
          {
            definition.title[
              locale
            ]
          }
        </h3>

        <p className="mt-2 max-w-3xl leading-7 text-muted-strong">
          {
            definition.instructions[
              locale
            ]
          }
        </p>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted">
            L
          </p>

          <p className="mt-1 font-mono text-lg font-semibold">
            {
              definition.input
                .spanM
            }{" "}
            m
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted">
            P
          </p>

          <p className="mt-1 font-mono text-lg font-semibold">
            {
              definition.input
                .pointLoadKN
            }{" "}
            kN
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted">
            a
          </p>

          <p className="mt-1 font-mono text-lg font-semibold">
            {
              definition.input
                .loadPositionM
            }{" "}
            m
          </p>
        </div>
      </div>

      <form
        onSubmit={
          submitAttempt
        }
        className="mt-7"
      >
        <h4 className="font-semibold text-foreground">
          {
            definition.ui
              .answersHeading[
              locale
            ]
          }
        </h4>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {definition.fields.map(
            (
              field,
            ) => {
              const fieldEvaluation =
                evaluationByField.get(
                  field.id,
                );

              const status =
                fieldEvaluation
                  ?.status;

              return (
                <label
                  key={
                    field.id
                  }
                  className={[
                    "rounded-xl border p-4 transition-colors",

                    getStatusClasses(
                      status,
                    ),
                  ].join(
                    " ",
                  )}
                >
                  <span className="text-sm font-medium text-foreground">
                    {
                      field.label[
                        locale
                      ]
                    }
                  </span>

                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      aria-label={
                        field.label[
                          locale
                        ]
                      }
                      value={
                        inputs[
                          field.id
                        ] ?? ""
                      }
                      disabled={
                        !session.isHydrated ||
                        isSolved
                      }
                      onChange={(
                        event,
                      ) =>
                        updateInput(
                          field.id,
                          event.target
                            .value,
                        )
                      }
                      className="min-h-11 min-w-0 flex-1 rounded-lg border border-border-strong bg-surface px-3 font-mono text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-focus/30 disabled:cursor-default disabled:opacity-70"
                    />

                    <span className="shrink-0 text-sm font-medium text-muted">
                      {
                        field.unitSymbol
                      }
                    </span>
                  </div>

                  {status ===
                  "correct" ? (
                    <p className="mt-2 text-sm font-medium text-success">
                      {
                        definition.ui
                          .correctLabel[
                          locale
                        ]
                      }
                    </p>
                  ) : null}

                  {status ===
                  "missing" ? (
                    <p className="mt-2 text-sm text-warning">
                      {
                        definition.ui
                          .missingLabel[
                          locale
                        ]
                      }
                    </p>
                  ) : null}

                  {status ===
                  "invalid" ? (
                    <p className="mt-2 text-sm text-warning">
                      {
                        definition.ui
                          .invalidLabel[
                          locale
                        ]
                      }
                    </p>
                  ) : null}

                  {status ===
                  "incorrect" ? (
                    <p className="mt-2 text-sm leading-6 text-warning">
                      {
                        field.hint[
                          locale
                        ]
                      }
                    </p>
                  ) : null}
                </label>
              );
            },
          )}
        </div>

        <div
          aria-live="polite"
          className="mt-5"
        >
          {evaluation ? (
            evaluation.allCorrect ? (
              <div
                role="status"
                className="rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-sm leading-6 text-foreground"
              >
                {
                  definition.ui
                    .successMessage[
                    locale
                  ]
                }
              </div>
            ) : (
              <div
                role="status"
                className="rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm leading-6 text-foreground"
              >
                {
                  definition.ui
                    .incorrectMessage[
                    locale
                  ]
                }
              </div>
            )
          ) : null}
        </div>

        {latestResult &&
        evaluation ? (
          <div className="mt-5">
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
          </div>
        ) : null}

        {evaluation ? (
          <div className="mt-5">
            <AssessmentAttemptSummary
              summary={
                session.summary
              }
              locale={
                locale
              }
            />
          </div>
        ) : null}

        {!isSolved ? (
          <button
            type="submit"
            disabled={
              !session.canSubmit
            }
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {attemptCount >
            0
              ? definition.ui
                  .retryLabel[
                  locale
                ]
              : definition.ui
                  .submitLabel[
                  locale
                ]}
          </button>
        ) : null}

        {session.persistenceError ? (
          <p
            role="alert"
            className="mt-4 text-sm text-warning"
          >
            {locale ===
            "tr"
              ? "İlerleme bu oturumda cihazda saklanamadı."
              : "Progress could not be stored on this device for this session."}
          </p>
        ) : null}
      </form>
    </section>
  );
}