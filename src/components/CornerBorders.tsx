import React from 'react';

interface CornerBordersProps {
  className?: string;
  color?: string;
  size?: string;
  inset?: string;
  showTicks?: boolean;
}

/**
 * Subtle modern geometric engravings/brackets for card corners and frames
 */
export const CornerBorders: React.FC<CornerBordersProps> = ({
  className = '',
  color = 'border-white/30',
  size = 'w-2.5 h-2.5',
  inset = 'top-2 left-2 right-2 bottom-2',
  showTicks = true,
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none select-none z-10 overflow-hidden ${className}`}>
      {/* Top Left Bracket */}
      <div className={`absolute top-2.5 left-2.5 ${size} border-t-1.5 border-l-1.5 ${color} rounded-tl-sm transition-colors`} />
      {/* Top Right Bracket */}
      <div className={`absolute top-2.5 right-2.5 ${size} border-t-1.5 border-r-1.5 ${color} rounded-tr-sm transition-colors`} />
      {/* Bottom Left Bracket */}
      <div className={`absolute bottom-2.5 left-2.5 ${size} border-b-1.5 border-l-1.5 ${color} rounded-bl-sm transition-colors`} />
      {/* Bottom Right Bracket */}
      <div className={`absolute bottom-2.5 right-2.5 ${size} border-b-1.5 border-r-1.5 ${color} rounded-br-sm transition-colors`} />

      {/* Subtle modern midpoint edge ticks if requested */}
      {showTicks && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-white/20" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-white/20" />
        </>
      )}
    </div>
  );
};
