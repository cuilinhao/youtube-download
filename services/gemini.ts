import { AnalysisResult } from '@/types';

export const analyzeVideoContext = async (videoTitleOrUrl: string): Promise<AnalysisResult> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoTitleOrUrl })
  });

  if (!response.ok) {
    let message = 'Failed to analyze video.';
    try {
      const error = await response.json();
      if (error?.error) {
        message = error.error;
      }
    } catch {
      // ignore JSON parse issues
    }
    throw new Error(message);
  }

  return response.json() as Promise<AnalysisResult>;
};
