import React from 'react';
import { AnalysisResult } from '@/types';
import { SparklesIcon } from './Icons';

interface AIAnalysisProps {
  data: AnalysisResult | null;
  loading: boolean;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-yt-dark rounded-xl border border-gray-800 p-6 h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
          <SparklesIcon className="w-12 h-12 text-blue-400 animate-pulse relative z-10" />
        </div>
        <h3 className="text-xl font-bold text-white">Gemini is Thinking...</h3>
        <p className="text-gray-400 max-w-xs text-sm">Analyzing metadata, checking trends, and generating SEO tags for your video.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-yt-dark rounded-xl border border-dashed border-gray-800 p-6 h-full flex flex-col items-center justify-center text-center min-h-[400px]">
        <SparklesIcon className="w-10 h-10 text-gray-600 mb-4" />
        <p className="text-gray-500">Enter a video URL to generate AI insights.</p>
      </div>
    );
  }

  return (
    <div className="bg-yt-dark rounded-xl border border-gray-800 p-6 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
          <SparklesIcon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AI Insights
        </h3>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Smart Summary</h4>
          <p className="text-gray-200 leading-relaxed text-sm">{data.summary}</p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Viral Titles</h4>
          <ul className="space-y-2">
            {data.suggestedTitles.map((title, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-800 text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5">{idx + 1}</span>
                {title}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Sentiment</h4>
                <div className="text-blue-400 font-medium">{data.sentiment}</div>
            </div>
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Marketing Hook</h4>
                <div className="text-purple-400 text-xs italic">
                  &ldquo;{data.marketingHook}&rdquo;
                </div>
            </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Optimized Tags</h4>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, idx) => (
              <span key={idx} className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md text-xs border border-gray-700 hover:border-gray-500 transition-colors cursor-default">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
