import {
  expect,
  test,
} from "@playwright/test";

const TR_BASE =
  "/tr/app/learn/mechanics-of-materials/bending";

const EN_BASE =
  "/en/app/learn/mechanics-of-materials/bending";

test.describe(
  "Mechivra complete Bending module",
  () => {
    test(
      "renders the Statics-to-Bending problem context",
      async ({
        page,
      }) => {
        await page.goto(
          `${TR_BASE}/activity-bending-01`,
        );

        await expect(
          page.getByRole(
            "heading",
            {
              name:
                "Statikten eğilmeye",
              exact:
                true,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByRole(
            "heading",
            {
              name:
                "Statik nerede bitti, mukavemet nerede başlıyor?",
              exact:
                true,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            /Statik Engineering Core tarafından bulunan moment sonucu/i,
          ),
        ).toBeVisible();
      },
    );

    test(
      "renders verified theory, stress visualization, and worked example",
      async ({
        page,
      }) => {
        await page.goto(
          `${TR_BASE}/activity-bending-02`,
        );

        await expect(
          page.getByRole(
            "heading",
            {
              name:
                "Dikdörtgen kesitte geometrinin rolü",
              exact:
                true,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByTestId(
            "bending-concept-maximum-stress",
          ),
        ).toHaveText(
          "15 MPa",
        );

        const conceptPanel =
          page.getByTestId(
            "bending-concept-visualization-panel",
          );

        const conceptDiagram =
          conceptPanel.getByTestId(
            "rectangular-stress-section-diagram",
          );

        await expect(
          conceptDiagram,
        ).toBeVisible();

        await expect(
          conceptDiagram.getByTestId(
            "top-stress-label",
          ),
        ).toContainText(
          "−15 MPa",
        );

        await expect(
          conceptDiagram.getByTestId(
            "bottom-stress-label",
          ),
        ).toContainText(
          "+15 MPa",
        );

        const workedExample =
          page.getByTestId(
            "bending-worked-example",
          );

        await expect(
          workedExample,
        ).toBeVisible();

        await expect(
          workedExample.locator(
            "[data-bending-worked-example-step]",
          ),
        ).toHaveCount(6);

        await expect(
          workedExample,
        ).toContainText(
          "Mmax = 10 kN·m",
        );

        await expect(
          workedExample,
        ).toContainText(
          "0,5 mm",
        );

        await expect(
          workedExample,
        ).toContainText(
          /gerilme ölçütü sağlanır/i,
        );
      },
    );

    test(
      "runs and locks the Bending prediction",
      async ({
        page,
      }) => {
        await page.goto(
          `${TR_BASE}/activity-bending-03`,
        );

        const prediction =
          page.getByTestId(
            "bending-height-prediction",
          );

        await expect(
          prediction,
        ).toHaveAttribute(
          "data-prediction-submitted",
          "false",
        );

        await prediction
          .getByRole(
            "button",
            {
              name:
                /maksimum gerilme dörtte bire, maksimum sehim sekizde bire/i,
            },
          )
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
          "true",
        );

        await expect(
          prediction.getByRole(
            "status",
          ),
        ).toContainText(
          "Tahmin doğru",
        );

        const buttons =
          prediction.getByRole(
            "button",
          );

        await expect(
          buttons,
        ).toHaveCount(3);

        for (
          let index = 0;
          index < 3;
          index += 1
        ) {
          await expect(
            buttons.nth(
              index,
            ),
          ).toBeDisabled();
        }
      },
    );

    test(
      "changes deflection but not moment or stress when E changes",
      async ({
        page,
      }) => {
        await page.goto(
          `${TR_BASE}/activity-bending-04`,
        );

        const explorer =
          page.getByTestId(
            "bending-interactive-explorer",
          );

        await expect(
          explorer.getByTestId(
            "bending-interactive-moment",
          ),
        ).toHaveText(
          "10 kN·m",
        );

        await expect(
          explorer.getByTestId(
            "bending-interactive-stress",
          ),
        ).toHaveText(
          "15 MPa",
        );

        await expect(
          explorer.getByTestId(
            "bending-interactive-deflection",
          ),
        ).toHaveText(
          "1 mm",
        );

        const elasticModulusSlider =
          explorer.getByRole(
            "slider",
            {
              name:
                "Elastisite modülü E",
            },
          );

        await elasticModulusSlider.focus();

        await elasticModulusSlider.press(
          "Home",
        );

        for (
          let index = 0;
          index < 5;
          index += 1
        ) {
          await elasticModulusSlider.press(
            "ArrowRight",
          );
        }

        await expect(
          explorer.getByTestId(
            "elastic_modulus-value",
          ),
        ).toHaveText(
          "100 GPa",
        );

        await expect(
          explorer.getByTestId(
            "bending-interactive-moment",
          ),
        ).toHaveText(
          "10 kN·m",
        );

        await expect(
          explorer.getByTestId(
            "bending-interactive-stress",
          ),
        ).toHaveText(
          "15 MPa",
        );

        await expect(
          explorer.getByTestId(
            "bending-interactive-deflection",
          ),
        ).toHaveText(
          "2 mm",
        );

        await expect(
          explorer,
        ).toHaveAttribute(
          "data-meaningful-interaction",
          "true",
        );
      },
    );

    test(
      "separates maximum moment and maximum deflection locations for an eccentric load",
      async ({
        page,
      }) => {
        await page.goto(
          `${TR_BASE}/activity-bending-04`,
        );

        const explorer =
          page.getByTestId(
            "bending-interactive-explorer",
          );

        const loadPositionSlider =
          explorer.getByRole(
            "slider",
            {
              name:
                "Yükün soldan konumu a",
            },
          );

        await loadPositionSlider.focus();

        await loadPositionSlider.press(
          "Home",
        );

        for (
          let index = 0;
          index < 5;
          index += 1
        ) {
          await loadPositionSlider.press(
            "ArrowRight",
          );
        }

        await expect(
          explorer.getByTestId(
            "load_position-value",
          ),
        ).toHaveText(
          "1 m",
        );

        await expect(
          explorer.getByTestId(
            "bending-interactive-moment",
          ),
        ).toHaveText(
          "7,5 kN·m",
        );

        await expect(
          explorer.getByTestId(
            "bending-interactive-deflection",
          ),
        ).toHaveText(
          "0,699 mm",
        );

        const deflectionDiagram =
          explorer.getByTestId(
            "deflected-beam-diagram",
          );

        await expect(
          deflectionDiagram.getByTestId(
            "maximum-moment-position-text",
          ),
        ).toContainText(
          "xM = 1 m",
        );

        await expect(
          deflectionDiagram.getByTestId(
            "maximum-deflection-position-text",
          ),
        ).toContainText(
          "xδ = 1,764 m",
        );

        await expect(
          deflectionDiagram,
        ).toContainText(
          /görsel olarak büyütülmüş/i,
        );
      },
    );

    test(
      "grades the new Bending problem and keeps stress and deflection criteria independent",
      async ({
        page,
      }) => {
        await page.goto(
          `${TR_BASE}/activity-bending-05`,
        );

        const problem =
          page.getByTestId(
            "bending-problem-activity",
          );

        await problem
          .getByRole(
            "textbox",
            {
              name:
                "Alan atalet momenti I",
            },
          )
          .fill(
            "2730,667",
          );

        await problem
          .getByRole(
            "textbox",
            {
              name:
                "Maksimum eğilme momenti",
            },
          )
          .fill(
            "6",
          );

        await problem
          .getByRole(
            "textbox",
            {
              name:
                "Maksimum eğilme gerilmesi",
            },
          )
          .fill(
            "17,578",
          );

        await problem
          .getByRole(
            "textbox",
            {
              name:
                "Maksimum sehim",
            },
          )
          .fill(
            "2,354",
          );

        const stressCriterion =
          problem.getByRole(
            "group",
            {
              name:
                "20 MPa gerilme ölçütü",
            },
          );

        await stressCriterion
          .getByRole(
            "radio",
            {
              name:
                "Sağlandı",
            },
          )
          .check();

        const deflectionCriterion =
          problem.getByRole(
            "group",
            {
              name:
                "2 mm sehim ölçütü",
            },
          );

        await deflectionCriterion
          .getByRole(
            "radio",
            {
              name:
                "Sağlanmadı",
            },
          )
          .check();

        await problem
          .getByRole(
            "button",
            {
              name:
                "Cevapları kontrol et",
            },
          )
          .click();

        await expect(
          problem,
        ).toHaveAttribute(
          "data-attempt-submitted",
          "true",
        );

        await expect(
          problem,
        ).toHaveAttribute(
          "data-attempt-correct",
          "true",
        );

        await expect(
          problem.getByRole(
            "status",
          ),
        ).toContainText(
          /Gerilme ölçütü sağlanırken sehim ölçütünün sağlanmadığını/i,
        );
      },
    );

    test(
      "closes the module with assumptions, limitations, and both scientific sources",
      async ({
        page,
      }) => {
        await page.goto(
          `${TR_BASE}/activity-bending-06`,
        );

        const summary =
          page.getByTestId(
            "bending-summary-panel",
          );

        await expect(
          summary,
        ).toBeVisible();

        await expect(
          summary.getByRole(
            "heading",
            {
              name:
                "Model varsayımları",
              exact:
                true,
            },
          ),
        ).toBeVisible();

        await expect(
          summary.getByRole(
            "heading",
            {
              name:
                "Model sınırları",
              exact:
                true,
            },
          ),
        ).toBeVisible();

        await expect(
          summary,
        ).toContainText(
          "Plastik davranış",
        );

        await expect(
          summary,
        ).toContainText(
          "Yorulma",
        );

        await expect(
          summary,
        ).toContainText(
          "Burkulma",
        );

        await expect(
          summary,
        ).toContainText(
          "yerel gerilme yığılmaları",
        );

        await expect(
          summary,
        ).toContainText(
          "PL³/(48EI)",
        );

        await expect(
          summary,
        ).toContainText(
          /kiriş güvenlidir/i,
        );

        await expect(
          summary.locator(
            '[data-source-id="source-mit-mechanics-lecture-13"]',
          ),
        ).toBeVisible();

        await expect(
          summary.locator(
            '[data-source-id="source-mit-beam-displacements"]',
          ),
        ).toBeVisible();
      },
    );

    test(
      "keeps the Bending interactive localized in English",
      async ({
        page,
      }) => {
        await page.goto(
          `${EN_BASE}/activity-bending-04`,
        );

        const explorer =
          page.getByTestId(
            "bending-interactive-explorer",
          );

        await expect(
          explorer.getByRole(
            "slider",
            {
              name:
                "Section width b",
            },
          ),
        ).toBeVisible();

        await expect(
          explorer.getByRole(
            "slider",
            {
              name:
                "Section height h",
            },
          ),
        ).toBeVisible();

        await expect(
          explorer.getByRole(
            "slider",
            {
              name:
                "Elastic modulus E",
            },
          ),
        ).toBeVisible();

        await expect(
          explorer.getByRole(
            "slider",
            {
              name:
                "Load position from the left a",
            },
          ),
        ).toBeVisible();

        await expect(
          explorer.getByText(
            "Compression",
            {
              exact:
                true,
            },
          ),
        ).toBeVisible();

        await expect(
          explorer.getByText(
            "Tension",
            {
              exact:
                true,
            },
          ),
        ).toBeVisible();

        await expect(
          explorer.getByRole(
            "img",
            {
              name:
                "Beam deflection curve",
            },
          ),
        ).toBeVisible();
      },
    );
  },
);