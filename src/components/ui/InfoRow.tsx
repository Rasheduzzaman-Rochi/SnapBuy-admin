'use client';

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
}

export function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center gap-2">
        {icon && <div className="text-slate-400">{icon}</div>}
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}
