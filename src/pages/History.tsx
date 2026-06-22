import { History as HistoryIcon } from 'lucide-react';

export default function History() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 bg-neutral-900 border border-brand-border rounded-full flex items-center justify-center mx-auto mb-6 text-brand-yellow">
        <HistoryIcon className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold mb-4 tracking-tight">Outreach History</h1>
      <p className="text-neutral-400 text-sm">
        A history of your generated and sent outreach emails will appear here.
      </p>
    </div>
  );
}
