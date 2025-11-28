import React, { useState, useEffect } from 'react';
import { DownloadOption } from '../types';
import { DownloadIcon, CheckIcon, LoaderIcon } from './Icons';

const options: DownloadOption[] = [
  { format: 'mp4', quality: '1080p', size: '145 MB', badge: 'Best' },
  { format: 'mp4', quality: '720p', size: '84 MB' },
  { format: 'mp3', quality: '320kbps', size: '8 MB', badge: 'Audio' },
];

const DownloadPanel: React.FC = () => {
  const [downloading, setDownloading] = useState<number | null>(null); // Index of downloading item
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState<number | null>(null);

  useEffect(() => {
    let interval: any;
    if (downloading !== null) {
      setProgress(0);
      setCompleted(null);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setCompleted(downloading);
            setDownloading(null);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [downloading]);

  const handleDownload = (index: number) => {
    if (downloading !== null) return;
    setDownloading(index);
  };

  return (
    <div className="bg-yt-dark rounded-xl border border-gray-800 p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-red-500/10 p-2 rounded-lg text-yt-red">
          <DownloadIcon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold">Download Media</h3>
      </div>

      <div className="space-y-4 flex-grow">
        {options.map((opt, idx) => (
          <div 
            key={idx} 
            className="group relative bg-black/40 border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors flex items-center justify-between overflow-hidden"
          >
            {/* Progress Bar Background */}
            {downloading === idx && (
              <div 
                className="absolute left-0 top-0 bottom-0 bg-white/5 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            )}

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-xs font-bold uppercase text-gray-400 border border-gray-700">
                {opt.format}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{opt.quality.toUpperCase()}</span>
                  {opt.badge && (
                    <span className="text-[10px] bg-red-600 text-white px-1.5 rounded-sm uppercase tracking-wide">
                      {opt.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">{opt.size} • {opt.format === 'mp3' ? 'Audio' : 'Video'}</div>
              </div>
            </div>

            <button
              onClick={() => handleDownload(idx)}
              disabled={downloading !== null}
              className={`relative z-10 px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2
                ${completed === idx 
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                  : 'bg-white text-black hover:bg-gray-200'}
                ${downloading !== null && downloading !== idx ? 'opacity-30 cursor-not-allowed' : ''}
              `}
            >
              {downloading === idx ? (
                <>
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                  <span>{Math.round(progress)}%</span>
                </>
              ) : completed === idx ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <DownloadIcon className="w-4 h-4" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-500 text-center">
        <p>By using this tool, you agree to our Terms of Service.</p>
        <p className="mt-1 opacity-60">Server-side downloads are simulated in this demo.</p>
      </div>
    </div>
  );
};

export default DownloadPanel;