import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component matching Burgundy Enterprise SaaS theme.
 */
export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-burgundy/20 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-burgundy text-white hover:bg-burgundy-hover active:bg-burgundy-dark shadow-sm hover:shadow',
    secondary:
      'bg-wine text-white hover:bg-wine-hover active:bg-burgundy shadow-sm',
    outline:
      'border border-border bg-white text-charcoal hover:bg-ivory hover:border-burgundy/40 active:bg-ivory-dark',
    ghost:
      'bg-transparent text-charcoal-muted hover:text-charcoal hover:bg-ivory-dark active:bg-border/60',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang xử lý...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};

