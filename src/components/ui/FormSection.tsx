import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isDanger?: boolean;
}

export function FormSection({ title, description, children, isDanger = false }: FormSectionProps) {
  if (isDanger) {
    return (
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6 lg:p-8 dark:bg-red-500/10 dark:border-red-500/20">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">{title}</h3>
          {description && <p className="text-red-700 text-sm mt-1 dark:text-red-300">{description}</p>}
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 dark:bg-slate-900 dark:border-slate-800">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        {description && <p className="text-slate-600 text-sm mt-1 dark:text-slate-400">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
