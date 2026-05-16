import React from 'react';

interface DataTableWrapperProps {
  children: React.ReactNode;
}

export function DataTableWrapper({ children }: DataTableWrapperProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">{children}</div>
      </div>
    </div>
  );
}
