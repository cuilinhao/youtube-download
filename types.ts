export interface VideoDetails {
  id: string;
  url: string;
  thumbnailUrl: string;
}

export interface AnalysisResult {
  summary: string;
  tags: string[];
  suggestedTitles: string[];
  sentiment: string;
  marketingHook: string;
}

export interface DownloadOption {
  format: 'mp4' | 'mp3';
  quality: '4k' | '1080p' | '720p' | '320kbps' | '128kbps';
  size: string;
  badge?: string;
}

export enum AppState {
  IDLE,
  ANALYZING,
  READY,
  ERROR
}