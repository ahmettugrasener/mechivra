import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createActivityProgressIdentity,
  createAssessmentHistoryIdentity,
  createModuleProgressIdentity,
  isSameActivityProgressIdentity,
  isSameAssessmentHistoryIdentity,
  isSameModuleProgressIdentity,
} from "@/domain/progress/identity";

describe(
  "Progress identities",
  () => {
    it(
      "treats module version as part of module identity",
      () => {
        const versionOne =
          createModuleProgressIdentity(
            "module-test",
            "1.0.0",
          );

        const versionTwo =
          createModuleProgressIdentity(
            "module-test",
            "2.0.0",
          );

        expect(
          isSameModuleProgressIdentity(
            versionOne,
            versionOne,
          ),
        ).toBe(
          true,
        );

        expect(
          isSameModuleProgressIdentity(
            versionOne,
            versionTwo,
          ),
        ).toBe(
          false,
        );
      },
    );

    it(
      "treats activity version as part of activity identity",
      () => {
        const versionOne =
          createActivityProgressIdentity(
            "module-test",
            "1.0.0",
            "activity-test",
            "1.0.0",
          );

        const versionTwo =
          createActivityProgressIdentity(
            "module-test",
            "1.0.0",
            "activity-test",
            "2.0.0",
          );

        expect(
          isSameActivityProgressIdentity(
            versionOne,
            versionTwo,
          ),
        ).toBe(
          false,
        );
      },
    );

    it(
      "treats assessment version as part of assessment-history identity",
      () => {
        const versionOne =
          createAssessmentHistoryIdentity(
            "activity-test",
            "1.0.0",
            "assessment-test",
            "1.0.0",
          );

        const versionTwo =
          createAssessmentHistoryIdentity(
            "activity-test",
            "1.0.0",
            "assessment-test",
            "2.0.0",
          );

        expect(
          isSameAssessmentHistoryIdentity(
            versionOne,
            versionTwo,
          ),
        ).toBe(
          false,
        );
      },
    );

    it(
      "keeps activity identity independent from locale",
      () => {
        const first =
          createActivityProgressIdentity(
            "module-test",
            "1.0.0",
            "activity-test",
            "1.0.0",
          );

        const second =
          createActivityProgressIdentity(
            "module-test",
            "1.0.0",
            "activity-test",
            "1.0.0",
          );

        expect(
          first,
        ).toEqual(
          second,
        );

        expect(
          "locale" in first,
        ).toBe(
          false,
        );
      },
    );

    it(
      "rejects empty identity components",
      () => {
        expect(
          () =>
            createModuleProgressIdentity(
              "",
              "1.0.0",
            ),
        ).toThrow(
          /module id/i,
        );

        expect(
          () =>
            createActivityProgressIdentity(
              "module-test",
              "1.0.0",
              "",
              "1.0.0",
            ),
        ).toThrow(
          /activity id/i,
        );

        expect(
          () =>
            createAssessmentHistoryIdentity(
              "activity-test",
              "1.0.0",
              "",
              "1.0.0",
            ),
        ).toThrow(
          /assessment id/i,
        );
      },
    );
  },
);