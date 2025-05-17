import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface NoteInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const NoteInput = ({ onSubmit, isLoading }: NoteInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto px-4">
      <div className="mb-4">
        <label 
          htmlFor="note" 
          className="block text-red-800 font-medium mb-2"
        >
          Your Note
        </label>
        <textarea
          id="note"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:border-red-400 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition-colors resize-none text-red-800 placeholder-red-300"
          placeholder="Paste your long text here..."
        />
      </div>
      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="w-full sm:w-auto px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Summarizing...
          </>
        ) : (
          'Summarize'
        )}
      </button>
    </form>
  );
};

export default NoteInput;
