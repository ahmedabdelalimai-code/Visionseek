import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const opportunityClassificationEnum = pgEnum('opportunity_classification', [
  'tactical',
  'strategic',
  'mixed',
]);
export const opportunityStatusEnum = pgEnum('opportunity_status', [
  'draft',
  'qualifying',
  'decision_ready',
  'decided',
  'archived',
]);
export const lifecycleStageEnum = pgEnum('lifecycle_stage', [
  'detect',
  'verify',
  'understand',
  'connect',
  'decide',
  'build',
  'operate',
  'learn',
  'compound',
]);
export const decisionOutcomeEnum = pgEnum('decision_outcome', ['approved', 'rejected', 'deferred']);
export const inboxStatusEnum = pgEnum('inbox_status', ['pending', 'in_review', 'resolved']);

/**
 * Identity is the sole holder of person-level information. Analytic records
 * reference actor IDs only and do not repeat contact data or profile details.
 */
export const actors = pgTable(
  'actors',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    displayName: varchar('display_name', { length: 160 }).notNull(),
    email: varchar('email', { length: 320 }).notNull(),
    role: varchar('role', { length: 64 }).notNull(),
    oidcSubject: varchar('oidc_subject', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('actors_email_unique').on(table.email),
    uniqueIndex('actors_oidc_subject_unique').on(table.oidcSubject),
  ],
);

export const sources = pgTable(
  'sources',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 300 }).notNull(),
    canonicalUrl: text('canonical_url'),
    sourceType: varchar('source_type', { length: 64 }).notNull(),
    publisher: varchar('publisher', { length: 300 }),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('sources_type_idx').on(table.sourceType)],
);

export const signals = pgTable(
  'signals',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sourceId: uuid('source_id').references(() => sources.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 300 }).notNull(),
    summary: text('summary').notNull(),
    lifecycleStage: lifecycleStageEnum('lifecycle_stage').default('detect').notNull(),
    observedAt: timestamp('observed_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('signals_stage_idx').on(table.lifecycleStage), index('signals_source_idx').on(table.sourceId)],
);

export const opportunities = pgTable(
  'opportunities',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 300 }).notNull(),
    summary: text('summary').notNull(),
    classification: opportunityClassificationEnum('classification').notNull(),
    status: opportunityStatusEnum('status').default('draft').notNull(),
    lifecycleStage: lifecycleStageEnum('lifecycle_stage').default('detect').notNull(),
    ownerActorId: uuid('owner_actor_id').references(() => actors.id, { onDelete: 'restrict' }),
    reviewDate: timestamp('review_date', { withTimezone: true }),
    keyGaps: jsonb('key_gaps').$type<string[]>().default([]).notNull(),
    confidence: numeric('confidence', { precision: 4, scale: 3 }).default('0.000').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('opportunities_status_idx').on(table.status),
    index('opportunities_classification_idx').on(table.classification),
    index('opportunities_owner_idx').on(table.ownerActorId),
  ],
);

export const theses = pgTable(
  'theses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    opportunityId: uuid('opportunity_id').notNull().references(() => opportunities.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 300 }).notNull(),
    workingContent: text('working_content').notNull(),
    active: boolean('active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('theses_opportunity_active_idx').on(table.opportunityId, table.active)],
);

/** A row with publishedAt set is immutable by database trigger and application policy. */
export const thesisVersions = pgTable(
  'thesis_versions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    thesisId: uuid('thesis_id').notNull().references(() => theses.id, { onDelete: 'cascade' }),
    versionNumber: integer('version_number').notNull(),
    content: text('content').notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    authorActorId: uuid('author_actor_id').notNull().references(() => actors.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('thesis_versions_version_unique').on(table.thesisId, table.versionNumber)],
);

export const claims = pgTable(
  'claims',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    thesisId: uuid('thesis_id').notNull().references(() => theses.id, { onDelete: 'cascade' }),
    statement: text('statement').notNull(),
    confidence: numeric('confidence', { precision: 4, scale: 3 }).default('0.000').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('claims_thesis_idx').on(table.thesisId)],
);

export const evidence = pgTable(
  'evidence',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    opportunityId: uuid('opportunity_id').notNull().references(() => opportunities.id, { onDelete: 'cascade' }),
    claimId: uuid('claim_id').references(() => claims.id, { onDelete: 'set null' }),
    sourceId: uuid('source_id').references(() => sources.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 500 }).notNull(),
    excerpt: text('excerpt').notNull(),
    reliabilityScore: numeric('reliability_score', { precision: 4, scale: 3 }).default('0.500').notNull(),
    corroborationStatus: varchar('corroboration_status', { length: 32 }).default('unverified').notNull(),
    capturedByActorId: uuid('captured_by_actor_id').notNull().references(() => actors.id, { onDelete: 'restrict' }),
    capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('evidence_opportunity_idx').on(table.opportunityId), index('evidence_claim_idx').on(table.claimId)],
);

export const decisions = pgTable(
  'decisions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    opportunityId: uuid('opportunity_id').notNull().references(() => opportunities.id, { onDelete: 'restrict' }),
    outcome: decisionOutcomeEnum('outcome').notNull(),
    rationale: text('rationale').notNull(),
    decidedByActorId: uuid('decided_by_actor_id').notNull().references(() => actors.id, { onDelete: 'restrict' }),
    decidedAt: timestamp('decided_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('decisions_opportunity_idx').on(table.opportunityId)],
);

export const decisionInboxItems = pgTable(
  'decision_inbox_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    opportunityId: uuid('opportunity_id').notNull().references(() => opportunities.id, { onDelete: 'cascade' }),
    assignedActorId: uuid('assigned_actor_id').notNull().references(() => actors.id, { onDelete: 'restrict' }),
    status: inboxStatusEnum('status').default('pending').notNull(),
    dueAt: timestamp('due_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('decision_inbox_assignee_status_idx').on(table.assignedActorId, table.status)],
);

/** Audit rows may be inserted but never changed or removed. See migration trigger. */
export const auditEvents = pgTable(
  'audit_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    entityType: varchar('entity_type', { length: 120 }).notNull(),
    entityId: uuid('entity_id').notNull(),
    action: varchar('action', { length: 160 }).notNull(),
    actorId: uuid('actor_id').notNull().references(() => actors.id, { onDelete: 'restrict' }),
    reason: text('reason'),
    payload: jsonb('payload').$type<Record<string, unknown>>().default({}).notNull(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('audit_events_entity_idx').on(table.entityType, table.entityId), index('audit_events_actor_idx').on(table.actorId)],
);

/** Every opportunity confidence change captures the human actor and a mandatory reason. */
export const opportunityConfidenceChanges = pgTable(
  'opportunity_confidence_changes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    opportunityId: uuid('opportunity_id').notNull().references(() => opportunities.id, { onDelete: 'cascade' }),
    previousConfidence: numeric('previous_confidence', { precision: 4, scale: 3 }).notNull(),
    nextConfidence: numeric('next_confidence', { precision: 4, scale: 3 }).notNull(),
    reason: text('reason').notNull(),
    actorId: uuid('actor_id').notNull().references(() => actors.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('opportunity_confidence_changes_opportunity_idx').on(table.opportunityId)],
);
