export const CANONICAL_LIFECYCLE = [
  'DETECT',
  'VERIFY',
  'UNDERSTAND',
  'CONNECT',
  'DECIDE',
  'BUILD',
  'OPERATE',
  'LEARN',
  'COMPOUND',
] as const;

export type LifecycleStage = (typeof CANONICAL_LIFECYCLE)[number];

export const OPPORTUNITY_CLASSIFICATIONS = ['TACTICAL', 'STRATEGIC', 'MIXED'] as const;
export type OpportunityClassification = (typeof OPPORTUNITY_CLASSIFICATIONS)[number];

export const OPPORTUNITY_STATUSES = [
  'DRAFT',
  'QUALIFYING',
  'DECISION_READY',
  'DECIDED',
  'ARCHIVED',
] as const;
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];
