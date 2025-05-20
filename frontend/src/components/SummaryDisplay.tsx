import { Check, Copy, MessageSquareQuote } from 'lucide-react';
import { useState } from 'react';
import SaveButton from './SaveButton';

interface SummaryDisplayProps {
  summary: string | null;
  originalText: string;
  noteSessionId: string | null;
  onSaved?: () => void;
}

const SummaryDisplay = ({ summary, originalText, noteSessionId, onSaved = () => {} }: SummaryDisplayProps) => {
  const [copied, setCopied] = useState(false);
  
  if (!summary || !noteSessionId) return null;
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="w-full mx-auto mt-12 relative">
      {/* Summary header with visual separation */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="bg-red-100 p-1.5 rounded-md">
            <MessageSquareQuote className="h-5 w-5 text-red-800" />
          </div>
          <h2 className="text-xl font-bold text-red-800">Your Summary</h2>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-gray-600 hover:text-red-700 shadow-sm"
            aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
          
          {/* Save button */}
          {summary && noteSessionId && (
            <SaveButton 
              originalText={originalText}
              summary={summary}
              noteSessionId={noteSessionId}
              onSave={onSaved}
            />
          )}
        </div>
      </div>
      
      {/* Cinematic summary display */}
      <div className="relative group">
        {/* Background glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-100 via-red-200 to-red-100 opacity-20 blur-sm rounded-xl group-hover:opacity-30 transition-opacity duration-300"></div>
        
        {/* Main content */}
        <div className="relative bg-white rounded-lg p-6 md:p-8 border border-gray-200 shadow-md">
          {/* Decorative quotes */}
          <div className="absolute -top-3 -left-3 text-5xl text-red-200 opacity-50 font-serif">"</div>
          <div className="absolute -bottom-8 -right-3 text-5xl text-red-200 opacity-50 font-serif transform rotate-180">"</div>
          
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">{summary}</p>
        </div>
      </div>
      
      {/* Stats bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-4 px-2 text-xs text-gray-500 space-y-2 sm:space-y-0">
        <div className="bg-gray-50 px-2 py-1 rounded-full">
          {Math.round(summary.length / originalText.length * 100)}% of original length
        </div>
        <div className="bg-gray-50 px-2 py-1 rounded-full">
          {summary.split(/\s+/).length} words • {summary.length} characters
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;
