import { KOREA_MENA_SCENARIO } from '@/lib/demo/korea-mena';
import { StatusPill } from '@/components/ui/status-pill';

export function DecisionRecord() {
  const { opportunity, decision } = KOREA_MENA_SCENARIO;
  return (
    <section className="workspace-stack">
      <div className="page-heading"><div><p className="eyebrow">Decision Intelligence</p><h1>Decision Record</h1><p className="lede">A durable, auditable record that links the final human decision to its rationale, evidence, and unresolved risks.</p></div><StatusPill tone="attention">Draft decision</StatusPill></div>
      <article className="record-panel"><div className="record-section"><span className="record-label">Opportunity</span><strong>{opportunity.title}</strong></div><div className="record-section"><span className="record-label">Recommendation</span><strong>{decision.recommendation}</strong></div><div className="record-section"><span className="record-label">Rationale</span><p>{decision.rationale}</p></div><div className="record-section"><span className="record-label">Authority</span><p>Final approval must be made by an authenticated human decision-maker. AI may assist with analysis but cannot approve.</p></div><div className="record-section"><span className="record-label">Audit state</span><p>When persisted, this record emits an append-only audit event with actor, rationale, and timestamp.</p></div></article>
    </section>
  );
}
