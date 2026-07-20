import { db } from './client';
import {
  actors,
  claims,
  decisionInboxItems,
  evidence,
  opportunities,
  signals,
  sources,
  theses,
  thesisVersions,
} from './schema';

const ids = {
  strategist: '11111111-1111-4111-8111-111111111111',
  source: '22222222-2222-4222-8222-222222222222',
  signal: '33333333-3333-4333-8333-333333333333',
  opportunity: '44444444-4444-4444-8444-444444444444',
  thesis: '55555555-5555-4555-8555-555555555555',
  claim: '66666666-6666-4666-8666-666666666666',
  evidence: '77777777-7777-4777-8777-777777777777',
  inbox: '88888888-8888-4888-8888-888888888888',
};

async function seed(): Promise<void> {
  await db.insert(actors).values({
    id: ids.strategist,
    displayName: 'Mina Rahman',
    email: 'mina.rahman@example.test',
    role: 'STRATEGIST',
    oidcSubject: 'seed|mina-rahman',
  }).onConflictDoNothing();

  await db.insert(sources).values({
    id: ids.source,
    name: 'Korea–GCC Industrial Cooperation Brief',
    canonicalUrl: 'https://example.test/research/korea-gcc-industrial-cooperation',
    sourceType: 'RESEARCH',
    publisher: 'VisionSeek Research Desk',
    publishedAt: new Date('2026-06-10T00:00:00.000Z'),
  }).onConflictDoNothing();

  await db.insert(signals).values({
    id: ids.signal,
    sourceId: ids.source,
    title: 'Korean advanced-manufacturing firms explore Gulf partnerships',
    summary: 'A structured signal pointing to a potential Korea–MENA value-chain corridor.',
    lifecycleStage: 'detect',
    observedAt: new Date('2026-06-12T00:00:00.000Z'),
  }).onConflictDoNothing();

  await db.insert(opportunities).values({
    id: ids.opportunity,
    title: 'Korea–MENA Advanced Manufacturing Corridor',
    summary: 'A strategic opportunity to connect Korean industrial capabilities with MENA market access, capital, and implementation capacity.',
    classification: 'strategic',
    status: 'qualifying',
    lifecycleStage: 'understand',
    ownerActorId: ids.strategist,
    reviewDate: new Date('2026-09-30T00:00:00.000Z'),
    keyGaps: [
      'Validate anchor customer demand in priority MENA markets.',
      'Verify local operating and intellectual-property requirements.',
    ],
    confidence: '0.720',
  }).onConflictDoNothing();

  await db.insert(theses).values({
    id: ids.thesis,
    opportunityId: ids.opportunity,
    title: 'Partner-led manufacturing corridor thesis',
    workingContent: 'A focused corridor can compound Korean technical depth with regional market proximity and strategic capital, provided demand, operating partners, and governance conditions are verified.',
    active: true,
  }).onConflictDoNothing();

  await db.insert(thesisVersions).values({
    thesisId: ids.thesis,
    versionNumber: 1,
    content: 'Initial published thesis: partner-led manufacturing corridor proposition.',
    publishedAt: new Date('2026-06-20T00:00:00.000Z'),
    authorActorId: ids.strategist,
  }).onConflictDoNothing();

  await db.insert(claims).values({
    id: ids.claim,
    thesisId: ids.thesis,
    statement: 'A Gulf-based assembly and test partnership can shorten regional customer lead times while retaining Korean process know-how.',
    confidence: '0.680',
  }).onConflictDoNothing();

  await db.insert(evidence).values({
    id: ids.evidence,
    opportunityId: ids.opportunity,
    claimId: ids.claim,
    sourceId: ids.source,
    title: 'Regional electronics demand supports a focused market-validation phase',
    excerpt: 'The research brief identifies growth in industrial automation and localization programmes across target Gulf markets.',
    reliabilityScore: '0.780',
    corroborationStatus: 'partial',
    capturedByActorId: ids.strategist,
  }).onConflictDoNothing();

  await db.insert(decisionInboxItems).values({
    id: ids.inbox,
    opportunityId: ids.opportunity,
    assignedActorId: ids.strategist,
    status: 'pending',
    dueAt: new Date('2026-08-01T00:00:00.000Z'),
  }).onConflictDoNothing();

  console.log('Seeded Korea–MENA opportunity scenario.');
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
