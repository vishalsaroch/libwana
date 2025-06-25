'use client'
import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import GoLiveChatWrapper from '@/components/PagesComponent/Chat/GoLiveChatWrapper';

export default function GoLivePage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // ✅ Check if user is logged in
  const isLoggedIn = useSelector((state) => state.UserSignup);
  const userId = isLoggedIn?.data?.data?.id || null;

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!userId) {
      router.push('/login'); // 🔄 Change to your actual login route
    }
  }, [userId, router]);

  // ✅ Create dynamic stream ID
  const streamId = `stream-user-${userId}`;

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsStreaming(true);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // ❌ Block rendering until login check
  if (!userId) return null;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🎥 Go Live</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <video ref={videoRef} autoPlay muted controls className="w-full rounded border shadow" />
          {!isStreaming && (
            <button 
              onClick={startStreaming} 
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Start Streaming
            </button>
          )}
        </div>

        <div className="w-full md:w-[30%] max-h-[500px] overflow-y-auto rounded border shadow p-3 bg-white">
          <h3 className="text-lg font-semibold mb-3">💬 Live Chat</h3>
          <GoLiveChatWrapper streamId={streamId} userId={userId} />
        </div>
      </div>
    </div>
  );
}
