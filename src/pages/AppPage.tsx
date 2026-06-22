import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { scrapeProfessorPage } from '../utils/scrape';
import { generateEmail, generateAnalysis } from '../utils/generateEmail';
import { generateSubjectLines } from '../utils/generateSubjectLines';
import { extractPDFText } from '../utils/extractPDF';

export default function AppPage() {
  // Student Credentials State
  const [fullName, setFullName] = useState('');
  const [academicBackground, setAcademicBackground] = useState('');
  const [researchInterests, setResearchInterests] = useState('');
  const [skills, setSkills] = useState('');
  const [targetDegree, setTargetDegree] = useState('PhD Program');
  const [notableWork, setNotableWork] = useState('');

  // Professor / Lab Targets State
  const [profName, setProfName] = useState('');
  const [university, setUniversity] = useState('');
  const [labUrl, setLabUrl] = useState('');
  const [paper1, setPaper1] = useState('');
  const [paper2, setPaper2] = useState('');
  const [paper3, setPaper3] = useState('');

  // Thesis PDF State
  const [thesisFile, setThesisFile] = useState<File | null>(null);
  const [thesisText, setThesisText] = useState('');

  // Scraped Content and Analysis State
  const [scrapedContentState, setScrapedContentState] = useState('');
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  const [analysisOutput, setAnalysisOutput] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  // Custom Instructions State
  const [customInstructions, setCustomInstructions] = useState('');

  // Loading and Status Text State
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');

  // Output, Tone, Length and Error States
  const [emailOutput, setEmailOutput] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ profName?: string; labUrl?: string }>({});
  const [generalError, setGeneralError] = useState('');
  const [tone, setTone] = useState('Formal');
  const [length, setLength] = useState('Short');

  // Copy to Clipboard Action
  const [copied, setCopied] = useState(false);

  // Subject Lines State
  const [subjectLines, setSubjectLines] = useState<string[]>([]);
  const [copiedSubjectIdx, setCopiedSubjectIdx] = useState<number | null>(null);

  // Save Draft State
  const [draftSaved, setDraftSaved] = useState(false);
  const handleCopy = () => {
    if (!emailOutput) return;
    navigator.clipboard.writeText(emailOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Action
  const handleDownload = () => {
    if (!emailOutput) return;
    const element = document.createElement("a");
    const file = new Blob([emailOutput], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "profmail-email.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Save Draft Handler
  const handleSaveDraft = () => {
    if (!emailOutput) return;
    const draft = {
      id: Date.now().toString(),
      professorName: profName,
      university: university,
      emailText: emailOutput,
      subjectLine: subjectLines[0] || '',
      timestamp: new Date().toISOString()
    };
    const stored = localStorage.getItem('profmail-drafts');
    const existing = stored ? JSON.parse(stored) : [];
    localStorage.setItem('profmail-drafts', JSON.stringify([draft, ...existing]));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  // PDF Upload Handler
  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThesisFile(file);
  };

  // Toggle Analysis Handler
  const handleToggleAnalysis = async () => {
    const nextState = !isAnalysisExpanded;
    setIsAnalysisExpanded(nextState);

    if (nextState && !analysisOutput && !loadingAnalysis) {
      setLoadingAnalysis(true);
      setAnalysisError('');
      try {
        const result = await generateAnalysis(
          {
            name: fullName,
            background: academicBackground,
            interests: researchInterests,
            skills: skills,
            degree: targetDegree,
            notableWork: notableWork,
            profName: profName,
            university: university
          },
          scrapedContentState,
          thesisText,
          paper1,
          paper2,
          paper3
        );
        setAnalysisOutput(result);
      } catch (err: any) {
        setAnalysisError(err?.message || 'Failed to generate research analysis.');
      } finally {
        setLoadingAnalysis(false);
      }
    }
  };

  const getAnalysisSection = (text: string, sectionName: string): string => {
    const marker = `[${sectionName}]`;
    const index = text.indexOf(marker);
    if (index === -1) return '';
    const start = index + marker.length;
    const nextMarkers = ['[Thesis Core Contribution]', '[Professor\'s Focus]', '[Key Overlaps]', '[Funding Fit Angle]'];
    let end = text.length;
    for (const nextMarker of nextMarkers) {
      if (nextMarker === marker) continue;
      const nextIndex = text.indexOf(nextMarker, start);
      if (nextIndex !== -1 && nextIndex < end) {
        end = nextIndex;
      }
    }
    return text.substring(start, end).trim();
  };

  const parseAnalysis = (text: string) => {
    const headings = [
      { key: 'Thesis Core Contribution', title: 'Thesis Core Contribution' },
      { key: "Professor's Focus", title: "Professor's Focus" },
      { key: 'Key Overlaps', title: 'Key Overlaps' },
      { key: 'Funding Fit Angle', title: 'Funding Fit Angle' }
    ];

    const sections: Record<string, string> = {};
    let hasSections = false;

    for (const h of headings) {
      const content = getAnalysisSection(text, h.key);
      if (content) {
        sections[h.key] = content;
        hasSections = true;
      }
    }

    if (!hasSections) {
      // Fallback regex parser in case format deviates slightly
      for (const h of headings) {
        const cleanKey = h.key.replace(/[\\'']/g, '');
        const regex = new RegExp(`(?:###|\\*\\*|#)?\\s*${cleanKey}\\s*(?::|\\b)(?:\\*\\*|#)?([\\s\\S]*?)(?=(?:###|\\*\\*|#)?\\s*(?:Thesis Core Contribution|Professor's Focus|Key Overlaps|Funding Fit Angle)|$)`, 'i');
        const match = text.match(regex);
        if (match && match[1]?.trim()) {
          sections[h.key] = match[1].trim();
          hasSections = true;
        }
      }
    }

    return { sections, hasSections };
  };

  // localStorage History State & Methods
  interface HistoryEntry {
    professorName: string;
    university: string;
    emailText: string;
    timestamp: string;
  }
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Load history from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('profmail-history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse profmail history', err);
      }
    }
  }, []);

  // Auto-fill form from template navigation state
  const location = useLocation();
  useEffect(() => {
    const state = location.state as any;
    if (state?.templateFill) {
      if (state.templateFill.degree) setTargetDegree(state.templateFill.degree);
      if (state.templateFill.tone) setTone(state.templateFill.tone);
      if (state.templateFill.length) setLength(state.templateFill.length);
    }
  }, [location.state]);

  const handleRemoveHistory = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => {
      const updated = prev.filter((_, i) => i !== indexToRemove);
      localStorage.setItem('profmail-history', JSON.stringify(updated));
      return updated;
    });
    if (expandedIndex === indexToRemove) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > indexToRemove) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // 1) Validate that Professor Name and URL are not empty
    const errors: { profName?: string; labUrl?: string } = {};
    if (!profName.trim()) {
      errors.profName = 'Professor Name is required.';
    }
    if (!labUrl.trim()) {
      errors.labUrl = 'Lab or Google Scholar URL is required.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear previous errors & analysis state
    setValidationErrors({});
    setGeneralError('');
    setSubjectLines([]);
    setAnalysisOutput('');
    setIsAnalysisExpanded(false);
    setAnalysisError('');

    try {
      // 2) Set loading true
      setLoading(true);

      // Thesis extraction step
      let localThesisText = '';
      if (thesisFile) {
        setStatusText('Reading your thesis...');
        localThesisText = await extractPDFText(thesisFile);
        setThesisText(localThesisText);
      } else {
        setThesisText('');
      }

      // 3) Set status to 'Scraping professor page...'
      setStatusText('Scraping professor page...');

      // 4) Call scrapeProfessorPage with the URL value
      const scraped = await scrapeProfessorPage(labUrl);
      setScrapedContentState(scraped);

      // 5) Set status to 'Writing your email...'
      setStatusText('Writing your email...');

      // 6) Call generateEmail with all form state values and the scraped content
      const result = await generateEmail(
        {
          name: fullName,
          background: academicBackground,
          interests: researchInterests,
          skills: skills,
          degree: targetDegree,
          notableWork: notableWork,
          profName: profName,
          university: university
        },
        scraped,
        tone,
        length,
        localThesisText,
        paper1,
        paper2,
        paper3,
        customInstructions
      );

      // 7) Store the result in an emailOutput state variable
      setEmailOutput(result);

      // Generate subject lines in background (non-blocking)
      generateSubjectLines(profName, university, paper1, scraped)
        .then(lines => setSubjectLines(lines))
        .catch(() => {});

      // Save entry to localStorage history
      const newEntry: HistoryEntry = {
        professorName: profName,
        university: university,
        emailText: result,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => {
        const updated = [newEntry, ...prev].slice(0, 5);
        localStorage.setItem('profmail-history', JSON.stringify(updated));
        return updated;
      });
    } catch (error: any) {
      console.error(error);
      // 9) If anything throws, set error message state
      setGeneralError(error.message || 'Something went wrong. Please check your API keys and try again.');
    } finally {
      // 8) Set loading false and clear status
      setLoading(false);
      setStatusText('');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Title / Description Header */}
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-[#e8e2d3] mb-2">
          Personalized Email Generator
        </h1>
        <p className="text-sm text-[#cdc7af]">
          Fill in your academic profile and specify your target lab to generate tailored outreach emails.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-[#1f1f1f] rounded-2xl bg-brand-card/30 overflow-hidden" style={{boxShadow:'0 0 0 1px #1a1a1a, 0 32px 80px rgba(0,0,0,0.5)'}}>
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#1f1f1f]">
          
          {/* Left Column: Student Credentials */}
          <div className="p-10 space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-[11px] font-bold tracking-[0.1em] text-[#e8d44d] uppercase whitespace-nowrap">
                Student Credentials
              </h2>
              <div className="flex-1 h-px bg-[#2a2a2a]"></div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] uppercase tracking-[0.08em] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alan Turing"
                className="pm-field"
                required
              />
            </div>

            {/* Academic Background */}
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] uppercase tracking-[0.08em] mb-2">
                Academic Background
              </label>
              <input
                type="text"
                value={academicBackground}
                onChange={(e) => setAcademicBackground(e.target.value)}
                placeholder="e.g. BSc Computer Science, BRAC University"
                className="pm-field"
                required
              />
            </div>

            {/* Research Interests */}
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] uppercase tracking-[0.08em] mb-2">
                Research Interests
              </label>
              <textarea
                rows={3}
                value={researchInterests}
                onChange={(e) => setResearchInterests(e.target.value)}
                placeholder="e.g. LLM security, adversarial robustness, fine-tuning"
                className="pm-field"
                required
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] uppercase tracking-[0.08em] mb-2">
                Skills
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. PyTorch, Python, transformers, LLMs, research writing"
                className="pm-field"
                required
              />
            </div>

            {/* Target Degree */}
            <div>
              <label className="block text-[11px] font-semibold text-[#666666] uppercase tracking-[0.08em] mb-2">
                Target Degree
              </label>
              <div className="relative">
                <select
                  value={targetDegree}
                  onChange={(e) => setTargetDegree(e.target.value)}
                  className="pm-field"
                  style={{appearance:'none'}}
                >
                  <option value="PhD Program">PhD Program</option>
                  <option value="Master's Program">Master's Program</option>
                  <option value="Post-Doc">Post-Doc</option>
                  <option value="Undergraduate Research">Undergraduate Research</option>
                </select>
                {/* Custom arrow decoration */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#cdc7af]">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Notable Work */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-semibold text-[#666666] uppercase tracking-[0.08em]">
                  Notable Work
                </label>
                <span className="text-[10px] text-[#3a3a3a] uppercase tracking-wider">Optional</span>
              </div>
              <textarea
                rows={2}
                value={notableWork}
                onChange={(e) => setNotableWork(e.target.value)}
                placeholder="e.g. Thesis title, published papers — optional"
                className="pm-field"
              />
            </div>

            {/* Thesis PDF Upload */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-semibold text-[#666666] uppercase tracking-[0.08em]">
                  Thesis / Research Paper (PDF)
                </label>
                <span className="text-[10px] text-[#3a3a3a] uppercase tracking-wider">Optional</span>
              </div>
              <label
                htmlFor="thesis-pdf-upload"
                className={`flex flex-col items-center justify-center w-full min-h-[96px] bg-[#1a1a1a] border-2 border-dashed rounded-lg cursor-pointer hover:bg-[#1f1f1f] transition-colors p-4 ${
                  thesisFile ? 'border-[#e8d44d]/50' : 'border-[#e8d44d]'
                }`}
              >
                {thesisFile ? (
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-[#e8d44d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-[#e8e2d3] truncate max-w-[220px]">{thesisFile.name}</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-[#e8d44d]/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-[#cdc7af]">Click to upload PDF</span>
                  </>
                )}
                <input
                  id="thesis-pdf-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handlePDFChange}
                />
              </label>
              <p className="text-[10px] text-[#cdc7af]/50 mt-1.5">Max 10MB — your thesis is read locally and never stored</p>
            </div>
          </div>

          {/* Right Column: Professor / Lab Targets */}
          <div className="p-10 space-y-5 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-[11px] font-bold tracking-[0.1em] text-[#e8d44d] uppercase whitespace-nowrap">
                  Professor / Lab Targets
                </h2>
                <div className="flex-1 h-px bg-[#2a2a2a]"></div>
              </div>

              {/* Professor Name */}
              <div>
                <label className="block text-[11px] font-semibold text-[#666666] uppercase tracking-[0.08em] mb-2">
                  Professor Name
                </label>
                <input
                  type="text"
                  value={profName}
                  onChange={(e) => {
                    setProfName(e.target.value);
                    if (validationErrors.profName) {
                      setValidationErrors(prev => ({ ...prev, profName: undefined }));
                    }
                  }}
                  placeholder="e.g. Dr. Bo Li"
                  className="pm-field"
                />
                {validationErrors.profName && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">{validationErrors.profName}</p>
                )}
              </div>

              {/* University */}
              <div>
                <label className="block text-[11px] font-semibold text-[#666666] uppercase tracking-[0.08em] mb-2">
                  University
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. UIUC"
                  className="pm-field"
                  required
                />
              </div>

              {/* Lab or Google Scholar URL */}
              <div>
                <label className="block text-[11px] font-semibold text-[#666666] uppercase tracking-[0.08em] mb-2">
                  Lab or Google Scholar URL
                </label>
                <input
                  type="url"
                  value={labUrl}
                  onChange={(e) => {
                    setLabUrl(e.target.value);
                    if (validationErrors.labUrl) {
                      setValidationErrors(prev => ({ ...prev, labUrl: undefined }));
                    }
                  }}
                  placeholder="https://"
                  className="pm-field"
                />
                {validationErrors.labUrl && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">{validationErrors.labUrl}</p>
                )}
              </div>

              {/* Recent Papers (up to 3) */}
              <div>
                <label className="block text-[11px] font-semibold text-[#666666] uppercase tracking-[0.08em] mb-2">
                  Recent Papers (up to 3)
                </label>
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={paper1}
                    onChange={(e) => setPaper1(e.target.value)}
                    placeholder="Paper 1 — paste title or abstract"
                    className="pm-field"
                  />
                  <textarea
                    rows={2}
                    value={paper2}
                    onChange={(e) => setPaper2(e.target.value)}
                    placeholder="Paper 2 — optional"
                    className="pm-field"
                  />
                  <textarea
                    rows={2}
                    value={paper3}
                    onChange={(e) => setPaper3(e.target.value)}
                    placeholder="Paper 3 — optional"
                    className="pm-field"
                  />
                </div>
                <p className="text-[10px] text-[#cdc7af]/50 mt-1.5">Paste abstracts for best results — titles alone also work</p>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-[#222017] border border-[#4b4735] rounded-lg p-4 flex items-start space-x-3">
              <svg 
                className="w-5 h-5 text-[#e8d44d] mt-0.5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="text-xs text-[#cdc7af] leading-relaxed">
                The tool will scan the provided URL to extract recent research topics automatically.
              </p>
            </div>
          </div>

        </div>

        {/* Custom Instructions Section */}
        <div className="border-t border-[#1f1f1f] p-10 space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <label className="block text-[11px] font-bold tracking-[0.1em] text-[#e8d44d] uppercase whitespace-nowrap">
              Custom Instructions
            </label>
            <div className="flex-1 h-px bg-[#2a2a2a]"></div>
          </div>
          <textarea
            rows={4}
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g. Mention I am from Bangladesh, emphasize my quantization work, keep it under 220 words, reference funding opportunities naturally, avoid sounding desperate"
            className="pm-field"
          />
          <p className="text-[10px] text-[#3a3a3a]">These instructions are appended directly to the generation prompt</p>
        </div>

        {/* Generate Button and Status Area */}
        <div className="border-t border-[#1f1f1f] px-10 py-8 flex flex-col items-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] bg-[#e8d44d] hover:bg-[#f0dc55] disabled:bg-[#e8d44d]/30 disabled:text-black/40 disabled:cursor-not-allowed text-black font-bold text-[16px] tracking-wide rounded-lg transition-all duration-200 hover:-translate-y-px active:translate-y-0 cursor-pointer"
            style={{boxShadow: loading ? 'none' : '0 4px 20px rgba(232,212,77,0.25)'}}
          >
            {loading ? 'Generating...' : 'Generate Email'}
          </button>
          {loading && (
            <p className="text-xs text-[#cdc7af] mt-4 font-mono tracking-wide animate-pulse">
              {statusText}
            </p>
          )}
          {generalError && (
            <p className="text-xs text-red-500 mt-4 font-semibold text-center leading-relaxed">
              {generalError}
            </p>
          )}
        </div>
      </form>

      {/* Output Section */}
      {emailOutput && (
        <div className="mt-8 border border-[#888888] rounded-xl bg-brand-card/40 p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in">
          {/* Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-[#888888]/20">
            {/* Tone Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#cdc7af]">Tone:</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setTone('Formal')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all duration-200 cursor-pointer border ${
                    tone === 'Formal'
                      ? 'bg-[#e8d44d] text-black border-[#e8d44d]'
                      : 'bg-transparent text-white border-[#e8d44d] hover:bg-[#e8d44d]/10'
                  }`}
                >
                  Formal
                </button>
                <button
                  type="button"
                  onClick={() => setTone('Semi-formal')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all duration-200 cursor-pointer border ${
                    tone === 'Semi-formal'
                      ? 'bg-[#e8d44d] text-black border-[#e8d44d]'
                      : 'bg-transparent text-white border-[#e8d44d] hover:bg-[#e8d44d]/10'
                  }`}
                >
                  Semi-formal
                </button>
              </div>
            </div>

            {/* Length Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#cdc7af]">Length:</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setLength('Short')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all duration-200 cursor-pointer border ${
                    length === 'Short'
                      ? 'bg-[#e8d44d] text-black border-[#e8d44d]'
                      : 'bg-transparent text-white border-[#e8d44d] hover:bg-[#e8d44d]/10'
                  }`}
                >
                  Short
                </button>
                <button
                  type="button"
                  onClick={() => setLength('Detailed')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all duration-200 cursor-pointer border ${
                    length === 'Detailed'
                      ? 'bg-[#e8d44d] text-black border-[#e8d44d]'
                      : 'bg-transparent text-white border-[#e8d44d] hover:bg-[#e8d44d]/10'
                  }`}
                >
                  Detailed
                </button>
              </div>
            </div>
          </div>

          {/* Subject Lines Panel */}
          {subjectLines.length > 0 && (
            <div className="space-y-2 pb-4 border-b border-[#888888]/20">
              <p className="text-[11px] font-bold text-[#cdc7af] uppercase tracking-widest">Suggested Subject Lines — click to copy</p>
              <div className="flex flex-col sm:flex-row gap-2">
                {(['Direct', 'Research-focused', 'Warm'] as const).map((label, idx) =>
                  subjectLines[idx] ? (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(subjectLines[idx]);
                        setCopiedSubjectIdx(idx);
                        setTimeout(() => setCopiedSubjectIdx(null), 2000);
                      }}
                      className="flex-1 text-left px-3 py-2.5 bg-black border border-[#888888] hover:border-[#e8d44d] rounded-lg transition-all duration-200 group cursor-pointer"
                    >
                      <span className="block text-[9px] font-bold text-[#e8d44d]/70 uppercase tracking-widest mb-1">{label}</span>
                      <span className="block text-xs text-[#e8e2d3] leading-snug group-hover:text-white transition-colors">
                        {copiedSubjectIdx === idx ? '✓ Copied!' : subjectLines[idx]}
                      </span>
                    </button>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Research Overlap Analysis Collapsible Section */}
          <div className="border border-[#888888]/30 rounded-lg overflow-hidden bg-black/40">
            <button
              type="button"
              onClick={handleToggleAnalysis}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#161616] hover:bg-[#1f1f1f] text-xs font-bold uppercase tracking-wider text-[#cdc7af] transition-colors cursor-pointer border-none focus:outline-none"
            >
              <span>Research Overlap Analysis</span>
              <svg
                className={`w-4 h-4 text-[#cdc7af] transition-transform duration-200 ${
                  isAnalysisExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isAnalysisExpanded && (
              <div className="p-4 border-t border-[#888888]/20 space-y-4">
                {loadingAnalysis ? (
                  <div className="flex items-center space-x-2 text-xs text-[#cdc7af]">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#e8d44d]"></div>
                    <span>Analyzing research overlap...</span>
                  </div>
                ) : analysisError ? (
                  <p className="text-xs text-[#ff5f57]">{analysisError}</p>
                ) : analysisOutput ? (
                  <div className="space-y-4">
                    {(() => {
                      const { sections, hasSections } = parseAnalysis(analysisOutput);
                      if (hasSections) {
                        return (
                          <>
                            {[
                              { key: 'Thesis Core Contribution', title: 'Thesis Core Contribution' },
                              { key: "Professor's Focus", title: "Professor's Focus" },
                              { key: 'Key Overlaps', title: 'Key Overlaps' },
                              { key: 'Funding Fit Angle', title: 'Funding Fit Angle' }
                            ].map((sec) => {
                              const content = sections[sec.key] || '';
                              if (!content) return null;
                              return (
                                <div key={sec.key} className="bg-[#121212] border-l-4 border-[#e8d44d] p-4 rounded-r">
                                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#e8d44d] mb-2">
                                    {sec.title}
                                  </h4>
                                  <p className="text-xs text-[#cdc7af] whitespace-pre-line leading-relaxed">
                                    {content}
                                  </p>
                                </div>
                              );
                            })}
                          </>
                        );
                      } else {
                        return (
                          <div className="bg-[#121212] border-l-4 border-[#e8d44d] p-4 rounded-r">
                            <p className="text-xs text-[#cdc7af] whitespace-pre-line leading-relaxed">
                              {analysisOutput}
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                ) : (
                  <p className="text-xs text-[#cdc7af]/60 italic">No analysis data loaded.</p>
                )}
              </div>
            )}
          </div>

          {/* Editable Textarea */}
          <div>
            <textarea
              rows={12}
              value={emailOutput}
              onChange={(e) => setEmailOutput(e.target.value)}
              className="w-full bg-black border border-[#888888] text-white focus:border-[#e8d44d] focus:outline-none p-4 rounded-lg font-sans text-sm leading-relaxed resize-y"
              placeholder="Your generated email will appear here..."
            />
          </div>

          {/* Buttons Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-grow sm:flex-grow-0 px-5 py-2.5 bg-transparent border border-[#e8d44d] text-[#e8d44d] hover:bg-[#e8d44d] hover:text-black font-semibold text-xs rounded transition-all duration-300 uppercase tracking-wider cursor-pointer"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="flex-grow sm:flex-grow-0 px-5 py-2.5 bg-transparent border border-[#e8d44d] text-[#e8d44d] hover:bg-[#e8d44d] hover:text-black font-semibold text-xs rounded transition-all duration-300 uppercase tracking-wider cursor-pointer"
            >
              Regenerate
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex-grow sm:flex-grow-0 px-5 py-2.5 bg-transparent border border-[#e8d44d] text-[#e8d44d] hover:bg-[#e8d44d] hover:text-black font-semibold text-xs rounded transition-all duration-300 uppercase tracking-wider cursor-pointer"
            >
              Download as .txt
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-grow sm:flex-grow-0 px-5 py-2.5 bg-[#e8d44d] text-black font-bold text-xs rounded transition-all duration-300 uppercase tracking-wider cursor-pointer hover:bg-[#f3df59] active:scale-95"
            >
              {draftSaved ? '✓ Saved to Drafts!' : 'Save Draft'}
            </button>
          </div>
        </div>
      )}

      {/* Recent Emails History Section */}
      <div className="mt-12 space-y-6">
        <h2 className="text-xs font-bold tracking-widest text-[#e8d44d] uppercase pb-2 border-b border-[#e8d44d]/20">
          Recent Emails
        </h2>
        {history.length === 0 ? (
          <p className="text-sm text-[#cdc7af] italic text-center py-4">
            No recent email outreach history found.
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div 
                key={index}
                className="border border-[#888888]/40 bg-brand-card/20 rounded-lg overflow-hidden transition-all duration-300"
              >
                {/* Header Row */}
                <div 
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-brand-card/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <span className="font-semibold text-sm text-[#e8e2d3]">
                      {item.professorName} ({item.university})
                    </span>
                    <span className="text-[10px] text-[#cdc7af]/60 font-mono mt-0.5 sm:mt-0">
                      {new Date(item.timestamp).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={(e) => handleRemoveHistory(index, e)}
                      className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <svg
                      className={`w-4 h-4 text-[#cdc7af] transform transition-transform duration-200 ${
                        expandedIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Collapsible Content */}
                {expandedIndex === index && (
                  <div className="p-4 border-t border-[#888888]/30 bg-black/40">
                    <pre className="font-sans text-xs text-[#cdc7af] whitespace-pre-wrap leading-relaxed select-all">
                      {item.emailText}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
