import { useState } from 'react';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  originalText: string;
  summary: string;
  onSave: () => void;
}

const SaveButton = ({ originalText, summary, onSave }: SaveButtonProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const response = await fetch('http://localhost:8000/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_text: originalText,
          summary,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error saving: ${response.status}`);
      }
      
      setSaveStatus('success');
      onSave();
    } catch (error) {
      console.error('Error saving summary:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
        saveStatus === 'success' 
          ? 'bg-green-600 hover:bg-green-700' 
          : saveStatus === 'error'
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-red-800 hover:bg-red-900'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Save className="w-4 h-4 mr-2" />
      {isSaving 
        ? 'Saving...' 
        : saveStatus === 'success'
        ? 'Saved!'
        : saveStatus === 'error'
        ? 'Error'
        : 'Save Summary'}
    </button>
  );
};

export default SaveButton;
