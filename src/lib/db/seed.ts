import { db } from './index';
import { actors, opportunities, theses, sources, evidence } from './schema';

async function seed() {
  console.log('Seeding initial data...');

  const [actor] = await db.insert(actors).values({
    name: 'Sarah Chen',
    email: 'sarah.chen@visionseek.os',
    role: 'Lead Strategist',
  }).returning();

  const [opp] = await db.insert(opportunities).values({
    title: 'Korea–MENA Semiconductor Supply Chain Corridor',
    description: 'Establishing a strategic semiconductor assembly and testing corridor between South Korea and Saudi Arabia.',
    type: 'Strategic',
    status: 'active',
    ownerId: actor.id,
    reviewDate: new Date('2026-12-31'),
    keyGaps: 'Local talent availability, regulatory alignment on IP protection.',
    confidence: '0.75',
  }).returning();

  const [thesis] = await db.insert(theses).values({
    opportunityId: opp.id,
    content: 'Leveraging South Korea\'s manufacturing excellence with Saudi Arabia\'s energy and capital surplus creates a unique competitive advantage in the global chip market.',
    isActive: true,
  }).returning();

  const [source] = await db.insert(sources).values({
    name: 'KOTRA Market Report 2026',
    url: 'https://kotra.or.kr/report/2026',
    type: 'Official Report',
  }).returning();

  await db.insert(evidence).values({
    opportunityId: opp.id,
    title: 'NEOM Tech Investment Roadmap',
    content: 'NEOM has allocated $5B for high-tech manufacturing partnerships.',
    sourceId: source.id,
    reliabilityScore: '0.90',
  });

  console.log('Seed completed successfully.');
}

seed().catch(console.error);
