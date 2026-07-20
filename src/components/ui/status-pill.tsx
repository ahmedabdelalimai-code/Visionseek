import type { ReactNode } from 'react';

const toneClass = {
  neutral: 'pill-neutral',
  attention: 'pill-attention',
  positive: 'pill-positive',
  critical: 'pill-critical',
} as const;

export function StatusPill({ children, tone = 'neutral' }: { children: ReactNode; tone?: keyof typeof toneClass }) {
  return <span className={`status-pill ${toneClass[tone]}`}>{children}</span>;
}
