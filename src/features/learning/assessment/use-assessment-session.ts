"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  appendAssessmentAttempt,
  createAssessmentAttempt,
  createAssessmentAttemptHistory,
  createAssessmentRevision,
  evaluateAssessmentAttempt,
  getLatestAssessmentAttempt,
  replaceLatestAssessmentAttempt,
  submitAssessmentAttempt,
  summarizeAssessmentAttemptHistory,
} from "@/domain/assessment";

import type {
  AssessmentAttemptHistory,
  AssessmentAttemptHistorySummary,
  AssessmentResult,
} from "@/domain/assessment";

import {
  createAssessmentHistoryIdentity,
} from "@/domain/progress";

import type {
  ProgressRepository,
} from "@/domain/progress";

import {
  createDexieProgressRepository,
} from "@/infrastructure/persistence";

export type AssessmentSessionPersistenceMode =
  | "none"
  | "browser";

export interface AssessmentSessionConfig<TResponse> {
  readonly activityId:
    string;

  readonly activityVersion:
    string;

  readonly assessmentId:
    string;

  readonly assessmentVersion:
    string;

  readonly evaluate:
    (
      response:
        TResponse,
    ) =>
      AssessmentResult;

  readonly createAttemptId?:
    (
      attemptNumber:
        number,
    ) =>
      string;

  readonly persistence?:
    AssessmentSessionPersistenceMode;

  readonly repository?:
    ProgressRepository;
}

export interface AssessmentSessionState<TResponse> {
  readonly history:
    AssessmentAttemptHistory<TResponse>;

  readonly summary:
    AssessmentAttemptHistorySummary;

  readonly latestAttempt:
    AssessmentAttemptHistory<TResponse>[
      "attempts"
    ][number];

  readonly isHydrated:
    boolean;

  readonly isPersisting:
    boolean;

  readonly isPersistenceEnabled:
    boolean;

  readonly persistenceError:
    string | null;

  readonly canSubmit:
    boolean;

  readonly canRevise:
    boolean;

  readonly submit:
    (
      response:
        TResponse,
    ) =>
      void;

  readonly revise:
    () =>
      void;
}

interface InternalAssessmentSessionState<TResponse> {
  readonly history:
    AssessmentAttemptHistory<TResponse>;

  readonly localRevision:
    number;
}

function defaultAttemptId(
  assessmentId:
    string,

  attemptNumber:
    number,
): string {
  return `${assessmentId}-attempt-${attemptNumber}`;
}

function errorMessage(
  value:
    unknown,
): string {
  if (
    value instanceof
    Error
  ) {
    return value.message;
  }

  return String(
    value,
  );
}

function createInitialHistory<TResponse>(
  config:
    Pick<
      AssessmentSessionConfig<TResponse>,
      | "activityId"
      | "activityVersion"
      | "assessmentId"
      | "assessmentVersion"
    >,

  createAttemptId:
    (
      attemptNumber:
        number,
    ) =>
      string,
): AssessmentAttemptHistory<TResponse> {
  const firstAttempt =
    createAssessmentAttempt<TResponse>(
      {
        attemptId:
          createAttemptId(
            1,
          ),

        activityId:
          config.activityId,

        activityVersion:
          config.activityVersion,

        assessmentId:
          config.assessmentId,

        assessmentVersion:
          config.assessmentVersion,

        attemptNumber:
          1,
      },
    );

  return createAssessmentAttemptHistory(
    firstAttempt,
  );
}

export function useAssessmentSession<TResponse>(
  config:
    AssessmentSessionConfig<TResponse>,
): AssessmentSessionState<TResponse> {
  const persistenceMode =
    config.persistence ??
    "none";

  const persistenceRequested =
    config.repository !==
      undefined ||
    persistenceMode ===
      "browser";

  const createAttemptId =
    useMemo(
      () =>
        config.createAttemptId ??
        (
          (
            attemptNumber:
              number,
          ) =>
            defaultAttemptId(
              config.assessmentId,
              attemptNumber,
            )
        ),
      [
        config.assessmentId,
        config.createAttemptId,
      ],
    );

  /*
   * TResponse burada explicit verilmelidir.
   *
   * createInitialHistory() parametrelerinden TResponse
   * infer edilemediği için aksi halde TypeScript unknown
   * üretir.
   */
  const freshHistory =
    useMemo<
      AssessmentAttemptHistory<TResponse>
    >(
      () =>
        createInitialHistory<TResponse>(
          {
            activityId:
              config.activityId,

            activityVersion:
              config.activityVersion,

            assessmentId:
              config.assessmentId,

            assessmentVersion:
              config.assessmentVersion,
          },

          createAttemptId,
        ),
      [
        config.activityId,
        config.activityVersion,
        config.assessmentId,
        config.assessmentVersion,
        createAttemptId,
      ],
    );

  const [
    sessionState,
    setSessionState,
  ] =
    useState<
      InternalAssessmentSessionState<TResponse>
    >(
      () => ({
        history:
          freshHistory,

        localRevision:
          0,
      }),
    );

  const [
    activeRepository,
    setActiveRepository,
  ] =
    useState<
      ProgressRepository | null
    >(
      null,
    );

  const [
    isHydrated,
    setIsHydrated,
  ] =
    useState(
      !persistenceRequested,
    );

  const [
    isPersisting,
    setIsPersisting,
  ] =
    useState(
      false,
    );

  const [
    persistenceError,
    setPersistenceError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const saveQueueRef =
    useRef<
      Promise<void>
    >(
      Promise.resolve(),
    );

  const latestSaveRevisionRef =
    useRef(
      0,
    );

  useEffect(
    () => {
      let cancelled =
        false;

      saveQueueRef.current =
        Promise.resolve();

      latestSaveRevisionRef.current =
        0;

      setSessionState({
        history:
          freshHistory,

        localRevision:
          0,
      });

      setPersistenceError(
        null,
      );

      setIsPersisting(
        false,
      );

      if (
        !persistenceRequested
      ) {
        setActiveRepository(
          null,
        );

        setIsHydrated(
          true,
        );

        return () => {
          cancelled =
            true;
        };
      }

      setIsHydrated(
        false,
      );

      let repository:
        ProgressRepository;

      try {
        if (
          config.repository
        ) {
          repository =
            config.repository;
        } else {
          if (
            typeof globalThis
              .indexedDB ===
            "undefined"
          ) {
            throw new Error(
              "Browser assessment persistence is unavailable because IndexedDB is not supported.",
            );
          }

          repository =
            createDexieProgressRepository();
        }
      } catch (
        error
      ) {
        setActiveRepository(
          null,
        );

        setPersistenceError(
          errorMessage(
            error,
          ),
        );

        setIsHydrated(
          true,
        );

        return () => {
          cancelled =
            true;
        };
      }

      setActiveRepository(
        repository,
      );

      const identity =
        createAssessmentHistoryIdentity(
          config.activityId,
          config.activityVersion,
          config.assessmentId,
          config.assessmentVersion,
        );

      void repository
        .getAssessmentAttemptHistory<TResponse>(
          identity,
        )
        .then(
          (
            restoredHistory,
          ) => {
            if (
              cancelled
            ) {
              return;
            }

            setSessionState({
              history:
                restoredHistory ??
                freshHistory,

              localRevision:
                0,
            });

            setIsHydrated(
              true,
            );
          },
        )
        .catch(
          (
            error,
          ) => {
            if (
              cancelled
            ) {
              return;
            }

            setActiveRepository(
              null,
            );

            setSessionState({
              history:
                freshHistory,

              localRevision:
                0,
            });

            setPersistenceError(
              errorMessage(
                error,
              ),
            );

            setIsHydrated(
              true,
            );
          },
        );

      return () => {
        cancelled =
          true;
      };
    },
    [
      config.activityId,
      config.activityVersion,
      config.assessmentId,
      config.assessmentVersion,
      config.repository,
      freshHistory,
      persistenceRequested,
    ],
  );

  useEffect(
    () => {
      if (
        !activeRepository ||
        !isHydrated ||
        sessionState.localRevision ===
          0
      ) {
        return;
      }

      const revision =
        sessionState.localRevision;

      const historyToSave:
        AssessmentAttemptHistory<TResponse> =
        sessionState.history;

      latestSaveRevisionRef.current =
        revision;

      setIsPersisting(
        true,
      );

      setPersistenceError(
        null,
      );

      const performSave =
        () =>
          activeRepository
            .saveAssessmentAttemptHistory<TResponse>(
              historyToSave,
            );

      const queuedSave =
        saveQueueRef.current.then(
          performSave,
          performSave,
        );

      saveQueueRef.current =
        queuedSave.catch(
          () =>
            undefined,
        );

      let cancelled =
        false;

      void queuedSave
        .then(
          () => {
            if (
              cancelled ||
              latestSaveRevisionRef
                .current !==
                revision
            ) {
              return;
            }

            setIsPersisting(
              false,
            );
          },
        )
        .catch(
          (
            error,
          ) => {
            if (
              cancelled ||
              latestSaveRevisionRef
                .current !==
                revision
            ) {
              return;
            }

            setPersistenceError(
              errorMessage(
                error,
              ),
            );

            setIsPersisting(
              false,
            );
          },
        );

      return () => {
        cancelled =
          true;
      };
    },
    [
      activeRepository,
      isHydrated,
      sessionState.history,
      sessionState.localRevision,
    ],
  );

  const history:
    AssessmentAttemptHistory<TResponse> =
    sessionState.history;

  const latestAttempt =
    getLatestAssessmentAttempt(
      history,
    );

  const summary =
    useMemo(
      () =>
        summarizeAssessmentAttemptHistory(
          history,
        ),
      [
        history,
      ],
    );

  function submit(
    response:
      TResponse,
  ): void {
    if (
      !isHydrated
    ) {
      return;
    }

    setSessionState(
      (
        currentState,
      ) => {
        const currentAttempt =
          getLatestAssessmentAttempt(
            currentState.history,
          );

        if (
          currentAttempt.status !==
          "draft"
        ) {
          return currentState;
        }

        const submitted =
          submitAssessmentAttempt(
            currentAttempt,
            response,
          );

        const submittedHistory =
          replaceLatestAssessmentAttempt(
            currentState.history,
            submitted,
          );

        const result =
          config.evaluate(
            response,
          );

        const evaluated =
          evaluateAssessmentAttempt(
            submitted,
            result,
          );

        const evaluatedHistory =
          replaceLatestAssessmentAttempt(
            submittedHistory,
            evaluated,
          );

        return {
          history:
            evaluatedHistory,

          localRevision:
            currentState
              .localRevision +
            1,
        };
      },
    );
  }

  function revise():
    void {
    if (
      !isHydrated
    ) {
      return;
    }

    setSessionState(
      (
        currentState,
      ) => {
        const currentAttempt =
          getLatestAssessmentAttempt(
            currentState.history,
          );

        if (
          currentAttempt.status !==
          "evaluated"
        ) {
          return currentState;
        }

        const nextAttemptNumber =
          currentAttempt
            .attemptNumber +
          1;

        const revision =
          createAssessmentRevision(
            currentAttempt,
            {
              attemptId:
                createAttemptId(
                  nextAttemptNumber,
                ),
            },
          );

        return {
          history:
            appendAssessmentAttempt(
              currentState.history,
              revision,
            ),

          localRevision:
            currentState
              .localRevision +
            1,
        };
      },
    );
  }

  return {
    history,

    summary,

    latestAttempt,

    isHydrated,

    isPersisting,

    isPersistenceEnabled:
      activeRepository !==
      null,

    persistenceError,

    canSubmit:
      isHydrated &&
      latestAttempt.status ===
        "draft",

    canRevise:
      isHydrated &&
      latestAttempt.status ===
        "evaluated",

    submit,

    revise,
  };
}