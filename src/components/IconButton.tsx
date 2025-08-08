import React from 'react';

interface IconButtonProps {
  ariaLabel: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const IconButton: React.FC<IconButtonProps> = ({ ariaLabel, icon, active = false, onClick }) => {
  return (
    <button
      type="button"
      className={`icon-button ${active ? 'active' : ''}`}
      aria-label={ariaLabel}
      aria-pressed={active}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};
