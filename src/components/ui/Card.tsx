import React from 'react';

interface CardProps {
  children: React.ReactNode;
  type?: 'primary' | 'gradient' | 'feature';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  type = 'primary',
  className = '',
  onClick,
}) => {
  const typeClasses = {
    primary: 'card-primary',
    gradient: 'card-gradient',
    feature: 'card-feature',
  };
  
  const clickableClasses = onClick ? 'cursor-pointer hover:scale-105' : '';
  
  return (
    <div
      onClick={onClick}
      className={`${typeClasses[type]} ${clickableClasses} ${className}`}
    >
      {children}
    </div>
  );
};
