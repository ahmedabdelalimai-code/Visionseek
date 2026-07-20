export const fixtureIds = {
  actor: '11111111-1111-4111-8111-111111111111',
  opportunity: '44444444-4444-4444-8444-444444444444',
  thesis: '55555555-5555-4555-8555-555555555555',
} as const;

export const koreaMenaReadinessFixture = {
  opportunityId: fixtureIds.opportunity,
  activeThesisId: fixtureIds.thesis,
  evidenceCount: 2,
  ownerActorId: fixtureIds.actor,
  reviewDate: new Date('2026-09-30T00:00:00.000Z'),
  keyGaps: [
    'Validate anchor-customer demand in priority MENA markets.',
    'Verify local operating and intellectual-property requirements.',
  ],
};

export const koreaMenaOpportunityFixture = {
  title: 'Korea–MENA Advanced Manufacturing Corridor',
  summary: 'A strategic opportunity to connect Korean industrial depth with MENA market access and capital.',
  classification: 'STRATEGIC' as const,
  status: 'QUALIFYING' as const,
  ownerActorId: fixtureIds.actor,
  reviewDate: new Date('2026-09-30T00:00:00.000Z'),
  keyGaps: koreaMenaReadinessFixture.keyGaps,
  confidence: 0.72,
  lifecycleStage: 'UNDERSTAND' as const,
};
