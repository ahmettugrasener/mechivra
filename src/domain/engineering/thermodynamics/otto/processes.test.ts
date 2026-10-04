import {
  describe,
  expect,
  it,
} from "vitest";

import {
  IDEAL_OTTO_PROCESS_SEQUENCE,
  getIdealOttoProcessDefinition,
} from "@/domain/engineering/thermodynamics/otto/processes";

describe(
  "Ideal Otto process sequence",
  () => {
    it(
      "contains exactly four closed-cycle processes",
      () => {
        expect(
          IDEAL_OTTO_PROCESS_SEQUENCE,
        ).toHaveLength(4);

        expect(
          IDEAL_OTTO_PROCESS_SEQUENCE.map(
            (process) => [
              process.fromState,
              process.toState,
            ],
          ),
        ).toEqual([
          [
            1,
            2,
          ],
          [
            2,
            3,
          ],
          [
            3,
            4,
          ],
          [
            4,
            1,
          ],
        ]);
      },
    );

    it(
      "uses the correct thermodynamic process kinds",
      () => {
        expect(
          IDEAL_OTTO_PROCESS_SEQUENCE.map(
            (process) =>
              process.kind,
          ),
        ).toEqual([
          "isentropic_compression",
          "constant_volume_heat_addition",
          "isentropic_expansion",
          "constant_volume_heat_rejection",
        ]);
      },
    );

    it(
      "retrieves a process definition by stable ID",
      () => {
        expect(
          getIdealOttoProcessDefinition(
            "process-2-3",
          ),
        ).toEqual({
          id:
            "process-2-3",

          fromState:
            2,

          toState:
            3,

          kind:
            "constant_volume_heat_addition",
        });
      },
    );
  },
);