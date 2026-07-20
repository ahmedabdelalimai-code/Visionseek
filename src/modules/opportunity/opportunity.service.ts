import { db } from '@/lib/db';
import { opportunities, theses, evidence } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { OpportunitySchema, OpportunityDecisionReadySchema } from '@/lib/validation/schemas';

export class OpportunityService {
  async getOpportunity(id: string) {
    const result = await db.select().from(opportunities).where(eq(opportunities.id, id));
    return result[0];
  }

  async checkDecisionReadiness(id: string) {
    const opportunity = await this.getOpportunity(id);
    if (!opportunity) throw new Error('Opportunity not found');

    const activeThesis = await db.select().from(theses).where(
      and(eq(theses.opportunityId, id), eq(theses.isActive, true))
    );

    const relatedEvidence = await db.select().from(evidence).where(
      eq(evidence.opportunityId, id)
    );

    const data = {
      ...opportunity,
      thesis: activeThesis[0],
      evidence: relatedEvidence,
    };

    return OpportunityDecisionReadySchema.safeParse(data);
  }

  async createOpportunity(data: any) {
    const validated = OpportunitySchema.parse(data);
    return await db.insert(opportunities).values(validated).returning();
  }
}
