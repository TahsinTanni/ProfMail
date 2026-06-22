import { Copy, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Templates() {
  const navigate = useNavigate();

  const handleUseTemplate = () => {
    navigate('/app', {
      state: {
        templateFill: {
          degree: 'PhD Program',
          tone: 'Formal',
          length: 'Detailed'
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 bg-neutral-900 border border-brand-border rounded-full flex items-center justify-center mx-auto mb-6 text-brand-yellow">
        <Copy className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold mb-4 tracking-tight">Email Templates</h1>
      <p className="text-neutral-400 max-w-md mx-auto text-sm leading-relaxed mb-8">
        Save, manage, and load custom templates to speed up your academic cold outreach generation.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* New template button */}
        <button className="border border-dashed border-brand-border hover:border-brand-yellow/50 bg-brand-card/20 rounded-lg p-6 flex flex-col items-center justify-center min-h-[160px] group transition-all cursor-pointer">
          <Plus className="w-8 h-8 text-neutral-500 group-hover:text-brand-yellow mb-2 transition-colors" />
          <span className="text-sm font-semibold text-neutral-400 group-hover:text-white transition-colors">Create Custom Template</span>
        </button>
        
        {/* Default template card */}
        <div className="border border-brand-border bg-brand-card/40 rounded-lg p-6 flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="text-[10px] font-bold text-brand-yellow tracking-widest uppercase">System Default</span>
            <h3 className="text-base font-semibold mt-1 mb-2">Standard Research Outreach</h3>
            <p className="text-xs text-neutral-400 line-clamp-2">
              A professional introduction focusing on aligning student credentials with laboratory publication topics.
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-neutral-500">Last updated: System</span>
            <button
              onClick={handleUseTemplate}
              className="text-xs text-brand-yellow hover:underline cursor-pointer font-semibold"
            >
              Use Template →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
