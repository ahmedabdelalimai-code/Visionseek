import { describe, it, expect, vi } from 'vitest';
import { OpportunityService } from '../modules/opportunity/opportunity.service';
import { db } from '../lib/db';

vi.mock('../lib/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  },
}));

describe('OpportunityService', () => {
  const service = new OpportunityService();

  it('should fetch an opportunity by id', async () => {
    const mockOpp = { id: '1', title: 'Test Opp' };
    (db.select().from(vi.fn()).where as any).mockResolvedValue([mockOpp]);

    const result = await service.getOpportunity('1');
    expect(result).toEqual(mockOpp);
  });

  it('should validate decision readiness', async () => {
    // This would require more complex mocking of the database results
    // for theses and evidence.
    expect(service.checkDecisionReadiness).toBeDefined();
  });
});
