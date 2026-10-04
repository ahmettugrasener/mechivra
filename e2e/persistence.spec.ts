import {
  expect,
  test,
} from "@playwright/test";

import type {
  Page,
} from "@playwright/test";

const TURKISH_PREDICTION_URL =
  "/tr/app/learn/statics/simply-supported-beam/activity-ssb-03";

const ENGLISH_PREDICTION_URL =
  "/en/app/learn/statics/simply-supported-beam/activity-ssb-03";

async function clearIndexedDb(
  page:
    Page,
): Promise<void> {
  /*
   * First establish the application origin.
   *
   * IndexedDB cannot be manipulated from about:blank because
   * storage is origin-scoped.
   */
  await page.goto(
    "/tr/app",
  );

  await page.evaluate(
    async () => {
      await new Promise<
        void
      >(
        (
          resolve,
          reject,
        ) => {
          const request =
            indexedDB.deleteDatabase(
              "mechivra",
            );

          request.onsuccess =
            () => {
              resolve();
            };

          request.onerror =
            () => {
              reject(
                request.error ??
                  new Error(
                    "Could not delete the Mechivra IndexedDB database.",
                  ),
              );
            };

          request.onblocked =
            () => {
              reject(
                new Error(
                  "Deleting the Mechivra IndexedDB database was blocked.",
                ),
              );
            };
        },
      );
    },
  );
}

test.describe(
  "Mechivra persistence",
  () => {
    test.beforeEach(
      async ({
        page,
      }) => {
        await clearIndexedDb(
          page,
        );
      },
    );

    test(
      "persists assessment and activity progress across refresh and locale changes, then resets both",
      async ({
        page,
      }) => {
        await page.goto(
          TURKISH_PREDICTION_URL,
        );

        const progressBoundary =
          page.getByTestId(
            "activity-progress-boundary",
          );

        const prediction =
          page.locator(
            '[data-prediction-activity="activity-ssb-03"]',
          );

        await expect(
          progressBoundary,
        ).toHaveAttribute(
          "data-progress-hydrated",
          "true",
        );

        await expect(
          prediction,
        ).toHaveAttribute(
          "data-assessment-hydrated",
          "true",
        );

        await expect(
          prediction,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "false",
        );

        /*
         * Statics prediction's correct answer is option B.
         * Select the first option intentionally so this test
         * proves:
         *
         * completed != correct
         */
        await prediction
          .locator(
            "button",
          )
          .first()
          .click();

        await expect(
          prediction,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "true",
        );

        await expect(
          prediction,
        ).toHaveAttribute(
          "data-prediction-correct",
          "false",
        );

        await expect(
          prediction,
        ).toHaveAttribute(
          "data-attempt-count",
          "1",
        );

        /*
         * Although the answer is incorrect, the learning
         * completion rule is submitted_prediction.
         */
        await expect(
          progressBoundary,
        ).toHaveAttribute(
          "data-progress-completed",
          "true",
        );

        /*
         * Full browser reload destroys all React state.
         * Anything restored after this point must come from
         * durable browser persistence.
         */
        await page.reload();

        const restoredPrediction =
          page.locator(
            '[data-prediction-activity="activity-ssb-03"]',
          );

        const restoredBoundary =
          page.getByTestId(
            "activity-progress-boundary",
          );

        await expect(
          restoredPrediction,
        ).toHaveAttribute(
          "data-assessment-hydrated",
          "true",
        );

        await expect(
          restoredPrediction,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "true",
        );

        await expect(
          restoredPrediction,
        ).toHaveAttribute(
          "data-prediction-correct",
          "false",
        );

        await expect(
          restoredPrediction,
        ).toHaveAttribute(
          "data-attempt-count",
          "1",
        );

        await expect(
          restoredBoundary,
        ).toHaveAttribute(
          "data-progress-hydrated",
          "true",
        );

        await expect(
          restoredBoundary,
        ).toHaveAttribute(
          "data-progress-completed",
          "true",
        );

        /*
         * Locale is deliberately absent from progress and
         * assessment identities.
         */
        await page.goto(
          ENGLISH_PREDICTION_URL,
        );

        const englishPrediction =
          page.locator(
            '[data-prediction-activity="activity-ssb-03"]',
          );

        await expect(
          englishPrediction,
        ).toHaveAttribute(
          "data-assessment-hydrated",
          "true",
        );

        await expect(
          englishPrediction,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "true",
        );

        await expect(
          englishPrediction,
        ).toHaveAttribute(
          "data-prediction-correct",
          "false",
        );

        await expect(
          page.getByTestId(
            "activity-progress-boundary",
          ),
        ).toHaveAttribute(
          "data-progress-completed",
          "true",
        );

        /*
         * The independent Progress UI must derive the same
         * persisted state.
         */
        await page.goto(
          "/en/app/progress",
        );

        const overview =
          page.getByTestId(
            "progress-overview",
          );

        await expect(
          overview,
        ).toHaveAttribute(
          "data-progress-loading",
          "false",
        );

        await expect(
          overview,
        ).toHaveAttribute(
          "data-progress-error",
          "false",
        );

        await expect(
          page.getByTestId(
            "overall-progress-count",
          ),
        ).toHaveText(
          "1/18",
        );

        const staticsCard =
          page.getByTestId(
            "module-progress-module-simply-supported-beam",
          );

        await expect(
          staticsCard,
        ).toHaveAttribute(
          "data-module-progress-status",
          "in_progress",
        );

        await expect(
          staticsCard,
        ).toHaveAttribute(
          "data-module-progress-completed",
          "1",
        );

        await expect(
          staticsCard,
        ).toHaveAttribute(
          "data-module-progress-total",
          "6",
        );

        /*
         * Controlled destructive reset.
         */
        await page.goto(
          "/en/app/settings",
        );

        const settings =
          page.getByTestId(
            "progress-data-settings",
          );

        await expect(
          settings,
        ).toHaveAttribute(
          "data-reset-state",
          "idle",
        );

        await settings
          .getByRole(
            "button",
            {
              name:
                "Reset progress",
            },
          )
          .click();

        await expect(
          settings,
        ).toHaveAttribute(
          "data-reset-state",
          "confirming",
        );

        await settings
          .getByRole(
            "button",
            {
              name:
                "Yes, delete all",
            },
          )
          .click();

        await expect(
          settings,
        ).toHaveAttribute(
          "data-reset-state",
          "success",
        );

        /*
         * Both ActivityProgress and AssessmentAttemptHistory
         * must now be gone.
         */
        await page.goto(
          "/en/app/progress",
        );

        await expect(
          page.getByTestId(
            "progress-overview",
          ),
        ).toHaveAttribute(
          "data-progress-loading",
          "false",
        );

        await expect(
          page.getByTestId(
            "overall-progress-count",
          ),
        ).toHaveText(
          "0/18",
        );

        await page.goto(
          ENGLISH_PREDICTION_URL,
        );

        const resetPrediction =
          page.locator(
            '[data-prediction-activity="activity-ssb-03"]',
          );

        await expect(
          resetPrediction,
        ).toHaveAttribute(
          "data-assessment-hydrated",
          "true",
        );

        await expect(
          resetPrediction,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "false",
        );

        await expect(
          resetPrediction,
        ).toHaveAttribute(
          "data-attempt-count",
          "0",
        );

        const resetBoundary =
          page.getByTestId(
            "activity-progress-boundary",
          );

        await expect(
          resetBoundary,
        ).toHaveAttribute(
          "data-progress-hydrated",
          "true",
        );

        await expect(
          resetBoundary,
        ).toHaveAttribute(
          "data-progress-completed",
          "false",
        );
      },
    );
  },
);