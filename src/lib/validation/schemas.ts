import { z } from 'zod';

export const OpportunityTypeSchema = z.enum(['Tactical', 'Strategic', 'Mixed']);
export const DecisionOutcomeSchema = z.enum(['Approved', 'Rejected', 'Deferred']);

export const ActorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string(),
});

export const OpportunitySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  type: OpportunityTypeSchema,
  status: z.string(),
  ownerId: z.string().uuid(),
  reviewDate: z.date().or(z.string().pipe(z.coerce.date())),
  keyGaps: z.string().min(1),
  confidence: z.number().min(0).max(1),
});

export const ThesisSchema = z.object({
  id: z.string().uuid().optional(),
  opportunityId: z.string().uuid(),
  content: z.string().min(1),
  isActive: z.boolean().default(true),
});

export const EvidenceSchema = z.object({
  id: z.string().uuid().optional(),
  opportunityId: z.string().uuid(),
  claimId: z.string().uuid().optional(),
  title: z.string().min(1),
  content: z.string().min(1),
  sourceId: z.string().uuid().optional(),
  reliabilityScore: z.number().min(0).max(1),
});

export const DecisionSchema = z.object({
  id: z.string().uuid().optional(),
  opportunityId: z.string().uuid(),
  outcome: DecisionOutcomeSchema,
  rationale: z.string().min(1),
  actorId: z.string().uuid(),
});

export const AuditEventSchema = z.object({
  id: z.string().uuid().optional(),
  entityType: z.string(),
  entityId: z.string().uuid(),
  action: z.string(),
  actorId: z.string().uuid(),
  changes: z.record(z.any()).optional(),
  reason: z.string().optional(),
});

// Business Rule: Opportunity Decision Readiness
export const OpportunityDecisionReadySchema = OpportunitySchema.extend({
  thesis: ThesisSchema,
  evidence: z.array(EvidenceSchema).min(1),
});
