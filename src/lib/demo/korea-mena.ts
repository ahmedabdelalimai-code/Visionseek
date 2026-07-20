export const KOREA_MENA_SCENARIO = {
  opportunity: {
    id: '44444444-4444-4444-8444-444444444444',
    title: 'Korea–MENA Advanced Manufacturing Corridor',
    classification: 'Strategic',
    status: 'Qualifying',
    lifecycleStage: 'Understand',
    confidence: 72,
    owner: 'Mina Rahman',
    reviewDate: '30 Sep 2026',
    summary: 'A partner-led opportunity to connect Korean advanced-manufacturing capabilities with MENA market access, strategic capital, and operating capacity.',
    keyGaps: [
      'Validate anchor-customer demand in priority MENA markets.',
      'Verify local operating and intellectual-property requirements.',
    ],
  },
  evidence: [
    {
      title: 'Regional electronics demand supports market validation',
      source: 'Korea–GCC Industrial Cooperation Brief',
      reliability: '0.78',
      status: 'Partially corroborated',
      capturedAt: '12 Jun 2026',
    },
    {
      title: 'Industrial localization programmes create an operating window',
      source: 'MENA advanced industries policy scan',
      reliability: '0.71',
      status: 'Unverified',
      capturedAt: '18 Jun 2026',
    },
  ],
  thesis: {
    title: 'Partner-led manufacturing corridor thesis',
    workingContent: 'A focused corridor can compound Korean technical depth with regional market proximity and strategic capital, provided demand, operating partners, and governance conditions are verified.',
    version: 1,
    publishedAt: '20 Jun 2026',
  },
  decision: {
    state: 'Pending human review',
    recommendation: 'Fund a 90-day market and partner validation mission.',
    rationale: 'The strategic fit is credible, but the opportunity remains in Qualifying until key gaps are resolved and the evidence base is corroborated.',
  },
} as const;
