/**
 * Opaque identifiers are represented as UUID strings at this boundary.
 * PostgreSQL owns UUID generation; application services never synthesize IDs.
 */
export type EntityId = string;
export type ActorId = EntityId;
export type OpportunityId = EntityId;
export type ThesisId = EntityId;
export type EvidenceId = EntityId;
export type DecisionId = EntityId;
