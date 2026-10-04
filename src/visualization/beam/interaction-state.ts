export type BeamInteractionParameter =
  | "point_load"
  | "load_position";

export interface BeamVisualizationInteractionState {
  readonly revision: number;

  readonly activeParameter:
    BeamInteractionParameter | null;
}