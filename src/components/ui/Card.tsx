import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hoverable = false, onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${
        hoverable ? 'hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
