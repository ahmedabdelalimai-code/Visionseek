import { NextResponse } from 'next/server';
import { CreateEvidenceRequestSchema } from '@/contracts/api';
import { badRequest, internalError } from '@/contracts/http';
import { db } from '@/lib/db/client';
import { auditEvents, evidence } from '@/lib/db/schema';

export async function POST(request: Request) {
  const payload: unknown = await request.json().catch(() => null);
  const parsed = CreateEvidenceRequestSchema.safeParse(payload);
  if (!parsed.success) return badRequest('Invalid evidence payload.', parsed.error.flatten());

  try {
    const input = parsed.data;
    const captured = await db.transaction(async (tx) => {
      const [created] = await tx.insert(evidence).values({
        opportunityId: input.opportunityId,
        claimId: input.claimId ?? null,
        sourceId: input.sourceId ?? null,
        title: input.title,
        excerpt: input.excerpt,
        capturedByActorId: input.capturedByActorId,
        capturedAt: input.capturedAt ?? new Date(),
        reliabilityScore: input.reliabilityScore.toFixed(3),
        corroborationStatus: input.corroborationStatus.toLowerCase(),
      }).returning();

      await tx.insert(auditEvents).values({
        entityType: 'evidence',
        entityId: created.id,
        action: 'EVIDENCE_CAPTURED',
        actorId: input.capturedByActorId,
        payload: { opportunityId: input.opportunityId, sourceId: input.sourceId ?? null },
      });

      return created;
    });

    return NextResponse.json({ data: captured }, { status: 201 });
  } catch {
    return internalError('Unable to capture evidence.');
  }
}
