import { useState, useEffect } from 'react';
import { FileText, Copy, Share2, Download, BookOpen, Users, TrendingUp, Loader2, Save, History, AlertCircle } from 'lucide-react';

// API configuration
const API_BASE_URL = 'http://localhost:8000';

// Types for API responses
interface SummarizeResponse {
  summary: string;
  note_session_id: string;
}

interface SaveNoteRequest {
  original_text: string;
  summary: string;
  note_session_id: string;
}

interface NoteResponse {
  id: number;
  note_session_id: string;
  original_text: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const [inputText, setInputText] = useState('');
  const [summarizedText, setSummarizedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentNoteSessionId, setCurrentNoteSessionId] = useState<string>('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [savedNotes, setSavedNotes] = useState<NoteResponse[]>([]);
  const [showSavedNotes, setShowSavedNotes] = useState(false);
  const [error, setError] = useState<string>('');

  // Load saved notes on component mount
  useEffect(() => {
    loadSavedNotes();
  }, []);

  // API function to summarize text
  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SummarizeResponse = await response.json();
      setSummarizedText(data.summary);
      setCurrentNoteSessionId(data.note_session_id);
      setIsNoteSaved(false);
    } catch (err) {
      console.error('Error summarizing text:', err);
      setError('Failed to summarize text. Please check if the backend server is running on http://localhost:8000');
    } finally {
      setIsLoading(false);
    }
  };

  // API function to save note
  const handleSaveNote = async () => {
    if (!summarizedText || !currentNoteSessionId || !inputText) return;

    try {
      const saveRequest: SaveNoteRequest = {
        original_text: inputText,
        summary: summarizedText,
        note_session_id: currentNoteSessionId,
      };

      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsNoteSaved(true);
      await loadSavedNotes(); // Refresh the saved notes list
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note. Please try again.');
    }
  };

  // API function to load saved notes
  const loadSavedNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const notes: NoteResponse[] = await response.json();
      setSavedNotes(notes);
    } catch (err) {
      console.error('Error loading notes:', err);
      // Don't show error for loading notes since it might be called on mount
    }
  };

  // Function to load a saved note
  const loadSavedNote = (note: NoteResponse) => {
    setInputText(note.original_text);
    setSummarizedText(note.summary);
    setCurrentNoteSessionId(note.note_session_id);
    setIsNoteSaved(true);
    setShowSavedNotes(false);
    setError('');
  };

  const handleCopy = async () => {
    if (summarizedText) {
      await navigator.clipboard.writeText(summarizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share && summarizedText) {
      navigator.share({
        title: 'Note Summary',
        text: summarizedText,
      });
    }
  };

  const handleDownload = () => {
    if (summarizedText) {
      const blob = new Blob([summarizedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'note-summary.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 mr-3" />
            <h1 className="text-4xl font-bold">AI Note Summarizer</h1>
          </div>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
            Transform your lengthy notes into clear, actionable summaries using AI. 
            Perfect for study sessions, meetings, and research.
          </p>
          
          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => setShowSavedNotes(false)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${!showSavedNotes ? 'bg-white text-purple-600' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
            >
              New Summary
            </button>
            <button
              onClick={() => {setShowSavedNotes(true); loadSavedNotes();}}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${showSavedNotes ? 'bg-white text-purple-600' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
            >
              <History className="w-4 h-4 mr-2 inline" />
              Saved Notes ({savedNotes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 mt-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {!showSavedNotes ? (
            <>
              {/* Input Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Paste Your Notes to Summarize
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste or type your content here..."
                      className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-purple-400 focus:outline-none transition-colors duration-200 text-gray-700 placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={handleSummarize}
                      disabled={!inputText.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center mx-auto"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Summarizing...
                        </>
                      ) : (
                        'Summarize with AI'
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Section */}
              {(summarizedText || isLoading) && (
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      AI Summary
                    </h3>
                    
                    {summarizedText && (
                      <div className="flex space-x-2">
                        {!isNoteSaved && (
                          <button
                            onClick={handleSaveNote}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                            title="Save note"
                          >
                            <Save className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={handleCopy}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                        </button>
                        <button
                          onClick={handleShare}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                          title="Share summary"
                        >
                          <Share2 className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                        </button>
                        <button
                          onClick={handleDownload}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                          title="Download as text file"
                        >
                          <Download className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 min-h-32">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-gray-700 font-medium leading-relaxed">
                        {summarizedText}
                      </pre>
                    )}
                  </div>
                  
                  {copied && (
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Copy className="w-4 h-4 mr-1" />
                        Copied to clipboard!
                      </span>
                    </div>
                  )}
                  
                  {isNoteSaved && (
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Save className="w-4 h-4 mr-1" />
                        Note saved successfully!
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Saved Notes View */
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
                <History className="w-6 h-6 mr-2 text-blue-600" />
                Your Saved Notes
              </h2>
              
              {savedNotes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No saved notes yet</p>
                  <p className="text-gray-400">Summarize some text and save it to see notes here</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {savedNotes.map((note) => (
                    <div
                      key={note.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => loadSavedNote(note)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-500">
                          {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          <strong>Original:</strong> {note.original_text.substring(0, 100)}
                          {note.original_text.length > 100 ? '...' : ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 line-clamp-2">
                          <strong>Summary:</strong> {note.summary.substring(0, 150)}
                          {note.summary.length > 150 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Summarize Study Notes</h3>
              <p className="text-gray-600 leading-relaxed">
                Transform lengthy study materials into concise bullet points that help you retain key information faster and more effectively.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Meeting Notes</h3>
              <p className="text-gray-600 leading-relaxed">
                Convert meeting transcripts and notes into structured action items and key takeaways that everyone can follow.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Articles & Blog Summaries</h3>
              <p className="text-gray-600 leading-relaxed">
                Extract the main insights from long articles and blog posts, saving time while ensuring you don't miss important details.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {summarizedText && !showSavedNotes && (
            <div className="flex justify-center space-x-6 mb-8 flex-wrap">
              {!isNoteSaved && (
                <button
                  onClick={handleSaveNote}
                  className="flex items-center space-x-2 bg-white hover:bg-green-50 text-green-600 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-green-200"
                >
                  <Save className="w-5 h-5" />
                  <span className="font-medium">Save Note</span>
                </button>
              )}
              
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 bg-white hover:bg-purple-50 text-purple-600 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-purple-200"
              >
                <Copy className="w-5 h-5" />
                <span className="font-medium">Copy Summary</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-white hover:bg-blue-50 text-blue-600 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-blue-200"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Share</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-white hover:bg-green-50 text-green-600 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-green-200"
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">Download</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 mr-2" />
            <span className="text-xl font-semibold">AI Note Summarizer</span>
          </div>
          <p className="text-blue-100 mb-4">© 2025 All rights reserved | Powered by AI</p>
          <div className="flex justify-center space-x-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-400 transition-colors">
              <span className="text-sm font-bold">f</span>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-400 transition-colors">
              <span className="text-sm font-bold">t</span>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-400 transition-colors">
              <span className="text-sm font-bold">in</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;