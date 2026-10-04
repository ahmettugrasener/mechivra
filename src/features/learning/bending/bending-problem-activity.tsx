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
  BendingProblemCriterionAnswer,
  BendingProblemDecisionFieldId,
  BendingProblemNumericFieldId,
  BendingProblemSubmission,
} from "@/domain/assessment/bending-problem";

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
  createBendingEngineeringProblemDefinition,
  createBendingEngineeringProblemResponse,
} from "@/features/learning/bending/bending-problem-adapter";

interface BendingProblemActivityProps {
  readonly locale:
    SupportedLocale;

  readonly repository?:
    ProgressRepository;
}

interface BendingUiEvaluation {
  readonly allCorrect:
    boolean;

  readonly numeric:
    Readonly<
      Record<
        BendingProblemNumericFieldId,
        boolean
      >
    >;

  readonly decisions:
    Readonly<
      Record<
        BendingProblemDecisionFieldId,
        boolean
      >
    >;
}

const EMPTY_NUMERIC_VALUES:
  Record<
    BendingProblemNumericFieldId,
    string
  > = {
    second_moment_area:
      "",

    maximum_moment:
      "",

    maximum_stress:
      "",

    maximum_deflection:
      "",
  };

const numericFields = [
  {
    id:
      "second_moment_area" as const,

    tr:
      "Alan atalet momenti I",

    en:
      "Second moment of area I",

    unit:
      "cm⁴",

    hintTr:
      "Dikdörtgen kesitte I = bh³/12. mm değerlerini tutarlı biçimde dönüştürmeyi unutma.",

    hintEn:
      "For a rectangular section, I = bh³/12. Remember to convert the mm dimensions consistently.",
  },

  {
    id:
      "maximum_moment" as const,

    tr:
      "Maksimum eğilme momenti",

    en:
      "Maximum bending moment",

    unit:
      "kN·m",

    hintTr:
      "Bu kirişte yük orta noktada. Önce Statik sonucunu düşün.",

    hintEn:
      "The load is at midspan. Start from the Statics result.",
  },

  {
    id:
      "maximum_stress" as const,

    tr:
      "Maksimum eğilme gerilmesi",

    en:
      "Maximum bending stress",

    unit:
      "MPa",

    hintTr:
      "|σ|max = |M|(h/2)/I bağıntısını kullan.",

    hintEn:
      "Use |σ|max = |M|(h/2)/I.",
  },

  {
    id:
      "maximum_deflection" as const,

    tr:
      "Maksimum sehim",

    en:
      "Maximum deflection",

    unit:
      "mm",

    hintTr:
      "Yük orta noktada olduğu için bu özel durumda PL³/(48EI) kullanılabilir.",

    hintEn:
      "Because the load is at midspan, PL³/(48EI) applies in this special case.",
  },
] as const;

const decisionFields = [
  {
    id:
      "stress_criterion" as const,

    tr:
      "20 MPa gerilme ölçütü",

    en:
      "20 MPa stress criterion",
  },

  {
    id:
      "deflection_criterion" as const,

    tr:
      "2 mm sehim ölçütü",

    en:
      "2 mm deflection criterion",
  },
] as const;

function parseNumericInput(
  value:
    string,

  locale:
    SupportedLocale,
):
  | number
  | undefined {
  if (
    value.trim().length ===
    0
  ) {
    return undefined;
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
    return undefined;
  }

  return parsed.value;
}

function formatRestoredNumericValue(
  value:
    number | undefined,

  locale:
    SupportedLocale,
): string {
  if (
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

function createUiEvaluation(
  result:
    AssessmentResult,
): BendingUiEvaluation {
  const resultById =
    new Map(
      result.items.map(
        (
          item,
        ) => [
          item.id,
          item.status,
        ],
      ),
    );

  return {
    allCorrect:
      result.correct,

    numeric: {
      second_moment_area:
        resultById.get(
          "second_moment_area",
        ) ===
        "correct",

      maximum_moment:
        resultById.get(
          "maximum_moment",
        ) ===
        "correct",

      maximum_stress:
        resultById.get(
          "maximum_stress",
        ) ===
        "correct",

      maximum_deflection:
        resultById.get(
          "maximum_deflection",
        ) ===
        "correct",
    },

    decisions: {
      stress_criterion:
        resultById.get(
          "stress_criterion",
        ) ===
        "correct",

      deflection_criterion:
        resultById.get(
          "deflection_criterion",
        ) ===
        "correct",
    },
  };
}

export function BendingProblemActivity({
  locale,
  repository,
}: BendingProblemActivityProps) {
  const engineeringDefinition =
    useMemo(
      () =>
        createBendingEngineeringProblemDefinition(),
      [],
    );

  const [
    numericValues,
    setNumericValues,
  ] =
    useState<
      Record<
        BendingProblemNumericFieldId,
        string
      >
    >(
      EMPTY_NUMERIC_VALUES,
    );

  const [
    decisionValues,
    setDecisionValues,
  ] =
    useState<
      Partial<
        Record<
          BendingProblemDecisionFieldId,
          BendingProblemCriterionAnswer
        >
      >
    >(
      {},
    );

  const [
    evaluation,
    setEvaluation,
  ] =
    useState<
      BendingUiEvaluation | null
    >(
      null,
    );

  const session =
    useAssessmentSession<
      BendingProblemSubmission
    >({
      activityId:
        "activity-bending-05",

      activityVersion:
        "1.0.0",

      assessmentId:
        "activity-bending-05-assessment",

      assessmentVersion:
        "1.0.0",

      persistence:
        "browser",

      repository,

      evaluate:
        (
          submission,
        ) =>
          evaluateEngineeringProblem(
            engineeringDefinition,

            createBendingEngineeringProblemResponse(
              submission,
            ),
          ).result,
    });

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
          "activity-bending-05",
          "1.0.0",
          "activity-bending-05-assessment",
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

      const response =
        responseAttempt
          ?.response;

      if (
        response
      ) {
        setNumericValues({
          second_moment_area:
            formatRestoredNumericValue(
              response.numeric
                .second_moment_area,

              locale,
            ),

          maximum_moment:
            formatRestoredNumericValue(
              response.numeric
                .maximum_moment,

              locale,
            ),

          maximum_stress:
            formatRestoredNumericValue(
              response.numeric
                .maximum_stress,

              locale,
            ),

          maximum_deflection:
            formatRestoredNumericValue(
              response.numeric
                .maximum_deflection,

              locale,
            ),
        });

        setDecisionValues(
          response.decisions,
        );
      } else {
        setNumericValues({
          ...EMPTY_NUMERIC_VALUES,
        });

        setDecisionValues(
          {},
        );
      }

      const latestAttempt =
        session.latestAttempt;

      if (
        latestAttempt.status ===
          "evaluated" &&
        latestAttempt.result !==
          null
      ) {
        setEvaluation(
          createUiEvaluation(
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
      locale,
      session.history
        .attempts,
      session.isHydrated,
      session.latestAttempt,
    ],
  );

  const solved =
    evaluation?.allCorrect ===
    true;

  const latestResult =
    session.latestAttempt
      .result;

  const attemptCount =
    session.summary
      .evaluatedAttemptCount;

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

  function updateNumericValue(
    fieldId:
      BendingProblemNumericFieldId,

    value:
      string,
  ): void {
    if (
      !session.isHydrated ||
      solved
    ) {
      return;
    }

    if (
      evaluation !==
      null
    ) {
      beginRevision();
    }

    setNumericValues(
      (
        current,
      ) => ({
        ...current,

        [fieldId]:
          value,
      }),
    );
  }

  function updateDecisionValue(
    fieldId:
      BendingProblemDecisionFieldId,

    value:
      BendingProblemCriterionAnswer,
  ): void {
    if (
      !session.isHydrated ||
      solved
    ) {
      return;
    }

    if (
      evaluation !==
      null
    ) {
      beginRevision();
    }

    setDecisionValues(
      (
        current,
      ) => ({
        ...current,

        [fieldId]:
          value,
      }),
    );
  }

  function submit():
    void {
    if (
      !session.canSubmit
    ) {
      return;
    }

    const numeric:
      BendingProblemSubmission["numeric"] =
      Object.fromEntries(
        numericFields.flatMap(
          (
            field,
          ) => {
            const parsed =
              parseNumericInput(
                numericValues[
                  field.id
                ],

                locale,
              );

            return parsed ===
              undefined
              ? []
              : [
                  [
                    field.id,
                    parsed,
                  ],
                ];
          },
        ),
      );

    const submission:
      BendingProblemSubmission =
      {
        numeric,

        decisions:
          decisionValues,
      };

    const engineeringEvaluation =
      evaluateEngineeringProblem(
        engineeringDefinition,

        createBendingEngineeringProblemResponse(
          submission,
        ),
      );

    setEvaluation(
      createUiEvaluation(
        engineeringEvaluation.result,
      ),
    );

    session.submit(
      submission,
    );
  }

  return (
    <section
      data-testid="bending-problem-activity"
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
        evaluation !==
        null
          ? "true"
          : "false"
      }
      data-attempt-correct={
        evaluation !==
        null &&
        solved
          ? "true"
          : "false"
      }
      data-attempt-count={
        attemptCount
      }
      className="mt-8 space-y-6"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          "L = 3 m",
          "P = 8 kN",
          "a = 1.5 m",
          "b = 80 mm",
          "h = 160 mm",
          "E = 70 GPa",
        ].map(
          (
            value,
          ) => (
            <div
              key={
                value
              }
              className="rounded-xl border border-border bg-surface-subtle p-3 text-center font-mono text-sm font-semibold text-foreground"
            >
              {
                value
              }
            </div>
          ),
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {numericFields.map(
          (
            field,
          ) => {
            const correct =
              evaluation?.numeric[
                field.id
              ];

            return (
              <label
                key={
                  field.id
                }
                className="rounded-xl border border-border bg-background p-4"
              >
                <span className="text-sm font-semibold text-foreground">
                  {locale ===
                  "tr"
                    ? field.tr
                    : field.en}
                </span>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    disabled={
                      !session.isHydrated ||
                      solved
                    }
                    aria-label={
                      locale ===
                      "tr"
                        ? field.tr
                        : field.en
                    }
                    value={
                      numericValues[
                        field.id
                      ]
                    }
                    onChange={(
                      event,
                    ) =>
                      updateNumericValue(
                        field.id,
                        event
                          .currentTarget
                          .value,
                      )
                    }
                    className="min-h-11 w-full rounded-lg border border-border bg-background px-3 font-mono text-foreground"
                  />

                  <span className="text-sm text-muted">
                    {
                      field.unit
                    }
                  </span>
                </div>

                {evaluation &&
                !correct ? (
                  <p className="mt-2 text-xs leading-5 text-warning">
                    {locale ===
                    "tr"
                      ? field.hintTr
                      : field.hintEn}
                  </p>
                ) : null}
              </label>
            );
          },
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {decisionFields.map(
          (
            field,
          ) => (
            <fieldset
              key={
                field.id
              }
              className="rounded-xl border border-border bg-background p-4"
            >
              <legend className="px-1 text-sm font-semibold text-foreground">
                {locale ===
                "tr"
                  ? field.tr
                  : field.en}
              </legend>

              <div className="mt-3 flex flex-wrap gap-3">
                {[
                  {
                    value:
                      "satisfied" as const,

                    tr:
                      "Sağlandı",

                    en:
                      "Satisfied",
                  },

                  {
                    value:
                      "not_satisfied" as const,

                    tr:
                      "Sağlanmadı",

                    en:
                      "Not satisfied",
                  },
                ].map(
                  (
                    option,
                  ) => (
                    <label
                      key={
                        option.value
                      }
                      className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-3"
                    >
                      <input
                        type="radio"
                        disabled={
                          !session.isHydrated ||
                          solved
                        }
                        name={
                          field.id
                        }
                        value={
                          option.value
                        }
                        checked={
                          decisionValues[
                            field.id
                          ] ===
                          option.value
                        }
                        onChange={() =>
                          updateDecisionValue(
                            field.id,
                            option.value,
                          )
                        }
                      />

                      <span className="text-sm text-muted-strong">
                        {locale ===
                        "tr"
                          ? option.tr
                          : option.en}
                      </span>
                    </label>
                  ),
                )}
              </div>

              {evaluation &&
              !evaluation
                .decisions[
                field.id
              ] ? (
                <p className="mt-2 text-xs leading-5 text-warning">
                  {locale ===
                  "tr"
                    ? "Bu ölçütü sayısal sonuçla ayrı olarak karşılaştır."
                    : "Compare this criterion separately with its numerical result."}
                </p>
              ) : null}
            </fieldset>
          ),
        )}
      </div>

      {evaluation ? (
        <div
          role="status"
          className={[
            "rounded-xl border p-4 text-sm leading-6",

            evaluation.allCorrect
              ? "border-success/30 bg-success/5"
              : "border-warning/30 bg-warning/5",
          ].join(
            " ",
          )}
        >
          {evaluation.allCorrect
            ? locale ===
              "tr"
              ? "Tüm hesaplar ve iki kriter doğru. Gerilme ölçütü sağlanırken sehim ölçütünün sağlanmadığını doğru ayırdın."
              : "All calculations and both criteria are correct. You correctly distinguished that the stress criterion is satisfied while the deflection criterion is not."
            : locale ===
              "tr"
              ? "Bazı sonuçlar henüz doğru değil. İpuçlarını kullanıp yalnız gerekli alanları yeniden değerlendir."
              : "Some results are not yet correct. Use the hints and reassess the required fields."}
        </div>
      ) : null}

      {latestResult &&
      evaluation ? (
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

      {evaluation ? (
        <AssessmentAttemptSummary
          summary={
            session.summary
          }
          locale={
            locale
          }
        />
      ) : null}

      {!solved ? (
        <button
          type="button"
          disabled={
            !session.canSubmit
          }
          onClick={
            submit
          }
          className="min-h-11 rounded-lg border border-brand bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {attemptCount ===
          0
            ? locale ===
              "tr"
              ? "Cevapları kontrol et"
              : "Check answers"
            : locale ===
              "tr"
              ? "Tekrar kontrol et"
              : "Check again"}
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
    </section>
  );
}