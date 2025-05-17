import { FileText } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="text-center py-12 px-4">
      <div className="flex justify-center mb-4">
        <FileText className="h-12 w-12 text-red-800" />
      </div>
      <h1 className="text-4xl font-bold text-red-800 mb-4">
        AI-Powered Note Summarizer
      </h1>
      <p className="text-lg text-red-700/80 max-w-2xl mx-auto">
        Paste your long notes and get concise summaries in seconds.
      </p>
    </div>
  );
};

export default HeroSection;
