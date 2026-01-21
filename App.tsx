
import React, { useState, useEffect } from 'react';
import { ImageFile, GenerationState, AspectRatio } from './types';
import { ImageUploader } from './components/ImageUploader';
import { ResultView } from './components/ResultView';
import { editImage } from './services/geminiService';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>('clarify this photo without changing the position of the car in the picture and adjust it to fit the phone screen to make it a "wallpaper"');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT);
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    resultUrl: null,
    resultMimeType: null,
  });

  const handleGenerate = async () => {
    if (!sourceImage) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const result = await editImage(sourceImage.base64, sourceImage.mimeType, prompt, aspectRatio);
      setState({
        isGenerating: false,
        error: null,
        resultUrl: result.imageUrl,
        resultMimeType: result.mimeType,
      });
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: err.message || "Something went wrong while generating the image." 
      }));
    }
  };

  const reset = () => {
    setState({
      isGenerating: false,
      error: null,
      resultUrl: null,
      resultMimeType: null,
    });
    setSourceImage(null);
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-6xl mx-auto flex flex-col items-center">
      {/* Header */}
      <header className="py-12 text-center w-full">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent mb-4">
          WallCraft AI
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
          Turn your photos into professional-grade mobile wallpapers. Perfect lighting, perfect aspect ratio, every time.
        </p>
      </header>

      <main className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Input Section */}
        {!state.resultUrl && !state.isGenerating && (
          <div className="glass-panel p-8 rounded-[40px] space-y-8 animate-in slide-in-from-left duration-700">
            <div>
              <label className="block text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">1. Upload Source</label>
              <ImageUploader onImageSelect={setSourceImage} currentImage={sourceImage} />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold uppercase tracking-widest text-gray-500">2. Customize Style</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-32"
                placeholder="Describe how you want to enhance the image..."
              />
              
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Retro Vibe", p: "Add a warm retro film aesthetic" },
                  { label: "High Contrast", p: "Make it cinematic with high contrast and dark shadows" },
                  { label: "Clear & Sharp", p: "Clarify the image and sharpen all details" },
                  { label: "Neon Glow", p: "Add subtle neon reflections and glow" }
                ].map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => setPrompt(tag.p)}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs text-gray-400 transition-colors"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">3. Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(AspectRatio).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setAspectRatio(val)}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${
                      aspectRatio === val 
                        ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`border-2 border-white/40 rounded ${
                      val === AspectRatio.PORTRAIT ? 'w-4 h-8' :
                      val === AspectRatio.LANDSCAPE ? 'w-8 h-4' :
                      val === AspectRatio.SQUARE ? 'w-6 h-6' :
                      val === AspectRatio.PHOTO ? 'w-8 h-6' : 'w-6 h-8'
                    }`}></div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{key}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!sourceImage || state.isGenerating}
              className={`w-full py-5 rounded-3xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                !sourceImage 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-gray-100 hover:scale-[1.02] active:scale-95'
              }`}
            >
              Generate AI Wallpaper
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </button>
            
            {state.error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 text-sm">
                {state.error}
              </div>
            )}
          </div>
        )}

        {/* Result Preview Area */}
        <div className={`lg:sticky lg:top-12 flex flex-col items-center justify-center w-full min-h-[400px] ${state.resultUrl || state.isGenerating ? 'col-span-full' : ''}`}>
          {(state.resultUrl || state.isGenerating) ? (
            <ResultView 
              url={state.resultUrl || ''} 
              isGenerating={state.isGenerating} 
              onReset={reset}
            />
          ) : (
            <div className="hidden lg:flex flex-col items-center text-gray-600 space-y-6 animate-pulse">
               <div className="w-64 h-[500px] border-2 border-dashed border-gray-800 rounded-[40px] flex items-center justify-center">
                  <span className="uppercase tracking-[0.3em] font-black text-sm rotate-90 opacity-20">Live Preview</span>
               </div>
               <p className="text-sm">Configure your wallpaper on the left</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-20 py-8 border-t border-white/5 w-full text-center">
        <p className="text-gray-600 text-xs tracking-widest uppercase">
          Powered by Gemini 2.5 Flash Image &bull; Professional Content Creation
        </p>
      </footer>
    </div>
  );
};

export default App;
