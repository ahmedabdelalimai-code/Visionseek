import { KOREA_MENA_SCENARIO } from '@/lib/demo/korea-mena';
import { StatusPill } from '@/components/ui/status-pill';

export function LivingThesis() {
  const { thesis } = KOREA_MENA_SCENARIO;
  return (
    <section className="workspace-stack">
      <div className="page-heading"><div><p className="eyebrow">Opportunity Intelligence</p><h1>Living Thesis</h1><p className="lede">A working thesis evolves in draft. Published versions are immutable evidence of what was believed at a point in time.</p></div><button className="primary-button" type="button">Publish next version</button></div>
      <div className="thesis-layout">
        <article className="panel thesis-editor"><div className="panel-header"><div><h2>{thesis.title}</h2><p>Working draft</p></div><StatusPill tone="neutral">Active</StatusPill></div><textarea aria-label="Working thesis" defaultValue={thesis.workingContent} rows={12} /><div className="form-actions"><button type="button" className="secondary-button">Save working draft</button></div></article>
        <aside className="panel"><p className="eyebrow">Version history</p><h2>Published record</h2><div className="timeline"><div className="timeline-item"><span>v{thesis.version}</span><div><strong>Published thesis</strong><p>{thesis.publishedAt} · Immutable</p></div></div><div className="timeline-item muted"><span>Next</span><div><strong>Working draft</strong><p>Not published</p></div></div></div></aside>
      </div>
    </section>
  );
}
