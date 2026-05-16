import React from 'react';
import { ActionButton } from './ActionButton';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="mb-4 text-slate-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && <p className="text-slate-600 text-sm mb-6 text-center max-w-sm">{description}</p>}
      {action && (
        <ActionButton variant="primary" onClick={action.onClick}>
          {action.label}
        </ActionButton>
      )}
    </div>
  );
}
