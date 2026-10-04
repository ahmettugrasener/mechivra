import {
  expect,
  test,
} from "@playwright/test";

test.describe(
  "Mechivra complete Statics module",
  () => {
    test(
      "renders the problem context as the first learning activity",
      async ({
        page,
      }) => {
        await page.goto(
          "/tr/app/learn/statics/simply-supported-beam",
        );

        await expect(
          page.getByRole(
            "heading",
            {
              name:
                "Bir kiriş yükü nasıl taşır?",
            },
          ),
        ).toBeVisible();

        const article =
          page.locator(
            "article",
          );

        await expect(
          article,
        ).toContainText(
          "kiriş",
        );

        await expect(
          article.getByRole(
            "link",
            {
              name:
                /Denge ve mesnet tepkileri/,
            },
          ),
        ).toBeVisible();
      },
    );

    test(
      "renders theory and the independently verified worked example",
      async ({
        page,
      }) => {
        await page.goto(
          "/tr/app/learn/statics/simply-supported-beam/activity-ssb-02",
        );

        await expect(
          page.getByRole(
            "heading",
            {
              name:
                "Denge ve mesnet tepkileri",
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByRole(
            "heading",
            {
              name:
                "Çözümlü örnek: Merkez dışı noktasal yük",
              exact: true,
            },
          ),
        ).toBeVisible();

        const workedExample =
          page.getByTestId(
            "beam-statics-worked-example",
          );

        await expect(
          workedExample.locator(
            "[data-worked-example-step]",
          ),
        ).toHaveCount(7);

        await expect(
          workedExample.getByTestId(
            "left-reaction-arrow",
          ),
        ).toContainText(
          /R_A\s*=\s*7,5\s*kN/,
        );

        await expect(
          workedExample.getByTestId(
            "right-reaction-arrow",
          ),
        ).toContainText(
          /R_B\s*=\s*2,5\s*kN/,
        );

        await expect(
          workedExample.getByTestId(
            "maximum-moment-label",
          ),
        ).toContainText(
          /7,5\s*kN·m/,
        );
      },
    );

    test(
      "runs the prediction learning activity",
      async ({
        page,
      }) => {
        await page.goto(
          "/tr/app/learn/statics/simply-supported-beam/activity-ssb-03",
        );

        const option =
          page.getByRole(
            "button",
            {
              name:
                /İki mesnet tepkisi de değişmez/,
            },
          );

        await option.click();

        await expect(
          page.locator(
            '[data-prediction-submitted="true"]',
          ),
        ).toBeVisible();

        await expect(
          page.locator(
            '[data-prediction-correct="false"]',
          ),
        ).toBeVisible();

        await expect(
          page.getByRole(
            "status",
          ),
        ).toBeVisible();

        await expect(
          page
            .locator(
              "article",
            )
            .getByRole(
              "link",
              {
                name:
                  /Kirişi etkileşimli incele/,
              },
            ),
        ).toBeVisible();
      },
    );

    test(
      "keeps beam, reactions, shear, and moment synchronized",
      async ({
        page,
      }) => {
        await page.goto(
          "/en/app/learn/statics/simply-supported-beam/activity-ssb-04",
        );

        const positionSlider =
          page.getByRole(
            "slider",
            {
              name:
                "Load position from the left",
            },
          );

        await positionSlider.focus();

        for (
          let step = 0;
          step < 10;
          step += 1
        ) {
          await page.keyboard.press(
            "ArrowRight",
          );
        }

        await expect(
          page.getByTestId(
            "load-position-value",
          ),
        ).toHaveText(
          "3 m",
        );

        await expect(
          page.getByTestId(
            "left-reaction-value",
          ),
        ).toHaveText(
          "2.5 kN",
        );

        await expect(
          page.getByTestId(
            "right-reaction-value",
          ),
        ).toHaveText(
          "7.5 kN",
        );

        await expect(
          page.getByTestId(
            "left-shear-label",
          ),
        ).toContainText(
          "+2.5 kN",
        );

        await expect(
          page.getByTestId(
            "right-shear-label",
          ),
        ).toContainText(
          "−7.5 kN",
        );

        await expect(
          page.getByTestId(
            "maximum-moment-label",
          ),
        ).toContainText(
          "7.5 kN·m",
        );

        await expect(
          page.getByTestId(
            "maximum-moment-position-label",
          ),
        ).toContainText(
          "x = 3 m",
        );

        await expect(
          page.locator(
            '[data-load-position-ratio="0.75"]',
          ),
        ).toBeVisible();

        await expect(
          page.locator(
            '[data-shear-load-position-ratio="0.75"]',
          ),
        ).toBeVisible();

        await expect(
          page.locator(
            '[data-moment-maximum-position-ratio="0.75"]',
          ),
        ).toBeVisible();
      },
    );

    test(
      "provides targeted feedback and accepts the correct numeric problem solution",
      async ({
        page,
      }) => {
        await page.goto(
          "/en/app/learn/statics/simply-supported-beam/activity-ssb-05",
        );

        await page.getByRole(
          "textbox",
          {
            name:
              "Right support reaction RB",
          },
        ).fill(
          "8",
        );

        await page.getByRole(
          "button",
          {
            name:
              "Check answers",
          },
        ).click();

        await expect(
          page.locator(
            '[data-attempt-submitted="true"]',
          ),
        ).toBeVisible();

        await expect(
          page.locator(
            '[data-attempt-correct="false"]',
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            /Take moments about A/,
          ),
        ).toBeVisible();

        const answers = [
          [
            "Left support reaction RA",
            "8",
          ],
          [
            "Right support reaction RB",
            "4",
          ],
          [
            "Shear force to the left of the load",
            "8",
          ],
          [
            "Shear force to the right of the load",
            "-4",
          ],
          [
            "Maximum bending moment",
            "16",
          ],
          [
            "Location of maximum moment",
            "2",
          ],
        ] as const;

        for (
          const [
            label,
            value,
          ]
          of answers
        ) {
          await page.getByRole(
            "textbox",
            {
              name:
                label,
            },
          ).fill(
            value,
          );
        }

        await page.getByRole(
          "button",
          {
            name:
              "Check again",
          },
        ).click();

        await expect(
          page.locator(
            '[data-attempt-correct="true"]',
          ),
        ).toBeVisible();

        await expect(
          page.getByRole(
            "status",
          ),
        ).toContainText(
          "All six results agree",
        );
      },
    );

    test(
      "closes the module with assumptions, limitations, and the scientific source",
      async ({
        page,
      }) => {
        await page.goto(
          "/tr/app/learn/statics/simply-supported-beam/activity-ssb-06",
        );

        await expect(
          page.getByRole(
            "heading",
            {
              name:
                "Özet ve model sınırları",
              exact: true,
            },
          ),
        ).toBeVisible();

        const summaryPanel =
          page.getByTestId(
            "statics-summary-panel",
          );

        await expect(
          summaryPanel.getByRole(
            "heading",
            {
              name:
                "Bu modülden sonra ne yapabilirsin?",
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          summaryPanel.getByRole(
            "heading",
            {
              name:
                "Model varsayımları",
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          summaryPanel.getByRole(
            "heading",
            {
              name:
                "Model sınırları",
              exact: true,
            },
          ),
        ).toBeVisible();

        const source =
          summaryPanel.locator(
            '[data-source-id="source-mit-beam-displacements"]',
          );

        await expect(
          source,
        ).toContainText(
          "Beam Displacements",
        );

        await expect(
          source,
        ).toContainText(
          "MIT OpenCourseWare",
        );

        await expect(
          summaryPanel.getByText(
            /Mukavemet — Eğilme modülünde/,
          ),
        ).toBeVisible();
      },
    );
  },
);