"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import type {
  LearningCompletionEvent,
} from "@/domain/learning/completion";

import type {
  LearningActivity,
} from "@/domain/learning/types";

import {
  createActivityProgress,
  createActivityProgressIdentity,
  recordActivityProgressEvent,
} from "@/domain/progress";

import type {
  ActivityProgress,
  ProgressRepository,
} from "@/domain/progress";

import type {
  VersionString,
} from "@/domain/shared/types";

import {
  createDexieProgressRepository,
} from "@/infrastructure/persistence";

interface ActivityProgressBoundaryProps {
  readonly activity:
    LearningActivity;

  readonly moduleVersion:
    VersionString;

  readonly children:
    ReactNode;

  readonly repository?:
    ProgressRepository;
}

interface InternalProgressState {
  readonly progress:
    ActivityProgress;

  readonly localRevision:
    number;
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

function isBooleanEvidenceAlreadyRecorded(
  progress:
    ActivityProgress,

  event:
    LearningCompletionEvent,
): boolean {
  switch (
    event
  ) {
    case "opened":
      return progress
        .evidence
        .opened;

    case "reached_end":
      return progress
        .evidence
        .reachedEnd;

    case "prediction_submitted":
    case "meaningful_interaction":
    case "attempt_submitted":
    case "explicit_completion":
      return false;
  }
}

function readNonNegativeIntegerAttribute(
  element:
    Element | null,

  attribute:
    string,
): number | null {
  if (
    !element
  ) {
    return null;
  }

  const raw =
    element.getAttribute(
      attribute,
    );

  if (
    raw ===
      null ||
    raw.trim().length ===
      0
  ) {
    return null;
  }

  const parsed =
    Number(
      raw,
    );

  if (
    !Number.isInteger(
      parsed,
    ) ||
    parsed <
      0
  ) {
    return null;
  }

  return parsed;
}

export function ActivityProgressBoundary({
  activity,
  moduleVersion,
  children,
  repository,
}: ActivityProgressBoundaryProps) {
  const freshProgress =
    useMemo(
      () =>
        createActivityProgress(
          {
            moduleId:
              activity.moduleId,

            moduleVersion,

            activityId:
              activity.id,

            activityVersion:
              activity.version,
          },
        ),
      [
        activity.id,
        activity.moduleId,
        activity.version,
        moduleVersion,
      ],
    );

  const [
    state,
    setState,
  ] =
    useState<
      InternalProgressState
    >(
      () => ({
        progress:
          freshProgress,

        localRevision:
          0,
      }),
    );

  const [
    isHydrated,
    setIsHydrated,
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

  const boundaryRef =
    useRef<
      HTMLDivElement | null
    >(
      null,
    );

  const endSentinelRef =
    useRef<
      HTMLDivElement | null
    >(
      null,
    );

  const activeRepositoryRef =
    useRef<
      ProgressRepository | null
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

  const syncedPredictionCountRef =
    useRef(
      0,
    );

  const syncedAttemptCountRef =
    useRef(
      0,
    );

  const interactionBaselineRef =
    useRef(
      0,
    );

  const syncedInteractionTargetRef =
    useRef(
      0,
    );

  const identity =
    useMemo(
      () =>
        createActivityProgressIdentity(
          activity.moduleId,
          moduleVersion,
          activity.id,
          activity.version,
        ),
      [
        activity.id,
        activity.moduleId,
        activity.version,
        moduleVersion,
      ],
    );

  useEffect(
    () => {
      let cancelled =
        false;

      setIsHydrated(
        false,
      );

      setPersistenceError(
        null,
      );

      setState({
        progress:
          freshProgress,

        localRevision:
          0,
      });

      saveQueueRef.current =
        Promise.resolve();

      latestSaveRevisionRef.current =
        0;

      let activeRepository:
        ProgressRepository;

      try {
        if (
          repository
        ) {
          activeRepository =
            repository;
        } else {
          if (
            typeof globalThis
              .indexedDB ===
            "undefined"
          ) {
            throw new Error(
              "Activity progress persistence is unavailable because IndexedDB is not supported.",
            );
          }

          activeRepository =
            createDexieProgressRepository();
        }
      } catch (
        error
      ) {
        activeRepositoryRef.current =
          null;

        syncedPredictionCountRef.current =
          0;

        syncedAttemptCountRef.current =
          0;

        interactionBaselineRef.current =
          0;

        syncedInteractionTargetRef.current =
          0;

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

      activeRepositoryRef.current =
        activeRepository;

      void activeRepository
        .getActivityProgress(
          identity,
        )
        .then(
          (
            restored,
          ) => {
            if (
              cancelled
            ) {
              return;
            }

            const progress =
              restored ??
              freshProgress;

            syncedPredictionCountRef.current =
              progress
                .evidence
                .predictionSubmissions;

            syncedAttemptCountRef.current =
              progress
                .evidence
                .attemptsSubmitted;

            interactionBaselineRef.current =
              progress
                .evidence
                .meaningfulInteractions;

            syncedInteractionTargetRef.current =
              progress
                .evidence
                .meaningfulInteractions;

            setState({
              progress,

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

            activeRepositoryRef.current =
              null;

            syncedPredictionCountRef.current =
              0;

            syncedAttemptCountRef.current =
              0;

            interactionBaselineRef.current =
              0;

            syncedInteractionTargetRef.current =
              0;

            setState({
              progress:
                freshProgress,

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
      freshProgress,
      identity,
      repository,
    ],
  );

  useEffect(
    () => {
      if (
        !isHydrated ||
        state.localRevision ===
          0
      ) {
        return;
      }

      const activeRepository =
        activeRepositoryRef.current;

      if (
        !activeRepository
      ) {
        return;
      }

      const revision =
        state.localRevision;

      const progressToSave =
        state.progress;

      latestSaveRevisionRef.current =
        revision;

      const performSave =
        () =>
          activeRepository
            .saveActivityProgress(
              progressToSave,
            );

      const queued =
        saveQueueRef.current.then(
          performSave,
          performSave,
        );

      saveQueueRef.current =
        queued.catch(
          () =>
            undefined,
        );

      let cancelled =
        false;

      void queued.catch(
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
        },
      );

      return () => {
        cancelled =
          true;
      };
    },
    [
      isHydrated,
      state.localRevision,
      state.progress,
    ],
  );

  const recordEvent =
    useCallback(
      (
        event:
          LearningCompletionEvent,
      ): void => {
        if (
          !isHydrated
        ) {
          return;
        }

        setState(
          (
            current,
          ) => {
            if (
              isBooleanEvidenceAlreadyRecorded(
                current.progress,
                event,
              )
            ) {
              return current;
            }

            const next =
              recordActivityProgressEvent(
                current.progress,
                activity.completionRule,
                event,
                new Date()
                  .toISOString(),
              );

            return {
              progress:
                next,

              localRevision:
                current
                  .localRevision +
                1,
            };
          },
        );
      },
      [
        activity.completionRule,
        isHydrated,
      ],
    );

  useEffect(
    () => {
      if (
        !isHydrated
      ) {
        return;
      }

      recordEvent(
        "opened",
      );
    },
    [
      isHydrated,
      recordEvent,
    ],
  );

  useEffect(
    () => {
      if (
        !isHydrated
      ) {
        return;
      }

      const root =
        boundaryRef.current;

      if (
        !root
      ) {
        return;
      }

      function recordRepeatedEvent(
        event:
          LearningCompletionEvent,

        count:
          number,
      ): void {
        for (
          let index =
            0;
          index <
          count;
          index +=
            1
        ) {
          recordEvent(
            event,
          );
        }
      }

      /*
       * Pass the already-null-checked root explicitly.
       *
       * TypeScript does not preserve narrowing of a captured
       * nullable value inside a callback that may execute
       * later. The explicit HTMLDivElement parameter makes
       * the invariant clear.
       */
      function synchronize(
        rootElement:
          HTMLDivElement,
      ): void {
        switch (
          activity
            .completionRule
            .type
        ) {
          case "submitted_prediction": {
            const prediction =
              rootElement.querySelector(
                "[data-prediction-activity]",
              );

            const observedCount =
              readNonNegativeIntegerAttribute(
                prediction,
                "data-attempt-count",
              ) ??
              (
                prediction
                  ?.getAttribute(
                    "data-prediction-submitted",
                  ) ===
                "true"
                  ? 1
                  : 0
              );

            if (
              observedCount >
              syncedPredictionCountRef
                .current
            ) {
              const delta =
                observedCount -
                syncedPredictionCountRef
                  .current;

              syncedPredictionCountRef.current =
                observedCount;

              recordRepeatedEvent(
                "prediction_submitted",
                delta,
              );
            }

            break;
          }

          case "submitted_attempt": {
            const problem =
              rootElement.querySelector(
                "[data-attempt-count]",
              );

            const observedCount =
              readNonNegativeIntegerAttribute(
                problem,
                "data-attempt-count",
              ) ??
              (
                problem
                  ?.getAttribute(
                    "data-attempt-submitted",
                  ) ===
                "true"
                  ? 1
                  : 0
              );

            if (
              observedCount >
              syncedAttemptCountRef
                .current
            ) {
              const delta =
                observedCount -
                syncedAttemptCountRef
                  .current;

              syncedAttemptCountRef.current =
                observedCount;

              recordRepeatedEvent(
                "attempt_submitted",
                delta,
              );
            }

            break;
          }

          case "meaningful_interaction": {
            const interactive =
              rootElement.querySelector(
                "[data-meaningful-interaction]",
              );

            const hasInteraction =
              interactive
                ?.getAttribute(
                  "data-meaningful-interaction",
                ) ===
              "true";

            const localCount =
              readNonNegativeIntegerAttribute(
                interactive,
                "data-interaction-count",
              ) ??
              (
                hasInteraction
                  ? 1
                  : 0
              );

            const targetCount =
              interactionBaselineRef
                .current +
              localCount;

            if (
              targetCount >
              syncedInteractionTargetRef
                .current
            ) {
              const delta =
                targetCount -
                syncedInteractionTargetRef
                  .current;

              syncedInteractionTargetRef.current =
                targetCount;

              recordRepeatedEvent(
                "meaningful_interaction",
                delta,
              );
            }

            break;
          }

          case "opened":
          case "reached_end":
          case "explicit_completion":
            break;
        }
      }

      synchronize(
        root,
      );

      if (
        typeof MutationObserver ===
        "undefined"
      ) {
        return;
      }

      const observer =
        new MutationObserver(
          () =>
            synchronize(
              root,
            ),
        );

      observer.observe(
        root,
        {
          subtree:
            true,

          attributes:
            true,

          attributeFilter: [
            "data-prediction-submitted",
            "data-attempt-submitted",
            "data-attempt-count",
            "data-meaningful-interaction",
            "data-interaction-count",
          ],
        },
      );

      return () => {
        observer.disconnect();
      };
    },
    [
      activity
        .completionRule
        .type,
      isHydrated,
      recordEvent,
    ],
  );

  useEffect(
    () => {
      if (
        !isHydrated ||
        activity
          .completionRule
          .type !==
          "reached_end" ||
        state.progress
          .evidence
          .reachedEnd
      ) {
        return;
      }

      const sentinel =
        endSentinelRef.current;

      if (
        !sentinel ||
        typeof IntersectionObserver ===
          "undefined"
      ) {
        return;
      }

      const observer =
        new IntersectionObserver(
          (
            entries,
          ) => {
            if (
              entries.some(
                (
                  entry,
                ) =>
                  entry.isIntersecting,
              )
            ) {
              recordEvent(
                "reached_end",
              );

              observer.disconnect();
            }
          },
          {
            threshold:
              0.25,
          },
        );

      observer.observe(
        sentinel,
      );

      return () => {
        observer.disconnect();
      };
    },
    [
      activity
        .completionRule
        .type,
      isHydrated,
      recordEvent,
      state.progress
        .evidence
        .reachedEnd,
    ],
  );

  return (
    <div
      ref={
        boundaryRef
      }
      data-testid="activity-progress-boundary"
      data-activity-progress-id={
        activity.id
      }
      data-progress-hydrated={
        isHydrated
          ? "true"
          : "false"
      }
      data-progress-status={
        state.progress
          .status
      }
      data-progress-opened={
        state.progress
          .evidence
          .opened
          ? "true"
          : "false"
      }
      data-progress-completed={
        state.progress
          .status ===
          "completed"
          ? "true"
          : "false"
      }
      data-progress-persistence-error={
        persistenceError
          ? "true"
          : "false"
      }
    >
      {children}

      <div
        ref={
          endSentinelRef
        }
        data-activity-end-sentinel={
          activity.id
        }
        aria-hidden="true"
        className="h-px w-full"
      />
    </div>
  );
}