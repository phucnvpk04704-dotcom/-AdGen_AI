import React from 'react';

/**
 * Primary action button styled with Burgundy Enterprise theme.
 * @param {{
 *   children: React.ReactNode,
 *   onClick?: () => void,
 *   type?: 'button' | 'submit' | 'reset',
 *   isLoading?: boolean,
 *   disabled?: boolean,
 *   className?: string,
 *   icon?: React.ReactNode
 * }} props
 */
export const PrimaryButton = ({
  children,
  onClick,
  type = 'button',
  isLoading = false,
  disabled = false,
  className = '',
  icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-burgundy hover:bg-burgundy-hover active:bg-burgundy-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 select-none ${className}`}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Đang xử lý...</span>
        </>
      ) : (
        <>
          {icon && <span className="text-base">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

