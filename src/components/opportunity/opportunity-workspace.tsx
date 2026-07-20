import { KOREA_MENA_SCENARIO } from '@/lib/demo/korea-mena';
import { StatusPill } from '@/components/ui/status-pill';

export function OpportunityWorkspace() {
  const { opportunity } = KOREA_MENA_SCENARIO;
  return (
    <section className="workspace-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Opportunity Intelligence</p>
          <h1>{opportunity.title}</h1>
          <p className="lede">{opportunity.summary}</p>
        </div>
        <div className="heading-actions">
          <StatusPill tone="attention">{opportunity.status}</StatusPill>
          <button className="secondary-button" type="button">Request review</button>
        </div>
      </div>
      <div className="metric-grid">
        <article className="metric-card"><span>Classification</span><strong>{opportunity.classification}</strong></article>
        <article className="metric-card"><span>Lifecycle</span><strong>{opportunity.lifecycleStage}</strong></article>
        <article className="metric-card"><span>Confidence</span><strong>{opportunity.confidence}%</strong></article>
        <article className="metric-card"><span>Owner</span><strong>{opportunity.owner}</strong></article>
      </div>
      <div className="two-column-grid">
        <article className="panel">
          <div className="panel-header"><div><p className="eyebrow">Decision readiness</p><h2>Not ready for final decision</h2></div><StatusPill tone="critical">Gaps open</StatusPill></div>
          <p>The active thesis and evidence exist. A final decision remains gated by required gap resolution and human review.</p>
          <ul className="check-list">
            <li>Active thesis <span>Present</span></li>
            <li>Evidence linked <span>2 items</span></li>
            <li>Owner assigned <span>{opportunity.owner}</span></li>
            <li>Review date <span>{opportunity.reviewDate}</span></li>
          </ul>
        </article>
        <article className="panel">
          <p className="eyebrow">Key gaps</p>
          <h2>What must be learned next</h2>
          <ol className="numbered-list">
            {opportunity.keyGaps.map((gap) => <li key={gap}>{gap}</li>)}
          </ol>
        </article>
      </div>
    </section>
  );
}
