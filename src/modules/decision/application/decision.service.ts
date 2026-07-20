import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { auditEvents, decisions, opportunities } from '@/lib/db/schema';
import { DecisionSchema } from '@/lib/validation/schemas';
import { OpportunityService } from '@/modules/opportunity/application/opportunity.service';
import { assertHumanDecisionAuthority } from '../domain/decision-policy';

type CreateDecisionInput = z.infer<typeof DecisionSchema>;

const outcomeToDatabase = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DEFERRED: 'deferred',
} as const;

export class DecisionService {
  private readonly opportunityService = new OpportunityService();

  async recordHumanDecision(input: CreateDecisionInput) {
    const valid = DecisionSchema.parse(input);
    const readiness = await this.opportunityService.getDecisionReadiness(valid.opportunityId);

    if (!readiness) {
      throw new Error('Opportunity not found.');
    }

    assertHumanDecisionAuthority({ actorKind: valid.actorKind, readiness });

    return db.transaction(async (tx) => {
      const [decision] = await tx.insert(decisions).values({
        opportunityId: valid.opportunityId,
        outcome: outcomeToDatabase[valid.outcome],
        rationale: valid.rationale,
        decidedByActorId: valid.decidedByActorId,
        decidedAt: valid.decidedAt ?? new Date(),
      }).returning();

      await tx.update(opportunities)
        .set({ status: 'decided', updatedAt: new Date() })
        .where(eq(opportunities.id, valid.opportunityId));

      await tx.insert(auditEvents).values({
        entityType: 'decision',
        entityId: decision.id,
        action: 'DECISION_RECORDED',
        actorId: valid.decidedByActorId,
        reason: valid.rationale,
        payload: {
          opportunityId: valid.opportunityId,
          outcome: valid.outcome,
          authority: valid.actorKind,
        },
      });

      return decision;
    });
  }
}
