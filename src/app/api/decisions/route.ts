import { NextResponse } from 'next/server';
import { CreateDecisionRequestSchema } from '@/contracts/api';
import { badRequest, internalError, notFoundResponse } from '@/contracts/http';
import { DecisionService } from '@/modules/decision/application/decision.service';

const decisionService = new DecisionService();

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const parsed = CreateDecisionRequestSchema.safeParse(payload);
  if (!parsed.success) return badRequest('Invalid decision payload.', parsed.error.flatten());

  try {
    const decision = await decisionService.recordHumanDecision(parsed.data);
    return NextResponse.json({ data: decision }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to record decision.';
    if (message === 'Opportunity not found.') return notFoundResponse(message);
    if (message.startsWith('Opportunity is not DecisionReady')) {
      return NextResponse.json({ error: { code: 'DECISION_NOT_READY', message } }, { status: 409 });
    }
    return internalError(message);
  }
}
