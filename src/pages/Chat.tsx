import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/auth';
import { supabase } from '../lib/supabase';
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

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface Chat {
  id: string;
  name: string;
  last_message?: Message;
}

export function Chat() {
  const { session } = useAuthStore();
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      const { data: participantData } = await supabase
        .from('chat_participants')
        .select('chat_id')
        .eq('profile_id', session?.user.id);

      if (participantData) {
        const chatIds = participantData.map(p => p.chat_id);
        const { data: chatsData } = await supabase
          .from('chats')
          .select('*')
          .in('id', chatIds);

        if (chatsData) {
          setChats(chatsData);
          if (!activeChat && chatsData.length > 0) {
            setActiveChat(chatsData[0].id);
          }
        }
      }
    };

    if (session) {
      fetchChats();
    }
  }, [session]);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', activeChat)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat:${activeChat}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${activeChat}`
      }, payload => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [activeChat]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !activeChat || !session) return;

    const newMessage = {
      chat_id: activeChat,
      sender_id: session.user.id,
      content: message
    };

    const { error } = await supabase
      .from('messages')
      .insert([newMessage]);

    if (!error) {
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`px-3 py-3 flex items-center space-x-3 hover:bg-[#202c33] cursor-pointer ${
                activeChat === chat.id ? 'bg-[#2a3942]' : ''
              }`}
            >
              <div className="h-12 w-12 rounded-full bg-[#2a3942] flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-[#aebac1]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-[#e9edef] text-base truncate">{chat.name}</p>
                  {chat.last_message && (
                    <span className="text-xs text-[#8696a0]">
                      {new Date(chat.last_message.created_at).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                {chat.last_message && (
                  <p className="text-[#8696a0] text-sm truncate">
                    {chat.last_message.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0a1014]">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="h-[60px] bg-[#202c33] flex items-center justify-between px-4 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-[#2a3942] flex items-center justify-center">
                  <Users className="h-5 w-5 text-[#aebac1]" />
                </div>
                <div>
                  <p className="text-[#e9edef]">
                    {chats.find(c => c.id === activeChat)?.name}
                  </p>
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
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === session?.user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg py-2 px-3 max-w-[65%] shadow ${
                      msg.sender_id === session?.user.id
                        ? 'bg-[#005c4b] text-[#e9edef]'
                        : 'bg-[#202c33] text-[#e9edef]'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-[11px] text-[#8696a0] text-right mt-1">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
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
                onKeyPress={handleKeyPress}
                placeholder="Type a message"
                className="flex-1 bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0] rounded-lg px-4 py-2 focus:outline-none"
              />
              <button className="text-[#8696a0] p-2 hover:bg-[#374045] rounded-full">
                <Mic className="h-6 w-6" />
              </button>
              {message && (
                <button
                  onClick={sendMessage}
                  className="text-[#00a884] p-2 hover:bg-[#374045] rounded-full"
                >
                  <Send className="h-6 w-6" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#8696a0]">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}