import {
  expect,
  test,
} from "@playwright/test";

const STATICS_BASE_ROUTE =
  "/tr/app/learn/statics/simply-supported-beam";

const STATICS_EN_BASE_ROUTE =
  "/en/app/learn/statics/simply-supported-beam";

test.describe(
  "Mechivra Learning Engine",
  () => {
    test(
      "navigates through the Statics learning sequence",
      async ({
        page,
      }) => {
        await page.goto(
          `${STATICS_BASE_ROUTE}/activity-ssb-01`,
        );

        await expect(
          page,
        ).toHaveURL(
          new RegExp(
            "/tr/app/learn/statics/simply-supported-beam/activity-ssb-01$",
          ),
        );

        const nextActivityIds = [
          "activity-ssb-02",
          "activity-ssb-03",
          "activity-ssb-04",
          "activity-ssb-05",
          "activity-ssb-06",
        ];

        for (
          const activityId
          of nextActivityIds
        ) {
          const targetHref =
            `${STATICS_BASE_ROUTE}/${activityId}`;

          const links =
            page.locator(
              `a[href="${targetHref}"]`,
            );

          await expect(
            links.first(),
          ).toBeVisible();

          /*
           * Aynı aktiviteye sidebar ve next-navigation
           * üzerinden birden fazla link olabilir.
           *
           * Son link sayfa altındaki ileri navigasyondur.
           */
          await links.last().click();

          await expect(
            page,
          ).toHaveURL(
            new RegExp(
              `${activityId}$`,
            ),
          );
        }
      },
    );

    test(
      "submits and locks a Statics prediction",
      async ({
        page,
      }) => {
        await page.goto(
          `${STATICS_BASE_ROUTE}/activity-ssb-03`,
        );

        const predictionActivity =
          page.locator(
            '[data-prediction-activity="activity-ssb-03"]',
          );

        await expect(
          predictionActivity,
        ).toBeVisible();

        await expect(
          predictionActivity,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "false",
        );

        await expect(
          predictionActivity,
        ).toHaveAttribute(
          "data-prediction-correct",
          "false",
        );

        await expect(
          predictionActivity,
        ).toHaveAttribute(
          "data-attempt-count",
          "0",
        );

        /*
         * Yalnız prediction seçenekleri aria-pressed taşır.
         * Revision/action butonları bu locator'a girmez.
         */
        const predictionButtons =
          predictionActivity.locator(
            'button[aria-pressed]',
          );

        await expect(
          predictionButtons,
        ).toHaveCount(
          3,
        );

        /*
         * Statics prediction'da ilk seçenek yanlış cevaptır.
         * Türkçe metne bağımlı selector kullanmıyoruz.
         */
        const incorrectOption =
          predictionButtons.first();

        await expect(
          incorrectOption,
        ).toBeEnabled();

        await incorrectOption.click();

        await expect(
          predictionActivity,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "true",
        );

        await expect(
          predictionActivity,
        ).toHaveAttribute(
          "data-prediction-correct",
          "false",
        );

        await expect(
          predictionActivity,
        ).toHaveAttribute(
          "data-attempt-count",
          "1",
        );

        await expect(
          predictionButtons,
        ).toHaveCount(
          3,
        );

        for (
          let index = 0;
          index < 3;
          index += 1
        ) {
          await expect(
            predictionButtons.nth(
              index,
            ),
          ).toBeDisabled();
        }

        await expect(
          incorrectOption,
        ).toHaveAttribute(
          "aria-pressed",
          "true",
        );

        /*
         * Yanlış cevaptan sonra prediction seçeneklerinden
         * ayrı bir revision butonu oluşur.
         */
        const actionButtons =
          predictionActivity.locator(
            'button:not([aria-pressed])',
          );

        await expect(
          actionButtons,
        ).toHaveCount(
          1,
        );

        await expect(
          actionButtons.first(),
        ).toBeEnabled();
      },
    );

    test(
      "updates verified Statics results when the beam load position changes",
      async ({
        page,
      }) => {
        await page.goto(
          `${STATICS_BASE_ROUTE}/activity-ssb-04`,
        );

        const interactive =
          page.locator(
            '[data-interactive-kind="beam_statics_point_load_explorer"]',
          );

        await expect(
          interactive,
        ).toBeVisible();

        await expect(
          interactive,
        ).toHaveAttribute(
          "data-meaningful-interaction",
          "false",
        );

        await expect(
          interactive,
        ).toHaveAttribute(
          "data-interaction-count",
          "0",
        );

        const scene =
          page.getByTestId(
            "beam-statics-scene",
          );

        await expect(
          scene,
        ).toBeVisible();

        await expect(
          scene,
        ).toHaveAttribute(
          "data-load-position-ratio",
          "0.5",
        );

        const loadPositionValue =
          page.getByTestId(
            "load-position-value",
          );

        await expect(
          loadPositionValue,
        ).toHaveText(
          "2 m",
        );

        /*
         * Explorer'da iki range input bulunur:
         * 0 = point-load magnitude
         * 1 = load position
         */
        const sliders =
          interactive.locator(
            'input[type="range"]',
          );

        await expect(
          sliders,
        ).toHaveCount(
          2,
        );

        const positionSlider =
          sliders.nth(
            1,
          );

        await expect(
          positionSlider,
        ).toHaveValue(
          "2",
        );

        /*
         * React controlled input:
         *
         * element.value = "3" doğrudan kullanıldığında
         * React'in internal value tracker'ı değişikliği
         * gerçek bir kullanıcı input'u olarak algılamayabilir.
         *
         * Native HTMLInputElement setter'ını doğrudan
         * çağırarak tracker'ı bypass ediyoruz ve ardından
         * gerçek input/change event'lerini gönderiyoruz.
         */
        await positionSlider.evaluate(
          (
            element,
          ) => {
            const input =
              element as HTMLInputElement;

            const valueSetter =
              Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                "value",
              )?.set;

            if (
              !valueSetter
            ) {
              throw new Error(
                "Native HTMLInputElement value setter is unavailable.",
              );
            }

            valueSetter.call(
              input,
              "3",
            );

            input.dispatchEvent(
              new Event(
                "input",
                {
                  bubbles:
                    true,
                },
              ),
            );

            input.dispatchEvent(
              new Event(
                "change",
                {
                  bubbles:
                    true,
                },
              ),
            );
          },
        );

        await expect(
          positionSlider,
        ).toHaveValue(
          "3",
        );

        await expect(
          loadPositionValue,
        ).toHaveText(
          "3 m",
        );

        /*
         * Başlangıç:
         * L = 4 m
         * a = 2 m
         * ratio = 0.5
         *
         * Yeni:
         * a = 3 m
         * ratio = 0.75
         */
        await expect(
          scene,
        ).toHaveAttribute(
          "data-load-position-ratio",
          "0.75",
        );

        await expect(
          interactive,
        ).toHaveAttribute(
          "data-meaningful-interaction",
          "true",
        );

        await expect(
          interactive,
        ).toHaveAttribute(
          "data-interaction-count",
          "1",
        );
      },
    );

    test(
      "keeps Learning Engine content localized in English",
      async ({
        page,
      }) => {
        await page.goto(
          `${STATICS_EN_BASE_ROUTE}/activity-ssb-04`,
        );

        await expect(
          page,
        ).toHaveURL(
          new RegExp(
            "/en/app/learn/statics/simply-supported-beam/activity-ssb-04$",
          ),
        );

        await expect(
          page.locator(
            "html",
          ),
        ).toHaveAttribute(
          "lang",
          "en",
        );

        await expect(
          page.getByRole(
            "heading",
            {
              name:
                "Explore the beam interactively",
            },
          ).first(),
        ).toBeVisible();

        const interactive =
          page.locator(
            '[data-interactive-kind="beam_statics_point_load_explorer"]',
          );

        await expect(
          interactive,
        ).toBeVisible();

        await expect(
          page.getByTestId(
            "beam-statics-scene",
          ),
        ).toBeVisible();

        await expect(
          page.getByTestId(
            "load-position-value",
          ),
        ).toHaveText(
          "2 m",
        );
      },
    );
  },
);