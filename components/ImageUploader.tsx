
import React, { useRef } from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageSelect: (image: ImageFile) => void;
  currentImage: ImageFile | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64 = result.split(',')[1];
        const mimeType = file.type;
        onImageSelect({
          base64,
          mimeType,
          previewUrl: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {!currentImage ? (
        <div 
          onClick={triggerUpload}
          className="border-2 border-dashed border-gray-600 rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-white/5 transition-all group"
        >
          <div className="bg-white/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <p className="text-gray-400 font-medium">Click to upload your photo</p>
          <p className="text-gray-500 text-sm mt-1">PNG, JPG up to 10MB</p>
        </div>
      ) : (
        <div className="relative group overflow-hidden rounded-3xl h-96 bg-black/40 flex items-center justify-center border border-white/10">
          <img 
            src={currentImage.previewUrl} 
            alt="Original" 
            className="h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button 
              onClick={triggerUpload}
              className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors"
            >
              Replace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
