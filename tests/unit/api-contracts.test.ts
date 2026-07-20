import { describe, expect, it } from 'vitest';
import { CreateOpportunityRequestSchema } from '@/contracts/api';
import { koreaMenaOpportunityFixture } from '../fixtures/korea-mena';

describe('Opportunity API contract', () => {
  it('accepts a fully classified opportunity payload', () => {
    const parsed = CreateOpportunityRequestSchema.parse(koreaMenaOpportunityFixture);
    expect(parsed.classification).toBe('STRATEGIC');
    expect(parsed.keyGaps).toHaveLength(2);
  });

  it('rejects an opportunity without Tactical, Strategic, or Mixed classification', () => {
    const result = CreateOpportunityRequestSchema.safeParse({
      ...koreaMenaOpportunityFixture,
      classification: 'UNCLASSIFIED',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a confidence value outside the explicit 0–1 range', () => {
    const result = CreateOpportunityRequestSchema.safeParse({
      ...koreaMenaOpportunityFixture,
      confidence: 1.01,
    });

    expect(result.success).toBe(false);
  });
});
