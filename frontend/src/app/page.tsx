"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import UploadSection from '@/components/UploadSection';
import VideoPreview from '@/components/VideoPreview';
import PromptInput from '@/components/PromptInput';
import ModeSelector from '@/components/ModeSelector';
import FeatureControlPanel, { FeatureValue } from '@/components/FeatureControlPanel';
import Timeline from '@/components/Timeline';
import ManualTools from '@/components/ManualTools';
import { Sparkles, Video, Settings2 } from 'lucide-react';

const API_BASE_URL = "http://localhost:8000";

const INITIAL_CONTROLS: Record<string, FeatureValue> = {
  'Trim / Split': 'no-idea', 'Crop': 'no-idea', 'Merge clips': 'no-idea', 'Delete section': 'no-idea',
  'Auto captions': 'no-idea', 'Auto text (Visuals)': 'no-idea', 'Manual text': 'no-idea', 'Font styles': 'no-idea', 'Text colors': 'no-idea', 'Text position': 'no-idea',
  'AI Voice Male': 'no-idea', 'AI Voice Female': 'no-idea', 'Upload user voice': 'no-idea', 'Voice sync': 'no-idea', 'Voice volume control': 'no-idea',
  'Background music': 'no-idea', 'Volume control': 'no-idea', 'Fade in/out': 'no-idea',
  'Filters': 'no-idea', 'Color grading': 'no-idea', 'Brightness / contrast': 'no-idea',
  'Zoom in/out': 'no-idea', 'Transitions': 'no-idea', 'Animations': 'no-idea', 'Speed control': 'no-idea',
  '9:16 (TikTok)': 'no-idea', '16:9 (YouTube)': 'no-idea', '1:1 (Instagram)': 'no-idea'
};

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<'auto' | 'assist' | 'manual'>('auto');
  const [controls, setControls] = useState(INITIAL_CONTROLS);

  const [isProcessing, setIsProcessing] = useState(false);
  const [outputVideoUrl, setOutputVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData);
      setUploadedFilename(response.data.filename);
    } catch (err: any) {
      setError("Failed to upload video. Please check if the backend is running.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setUploadedFilename(null);
    setOutputVideoUrl(null);
    setShowManual(false);
  };

  const setControl = (feature: string, value: FeatureValue) => {
    setControls(prev => ({ ...prev, [feature]: value }));
  };

  const handleGenerate = async () => {
    if (!uploadedFilename) return;

    setIsProcessing(true);
    setError(null);
    setOutputVideoUrl(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/process`, {
        filename: uploadedFilename,
        prompt,
        feature_controls: controls,
        mode
      });

      if (response.data.status === "success") {
        setOutputVideoUrl(`${API_BASE_URL}${response.data.output_video_url}`);
        setShowManual(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred during processing.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    if (outputVideoUrl) {
      const link = document.createElement('a');
      link.href = outputVideoUrl;
      link.download = `edited_${selectedFile?.name || 'video.mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-zinc-300 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          projectName={selectedFile ? selectedFile.name : "Untitled Project"}
          onExport={handleExport}
          isProcessing={isProcessing}
        />

        <main className="flex-1 overflow-hidden flex flex-col">
          {error && (
            <div className="mx-8 mt-4 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-2">
              <p>{error}</p>
              <button onClick={() => setError(null)} className="font-bold uppercase tracking-tighter text-xs">Dismiss</button>
            </div>
          )}

          <div className="flex-1 flex overflow-hidden">
            {/* LEFT PANEL: AI CONTROLS */}
            <div className="w-[400px] border-r border-zinc-900 bg-zinc-950/50 overflow-y-auto custom-scrollbar p-6 space-y-8">
              <div className="space-y-1">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-500" />
                  AI Intelligence
                </h3>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Driven by GPT-4o</p>
              </div>

              <UploadSection
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onClear={handleClearFile}
              />

              <ModeSelector
                mode={mode}
                setMode={setMode}
                disabled={uploading || isProcessing}
              />

              <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                isLoading={isProcessing}
                disabled={!uploadedFilename || uploading}
              />

              <FeatureControlPanel
                controls={controls}
                setControl={setControl}
                disabled={uploading || isProcessing}
              />
            </div>

            {/* CENTER PANEL: PREVIEW */}
            <div className="flex-1 flex flex-col bg-zinc-950/20 relative">
              <div className="flex-1 p-10 flex items-center justify-center min-h-0">
                <VideoPreview
                  videoUrl={outputVideoUrl}
                  isLoading={isProcessing}
                />
              </div>

              {/* BOTTOM: TIMELINE */}
              <div className="h-[280px] border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-xl p-6 relative">
                 <Timeline />
              </div>
            </div>

            {/* RIGHT PANEL: MANUAL TOOLS */}
            <div className="w-[320px] border-l border-zinc-900 bg-zinc-950/50">
               <ManualTools isVisible={showManual} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
