import { z } from "zod";

const entityIdSchema = z
  .string()
  .min(1)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Entity IDs must use lowercase kebab-case.",
  );

const versionSchema = z
  .string()
  .regex(
    /^\d+\.\d+\.\d+$/,
    "Version must use semantic version format such as 1.0.0.",
  );

export const localizedTextSchema = z
  .object({
    tr: z.string().min(1),
    en: z.string().min(1),
  })
  .strict();

export const publicationStatusSchema = z.enum([
  "draft",
  "technical_review",
  "language_review",
  "approved",
  "published",
  "archived",
]);

export const courseSchema = z
  .object({
    id: entityIdSchema,
    version: versionSchema,

    slug: entityIdSchema,

    title: localizedTextSchema,
    description: localizedTextSchema,

    moduleIds: z.array(entityIdSchema),

    status: publicationStatusSchema,
  })
  .strict();

export const learningOutcomeSchema = z
  .object({
    id: entityIdSchema,
    version: versionSchema,

    moduleId: entityIdSchema,

    code: z.string().min(1),

    description: localizedTextSchema,
  })
  .strict();

export const conceptSchema = z
  .object({
    id: entityIdSchema,
    version: versionSchema,

    slug: entityIdSchema,

    title: localizedTextSchema,
    shortDefinition: localizedTextSchema,

    requires: z.array(entityIdSchema),
    relatedTo: z.array(entityIdSchema),
    usedIn: z.array(entityIdSchema),

    sourceIds: z.array(entityIdSchema),

    status: publicationStatusSchema,
  })
  .strict();

export const learningModuleSchema = z
  .object({
    id: entityIdSchema,
    version: versionSchema,

    courseId: entityIdSchema,
    slug: entityIdSchema,

    title: localizedTextSchema,
    description: localizedTextSchema,

    learningOutcomeIds: z.array(entityIdSchema),
    prerequisiteConceptIds: z.array(entityIdSchema),
    conceptIds: z.array(entityIdSchema),
    activityIds: z.array(entityIdSchema),

    sourceIds: z.array(entityIdSchema),

    status: publicationStatusSchema,
  })
  .strict();

const completionRuleSchema = z
  .object({
    type: z.enum([
      "opened",
      "reached_end",
      "submitted_prediction",
      "meaningful_interaction",
      "submitted_attempt",
      "explicit_completion",
    ]),
  })
  .strict();

const headingContentBlockSchema = z
  .object({
    id: entityIdSchema,
    type: z.literal("heading"),
    level: z.union([
      z.literal(2),
      z.literal(3),
    ]),
    text: localizedTextSchema,
  })
  .strict();

const paragraphContentBlockSchema = z
  .object({
    id: entityIdSchema,
    type: z.literal("paragraph"),
    text: localizedTextSchema,
  })
  .strict();

const equationContentBlockSchema = z
  .object({
    id: entityIdSchema,
    type: z.literal("equation"),
    expression: z.string().min(1),
    description: localizedTextSchema.optional(),
  })
  .strict();

const calloutContentBlockSchema = z
  .object({
    id: entityIdSchema,
    type: z.literal("callout"),
    tone: z.enum([
      "info",
      "engineering",
      "warning",
    ]),
    title: localizedTextSchema.optional(),
    body: localizedTextSchema,
  })
  .strict();

const figureContentBlockSchema = z
  .object({
    id: entityIdSchema,
    type: z.literal("figure"),
    assetId: entityIdSchema,
    alt: localizedTextSchema,
    caption: localizedTextSchema.optional(),
  })
  .strict();

export const learningContentBlockSchema =
  z.discriminatedUnion(
    "type",
    [
      headingContentBlockSchema,
      paragraphContentBlockSchema,
      equationContentBlockSchema,
      calloutContentBlockSchema,
      figureContentBlockSchema,
    ],
  );

export const learningActivitySchema = z
  .object({
    id: entityIdSchema,
    version: versionSchema,

    moduleId: entityIdSchema,

    type: z.enum([
      "problem_context",
      "concept",
      "prediction",
      "worked_example",
      "interactive",
      "interpretation",
      "problem",
      "quiz",
      "design_task",
      "lab",
      "reflection",
      "summary",
    ]),

    order: z.number().int().positive(),

    title: localizedTextSchema,

    learningOutcomeIds: z.array(entityIdSchema),
    conceptIds: z.array(entityIdSchema),
    sourceIds: z.array(entityIdSchema),

    contentBlocks: z.array(
      learningContentBlockSchema,
    ),

    completionRule: completionRuleSchema,

    status: publicationStatusSchema,
  })
  .strict();

export const sourceUsageTypeSchema = z.enum([
  "scientific_reference",
  "engineering_model",
  "material_data",
  "content_reference",
  "asset",
  "license",
]);

export const sourceRecordSchema = z
  .object({
    id: entityIdSchema,
    version: versionSchema,

    title: z.string().min(1),

    authors: z.array(
      z.string().min(1),
    ),

    organization: z
      .string()
      .min(1)
      .optional(),

    year: z
      .number()
      .int()
      .positive()
      .optional(),

    edition: z
      .string()
      .min(1)
      .optional(),

    doi: z
      .string()
      .min(1)
      .optional(),

    url: z
      .url()
      .optional(),

    location: z
      .string()
      .min(1)
      .optional(),

    usageTypes: z.array(
      sourceUsageTypeSchema,
    ),

    relatedEntityIds: z.array(
      entityIdSchema,
    ),

    license: z
      .string()
      .min(1)
      .optional(),

    permissionStatus: z
      .string()
      .min(1)
      .optional(),

    status: publicationStatusSchema,
  })
  .strict();