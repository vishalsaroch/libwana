'use client'
import React, { useState } from 'react';
import ChatMessages from './ChatMessages';

export default function GoLiveChatWrapper({ streamId, userId }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: `Welcome to stream: ${streamId}`,
      message_type: "text",
      sender_id: 0,
      created_at: new Date().toISOString()
    }
  ]);
  const [newMsg, setNewMsg] = useState('');

  const handleSend = () => {
    if (!newMsg.trim()) return;
    const newMessage = {
      id: Date.now(),
      message: newMsg,
      message_type: "text",
      sender_id: userId,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    setNewMsg('');
  };

  const selectedTabData = { id: streamId };

  return (
    <div className="flex flex-col h-full">
      {/* Chat message rendering */}
      <div className="flex-1 overflow-y-auto max-h-[350px]">
        <ChatMessages
          chatMessages={messages}
          selectedTabData={selectedTabData}
          openImageViewer={() => {}}
          systemSettingsData={{}}
          IsLoadPrevMesg={false}
          CurrentMessagesPage={1}
          HasMoreChatMessages={false}
          fetchChatMessgaes={() => {}}
        />
      </div>

      {/* Chat input */}
      <div className="flex mt-2">
        <input
          type="text"
          className="flex-grow border rounded-l px-2 py-1 text-sm"
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded-r text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
