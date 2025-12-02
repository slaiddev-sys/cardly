import React from 'react';
import { Heart } from 'lucide-react';
import { useSocket } from '../context/SocketProvider';

const Messages = () => {
  const { messages } = useSocket();

  return (
    <div className="h-full flex flex-col pt-8 pb-24 px-6 overflow-y-auto bg-gray-50">

      <div className="flex flex-col gap-6 flex-1">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-gray-400">
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="bg-white p-4 rounded-3xl border border-orange-50">
              <div className="flex justify-between items-center mb-3 px-2">
                <span className="font-bold text-[#fa9a00]">From: {msg.sender}</span>
                <span className="text-xs text-[#8B7355]">{msg.date}</span>
              </div>
              <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square border border-orange-100">
                <img src={msg.image} alt="Drawing" className="w-full h-full object-contain" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;

