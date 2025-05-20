import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';


const supabase = createClient('https://txolqppzjfirsxyrsfin.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4b2xxcHB6amZpcnN4eXJzZmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTk3NjEsImV4cCI6MjA2MzMzNTc2MX0.RMMSte-IvSI2PtRhrL6OnsFrEHfLJDx4k9rWrIJT4DE');

const chats = [
  { id: 'chat1', name: 'Test El Centro' },
  { id: 'chat2', name: 'Test Demo17' }
];

export default function ChatApp({ userId }) {
  const [activeChat, setActiveChat] = useState(chats[0].id);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch messages for the active chat
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', activeChat)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();

    // Subscribe to new messages in real time
    const subscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${activeChat}` },
        (payload) => setMessages((msgs) => [...msgs, payload.new])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [activeChat]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (input.trim()) {
      await supabase.from('messages').insert([
        { chat_id: activeChat, sender_id: userId, content: input }
      ]);
      setInput('');
    }
  };

  return (
    <div style={{ display: 'flex', height: 500 }}>
      <div style={{ width: 200, borderRight: '1px solid #ccc' }}>
        {chats.map((chat) => (
          <div
            key={chat.id}
            style={{
              padding: 10,
              background: activeChat === chat.id ? '#eee' : '#fff',
              cursor: 'pointer'
            }}
            onClick={() => setActiveChat(chat.id)}
          >
            {chat.name}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ margin: '5px 0' }}>
              <b>{msg.sender_id === userId ? 'Me' : msg.sender_id}:</b> {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: 'flex', padding: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            style={{ flex: 1, marginRight: 8 }}
            placeholder="Type a message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}