import { useState, useEffect } from 'react';
import { Trash2, FileText, Inbox } from 'lucide-react';

interface Draft {
  id: string;
  professorName: string;
  university: string;
  emailText: string;
  subjectLine: string;
  timestamp: string;
}

export default function Drafts() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('profmail-drafts');
    if (stored) {
      try {
        setDrafts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse drafts', e);
      }
    }
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDrafts(prev => {
      const updated = prev.filter(d => d.id !== id);
      localStorage.setItem('profmail-drafts', JSON.stringify(updated));
      return updated;
    });
    if (expandedId === id) setExpandedId(null);
  };

  const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10 flex items-center space-x-4">
        <div className="w-12 h-12 bg-neutral-900 border border-[#888888] rounded-full flex items-center justify-center text-[#e8d44d]">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#e8e2d3]">Saved Drafts</h1>
          <p className="text-sm text-[#cdc7af] mt-0.5">
            {drafts.length === 0
              ? 'No drafts saved yet'
              : `${drafts.length} draft${drafts.length === 1 ? '' : 's'} saved`}
          </p>
        </div>
      </div>

      {drafts.length === 0 ? (
        <div className="border border-[#888888]/40 bg-[#222017]/50 rounded-xl p-16 flex flex-col items-center justify-center text-center">
          <Inbox className="w-14 h-14 text-neutral-600 mb-4" />
          <h2 className="text-base font-semibold text-[#cdc7af] mb-2">No drafts yet</h2>
          <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
            Generate an email on the workspace page and click{' '}
            <strong className="text-[#e8d44d]">Save Draft</strong> to store it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xs font-bold tracking-widest text-[#e8d44d] uppercase pb-2 border-b border-[#e8d44d]/20">
            Your Drafts
          </h2>

          {drafts.map(draft => (
            <div
              key={draft.id}
              className="border border-[#888888]/40 bg-[#222017]/30 rounded-lg overflow-hidden transition-all duration-300"
            >
              {/* Header Row */}
              <div
                onClick={() => setExpandedId(expandedId === draft.id ? null : draft.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#222017]/60 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                    <span className="font-semibold text-sm text-[#e8e2d3] truncate">
                      {draft.professorName}
                      {draft.university ? ` (${draft.university})` : ''}
                    </span>
                    <span className="text-[10px] text-[#cdc7af]/60 font-mono mt-0.5 sm:mt-0 flex-shrink-0">
                      {new Date(draft.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {draft.subjectLine && (
                    <p className="text-xs text-[#cdc7af]/70 mt-0.5 truncate">
                      Subject: {draft.subjectLine}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={e => handleDelete(draft.id, e)}
                    className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                    title="Delete draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <svg
                    className={`w-4 h-4 text-[#cdc7af] transform transition-transform duration-200 ${
                      expandedId === draft.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === draft.id && (
                <div className="border-t border-[#888888]/30 bg-black/40 p-4 space-y-3">
                  {draft.subjectLine && (
                    <div className="flex items-center space-x-2 pb-2 border-b border-[#888888]/20">
                      <span className="text-[10px] font-bold text-[#cdc7af]/60 uppercase tracking-wider">
                        Subject:
                      </span>
                      <span className="text-xs text-[#e8e2d3] font-mono">{draft.subjectLine}</span>
                    </div>
                  )}
                  <pre className="font-sans text-xs text-[#cdc7af] whitespace-pre-wrap leading-relaxed select-all">
                    {draft.emailText}
                  </pre>
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={e => handleCopy(draft.emailText, draft.id, e)}
                      className="px-4 py-2 text-xs font-semibold border border-[#e8d44d] text-[#e8d44d] hover:bg-[#e8d44d] hover:text-black rounded transition-all duration-200 uppercase tracking-wider cursor-pointer"
                    >
                      {copiedId === draft.id ? '✓ Copied!' : 'Copy Email'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
