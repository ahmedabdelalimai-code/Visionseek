import { useTranslations } from 'next-intl';

export default function DecisionInbox() {
  const t = useTranslations('decisions');

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Decision Inbox</h1>
        <p className="text-muted-foreground">Manage pending strategic decisions and approvals.</p>
      </header>

      <div className="grid gap-4">
        {/* Placeholder for decision items */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-6 bg-card hover:bg-accent transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Strategic Opportunity #{i}</h3>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Pending Review</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Requested by Lead Strategist • Due in 3 days
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Review Thesis</button>
              <button className="px-4 py-2 border rounded-md text-sm">View Evidence</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
