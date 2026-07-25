import { z } from 'zod';
import {
  CANONICAL_LIFECYCLE,
  OPPORTUNITY_CLASSIFICATIONS,
  OPPORTUNITY_STATUSES,
} from '@/core/lifecycle';

const IdSchema = z.string().uuid();
const RequiredText = z.string().trim().min(1);
const OptionalText = z.string().trim().max(10_000).optional();

export const ActorRoleSchema = z.enum([
  'ADMINISTRATOR',
  'STRATEGIST',
  'ANALYST',
  'DECISION_MAKER',
  'OPERATOR',
]);

export const ActorSchema = z.object({
  id: IdSchema.optional(),
  displayName: RequiredText.max(160),
  email: z.string().email(),
  role: ActorRoleSchema,
  oidcSubject: RequiredText.max(255).optional(),
});

export const SourceTypeSchema = z.enum([
  'OFFICIAL',
  'NEWS',
  'RESEARCH',
  'MARKET_DATA',
  'INTERVIEW',
  'INTERNAL',
]);

export const SourceSchema = z.object({
  id: IdSchema.optional(),
  name: RequiredText.max(300),
  canonicalUrl: z.url().optional(),
  sourceType: SourceTypeSchema,
  publisher: OptionalText,
  publishedAt: z.coerce.date().optional(),
});

export const SignalSchema = z.object({
  id: IdSchema.optional(),
  sourceId: IdSchema.optional(),
  title: RequiredText.max(300),
  summary: RequiredText.max(5_000),
  observedAt: z.coerce.date(),
  lifecycleStage: z.enum(CANONICAL_LIFECYCLE).default('DETECT'),
});

export const OpportunityClassificationSchema = z.enum(OPPORTUNITY_CLASSIFICATIONS);
export const OpportunityStatusSchema = z.enum(OPPORTUNITY_STATUSES);

export const OpportunitySchema = z.object({
  id: IdSchema.optional(),
  title: RequiredText.max(300),
  summary: RequiredText.max(5_000),
  classification: OpportunityClassificationSchema,
  status: OpportunityStatusSchema.default('DRAFT'),
  ownerActorId: IdSchema.nullable().optional(),
  reviewDate: z.coerce.date().nullable().optional(),
  keyGaps: z.array(RequiredText.max(500)).default([]),
  confidence: z.number().min(0).max(1).default(0),
  lifecycleStage: z.enum(CANONICAL_LIFECYCLE).default('DETECT'),
});

export const CreateOpportunitySchema = OpportunitySchema.omit({ id: true });

export const ThesisSchema = z.object({
  id: IdSchema.optional(),
  opportunityId: IdSchema,
  title: RequiredText.max(300),
  workingContent: RequiredText.max(30_000),
  active: z.boolean().default(true),
});

export const ThesisVersionSchema = z.object({
  id: IdSchema.optional(),
  thesisId: IdSchema,
  versionNumber: z.number().int().positive(),
  content: RequiredText.max(30_000),
  publishedAt: z.coerce.date().nullable().optional(),
  authorActorId: IdSchema,
});

export const ClaimSchema = z.object({
  id: IdSchema.optional(),
  thesisId: IdSchema,
  statement: RequiredText.max(5_000),
  confidence: z.number().min(0).max(1).default(0),
});

export const EvidenceSchema = z.object({
  id: IdSchema.optional(),
  opportunityId: IdSchema,
  claimId: IdSchema.nullable().optional(),
  sourceId: IdSchema.nullable().optional(),
  title: RequiredText.max(500),
  excerpt: RequiredText.max(20_000),
  capturedByActorId: IdSchema,
  capturedAt: z.coerce.date().optional(),
  reliabilityScore: z.number().min(0).max(1).default(0.5),
  corroborationStatus: z.enum(['UNVERIFIED', 'PARTIAL', 'CORROBORATED', 'REFUTED']).default('UNVERIFIED'),
});

export const DecisionOutcomeSchema = z.enum(['APPROVED', 'REJECTED', 'DEFERRED']);

export const DecisionSchema = z.object({
  id: IdSchema.optional(),
  opportunityId: IdSchema,
  outcome: DecisionOutcomeSchema,
  rationale: RequiredText.max(20_000),
  decidedByActorId: IdSchema,
  actorKind: z.literal('HUMAN'),
  decidedAt: z.coerce.date().optional(),
});

export const DecisionInboxItemSchema = z.object({
  id: IdSchema.optional(),
  opportunityId: IdSchema,
  assignedActorId: IdSchema,
  status: z.enum(['PENDING', 'IN_REVIEW', 'RESOLVED']).default('PENDING'),
  dueAt: z.coerce.date().nullable().optional(),
});

export const AuditEventSchema = z.object({
  id: IdSchema.optional(),
  entityType: RequiredText.max(120),
  entityId: IdSchema,
  action: RequiredText.max(160),
  actorId: IdSchema,
  reason: OptionalText,
  occurredAt: z.coerce.date().optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
});

export const ConfidenceChangeSchema = z.object({
  opportunityId: IdSchema,
  previousConfidence: z.number().min(0).max(1),
  nextConfidence: z.number().min(0).max(1),
  reason: RequiredText.max(2_000),
  actorId: IdSchema,
}).refine(
  (change) => change.previousConfidence !== change.nextConfidence,
  { message: 'Confidence change must modify the value.', path: ['nextConfidence'] },
);

export const OpportunityReadinessInputSchema = z.object({
  opportunityId: IdSchema,
  activeThesisId: IdSchema.nullable(),
  evidenceCount: z.number().int().nonnegative(),
  ownerActorId: IdSchema.nullable(),
  reviewDate: z.coerce.date().nullable(),
  keyGaps: z.array(RequiredText),
});

export type CreateOpportunityInput = z.infer<typeof CreateOpportunitySchema>;
export type OpportunityReadinessInput = z.infer<typeof OpportunityReadinessInputSchema>;
export type ConfidenceChangeInput = z.infer<typeof ConfidenceChangeSchema>;
