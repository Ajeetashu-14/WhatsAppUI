import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from './pages/Auth';
import { Chat } from './pages/Chat';
import { useAuthStore } from './stores/auth';

function App() {
  const { session } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            session ? <Navigate to="/chats" replace /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/auth"
          element={session ? <Navigate to="/chats" replace /> : <Auth />}
        />
        <Route
          path="/chats"
          element={session ? <Chat /> : <Navigate to="/auth" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;