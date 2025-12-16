import React, { useState } from 'react';
import { GlassCard, NeonButton, InputField } from '../components/NeonComponents';
import { useStore } from '../store';
import { MOCK_USER } from '../constants';
import { Clapperboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const setUser = useStore(state => state.setUser);
  const [alias, setAlias] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alias.trim()) return;

    // Simulate login
    const user = {
      ...MOCK_USER,
      uid: `user-${Date.now()}`,
      cinemaAlias: alias,
      isAdmin: isAdminMode
    };

    setUser(user);
    // Persist mock auth for refresh (in a real app this is automatic)
    localStorage.setItem('ck_auth_user', JSON.stringify(user));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://picsum.photos/1920/1080?blur=10')] bg-cover opacity-20 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-kolly-violet/20 rounded-full blur-[100px] z-0 pointer-events-none"></div>

      <GlassCard className="max-w-md w-full relative z-10 m-4">
        <div className="text-center mb-8">
          <Clapperboard className="w-16 h-16 text-kolly-cyan mx-auto mb-4" />
          <h1 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-kolly-cyan to-kolly-violet mb-2">
            CYBER KOLLYWOOD
          </h1>
          <p className="text-gray-400">Enter the Metaverse of Tamil Cinema</p>
        </div>

        <form onSubmit={handleLogin}>
          <InputField 
            label="Cinema Alias (Username)" 
            value={alias} 
            onChange={(e: any) => setAlias(e.target.value)} 
            placeholder="e.g. Thalapathy Fan 007" 
          />
          
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => setIsAdminMode(!isAdminMode)}>
            <div className={`w-5 h-5 rounded border border-kolly-violet flex items-center justify-center ${isAdminMode ? 'bg-kolly-violet' : 'bg-transparent'}`}>
              {isAdminMode && <div className="w-3 h-3 bg-white rounded-sm" />}
            </div>
            <span className="text-sm text-gray-300">Enter as Director (Admin Mode)</span>
          </div>

          <NeonButton type="submit" className="w-full justify-center">
            Start Action
          </NeonButton>
          
          <div className="mt-4 text-xs text-center text-gray-500">
            * Uses Mock Auth (Google Sign-In simulation)
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default AuthPage;
