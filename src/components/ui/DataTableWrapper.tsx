import React from 'react';

interface DataTableWrapperProps {
  children: React.ReactNode;
}

export function DataTableWrapper({ children }: DataTableWrapperProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle [&_table]:min-w-[720px]">{children}</div>
      </div>
    </div>
  );
}
