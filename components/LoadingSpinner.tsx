import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'w-12 h-12' }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
    >
      <circle cx="50" cy="50" r="45" stroke="rgba(34, 211, 238, 0.3)" fill="none" strokeWidth="6" />
      <circle cx="50" cy="50" r="45" stroke="#22D3EE" fill="none" strokeWidth="6" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="1s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dasharray"
          values="1, 200; 89, 200; 89, 200"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};
