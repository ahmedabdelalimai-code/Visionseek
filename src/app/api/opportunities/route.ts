import { NextResponse } from 'next/server';
import { CreateOpportunityRequestSchema } from '@/contracts/api';
import { badRequest, internalError } from '@/contracts/http';
import { OpportunityService } from '@/modules/opportunity/application/opportunity.service';

const opportunityService = new OpportunityService();

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const parsed = CreateOpportunityRequestSchema.safeParse(payload);
  if (!parsed.success) return badRequest('Invalid opportunity payload.', parsed.error.flatten());

  try {
    const opportunity = await opportunityService.create(parsed.data);
    return NextResponse.json({ data: opportunity }, { status: 201 });
  } catch {
    return internalError('Unable to create opportunity.');
  }
}
