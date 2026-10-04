"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  evaluateEngineeringProblem,
  parseNumericAssessmentInput,
} from "@/domain/assessment";

import type {
  AssessmentResult,
} from "@/domain/assessment";

import type {
  OttoProblemAnswer,
} from "@/domain/assessment/otto-problem";

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
  createOttoEngineeringProblemDefinition,
  createOttoEngineeringProblemResponse,
} from "@/features/learning/otto/otto-problem-adapter";

interface OttoProblemActivityProps {
  readonly locale:
    SupportedLocale;

  readonly repository?:
    ProgressRepository;
}

interface RawAnswers {
  readonly state2TemperatureK:
    string;

  readonly state2PressureKPa:
    string;

  readonly state2SpecificVolumeM3PerKg:
    string;

  readonly state3TemperatureK:
    string;

  readonly state3PressureKPa:
    string;

  readonly state4TemperatureK:
    string;

  readonly state4PressureKPa:
    string;

  readonly heatRejectedKJPerKg:
    string;

  readonly netWorkKJPerKg:
    string;

  readonly thermalEfficiencyPercent:
    string;
}

const EMPTY_ANSWERS:
  RawAnswers = {
    state2TemperatureK:
      "",

    state2PressureKPa:
      "",

    state2SpecificVolumeM3PerKg:
      "",

    state3TemperatureK:
      "",

    state3PressureKPa:
      "",

    state4TemperatureK:
      "",

    state4PressureKPa:
      "",

    heatRejectedKJPerKg:
      "",

    netWorkKJPerKg:
      "",

    thermalEfficiencyPercent:
      "",
  };

function parseLocalizedNumber(
  raw:
    string,

  locale:
    SupportedLocale,
): number {
  const parsed =
    parseNumericAssessmentInput(
      raw,
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

function parseAnswers(
  answers:
    RawAnswers,

  locale:
    SupportedLocale,
): OttoProblemAnswer {
  return {
    state2TemperatureK:
      parseLocalizedNumber(
        answers
          .state2TemperatureK,
        locale,
      ),

    state2PressureKPa:
      parseLocalizedNumber(
        answers
          .state2PressureKPa,
        locale,
      ),

    state2SpecificVolumeM3PerKg:
      parseLocalizedNumber(
        answers
          .state2SpecificVolumeM3PerKg,
        locale,
      ),

    state3TemperatureK:
      parseLocalizedNumber(
        answers
          .state3TemperatureK,
        locale,
      ),

    state3PressureKPa:
      parseLocalizedNumber(
        answers
          .state3PressureKPa,
        locale,
      ),

    state4TemperatureK:
      parseLocalizedNumber(
        answers
          .state4TemperatureK,
        locale,
      ),

    state4PressureKPa:
      parseLocalizedNumber(
        answers
          .state4PressureKPa,
        locale,
      ),

    heatRejectedKJPerKg:
      parseLocalizedNumber(
        answers
          .heatRejectedKJPerKg,
        locale,
      ),

    netWorkKJPerKg:
      parseLocalizedNumber(
        answers
          .netWorkKJPerKg,
        locale,
      ),

    thermalEfficiencyPercent:
      parseLocalizedNumber(
        answers
          .thermalEfficiencyPercent,
        locale,
      ),
  };
}

function formatRestoredNumber(
  value:
    number,

  locale:
    SupportedLocale,
): string {
  if (
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

function responseToRawAnswers(
  response:
    OttoProblemAnswer,

  locale:
    SupportedLocale,
): RawAnswers {
  return {
    state2TemperatureK:
      formatRestoredNumber(
        response
          .state2TemperatureK,
        locale,
      ),

    state2PressureKPa:
      formatRestoredNumber(
        response
          .state2PressureKPa,
        locale,
      ),

    state2SpecificVolumeM3PerKg:
      formatRestoredNumber(
        response
          .state2SpecificVolumeM3PerKg,
        locale,
      ),

    state3TemperatureK:
      formatRestoredNumber(
        response
          .state3TemperatureK,
        locale,
      ),

    state3PressureKPa:
      formatRestoredNumber(
        response
          .state3PressureKPa,
        locale,
      ),

    state4TemperatureK:
      formatRestoredNumber(
        response
          .state4TemperatureK,
        locale,
      ),

    state4PressureKPa:
      formatRestoredNumber(
        response
          .state4PressureKPa,
        locale,
      ),

    heatRejectedKJPerKg:
      formatRestoredNumber(
        response
          .heatRejectedKJPerKg,
        locale,
      ),

    netWorkKJPerKg:
      formatRestoredNumber(
        response
          .netWorkKJPerKg,
        locale,
      ),

    thermalEfficiencyPercent:
      formatRestoredNumber(
        response
          .thermalEfficiencyPercent,
        locale,
      ),
  };
}

export function OttoProblemActivity({
  locale,
  repository,
}: OttoProblemActivityProps) {
  const engineeringDefinition =
    useMemo(
      () =>
        createOttoEngineeringProblemDefinition(),
      [],
    );

  const [
    answers,
    setAnswers,
  ] =
    useState<
      RawAnswers
    >(
      EMPTY_ANSWERS,
    );

  const [
    evaluation,
    setEvaluation,
  ] =
    useState<
      AssessmentResult | null
    >(
      null,
    );

  const session =
    useAssessmentSession<
      OttoProblemAnswer
    >({
      activityId:
        "activity-otto-05",

      activityVersion:
        "1.0.0",

      assessmentId:
        "activity-otto-05-assessment",

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

            createOttoEngineeringProblemResponse(
              response,
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
          "activity-otto-05",
          "1.0.0",
          "activity-otto-05-assessment",
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
       * For a draft revision, preserve the most recent
       * submitted values as the editable starting point.
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
        setAnswers(
          responseToRawAnswers(
            responseAttempt.response,
            locale,
          ),
        );
      } else {
        setAnswers({
          ...EMPTY_ANSWERS,
        });
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
          latestAttempt.result,
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

  const submitted =
    evaluation !==
    null;

  const correct =
    evaluation?.correct ===
    true;

  const latestResult =
    session.latestAttempt
      .result;

  const attemptCount =
    session.summary
      .evaluatedAttemptCount;

  function updateAnswer(
    key:
      keyof RawAnswers,

    value:
      string,
  ): void {
    if (
      !session.isHydrated ||
      correct
    ) {
      return;
    }

    if (
      evaluation !==
        null &&
      session.canRevise
    ) {
      session.revise();
    }

    setAnswers(
      (
        previous,
      ) => ({
        ...previous,

        [key]:
          value,
      }),
    );

    setEvaluation(
      null,
    );
  }

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    if (
      !session.canSubmit
    ) {
      return;
    }

    const parsedAnswers =
      parseAnswers(
        answers,
        locale,
      );

    const engineeringEvaluation =
      evaluateEngineeringProblem(
        engineeringDefinition,

        createOttoEngineeringProblemResponse(
          parsedAnswers,
        ),
      );

    setEvaluation(
      engineeringEvaluation.result,
    );

    session.submit(
      parsedAnswers,
    );
  }

  const fields = [
    {
      key:
        "state2TemperatureK",

      tr:
        "Durum 2 sıcaklığı T₂",

      en:
        "State-2 temperature T₂",

      unit:
        "K",
    },

    {
      key:
        "state2PressureKPa",

      tr:
        "Durum 2 basıncı p₂",

      en:
        "State-2 pressure p₂",

      unit:
        "kPa",
    },

    {
      key:
        "state2SpecificVolumeM3PerKg",

      tr:
        "Durum 2 özgül hacmi v₂",

      en:
        "State-2 specific volume v₂",

      unit:
        "m³/kg",
    },

    {
      key:
        "state3TemperatureK",

      tr:
        "Durum 3 sıcaklığı T₃",

      en:
        "State-3 temperature T₃",

      unit:
        "K",
    },

    {
      key:
        "state3PressureKPa",

      tr:
        "Durum 3 basıncı p₃",

      en:
        "State-3 pressure p₃",

      unit:
        "kPa",
    },

    {
      key:
        "state4TemperatureK",

      tr:
        "Durum 4 sıcaklığı T₄",

      en:
        "State-4 temperature T₄",

      unit:
        "K",
    },

    {
      key:
        "state4PressureKPa",

      tr:
        "Durum 4 basıncı p₄",

      en:
        "State-4 pressure p₄",

      unit:
        "kPa",
    },

    {
      key:
        "heatRejectedKJPerKg",

      tr:
        "Özgül ısı atımı qout",

      en:
        "Specific heat rejected qout",

      unit:
        "kJ/kg",
    },

    {
      key:
        "netWorkKJPerKg",

      tr:
        "Net özgül iş wnet",

      en:
        "Net specific work wnet",

      unit:
        "kJ/kg",
    },

    {
      key:
        "thermalEfficiencyPercent",

      tr:
        "İdeal ısıl verim η",

      en:
        "Ideal thermal efficiency η",

      unit:
        "%",
    },
  ] as const;

  return (
    <section
      data-testid="otto-problem-activity"
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
        submitted
          ? "true"
          : "false"
      }
      data-attempt-correct={
        submitted &&
        correct
          ? "true"
          : "false"
      }
      data-attempt-count={
        attemptCount
      }
      className="mt-8 space-y-6"
    >
      <div className="rounded-xl border border-border bg-surface-subtle p-4">
        <h3 className="font-semibold text-foreground">
          {locale ===
          "tr"
            ? "Verilenler"
            : "Given"}
        </h3>

        <p className="mt-2 font-mono text-sm leading-7 text-muted-strong">
          r = 6
          {" · "}
          T₁ = 320 K
          {" · "}
          p₁ = 120 kPa
          {" · "}
          qin = 600 kJ/kg
          {" · "}
          R = 287 J/(kg·K)
          {" · "}
          γ ={" "}
          {locale ===
          "tr"
            ? "1,4"
            : "1.4"}
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map(
            (
              field,
            ) => (
              <label
                key={
                  field.key
                }
                className="block rounded-xl border border-border bg-background p-4"
              >
                <span className="text-sm font-semibold text-foreground">
                  {
                    field[
                      locale
                    ]
                  }
                </span>

                <span className="mt-3 flex items-center gap-3">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={
                      answers[
                        field.key
                      ]
                    }
                    disabled={
                      !session.isHydrated ||
                      correct
                    }
                    onChange={
                      (
                        event,
                      ) =>
                        updateAnswer(
                          field.key,
                          event
                            .currentTarget
                            .value,
                        )
                    }
                    aria-label={
                      field[
                        locale
                      ]
                    }
                    className="min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-foreground disabled:cursor-default disabled:opacity-70"
                  />

                  <span className="whitespace-nowrap text-sm text-muted">
                    {
                      field.unit
                    }
                  </span>
                </span>
              </label>
            ),
          )}
        </div>

        {!correct ? (
          <button
            type="submit"
            disabled={
              !session.canSubmit
            }
            className="min-h-11 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
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
      </form>

      {submitted ? (
        <div
          role="status"
          className={[
            "rounded-xl border p-4 text-sm leading-6",

            correct
              ? "border-success/30 bg-success/5 text-muted-strong"
              : "border-warning/30 bg-warning/5 text-muted-strong",
          ].join(
            " ",
          )}
        >
          {correct
            ? locale ===
              "tr"
              ? "Tüm sonuçlar tolerans içinde doğru. Enerji dengesi ve verim ilişkilerini de son kez kontrol et: qin − qout = wnet ve η = wnet/qin."
              : "All results are correct within tolerance. Finish by checking the energy and efficiency relations: qin − qout = wnet and η = wnet/qin."
            : locale ===
              "tr"
              ? "En az bir sonuç tolerans dışında. Süreçleri sırayla çöz; sabit hacim adımlarında özgül hacmin değişmediğini ve enerji terimlerinin aynı kJ/kg temelinde olduğunu kontrol et."
              : "At least one result is outside tolerance. Solve the processes in sequence; check that specific volume remains constant on the constant-volume legs and that all energy terms use the same kJ/kg basis."}
        </div>
      ) : null}

      {latestResult &&
      submitted ? (
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

      {submitted ? (
        <AssessmentAttemptSummary
          summary={
            session.summary
          }
          locale={
            locale
          }
        />
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