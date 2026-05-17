import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumb?: Array<{ label: string; href?: string }>;
}

export function PageHeader({ title, description, action, breadcrumb }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumb && (
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4 dark:text-slate-400">
          {breadcrumb.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-400 dark:text-slate-600">/</span>}
              {item.href ? (
                <a href={item.href} className="hover:text-slate-900 transition-colors dark:hover:text-slate-100">
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl dark:text-slate-100">{title}</h1>
          {description && <p className="mt-2 text-sm text-slate-600 sm:text-base dark:text-slate-400">{description}</p>}
        </div>
        {action && <div className="flex w-full items-center sm:w-auto sm:justify-end">{action}</div>}
      </div>
    </div>
  );
}
