import { pgTable, text, timestamp, uuid, integer, decimal, boolean, jsonb } from 'drizzle-orm/pg-core';

export const actors = pgTable('actors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  role: text('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const signals = pgTable('signals', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  sourceId: uuid('source_id'),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sources = pgTable('sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  url: text('url'),
  type: text('type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const opportunities = pgTable('opportunities', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull(), // Tactical, Strategic, Mixed
  status: text('status').notNull().default('draft'),
  ownerId: uuid('owner_id').references(() => actors.id),
  reviewDate: timestamp('review_date'),
  keyGaps: text('key_gaps'),
  confidence: decimal('confidence', { precision: 3, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const theses = pgTable('theses', {
  id: uuid('id').primaryKey().defaultRandom(),
  opportunityId: uuid('opportunity_id').references(() => opportunities.id).notNull(),
  content: text('content').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const thesisVersions = pgTable('thesis_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  thesisId: uuid('thesis_id').references(() => theses.id).notNull(),
  versionNumber: integer('version_number').notNull(),
  content: text('content').notNull(),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  authorId: uuid('author_id').references(() => actors.id).notNull(),
});

export const claims = pgTable('claims', {
  id: uuid('id').primaryKey().defaultRandom(),
  thesisId: uuid('thesis_id').references(() => theses.id).notNull(),
  statement: text('statement').notNull(),
  confidence: decimal('confidence', { precision: 3, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const evidence = pgTable('evidence', {
  id: uuid('id').primaryKey().defaultRandom(),
  claimId: uuid('claim_id').references(() => claims.id),
  opportunityId: uuid('opportunity_id').references(() => opportunities.id).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  sourceId: uuid('source_id').references(() => sources.id),
  reliabilityScore: decimal('reliability_score', { precision: 3, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const decisions = pgTable('decisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  opportunityId: uuid('opportunity_id').references(() => opportunities.id).notNull(),
  outcome: text('outcome').notNull(), // Approved, Rejected, Deferred
  rationale: text('rationale').notNull(),
  actorId: uuid('actor_id').references(() => actors.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const decisionInboxItems = pgTable('decision_inbox_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  opportunityId: uuid('opportunity_id').references(() => opportunities.id).notNull(),
  actorId: uuid('actor_id').references(() => actors.id).notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditEvents = pgTable('audit_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  action: text('action').notNull(),
  actorId: uuid('actor_id').references(() => actors.id).notNull(),
  changes: jsonb('changes'),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
// Sprint 1 Foundation
