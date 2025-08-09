import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { makeServer } from './mirage/server';
import Navigation from './components/Navigation';
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';
import RunDetailsPage from './pages/RunDetailsPage';
import ProfilePage from './pages/ProfilePage';
import TipsPage from './pages/TipsPage';
import AdminDashboard from './pages/AdminDashboard';
import CommunityPage from './pages/CommunityPage';

// Initialize MirageJS server
if (process.env.NODE_ENV === 'development') {
  makeServer();
}

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Main App Layout
const AppLayout: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="md:ml-64">
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/runs/:id" element={<RunDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tips" element={<TipsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
