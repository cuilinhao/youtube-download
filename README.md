<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TubeGenius Studio

Next.js + Tailwind port of the YouTube download and AI analysis UI. Gemini runs via a server-side API route, and downloads are streamed through a ytdl-core powered endpoint.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Copy `.env.local.example` to `.env.local` and set `GEMINI_API_KEY` to your Gemini API key.
3. Start the dev server: `npm run dev` and open http://localhost:3000

## Notes

- `/api/analyze` proxies requests to Gemini. Calls will fail unless `GEMINI_API_KEY` is set.
- `/api/download` streams YouTube media via ytdl-core. The client builds download links like `/api/download?url=<videoUrl>&quality=1080p&format=mp4`.
- Tailwind is configured in `tailwind.config.ts`; global styles live in `app/globals.css`.
