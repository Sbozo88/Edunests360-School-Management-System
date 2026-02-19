import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'gradient-border';
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action, variant = 'default', ...props }) => {
  const variantStyles = {
    default: 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-card hover:shadow-card-hover',
    glass: 'glass shadow-card hover:shadow-card-hover',
    elevated: 'bg-white shadow-elevated hover:shadow-glow-sm hover:-translate-y-0.5',
    'gradient-border': 'bg-white gradient-border shadow-card hover:shadow-glow-md',
  };

  return (
    <div
      className={`${variantStyles[variant]} rounded-2xl p-6 transition-all duration-300 ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className="flex justify-between items-center mb-6">
          {title && <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};