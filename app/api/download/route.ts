import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'node:stream';
import ytdl, { videoInfo, videoFormat } from 'ytdl-core';

export const runtime = 'nodejs';

const sanitizeTitle = (title: string) =>
  title.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80) || 'youtube-video';

const pickVideoFormat = (info: videoInfo, targetHeight?: number): videoFormat => {
  const videoFormats = info.formats
    .filter((f) => f.hasVideo && f.hasAudio && typeof f.height === 'number')
    .sort((a, b) => (b.height || 0) - (a.height || 0));

  if (!videoFormats.length) {
    throw new Error('No combined audio/video formats available for this video.');
  }

  if (!targetHeight) {
    return videoFormats[0];
  }

  const match = videoFormats.find((f) => (f.height || 0) <= targetHeight);
  return match ?? videoFormats[videoFormats.length - 1];
};

const pickAudioFormat = (info: videoInfo): videoFormat => {
  const audioFormats = info.formats
    .filter((f) => f.hasAudio && !f.hasVideo)
    .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));

  if (!audioFormats.length) {
    throw new Error('No audio-only formats available for this video.');
  }

  return audioFormats[0];
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoUrl = searchParams.get('url') ?? '';
  const quality = searchParams.get('quality') ?? '1080p';
  const format = (searchParams.get('format') ?? 'mp4').toLowerCase();

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return NextResponse.json({ error: 'Please provide a valid YouTube URL via the "url" query param.' }, { status: 400 });
  }

  const height = parseInt(quality.replace(/\D+/g, ''), 10);

  try {
    const info = await ytdl.getInfo(videoUrl);
    const title = sanitizeTitle(info.videoDetails.title || 'youtube-video');
    const isAudioOnly = format === 'mp3' || format === 'audio';
    const selectedFormat = isAudioOnly ? pickAudioFormat(info) : pickVideoFormat(info, Number.isFinite(height) ? height : undefined);
    const extension = isAudioOnly ? 'webm' : 'mp4';
    const fileName = `${title}-${isAudioOnly ? 'audio' : selectedFormat.height || 'video'}.${extension}`;

    const nodeStream = ytdl(videoUrl, { format: selectedFormat });
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': selectedFormat.mimeType || (isAudioOnly ? 'audio/webm' : 'video/mp4'),
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Transfer-Encoding': 'chunked'
      }
    });
  } catch (error) {
    console.error('YouTube download failed', error);
    return NextResponse.json({ error: 'Unable to download this video. Please try a different URL or quality.' }, { status: 500 });
  }
}
