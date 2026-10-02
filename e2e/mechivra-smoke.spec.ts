import {
  expect,
  test,
} from "@playwright/test";

test.describe(
  "Mechivra MVP shell",
  () => {
    test(
      "redirects the root URL to the default Turkish locale",
      async ({ page }) => {
        await page.goto("/");

        await expect(
          page,
        ).toHaveURL(
          /\/tr\/?$/,
        );

        const heroHeading =
          page.getByRole(
            "heading",
            {
              level: 1,
            },
          );

        await expect(
          heroHeading,
        ).toBeVisible();

        await expect(
          heroHeading,
        ).toContainText(
          "Mühendislik öğrenme.",
        );

        await expect(
          heroHeading,
        ).toContainText(
          "Mühendislik yap.",
        );
      },
    );

    test(
      "switches from Turkish to English without losing the current page",
      async ({ page }) => {
        await page.goto(
          "/tr/courses",
        );

        await expect(
          page.getByRole(
            "heading",
            {
              level: 1,
              name: "Dersler",
            },
          ),
        ).toBeVisible();

        await page
          .getByRole(
            "button",
            {
              name: "EN",
              exact: true,
            },
          )
          .click();

        await expect(
          page,
        ).toHaveURL(
          /\/en\/courses\/?$/,
        );

        await expect(
          page.getByRole(
            "heading",
            {
              level: 1,
              name: "Courses",
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Mechanics of Materials",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await page
          .getByRole(
            "button",
            {
              name: "TR",
              exact: true,
            },
          )
          .click();

        await expect(
          page,
        ).toHaveURL(
          /\/tr\/courses\/?$/,
        );

        await expect(
          page.getByRole(
            "heading",
            {
              level: 1,
              name: "Dersler",
            },
          ),
        ).toBeVisible();
      },
    );

    test(
      "opens the Statics course and learning module",
      async ({ page }) => {
        await page.goto(
          "/tr/courses",
        );

        const staticsCourseLink =
          page
            .getByRole(
              "link",
            )
            .filter({
              hasText: "Statik",
            })
            .first();

        await expect(
          staticsCourseLink,
        ).toBeVisible();

        await staticsCourseLink.click();

        await expect(
          page,
        ).toHaveURL(
          /\/tr\/courses\/statics\/?$/,
        );

        await expect(
          page.getByRole(
            "heading",
            {
              level: 1,
              name: "Statik",
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByRole(
            "heading",
            {
              level: 2,
              name:
                "Basit Mesnetli Kiriş",
            },
          ),
        ).toBeVisible();

        await page
          .getByRole(
            "link",
            {
              name:
                "Modülü Aç",
              exact: true,
            },
          )
          .click();

        await expect(
          page,
        ).toHaveURL(
          /\/tr\/app\/learn\/statics\/simply-supported-beam\/?$/,
        );

        await expect(
          page.getByRole(
            "heading",
            {
              level: 1,
              name:
                "Basit Mesnetli Kiriş",
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Bir kiriş yükü nasıl taşır?",
            {
              exact: true,
            },
          ).first(),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Kirişi etkileşimli incele",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Yeni bir kiriş problemi çöz",
            {
              exact: true,
            },
          ),
        ).toBeVisible();
      },
    );

    test(
      "preserves the learning module while changing locale",
      async ({ page }) => {
        await page.goto(
          "/tr/app/learn/statics/simply-supported-beam",
        );

        await expect(
          page.getByRole(
            "heading",
            {
              level: 1,
              name:
                "Basit Mesnetli Kiriş",
            },
          ),
        ).toBeVisible();

        await page
          .getByRole(
            "button",
            {
              name: "EN",
              exact: true,
            },
          )
          .click();

        await expect(
          page,
        ).toHaveURL(
          /\/en\/app\/learn\/statics\/simply-supported-beam\/?$/,
        );

        await expect(
          page.getByRole(
            "heading",
            {
              level: 1,
              name:
                "Simply Supported Beam",
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "How does a beam carry load?",
            {
              exact: true,
            },
          ).first(),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Explore the beam interactively",
            {
              exact: true,
            },
          ),
        ).toBeVisible();
      },
    );

    test(
      "opens all three MVP learning workspaces from registry routes",
      async ({ page }) => {
        const modules = [
          {
            path:
              "/tr/app/learn/statics/simply-supported-beam",

            heading:
              "Basit Mesnetli Kiriş",
          },

          {
            path:
              "/tr/app/learn/mechanics-of-materials/bending",

            heading:
              "Eğilme",
          },

          {
            path:
              "/tr/app/learn/thermodynamics/ideal-otto-cycle",

            heading:
              "İdeal Otto Çevrimi",
          },
        ] as const;

        for (
          const moduleItem
          of modules
        ) {
          await page.goto(
            moduleItem.path,
          );

          await expect(
            page.getByRole(
              "heading",
              {
                level: 1,
                name:
                  moduleItem.heading,
              },
            ),
          ).toBeVisible();
        }
      },
    );

    test(
      "shows a localized 404 for an unknown course",
      async ({ page }) => {
        await page.goto(
          "/tr/courses/olmayan-ders",
        );

        await expect(
          page.getByRole(
            "heading",
            {
              level: 1,
              name:
                "Sayfa bulunamadı",
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByRole(
            "link",
            {
              name:
                "Ana sayfaya dön",
              exact: true,
            },
          ),
        ).toBeVisible();
      },
    );
  },
);