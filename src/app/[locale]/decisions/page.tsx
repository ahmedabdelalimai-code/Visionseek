import { notFound } from 'next/navigation';
import { DecisionInbox } from '@/components/decision/decision-inbox';
import { routing, type AppLocale } from '@/i18n/routing';

export default async function DecisionInboxPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as AppLocale)) notFound();
  return <DecisionInbox locale={locale as AppLocale} />;
}
