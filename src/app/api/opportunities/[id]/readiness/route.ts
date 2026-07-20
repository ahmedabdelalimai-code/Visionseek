import { NextResponse } from 'next/server';
import { notFoundResponse, internalError } from '@/contracts/http';
import { OpportunityService } from '@/modules/opportunity/application/opportunity.service';

const opportunityService = new OpportunityService();

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const readiness = await opportunityService.getDecisionReadiness(id);
    if (!readiness) return notFoundResponse('Opportunity not found.');
    return NextResponse.json({ data: { opportunityId: id, ...readiness } });
  } catch {
    return internalError('Unable to evaluate decision readiness.');
  }
}
