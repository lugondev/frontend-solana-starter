import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/format';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function Card({ children, className, title, description }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
