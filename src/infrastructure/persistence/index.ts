export {
  MECHIVRA_DATABASE_NAME,
  MECHIVRA_DATABASE_VERSION,
  MECHIVRA_PERSISTENCE_SCHEMA_KEY,
  MechivraDatabase,
  getMechivraDatabase,
} from "@/infrastructure/persistence/mechivra-database";

export type {
  ActivityProgressPrimaryKey,
  AssessmentHistoryPrimaryKey,
  PersistenceMetadataRecord,
} from "@/infrastructure/persistence/mechivra-database";

export {
  DexieProgressRepository,
  ProgressPersistenceVersionConflictError,
  createDexieProgressRepository,
} from "@/infrastructure/persistence/dexie-progress-repository";