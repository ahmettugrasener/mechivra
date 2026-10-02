import {
  expect,
  test,
} from "@playwright/test";

test.describe(
  "Mechivra student application",
  () => {
    test(
      "opens the Turkish learning dashboard",
      async ({ page }) => {
        await page.goto(
          "/tr/app",
        );

        await expect(
          page.getByRole(
            "heading",
            {
              level: 1,
              name:
                "Öğrenmeye devam et.",
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Basit Mesnetli Kiriş",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "İdeal Otto Çevrimi",
            {
              exact: true,
            },
          ),
        ).toBeVisible();
      },
    );

    test(
      "navigates between Courses, Progress, and Settings",
      async ({ page }) => {
        await page.goto(
          "/tr/app",
        );

        await page
          .getByRole(
            "link",
            {
              name: "Dersler",
            },
          )
          .click();

        await expect(
          page,
        ).toHaveURL(
          /\/tr\/app\/courses\/?$/,
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
            "link",
            {
              name: "İlerleme",
            },
          )
          .click();

        await expect(
          page,
        ).toHaveURL(
          /\/tr\/app\/progress\/?$/,
        );

        await expect(
          page.getByRole(
            "heading",
            {
              level: 1,
              name: "İlerleme",
            },
          ),
        ).toBeVisible();

        await page
          .getByRole(
            "link",
            {
              name: "Ayarlar",
            },
          )
          .click();

        await expect(
          page,
        ).toHaveURL(
          /\/tr\/app\/settings\/?$/,
        );

        await expect(
          page.getByRole(
            "heading",
            {
              level: 1,
              name: "Ayarlar",
            },
          ),
        ).toBeVisible();
      },
    );

    test(
      "renders the English dashboard from the same content registry",
      async ({ page }) => {
        await page.goto(
          "/en/app",
        );

        await expect(
          page.getByRole(
            "heading",
            {
              level: 1,
              name:
                "Continue learning.",
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Simply Supported Beam",
            {
              exact: true,
            },
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Ideal Otto Cycle",
            {
              exact: true,
            },
          ),
        ).toBeVisible();
      },
    );
  },
);