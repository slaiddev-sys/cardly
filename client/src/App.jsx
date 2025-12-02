import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Connect from './pages/Connect';
import Login from './pages/Login';
import Draw from './pages/Draw';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Paywall from './pages/Paywall';
import OnboardingPreview from './pages/OnboardingPreview';
import MobileLayout from './components/MobileLayout';
import { SocketProvider } from './context/SocketProvider';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <MobileLayout>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/connect" element={<Connect />} />
              <Route path="/draw" element={<Draw />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/paywall" element={<Paywall />} />
              <Route path="/onboarding/preview" element={<OnboardingPreview />} />
            </Routes>
            <BottomNav />
          </MobileLayout>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
