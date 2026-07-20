import Link from 'next/link';
import { KOREA_MENA_SCENARIO } from '@/lib/demo/korea-mena';
import { StatusPill } from '@/components/ui/status-pill';

export function DecisionInbox({ locale }: { locale: 'en' | 'ar' }) {
  const { opportunity, decision } = KOREA_MENA_SCENARIO;
  return (
    <section className="workspace-stack">
      <div className="page-heading">
        <div><p className="eyebrow">Decision Intelligence</p><h1>Decision Inbox</h1><p className="lede">Human decision-makers receive decision-ready context, never AI approvals.</p></div>
        <button type="button" className="primary-button">Create decision brief</button>
      </div>
      <article className="inbox-card">
        <div className="inbox-card-topline"><StatusPill tone="attention">{decision.state}</StatusPill><span>Review due {opportunity.reviewDate}</span></div>
        <h2>{opportunity.title}</h2>
        <p>{decision.recommendation}</p>
        <div className="inbox-card-footer"><span>Owner: {opportunity.owner}</span><span>Confidence: {opportunity.confidence}%</span><Link className="text-link" href={`/${locale}/opportunities/${opportunity.id}`}>Open workspace →</Link></div>
      </article>
      <div className="empty-state"><strong>Queue design placeholder</strong><p>This first skeleton establishes review context, status, ownership, and human authority before workflow automation is added.</p></div>
    </section>
  );
}
