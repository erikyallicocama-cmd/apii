import React from 'react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32'
};

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 'md',
  className = ''
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {/* Professional AI Brain Icon */}
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#14b8a6', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Background Circle */}
        <circle cx="100" cy="100" r="95" fill="url(#brainGradient)" opacity="0.1" />
        
        {/* Neural Network Nodes */}
        <circle cx="100" cy="60" r="8" fill="url(#brainGradient)" />
        <circle cx="70" cy="90" r="8" fill="url(#brainGradient)" />
        <circle cx="130" cy="90" r="8" fill="url(#brainGradient)" />
        <circle cx="60" cy="130" r="8" fill="url(#accentGradient)" />
        <circle cx="100" cy="140" r="8" fill="url(#accentGradient)" />
        <circle cx="140" cy="130" r="8" fill="url(#accentGradient)" />
        
        {/* Connection Lines */}
        <line x1="100" y1="60" x2="70" y2="90" stroke="url(#brainGradient)" strokeWidth="3" opacity="0.6" />
        <line x1="100" y1="60" x2="130" y2="90" stroke="url(#brainGradient)" strokeWidth="3" opacity="0.6" />
        <line x1="70" y1="90" x2="60" y2="130" stroke="url(#brainGradient)" strokeWidth="3" opacity="0.6" />
        <line x1="70" y1="90" x2="100" y2="140" stroke="url(#brainGradient)" strokeWidth="3" opacity="0.6" />
        <line x1="130" y1="90" x2="100" y2="140" stroke="url(#brainGradient)" strokeWidth="3" opacity="0.6" />
        <line x1="130" y1="90" x2="140" y2="130" stroke="url(#brainGradient)" strokeWidth="3" opacity="0.6" />
        
        {/* AI Brain Symbol */}
        <path 
          d="M 100 50 Q 85 50 75 60 Q 70 70 70 85 Q 70 95 75 105 L 80 110 Q 75 115 75 125 Q 75 135 85 145 Q 95 150 100 150 Q 105 150 115 145 Q 125 135 125 125 Q 125 115 120 110 L 125 105 Q 130 95 130 85 Q 130 70 125 60 Q 115 50 100 50 Z" 
          fill="none" 
          stroke="url(#brainGradient)" 
          strokeWidth="4"
          opacity="0.8"
        />
        
        {/* Sparkle Effect */}
        <circle cx="140" cy="70" r="3" fill="url(#accentGradient)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="70" r="3" fill="url(#accentGradient)">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};
