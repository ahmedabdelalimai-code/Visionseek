import { describe, expect, it } from 'vitest';
import { evaluateDecisionReadiness } from '@/modules/opportunity/domain/decision-readiness';
import { assertHumanDecisionAuthority } from '@/modules/decision/domain/decision-policy';
import { validateConfidenceChange } from '@/modules/integrity/domain/confidence-change';
import { fixtureIds, koreaMenaReadinessFixture } from '../fixtures/korea-mena';

describe('DecisionReady policy', () => {
  it('marks a complete Korea–MENA opportunity as ready', () => {
    expect(evaluateDecisionReadiness(koreaMenaReadinessFixture)).toEqual({
      isReady: true,
      missing: [],
    });
  });

  it('reports every mandatory missing requirement', () => {
    expect(evaluateDecisionReadiness({
      ...koreaMenaReadinessFixture,
      activeThesisId: null,
      evidenceCount: 0,
      ownerActorId: null,
      reviewDate: null,
      keyGaps: [],
    })).toEqual({
      isReady: false,
      missing: ['ACTIVE_THESIS', 'EVIDENCE', 'OWNER', 'REVIEW_DATE', 'KEY_GAPS'],
    });
  });
});

describe('Final decision authority', () => {
  it('requires readiness before a human can make a final decision', () => {
    expect(() => assertHumanDecisionAuthority({
      actorKind: 'HUMAN',
      readiness: { isReady: false, missing: ['EVIDENCE'] },
    })).toThrow('Opportunity is not DecisionReady');
  });

  it('allows a decision only once the required human and readiness conditions are met', () => {
    expect(() => assertHumanDecisionAuthority({
      actorKind: 'HUMAN',
      readiness: { isReady: true, missing: [] },
    })).not.toThrow();
  });
});

describe('Confidence change integrity', () => {
  it('requires a reason and a human actor for any confidence change', () => {
    expect(() => validateConfidenceChange({
      opportunityId: fixtureIds.opportunity,
      previousConfidence: 0.5,
      nextConfidence: 0.7,
      reason: '',
      actorId: fixtureIds.actor,
    })).toThrow();

    expect(validateConfidenceChange({
      opportunityId: fixtureIds.opportunity,
      previousConfidence: 0.5,
      nextConfidence: 0.7,
      reason: 'Two independent sources corroborated the demand signal.',
      actorId: fixtureIds.actor,
    }).reason).toContain('corroborated');
  });
});
