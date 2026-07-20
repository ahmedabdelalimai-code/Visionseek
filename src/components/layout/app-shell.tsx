import Link from 'next/link';
import type { ReactNode } from 'react';
import type { AppLocale } from '@/i18n/routing';

const navigation = [
  { href: 'decisions', label: 'Decision Inbox' },
  { href: 'opportunities/44444444-4444-4444-8444-444444444444', label: 'Opportunity Workspace' },
  { href: 'evidence', label: 'Evidence Capture' },
  { href: 'thesis', label: 'Living Thesis' },
  { href: 'records/44444444-4444-4444-8444-444444444444', label: 'Decision Record' },
] as const;

export function AppShell({ children, locale }: { children: ReactNode; locale: AppLocale }) {
  const isArabic = locale === 'ar';

  return (
    <div className="app-frame">
      <aside className="sidebar" aria-label="Primary navigation">
        <Link className="brand" href={`/${locale}`}>
          <span className="brand-mark" aria-hidden="true">V</span>
          <span>
            <strong>VisionSeek</strong>
            <small>Opportunity OS</small>
          </span>
        </Link>
        <nav className="navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={`/${locale}/${item.href}`} className="navigation-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="eyebrow">Locale</span>
          <Link href={isArabic ? '/en' : '/ar'} className="locale-link">
            {isArabic ? 'English LTR' : 'العربية RTL'}
          </Link>
          <p>Foundation · Sprint 1</p>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
