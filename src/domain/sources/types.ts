import type {
  EntityId,
  PublicationStatus,
  VersionedEntity,
} from "@/domain/shared/types";

export type SourceUsageType =
  | "scientific_reference"
  | "engineering_model"
  | "material_data"
  | "content_reference"
  | "asset"
  | "license";

export interface SourceRecord extends VersionedEntity {
  readonly title: string;

  readonly authors: readonly string[];
  readonly organization?: string;

  readonly year?: number;
  readonly edition?: string;

  readonly doi?: string;
  readonly url?: string;

  readonly location?: string;

  readonly usageTypes: readonly SourceUsageType[];

  readonly relatedEntityIds: readonly EntityId[];

  readonly license?: string;
  readonly permissionStatus?: string;

  readonly status: PublicationStatus;
}