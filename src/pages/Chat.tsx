import React, { useState } from 'react';
import { useAuthStore } from '../stores/auth';
import {
  MessageSquare,
  Users,
  Send,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Image,
  Mic
} from 'lucide-react';

export function Chat() {
  const { session } = useAuthStore();
  const [message, setMessage] = useState('');

  return (
    <div className="flex h-screen bg-[#0a1014]">
      {/* Sidebar */}
      <div className="w-[400px] bg-[#111b21] border-r border-[#2f3b43]">
        {/* User Profile */}
        <div className="p-3 bg-[#202c33] flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-[#2a3942] flex items-center justify-center">
              <Users className="h-5 w-5 text-[#aebac1]" />
            </div>
          </div>
          <div className="flex items-center space-x-3 text-[#aebac1]">
            <button className="p-2 hover:bg-[#374045] rounded-full">
              <Users className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-[#374045] rounded-full">
              <MessageSquare className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-[#374045] rounded-full">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="bg-[#202c33] rounded-lg flex items-center px-4 py-1.5">
            <Search className="h-5 w-5 text-[#aebac1]" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="ml-4 bg-transparent text-[#d1d7db] placeholder-[#8696a0] flex-1 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto">
          {[1, 2, 3].map((chat) => (
            <div
              key={chat}
              className="px-3 py-3 flex items-center space-x-3 hover:bg-[#202c33] cursor-pointer"
            >
              <div className="h-12 w-12 rounded-full bg-[#2a3942] flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-[#aebac1]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-[#e9edef] text-base truncate">Chat {chat}</p>
                  <span className="text-xs text-[#8696a0]">10:30 PM</span>
                </div>
                <p className="text-[#8696a0] text-sm truncate">
                  Last message in chat {chat}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0a1014]">
        {/* Chat Header */}
        <div className="h-[60px] bg-[#202c33] flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-[#2a3942] flex items-center justify-center">
              <Users className="h-5 w-5 text-[#aebac1]" />
            </div>
            <div>
              <p className="text-[#e9edef]">Chat Name</p>
              <p className="text-sm text-[#8696a0]">online</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-[#aebac1]">
            <button className="p-2 hover:bg-[#374045] rounded-full">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-[#374045] rounded-full">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{
            backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
            backgroundSize: '400px'
          }}
        >
          <div className="flex justify-end">
            <div className="bg-[#005c4b] text-[#e9edef] rounded-lg py-2 px-3 max-w-[65%] shadow">
              <p>Hey there! Welcome to WhatsApp Clone!</p>
              <p className="text-[11px] text-[#8696a0] text-right mt-1">10:30 PM</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-[#202c33] text-[#e9edef] rounded-lg py-2 px-3 max-w-[65%] shadow">
              <p>Hi! Thanks for having me here!</p>
              <p className="text-[11px] text-[#8696a0] text-right mt-1">10:31 PM</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-[#202c33] p-3 flex items-center space-x-4">
          <button className="text-[#8696a0] p-2 hover:bg-[#374045] rounded-full">
            <Smile className="h-6 w-6" />
          </button>
          <button className="text-[#8696a0] p-2 hover:bg-[#374045] rounded-full">
            <Paperclip className="h-6 w-6" />
          </button>
          <button className="text-[#8696a0] p-2 hover:bg-[#374045] rounded-full">
            <Image className="h-6 w-6" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0] rounded-lg px-4 py-2 focus:outline-none"
          />
          <button className="text-[#8696a0] p-2 hover:bg-[#374045] rounded-full">
            <Mic className="h-6 w-6" />
          </button>
          {message && (
            <button className="text-[#8696a0] p-2 hover:bg-[#374045] rounded-full">
              <Send className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}