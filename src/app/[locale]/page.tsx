import { notFound } from 'next/navigation';
import { KOREA_MENA_SCENARIO } from '@/lib/demo/korea-mena';
import { routing, type AppLocale } from '@/i18n/routing';
import { StatusPill } from '@/components/ui/status-pill';

export default async function OverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as AppLocale)) notFound();
  const lifecycle = ['Detect', 'Verify', 'Understand', 'Connect', 'Decide', 'Build', 'Operate', 'Learn', 'Compound'];
  return <section className="workspace-stack"><div className="page-heading"><div><p className="eyebrow">Integrated Strategic Opportunity Intelligence</p><h1>Command surface</h1><p className="lede">A modular foundation for detecting, verifying, deciding, and compounding strategic opportunities.</p></div><StatusPill tone="positive">Sprint 1 foundation</StatusPill></div><div className="panel"><p className="eyebrow">Canonical lifecycle</p><div className="lifecycle-track">{lifecycle.map((stage, index) => <div key={stage} className={`lifecycle-step ${index === 2 ? 'current' : ''}`}><span>{index + 1}</span><strong>{stage}</strong></div>)}</div></div><div className="two-column-grid"><article className="panel"><p className="eyebrow">Featured opportunity</p><h2>{KOREA_MENA_SCENARIO.opportunity.title}</h2><p>{KOREA_MENA_SCENARIO.opportunity.summary}</p><div className="metadata-row"><span>{KOREA_MENA_SCENARIO.opportunity.classification}</span><span>{KOREA_MENA_SCENARIO.opportunity.confidence}% confidence</span></div></article><article className="panel"><p className="eyebrow">Governance guardrails</p><ul className="numbered-list"><li>DecisionReady is a gated state, not a label.</li><li>Published thesis versions and audit events are immutable.</li><li>AI supports analysis and never approves final decisions.</li></ul></article></div></section>;
}
