import { z } from 'zod';
import {
  CreateOpportunitySchema,
  DecisionSchema,
  EvidenceSchema,
  OpportunityReadinessInputSchema,
} from '@/lib/validation/schemas';

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export const CreateOpportunityRequestSchema = CreateOpportunitySchema;
export const CreateEvidenceRequestSchema = EvidenceSchema.omit({ id: true });
export const CreateDecisionRequestSchema = DecisionSchema.omit({ id: true });
export const OpportunityReadinessResponseSchema = z.object({
  opportunityId: z.string().uuid(),
  isReady: z.boolean(),
  missing: z.array(z.enum(['ACTIVE_THESIS', 'EVIDENCE', 'OWNER', 'REVIEW_DATE', 'KEY_GAPS'])),
});
export const OpportunityReadinessInputContractSchema = OpportunityReadinessInputSchema;
