'use client'
import React, { useEffect, useRef, useState } from 'react';
import ChatMessages from '@/components/PagesComponent/Chat/ChatMessages';
import Link from 'next/link';

export default function LiveStreamPage({ params }) {
  const videoRef = useRef(null);
  const [broadcast, setBroadcast] = useState(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    // 1) Fetch broadcast metadata by streamId
    fetch(`/api/broadcasts/${params.streamId}`)
      .then(res => res.json())
      .then((data) => {
        setBroadcast(data);
        const now = new Date();
        const exp = new Date(data.expiresAt);
        setExpired(now > exp);

        if (now >= new Date(data.startsAt) && now < exp) {
          videoRef.current.src = data.videoUrl;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch(console.error);
  }, [params.streamId]);

  if (!broadcast) {
    return <p>Loading broadcast...</p>;
  }
  if (expired) {
    return <p>This promotion has ended.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🔴 Live Broadcasting</h2>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Video + business overlay */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            controls
            className="w-full h-auto rounded shadow border"
          />
          {/* Business info overlay */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-75 p-3 rounded shadow">
            <h3 className="font-semibold">{broadcast.business.name}</h3>
            <Link href={broadcast.business.link}>
              <a target="_blank" className="text-blue-600 underline">
                Learn more
              </a>
            </Link>
          </div>
        </div>

        {/* Chat */}
        <div className="w-full md:w-[30%] max-h-[500px] overflow-y-auto rounded border shadow p-3 bg-white">
          <h3 className="text-lg font-semibold mb-3">💬 Live Chat</h3>
          <ChatMessages streamId={params.streamId} isLive={true} />
        </div>
      </div>
    </div>
  );
}
