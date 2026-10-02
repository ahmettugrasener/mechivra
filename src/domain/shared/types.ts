export type SupportedLocale = "tr" | "en";

export type LocalizedText = Readonly<
  Record<SupportedLocale, string>
>;

export type EntityId = string;
export type VersionString = string;

export type PublicationStatus =
  | "draft"
  | "technical_review"
  | "language_review"
  | "approved"
  | "published"
  | "archived";

export interface VersionedEntity {
  readonly id: EntityId;
  readonly version: VersionString;
}