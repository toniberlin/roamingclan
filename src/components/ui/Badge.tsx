import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  type = 'primary',
  size = 'md',
  className = '',
}) => {
  const typeClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  return (
    <span className={`${typeClasses[type]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};
