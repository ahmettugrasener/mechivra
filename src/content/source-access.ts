import {
  rawSources,
} from "@/content/mvp-content";

import type {
  EntityId,
} from "@/domain/shared/types";

export type SourceRecord =
  (typeof rawSources)[number];

export function getSourceById(
  sourceId: EntityId,
): SourceRecord | undefined {
  return rawSources.find(
    (source) =>
      source.id ===
      sourceId,
  );
}

export function getSourcesByIds(
  sourceIds:
    readonly EntityId[],
): readonly SourceRecord[] {
  return sourceIds.map(
    (sourceId) => {
      const source =
        getSourceById(
          sourceId,
        );

      if (!source) {
        throw new Error(
          `Unknown source ID: ${sourceId}`,
        );
      }

      return source;
    },
  );
}