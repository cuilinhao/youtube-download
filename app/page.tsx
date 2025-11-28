'use client';

import React, { useCallback, useState } from 'react';
import AIAnalysis from '@/components/AIAnalysis';
import DownloadPanel from '@/components/DownloadPanel';
import { AlertIcon, SearchIcon, YoutubeIcon } from '@/components/Icons';
import VideoPreview from '@/components/VideoPreview';
import { analyzeVideoContext } from '@/services/gemini';
import { AnalysisResult, AppState, VideoDetails } from '@/types';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractVideoId = useCallback((input: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = input.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  }, []);

  const handleProcess = useCallback(async () => {
    if (!url.trim()) return;
    setError(null);
    setState(AppState.ANALYZING);
    setAnalysis(null);

    try {
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      setVideo({
        id: videoId,
        url,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      });

      const analysisResult = await analyzeVideoContext(url);
      setAnalysis(analysisResult);
      setState(AppState.READY);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
      setState(AppState.ERROR);
    }
  }, [url, extractVideoId]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yt-red selection:text-white pb-20">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <YoutubeIcon className="w-8 h-8 text-yt-red" />
            <span className="text-xl font-bold tracking-tight">
              Tube<span className="text-yt-red">Genius</span>
            </span>
          </div>
          <div className="text-sm text-gray-500 font-medium hidden md:block">
            v2.5.0 • Powered by Gemini
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-12 space-y-12">
        <section className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Download &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Analyze
            </span>
            <br /> YouTube Videos
          </h1>
          <p className="text-gray-400 text-lg">
            Get instant download links, AI-generated summaries, SEO tags, and viral title suggestions for any
            video.
          </p>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yt-red to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
            <div className="relative flex items-center bg-yt-dark rounded-xl border border-gray-700 p-2 shadow-2xl">
              <div className="pl-4 text-gray-500">
                <SearchIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Paste YouTube URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
                className="flex-1 bg-transparent border-none text-white placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-0 text-lg w-full"
              />
              <button
                onClick={handleProcess}
                disabled={state === AppState.ANALYZING}
                className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state === AppState.ANALYZING ? 'Processing...' : 'Start'}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400 bg-red-900/20 py-2 rounded-lg border border-red-900/50">
              <AlertIcon className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </section>

        {(video || state === AppState.ANALYZING) && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up">
            <div className="lg:col-span-7 space-y-6">
              {video ? <VideoPreview video={video} /> : <div className="aspect-video bg-yt-dark rounded-xl animate-pulse"></div>}
              <DownloadPanel videoUrl={video?.url} />
            </div>

            <div className="lg:col-span-5">
              <AIAnalysis data={analysis} loading={state === AppState.ANALYZING} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
