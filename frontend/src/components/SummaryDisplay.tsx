import SaveButton from './SaveButton';

interface SummaryDisplayProps {
  summary: string | null;
  originalText: string;
  onSaved?: () => void;
}

const SummaryDisplay = ({ summary, originalText, onSaved = () => {} }: SummaryDisplayProps) => {
  if (!summary) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-red-800">Summary</h2>
        {summary && (
          <SaveButton 
            originalText={originalText}
            summary={summary}
            onSave={onSaved}
          />
        )}
      </div>
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
        <p className="text-red-800 whitespace-pre-wrap">{summary}</p>
      </div>
    </div>
  );
};

export default SummaryDisplay;
