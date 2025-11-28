import { NextResponse } from 'next/server';
import { GoogleGenAI, Schema, Type } from '@google/genai';
import { AnalysisResult } from '@/types';

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'A concise 2-sentence summary of what this video might contain based on the topic.'
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '5 high-traffic SEO tags for this video.'
    },
    suggestedTitles: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 viral, click-worthy alternative titles.'
    },
    sentiment: {
      type: Type.STRING,
      description: 'The likely emotional tone (e.g., Educational, Exciting, Controversial).'
    },
    marketingHook: {
      type: Type.STRING,
      description: 'A short, punchy marketing hook for social media sharing.'
    }
  },
  required: ['summary', 'tags', 'suggestedTitles', 'sentiment', 'marketingHook']
};

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set.' }, { status: 500 });
  }

  const { videoTitleOrUrl } = await req.json().catch(() => ({ videoTitleOrUrl: '' }));

  if (!videoTitleOrUrl || typeof videoTitleOrUrl !== 'string') {
    return NextResponse.json({ error: 'Please provide a valid YouTube URL or title.' }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the potential content and strategy for a YouTube video with this input (URL or Title): "${videoTitleOrUrl}". 
      If it is a URL, infer the likely content from the ID or pretend you know it. If it is a title, analyze that.
      Provide a strategic analysis for a content creator.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        systemInstruction: 'You are a world-class YouTube algorithm expert and content strategist.'
      }
    });

    const rawText = (result as any).text ?? (result as any).response?.text?.();
    const resolvedText = typeof rawText === 'function' ? rawText() : rawText;
    const text = typeof resolvedText === 'string' ? resolvedText : await resolvedText;

    if (!text) {
      throw new Error('No response from AI');
    }

    const parsed = JSON.parse(text) as AnalysisResult;
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Gemini Analysis Failed:', error);
    return NextResponse.json({ error: 'Gemini analysis failed. Please try again.' }, { status: 500 });
  }
}
