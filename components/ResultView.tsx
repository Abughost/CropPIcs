
import React from 'react';

interface ResultViewProps {
  url: string;
  isGenerating: boolean;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ url, isGenerating, onReset }) => {
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] w-full bg-white/5 rounded-3xl border border-white/10 animate-pulse">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-xl font-light text-gray-300">Clarifying and polishing...</p>
        <p className="mt-2 text-sm text-gray-500">Generating your new wallpaper</p>
      </div>
    );
  }

  if (!url) return null;

  return (
    <div className="flex flex-col items-center w-full space-y-6 animate-in fade-in duration-700">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 shadow-2xl shadow-blue-900/10">
        <img 
          src={url} 
          alt="AI Generated Wallpaper" 
          className="w-full h-auto object-contain"
        />
        <div className="absolute top-4 right-4">
          <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">AI Generated</div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <a 
          href={url} 
          download="ai-wallpaper.png"
          className="flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Save to Phone
        </a>
        <button 
          onClick={onReset}
          className="flex items-center justify-center px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all border border-white/10"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};
