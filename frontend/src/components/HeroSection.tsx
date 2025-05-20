import { BookOpen, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="text-center py-12 md:py-16 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-4 -right-4 w-24 h-24 md:w-32 md:h-32 bg-red-100 rounded-full opacity-30"></div>
        <div className="absolute top-1/4 -left-8 w-20 h-20 bg-red-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-16 h-16 bg-red-100 rounded-full opacity-20"></div>
      </div>
      
      {/* Icon with animation */}
      <div className="flex justify-center mb-6 relative">
        <div className="absolute inset-0 bg-red-50 rounded-full scale-[1.8] blur-xl opacity-30 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-red-700 to-red-900 p-4 rounded-xl shadow-lg">
          <BookOpen className="h-10 w-10 text-white" />
        </div>
        <div className="absolute -right-1 -top-1">
          <Sparkles className="h-5 w-5 text-red-500" />
        </div>
      </div>
      
      {/* Headline with subtle animation */}
      <h1 className="text-4xl md:text-5xl font-bold text-red-800 mb-4 leading-tight">
        <span className="inline-block animate-fade-in-up">AI-Powered</span> <span className="inline-block animate-fade-in-up animation-delay-100">Note Summarizer</span>
      </h1>
      
      {/* Description */}
      <p className="text-lg md:text-xl text-red-700/80 max-w-2xl mx-auto leading-relaxed">
        Transform lengthy documents into concise, actionable insights within seconds.
      </p>
      
      {/* Visual divider */}
      <div className="flex justify-center mt-8">
        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-red-200 to-transparent rounded-full"></div>
      </div>
    </div>
  );
};

export default HeroSection;
