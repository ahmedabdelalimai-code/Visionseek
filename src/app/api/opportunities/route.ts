import { NextResponse } from 'next/server';
import { OpportunityService } from '@/modules/opportunity/opportunity.service';

const opportunityService = new OpportunityService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await opportunityService.createOpportunity(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
