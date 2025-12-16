import React from 'react';

export const GlassCard = ({ children, className = '' }: any) => {
  return (
    <div
      className={`rounded-xl p-6 bg-white/5 border border-white/10 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
};

export const NeonButton = ({
  children,
  className = '',
  variant = 'primary',
  ...props
}: any) => {
  const base =
    'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all';

  const styles =
    variant === 'secondary'
      ? 'bg-white/10 hover:bg-white/20 text-white'
      : variant === 'outline'
      ? 'border border-white/30 text-white hover:bg-white/10'
      : 'bg-violet-600 hover:bg-violet-700 text-white';

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const InputField = ({
  label,
  ...props
}: any) => {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-2 text-gray-300">{label}</label>
      <input
        className="w-full px-3 py-2 rounded bg-black/40 border border-white/20 text-white focus:outline-none focus:border-violet-500"
        {...props}
      />
    </div>
  );
};
