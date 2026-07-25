import { KOREA_MENA_SCENARIO } from '@/lib/demo/korea-mena';
import { StatusPill } from '@/components/ui/status-pill';

export function EvidenceCapture() {
  return (
    <section className="workspace-stack">
      <div className="page-heading"><div><p className="eyebrow">Analytic Integrity</p><h1>Evidence Capture</h1><p className="lede">Capture traceable evidence against an opportunity or claim. Storage upload remains an adapter placeholder.</p></div><button className="primary-button" type="button">Capture evidence</button></div>
      <div className="evidence-layout">
        <form className="panel form-grid">
          <label>Title<input placeholder="Evidence title" /></label>
          <label>Source URL<input placeholder="https://" type="url" /></label>
          <label className="full-width">Excerpt<textarea placeholder="Verbatim excerpt or analytic note" rows={5} /></label>
          <label>Reliability score<input type="number" min="0" max="1" step="0.01" placeholder="0.00" /></label>
          <div className="full-width form-actions"><button className="secondary-button" type="button">Save draft</button><button className="primary-button" type="button">Link evidence</button></div>
        </form>
        <aside className="panel"><p className="eyebrow">Existing evidence</p><h2>Traceability</h2><div className="stacked-list">{KOREA_MENA_SCENARIO.evidence.map((item) => <article key={item.title} className="list-row"><div><strong>{item.title}</strong><p>{item.source} · captured {item.capturedAt}</p></div><StatusPill tone={item.status === 'Unverified' ? 'attention' : 'positive'}>{item.status}</StatusPill></article>)}</div></aside>
      </div>
    </section>
  );
}
