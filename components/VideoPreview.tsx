import React from 'react';
import { VideoDetails } from '../types';

interface VideoPreviewProps {
  video: VideoDetails;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ video }) => {
  return (
    <div className="w-full bg-yt-dark rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
      <div className="relative aspect-video w-full overflow-hidden group">
        <img 
          src={video.thumbnailUrl} 
          alt="Video Thumbnail" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Detected Video</p>
          <h2 className="text-xl font-bold text-white truncate shadow-sm">
             ID: {video.id}
          </h2>
        </div>
      </div>
      <div className="p-4 flex gap-3 text-sm text-gray-400">
        <span className="bg-gray-800 px-2 py-1 rounded">HD</span>
        <span className="bg-gray-800 px-2 py-1 rounded">CC</span>
      </div>
    </div>
  );
};

export default VideoPreview;