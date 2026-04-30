"use strict";

import React, { useCallback } from 'react';
import { Upload, FileVideo, X } from 'lucide-react';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelect, selectedFile, onClear }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <Upload size={20} className="text-blue-500" />
        Upload Video
      </h2>

      {!selectedFile ? (
        <label
          className="border-2 border-dashed border-zinc-700 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <FileVideo size={48} className="text-zinc-500 mb-3" />
          <p className="text-zinc-400">Drag & drop your video here or click to browse</p>
          <span className="text-xs text-zinc-600 mt-2">Supports MP4, MOV, AVI</span>
          <input
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between bg-zinc-800 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded">
              <FileVideo size={24} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white max-w-[200px] truncate">{selectedFile.name}</p>
              <p className="text-xs text-zinc-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="p-2 hover:bg-zinc-700 rounded-full transition-colors text-zinc-400"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
