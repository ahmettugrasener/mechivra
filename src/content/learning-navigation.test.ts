import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getLearningActivityNavigation,
} from "@/content/learning-navigation";

describe(
  "Learning activity navigation",
  () => {
    it(
      "resolves the first activity of the Statics module",
      () => {
        const navigation =
          getLearningActivityNavigation(
            "module-simply-supported-beam",
            "activity-ssb-01",
          );

        expect(
          navigation,
        ).toBeDefined();

        expect(
          navigation?.position,
        ).toBe(1);

        expect(
          navigation?.total,
        ).toBe(6);

        expect(
          navigation?.previous,
        ).toBeNull();

        expect(
          navigation?.current.id,
        ).toBe(
          "activity-ssb-01",
        );

        expect(
          navigation?.next?.id,
        ).toBe(
          "activity-ssb-02",
        );
      },
    );

    it(
      "resolves previous and next activities for a middle activity",
      () => {
        const navigation =
          getLearningActivityNavigation(
            "module-simply-supported-beam",
            "activity-ssb-04",
          );

        expect(
          navigation?.position,
        ).toBe(4);

        expect(
          navigation?.previous?.id,
        ).toBe(
          "activity-ssb-03",
        );

        expect(
          navigation?.current.id,
        ).toBe(
          "activity-ssb-04",
        );

        expect(
          navigation?.next?.id,
        ).toBe(
          "activity-ssb-05",
        );
      },
    );

    it(
      "resolves the final activity without a next activity",
      () => {
        const navigation =
          getLearningActivityNavigation(
            "module-simply-supported-beam",
            "activity-ssb-06",
          );

        expect(
          navigation?.position,
        ).toBe(6);

        expect(
          navigation?.previous?.id,
        ).toBe(
          "activity-ssb-05",
        );

        expect(
          navigation?.next,
        ).toBeNull();
      },
    );

    it(
      "returns undefined when the activity does not belong to the module",
      () => {
        const navigation =
          getLearningActivityNavigation(
            "module-simply-supported-beam",
            "activity-otto-01",
          );

        expect(
          navigation,
        ).toBeUndefined();
      },
    );

    it(
      "returns undefined for an unknown activity",
      () => {
        const navigation =
          getLearningActivityNavigation(
            "module-bending",
            "activity-does-not-exist",
          );

        expect(
          navigation,
        ).toBeUndefined();
      },
    );
  },
);