import React from 'react';

export const GlassCard = ({ children, className = '' }: any) => (
  <div
    className={`rounded-xl p-6 bg-white/5 border border-white/10 backdrop-blur ${className}`}
  >
    {children}
  </div>
);

export const NeonButton = ({
  children,
  className = '',
  ...props
}: any) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg bg-kolly-violet hover:bg-kolly-cyan transition text-white flex items-center gap-2 justify-center ${className}`}
  >
    {children}
  </button>
);

export const InputField = ({
  label,
  className = '',
  ...props
}: any) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm text-kolly-cyan mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2 rounded bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-kolly-violet"
    />
  </div>
);
