import React from 'react';

/**
 * Reusable Badge Component.
 */
export const Badge = ({
  children,
  variant = 'default', // 'default' | 'burgundy' | 'success' | 'warning' | 'info' | 'outline'
  size = 'sm', // 'sm' | 'md'
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 font-medium',
  };

  const variantStyles = {
    default: 'bg-ivory-dark text-charcoal-muted border border-border',
    burgundy: 'bg-burgundy/10 text-burgundy border border-burgundy/20 font-semibold',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    outline: 'border border-border text-charcoal bg-transparent',
  };

  return (
    <span
      className={`inline-flex items-center select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

