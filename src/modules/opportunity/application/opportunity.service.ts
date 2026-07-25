import { and, count, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { evidence, opportunities, theses } from '@/lib/db/schema';
import { CreateOpportunitySchema, OpportunityReadinessInputSchema, type CreateOpportunityInput } from '@/lib/validation/schemas';
import { evaluateDecisionReadiness } from '../domain/decision-readiness';

const classificationToDatabase = {
  TACTICAL: 'tactical',
  STRATEGIC: 'strategic',
  MIXED: 'mixed',
} as const;

const statusToDatabase = {
  DRAFT: 'draft',
  QUALIFYING: 'qualifying',
  DECISION_READY: 'decision_ready',
  DECIDED: 'decided',
  ARCHIVED: 'archived',
} as const;

const stageToDatabase = {
  DETECT: 'detect',
  VERIFY: 'verify',
  UNDERSTAND: 'understand',
  CONNECT: 'connect',
  DECIDE: 'decide',
  BUILD: 'build',
  OPERATE: 'operate',
  LEARN: 'learn',
  COMPOUND: 'compound',
} as const;

export class OpportunityService {
  async create(input: CreateOpportunityInput) {
    const valid = CreateOpportunitySchema.parse(input);
    const [created] = await db.insert(opportunities).values({
      title: valid.title,
      summary: valid.summary,
      classification: classificationToDatabase[valid.classification],
      status: statusToDatabase[valid.status],
      lifecycleStage: stageToDatabase[valid.lifecycleStage],
      ownerActorId: valid.ownerActorId ?? null,
      reviewDate: valid.reviewDate ?? null,
      keyGaps: valid.keyGaps,
      confidence: valid.confidence.toFixed(3),
    }).returning();
    return created;
  }

  async getDecisionReadiness(opportunityId: string) {
    const [opportunity] = await db.select({
      id: opportunities.id,
      ownerActorId: opportunities.ownerActorId,
      reviewDate: opportunities.reviewDate,
      keyGaps: opportunities.keyGaps,
    }).from(opportunities).where(eq(opportunities.id, opportunityId));

    if (!opportunity) return null;

    const [activeThesis] = await db.select({ id: theses.id })
      .from(theses)
      .where(and(eq(theses.opportunityId, opportunityId), eq(theses.active, true)));

    const [evidenceResult] = await db.select({ total: count() })
      .from(evidence)
      .where(eq(evidence.opportunityId, opportunityId));

    const input = OpportunityReadinessInputSchema.parse({
      opportunityId,
      activeThesisId: activeThesis?.id ?? null,
      evidenceCount: Number(evidenceResult?.total ?? 0),
      ownerActorId: opportunity.ownerActorId,
      reviewDate: opportunity.reviewDate,
      keyGaps: opportunity.keyGaps,
    });

    return evaluateDecisionReadiness(input);
  }
}
