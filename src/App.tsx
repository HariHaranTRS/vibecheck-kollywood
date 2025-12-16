import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import QuizPlayer from './pages/QuizPlayer';
import Admin from './pages/Admin';
import { useStore } from './store';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useStore(state => state.user);
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen text-white font-sans selection:bg-kolly-violet selection:text-white">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/quiz/daily" element={
            <ProtectedRoute>
              <QuizPlayer />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />

          {/* Fallback to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
