import type { OpportunityReadinessInput } from '@/lib/validation/schemas';

export type ReadinessRequirement =
  | 'ACTIVE_THESIS'
  | 'EVIDENCE'
  | 'OWNER'
  | 'REVIEW_DATE'
  | 'KEY_GAPS';

export type DecisionReadiness = {
  isReady: boolean;
  missing: ReadinessRequirement[];
};

/**
 * Canonical product rule: an opportunity cannot become DecisionReady unless it
 * has an active thesis, evidence, an owner, a review date, and key gaps.
 */
export function evaluateDecisionReadiness(input: OpportunityReadinessInput): DecisionReadiness {
  const missing: ReadinessRequirement[] = [];

  if (!input.activeThesisId) missing.push('ACTIVE_THESIS');
  if (input.evidenceCount < 1) missing.push('EVIDENCE');
  if (!input.ownerActorId) missing.push('OWNER');
  if (!input.reviewDate) missing.push('REVIEW_DATE');
  if (input.keyGaps.length < 1) missing.push('KEY_GAPS');

  return { isReady: missing.length === 0, missing };
}
