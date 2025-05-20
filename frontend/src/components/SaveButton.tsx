import { useState } from 'react';
import { Save, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface SaveButtonProps {
  originalText: string;
  summary: string;
  noteSessionId: string;
  onSave: () => void;
}

const SaveButton = ({ originalText, summary, noteSessionId, onSave }: SaveButtonProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error' | 'updated'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      // First check if this note session already exists
      const checkResponse = await fetch(`http://localhost:8000/notes/${noteSessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(() => null); // Catch 404 errors
      
      let response;
      let isUpdate = false;
      
      if (checkResponse && checkResponse.ok) {
        // Note exists, update it
        isUpdate = true;
        response = await fetch(`http://localhost:8000/notes/${noteSessionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary,
          }),
        });
      } else {
        // Note doesn't exist, create it
        response = await fetch('http://localhost:8000/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            original_text: originalText,
            summary,
            note_session_id: noteSessionId,
          }),
        });
      }
      
      if (!response.ok) {
        throw new Error(`Error saving: ${response.status}`);
      }
      
      setSaveStatus(isUpdate ? 'updated' : 'success');
      setLastSaved(new Date());
      onSave();
    } catch (error) {
      console.error('Error saving summary:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-sm ${(
          saveStatus === 'success' 
            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white ring-green-200' 
            : saveStatus === 'updated'
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white ring-blue-200'
            : saveStatus === 'error'
            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white ring-red-200'
            : 'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white ring-red-200'
        )} ${(['success', 'updated', 'error'].includes(saveStatus) ? 'ring-2' : '')} hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none`}
      >
        {isSaving ? (
          <>
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Saving</span>
          </>
        ) : saveStatus === 'success' ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved</span>
          </>
        ) : saveStatus === 'updated' ? (
          <>
            <RefreshCw className="w-4 h-4" />
            <span>Updated</span>
          </>
        ) : saveStatus === 'error' ? (
          <>
            <AlertCircle className="w-4 h-4" />
            <span>Failed</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </>
        )}
      </button>
      
      {lastSaved && (
        <span className="text-xs text-gray-500 mt-1.5 px-1 animate-fade-in-up">
          Saved at {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      )}
    </div>
  );
};

export default SaveButton;
