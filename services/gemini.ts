import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise 2-sentence summary of what this video might contain based on the topic."
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5 high-traffic SEO tags for this video."
    },
    suggestedTitles: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 viral, click-worthy alternative titles."
    },
    sentiment: {
      type: Type.STRING,
      description: "The likely emotional tone (e.g., Educational, Exciting, Controversial)."
    },
    marketingHook: {
      type: Type.STRING,
      description: "A short, punchy marketing hook for social media sharing."
    }
  },
  required: ["summary", "tags", "suggestedTitles", "sentiment", "marketingHook"]
};

export const analyzeVideoContext = async (videoTitleOrUrl: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the potential content and strategy for a YouTube video with this input (URL or Title): "${videoTitleOrUrl}". 
      If it is a URL, infer the likely content from the ID or pretend you know it. If it is a title, analyze that.
      Provide a strategic analysis for a content creator.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a world-class YouTube algorithm expert and content strategist."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};