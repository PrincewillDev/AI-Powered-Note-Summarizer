import { useState, useEffect } from 'react';
import { Loader2, Sparkles, FileText } from 'lucide-react';

interface NoteInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const NoteInput = ({ onSubmit, isLoading }: NoteInputProps) => {
  const [text, setText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setCharacterCount(text.length);
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };
  
  const handlePaste = () => {
    // Visual feedback when pasting
    setIsFocused(true);
    setTimeout(() => setIsFocused(false), 200);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto">
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <label 
            htmlFor="note" 
            className="text-red-800 font-semibold flex items-center gap-2 text-lg"
          >
            <FileText className="h-5 w-5" />
            Your Document
          </label>
          <div className="text-xs text-gray-500">
            {characterCount} characters
          </div>
        </div>
        
        <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : 'scale-100'}`}>
          {/* Decorative elements */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-100 to-red-200 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 animate-tilt"></div>
          
          {/* Textarea container */}
          <div className="relative">
            <textarea
              id="note"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onPaste={handlePaste}
              className="w-full h-56 sm:h-64 p-5 border border-gray-200 rounded-lg focus:border-red-400 focus:ring-2 focus:ring-red-200 focus:ring-opacity-50 transition-all duration-300 resize-none text-gray-800 placeholder-gray-400 shadow-sm bg-white/90 backdrop-blur-sm"
              placeholder="Paste your long document or notes here..."
            />
            
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-red-300 opacity-50 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-red-300 opacity-50 rounded-bl-lg"></div>
          </div>
        </div>
        
        {/* Helper text */}
        <p className="mt-2 text-xs text-gray-500 italic">
          For best results, provide detailed content with good structure.
        </p>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg hover:from-red-800 hover:to-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 group"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
              <span>Generate Summary</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default NoteInput;
