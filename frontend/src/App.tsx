import { useState, useEffect } from 'react';
import './index.css';
import HeroSection from './components/HeroSection';
import NoteInput from './components/NoteInput';
import SummaryDisplay from './components/SummaryDisplay';
import { ArrowUpRight, Loader2, BookOpen } from 'lucide-react';

// API configuration
const API_URL = 'http://localhost:8000';

// Type definitions
interface Note {
  id: number;
  note_session_id: string;
  original_text: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const [originalText, setOriginalText] = useState<string>('');
  const [summary, setSummary] = useState<string | null>(null);
  const [noteSessionId, setNoteSessionId] = useState<string | null>(null);
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
  
  // Update document title based on app state
  useEffect(() => {
    const baseTitle = 'AI-Powered Note Summarizer';
    if (isLoading) {
      document.title = `Generating... | ${baseTitle}`;
    } else if (summary) {
      document.title = `Summary Ready | ${baseTitle}`;
    } else if (showSavedNotes) {
      document.title = `Saved Notes | ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
    
    // Cleanup when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [isLoading, summary, showSavedNotes]);

  const handleSubmit = async (text: string) => {
    setIsLoading(true);
    setSummary(null);
    setNoteSessionId(null);
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
      setNoteSessionId(data.note_session_id);
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <div className="absolute top-0 right-0 w-full h-64 bg-red-50 opacity-30 -z-10 skew-y-6 transform origin-top-right"></div>
      
      <main className="flex-1 container mx-auto py-8 px-4 md:px-8 relative z-10">
        <HeroSection />
        
        <div className="mb-8 flex justify-end max-w-4xl mx-auto">
          <button 
            onClick={() => setShowSavedNotes(!showSavedNotes)}
            className="relative text-red-800 hover:text-red-900 flex items-center gap-1 text-sm font-medium transition-all hover:gap-2 px-4 py-2 group overflow-hidden"
          >
            <span className="relative z-10">
              {showSavedNotes ? 'Back to Summarizer' : 'View Saved Notes'}
            </span>
            <ArrowUpRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span className="absolute inset-0 bg-red-50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-md"></span>
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto backdrop-blur-sm backdrop-filter bg-white/80 rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-500">
          {showSavedNotes ? (
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-red-800 mb-6">Saved Notes</h2>
              {notesLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-3 w-3 bg-red-200 rounded-full"></div>
                    <div className="h-3 w-3 bg-red-300 rounded-full"></div>
                    <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                  </div>
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No saved notes yet.</p>
                  <p className="text-gray-400 mt-2 text-sm">Summarize notes and save them to see them here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {notes.map((note, index) => (
                    <div 
                      key={note.id} 
                      className="border border-gray-100 rounded-lg p-6 transition-all hover:shadow-md bg-white group relative overflow-hidden animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Decorative element */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-50 via-red-200 to-red-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      
                      <div className="mb-3 flex justify-between items-center">
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                          {new Date(note.created_at).toLocaleString()}
                        </span>
                        <span className="text-xs text-red-500/60 font-medium">Note #{notes.length - index}</span>
                      </div>
                      
                      <h3 className="font-medium text-red-800 mb-3 text-lg flex items-center gap-2">
                        <span className="bg-red-100/50 p-1 rounded-md inline-block">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-800">
                            <path d="M14 9V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V12a3 3 0 0 0-3-3h-3z"></path>
                          </svg>
                        </span>
                        Summary
                      </h3>
                      
                      <div className="bg-white rounded border border-gray-100 p-4 mb-4 relative">
                        <div className="absolute -top-1.5 -left-1.5 text-3xl text-red-200 opacity-40 font-serif">"</div>
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed relative z-10">{note.summary}</p>
                        <div className="absolute -bottom-5 -right-1 text-3xl text-red-200 opacity-40 font-serif transform rotate-180">"</div>
                      </div>
                      
                      <details className="text-sm group/details">
                        <summary className="cursor-pointer text-red-700 hover:text-red-800 inline-flex items-center gap-1 font-medium select-none">
                          <span>View Original Text</span>
                          <span className="text-xs bg-red-50 px-2 py-0.5 rounded-full text-red-600 group-open/details:rotate-180 transform transition-transform">↓</span>
                        </summary>
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-100 transition-all">
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
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
            <div className="p-6 md:p-8">
              <NoteInput onSubmit={handleSubmit} isLoading={isLoading} />
              
              {isLoading && (
                <div className="w-full mt-12 flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-50 rounded-full scale-150 blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-red-700 to-red-800 p-3 rounded-full shadow-lg flex items-center justify-center">
                      <Loader2 className="h-7 w-7 text-white animate-spin" />
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <h3 className="text-lg font-semibold text-red-800 mb-1.5">Generating Summary</h3>
                    <p className="text-sm text-gray-600">Analyzing and condensing your document...</p>
                  </div>
                </div>
              )}
              
              {!isLoading && originalText && !summary && (
                <div className="w-full mt-12 flex flex-col items-center justify-center py-12 text-center text-gray-500">
                  <BookOpen className="h-8 w-8 mb-3 text-red-200" />
                  <p>Unable to generate summary. Please try again.</p>
                </div>
              )}
              
              <SummaryDisplay 
                summary={summary} 
                originalText={originalText} 
                noteSessionId={noteSessionId}
                onSaved={handleSaved} 
              />
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-8 text-center">
        <div className="max-w-4xl mx-auto px-4 border-t border-gray-100 pt-6">
          <p className="text-sm text-red-800/70">
            Powered by AI &middot; <span className="hover:underline cursor-pointer transition-colors hover:text-red-900" onClick={() => window.open(`${API_URL}/docs`, '_blank')}>API Documentation</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
