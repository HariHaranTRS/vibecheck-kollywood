import React from 'react';
import { GlassCard, NeonButton } from '../components/NeonComponents';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';

const ADMIN_EMAIL = 'admin@gmail.com'; // 👈 CHANGE TO YOUR GMAIL

const AuthPage = () => {
  const setUser = useStore(state => state.setUser);
  const navigate = useNavigate();

  const mockGoogleLogin = () => {
    // TEMP MOCK — later replace with Firebase Google Auth
    const email = prompt('Enter Gmail (mock login)');

    if (!email) return;

    const user = {
      uid: email,               // ✅ stable ID
      email,
      displayName: email.split('@')[0],
      cinemaAlias: email.split('@')[0],
      isAdmin: email === ADMIN_EMAIL,
    };

    localStorage.setItem('ck_auth_user', JSON.stringify(user));
    setUser(user);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <GlassCard className="max-w-md w-full text-center">
        <Clapperboard className="w-16 h-16 text-kolly-cyan mx-auto mb-4" />
        <h1 className="text-3xl font-display font-bold mb-2">
          CYBER KOLLYWOOD
        </h1>
        <p className="text-gray-400 mb-6">
          Enter the Tamil Pop Culture Metaverse
        </p>

        <NeonButton className="w-full justify-center" onClick={mockGoogleLogin}>
          Sign in with Google (Mock)
        </NeonButton>

        <p className="text-xs text-gray-500 mt-4">
          Firebase Google Auth will replace this later
        </p>
      </GlassCard>
    </div>
  );
};

export default AuthPage;
