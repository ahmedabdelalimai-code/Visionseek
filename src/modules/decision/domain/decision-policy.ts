import type { DecisionReadiness } from '@/modules/opportunity/domain/decision-readiness';

export function assertHumanDecisionAuthority(input: { actorKind: 'HUMAN'; readiness: DecisionReadiness }): void {
  if (input.actorKind !== 'HUMAN') {
    throw new Error('AI cannot approve final decisions.');
  }
  if (!input.readiness.isReady) {
    throw new Error(`Opportunity is not DecisionReady: ${input.readiness.missing.join(', ')}.`);
  }
}
