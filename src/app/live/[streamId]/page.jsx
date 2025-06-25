'use client'
import React, { useEffect, useRef } from 'react';
import ChatMessages from '@/components/PagesComponent/Chat/ChatMessages';

export default function LiveStreamPage({ params }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Dummy video for simulation — replace with actual stream later
    videoRef.current.src = '/placeholder-video.mp4';
    videoRef.current.play();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🔴 Live Streaming</h2>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* 🎥 Video Section */}
        <div className="flex-1">
          <video 
            ref={videoRef} 
            controls 
            className="w-full h-auto rounded shadow border" 
          />
        </div>

        {/* 💬 Chat Section */}
        <div className="w-full md:w-[30%] max-h-[500px] overflow-y-auto rounded border shadow p-3 bg-white">
          <h3 className="text-lg font-semibold mb-3">💬 Live Chat</h3>
          <ChatMessages streamId={params.streamId} isLive={true} />
        </div>
      </div>
    </div>
  );
}
