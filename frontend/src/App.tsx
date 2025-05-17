import { useState, useEffect } from 'react';
import './index.css';
import HeroSection from './components/HeroSection';
import NoteInput from './components/NoteInput';
import SummaryDisplay from './components/SummaryDisplay';

// API configuration
const API_URL = 'http://localhost:8000';

// Type definitions
interface Note {
  id: number;
  original_text: string;
  summary: string;
  created_at: string;
}

function App() {
  const [originalText, setOriginalText] = useState<string>('');
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showSavedNotes, setShowSavedNotes] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  
  // Fetch saved notes when needed
  const fetchNotes = async () => {
    setNotesLoading(true);
    try {
      const response = await fetch(`${API_URL}/notes`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setNotesLoading(false);
    }
  };
  
  // Refresh notes when showing saved notes
  useEffect(() => {
    if (showSavedNotes) {
      fetchNotes();
    }
  }, [showSavedNotes]);

  const handleSubmit = async (text: string) => {
    setIsLoading(true);
    setSummary(null);
    setOriginalText(text);
    
    try {
      console.log('Sending request to:', `${API_URL}/summarize`);
      console.log('Request payload:', JSON.stringify({ text }));
      
      const response = await fetch(`${API_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error summarizing text:', error);
      setSummary('Error: Could not generate summary. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle successful save
  const handleSaved = () => {
    // If showing saved notes, refresh the list
    if (showSavedNotes) {
      fetchNotes();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 container mx-auto py-8">
        <HeroSection />
        
        <div className="mb-6 flex justify-end max-w-3xl mx-auto px-4">
          <button 
            onClick={() => setShowSavedNotes(!showSavedNotes)}
            className="text-red-800 hover:text-red-900 underline text-sm"
          >
            {showSavedNotes ? 'Hide Saved Notes' : 'Show Saved Notes'}
          </button>
        </div>
        
        {showSavedNotes ? (
          <div className="w-full max-w-3xl mx-auto px-4">
            <h2 className="text-xl font-semibold text-red-800 mb-4">Saved Notes</h2>
            {notesLoading ? (
              <p className="text-gray-500">Loading saved notes...</p>
            ) : notes.length === 0 ? (
              <p className="text-gray-500">No saved notes yet.</p>
            ) : (
              <div className="space-y-4">
                {notes.map(note => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="font-medium text-red-800 mb-2">Summary:</h3>
                    <p className="text-gray-800 whitespace-pre-wrap mb-4">{note.summary}</p>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-red-700 hover:text-red-800">
                        Show Original Text
                      </summary>
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {note.original_text.length > 300 
                            ? `${note.original_text.substring(0, 300)}...` 
                            : note.original_text}
                        </p>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <NoteInput onSubmit={handleSubmit} isLoading={isLoading} />
            <SummaryDisplay 
              summary={summary} 
              originalText={originalText} 
              onSaved={handleSaved} 
            />
          </>
        )}
      </main>
      
      <footer className="py-4 text-center text-sm text-red-800/60">
        Powered by Hugging Face AI • <span className="hover:underline cursor-pointer" onClick={() => window.open(`${API_URL}/docs`, '_blank')}>API Docs</span>
      </footer>
    </div>
  );
}

export default App;
