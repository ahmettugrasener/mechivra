"use client";

import {
  useState,
} from "react";

import type {
  ProgressRepository,
} from "@/domain/progress";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import {
  createDexieProgressRepository,
} from "@/infrastructure/persistence";

interface ProgressDataSettingsProps {
  readonly locale:
    SupportedLocale;

  readonly repository?:
    ProgressRepository;
}

type ResetState =
  | "idle"
  | "confirming"
  | "resetting"
  | "success"
  | "error";

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

export function ProgressDataSettings({
  locale,
  repository,
}: ProgressDataSettingsProps) {
  const [
    state,
    setState,
  ] =
    useState<
      ResetState
    >(
      "idle",
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  function beginReset():
    void {
    setError(
      null,
    );

    setState(
      "confirming",
    );
  }

  function cancelReset():
    void {
    setError(
      null,
    );

    setState(
      "idle",
    );
  }

  async function confirmReset():
    Promise<void> {
    setError(
      null,
    );

    setState(
      "resetting",
    );

    try {
      const activeRepository =
        repository ??
        createDexieProgressRepository();

      await activeRepository
        .clearAllProgress();

      /*
       * Other mounted client surfaces can optionally listen
       * for this event in later phases.
       */
      if (
        typeof window !==
        "undefined"
      ) {
        window.dispatchEvent(
          new CustomEvent(
            "mechivra:progress-reset",
          ),
        );
      }

      setState(
        "success",
      );
    } catch (
      caughtError
    ) {
      setError(
        errorMessage(
          caughtError,
        ),
      );

      setState(
        "error",
      );
    }
  }

  return (
    <section
      data-testid="progress-data-settings"
      data-reset-state={
        state
      }
      className="mt-8 rounded-2xl border border-border bg-background p-5 sm:p-6"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {locale ===
          "tr"
            ? "Yerel öğrenme verisi"
            : "Local learning data"}
        </p>

        <h2 className="mt-2 text-xl font-semibold text-foreground">
          {locale ===
          "tr"
            ? "İlerleme verilerini sıfırla"
            : "Reset progress data"}
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-strong">
          {locale ===
          "tr"
            ? "Bu işlem bu tarayıcıda saklanan aktivite ilerlemesini ve değerlendirme deneme geçmişini siler. Ders içeriği veya uygulama ayarları silinmez."
            : "This removes activity progress and assessment attempt history stored in this browser. Course content and application settings are not removed."}
        </p>

        <p className="mt-2 text-xs leading-5 text-muted">
          {locale ===
          "tr"
            ? "Mechivra MVP yerel-first çalışır; şu anda bu verilerin bulut kopyası yoktur."
            : "Mechivra MVP is local-first; these records currently have no cloud copy."}
        </p>
      </div>

      {state ===
        "idle" ||
      state ===
        "success" ||
      state ===
        "error" ? (
        <div className="mt-5">
          <button
            type="button"
            onClick={
              beginReset
            }
            className="min-h-11 rounded-lg border border-warning/50 px-4 py-2.5 text-sm font-semibold text-warning transition-colors hover:bg-warning/5"
          >
            {locale ===
            "tr"
              ? "İlerlemeyi sıfırla"
              : "Reset progress"}
          </button>
        </div>
      ) : null}

      {state ===
      "confirming" ? (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-warning/30 bg-warning/5 p-4"
        >
          <p className="font-semibold text-foreground">
            {locale ===
            "tr"
              ? "Tüm yerel ilerleme silinsin mi?"
              : "Delete all local progress?"}
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-strong">
            {locale ===
            "tr"
              ? "Bu işlem geri alınamaz. Tamamlanan aktiviteler ve bütün assessment denemeleri yeniden başlatılır."
              : "This cannot be undone. Completed activities and all assessment attempts will start over."}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                void confirmReset();
              }}
              className="min-h-11 rounded-lg bg-warning px-4 py-2.5 text-sm font-semibold text-white"
            >
              {locale ===
              "tr"
                ? "Evet, tümünü sil"
                : "Yes, delete all"}
            </button>

            <button
              type="button"
              onClick={
                cancelReset
              }
              className="min-h-11 rounded-lg border border-border-strong px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-surface-subtle"
            >
              {locale ===
              "tr"
                ? "Vazgeç"
                : "Cancel"}
            </button>
          </div>
        </div>
      ) : null}

      {state ===
      "resetting" ? (
        <p
          role="status"
          className="mt-5 text-sm text-muted-strong"
        >
          {locale ===
          "tr"
            ? "Yerel ilerleme siliniyor…"
            : "Clearing local progress…"}
        </p>
      ) : null}

      {state ===
      "success" ? (
        <div
          role="status"
          className="mt-5 rounded-xl border border-success/30 bg-success/5 p-4 text-sm text-muted-strong"
        >
          {locale ===
          "tr"
            ? "Yerel ilerleme ve değerlendirme geçmişi silindi."
            : "Local progress and assessment history were cleared."}
        </div>
      ) : null}

      {state ===
      "error" ? (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-warning/30 bg-warning/5 p-4"
        >
          <p className="text-sm font-semibold text-foreground">
            {locale ===
            "tr"
              ? "İlerleme verileri silinemedi."
              : "Progress data could not be cleared."}
          </p>

          {error ? (
            <p className="mt-2 text-xs text-muted">
              {
                error
              }
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}