'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  showText?: boolean;
  subtitle?: string;
  size?: LogoSize;
  className?: string;
}

const sizeMap: Record<LogoSize, { image: number; title: string; subtitle: string; gap: string }> = {
  sm: { image: 40, title: 'text-lg', subtitle: 'text-xs', gap: 'gap-3' },
  md: { image: 56, title: 'text-2xl', subtitle: 'text-sm', gap: 'gap-4' },
  lg: { image: 80, title: 'text-3xl', subtitle: 'text-sm', gap: 'gap-5' },
};

export function Logo({ showText = true, subtitle, size = 'md', className }: LogoProps) {
  const config = sizeMap[size];

  return (
    <div className={cn('flex items-center min-w-0', config.gap, className)}>
      <Image
        src="/snapbuy-logo.png"
        alt="SnapBuy"
        width={config.image}
        height={config.image}
        priority
        className="shrink-0 rounded-2xl object-contain"
      />
      {showText && (
        <div className="min-w-0">
          <div className={cn('truncate font-bold text-slate-900 dark:text-white', config.title)}>SnapBuy</div>
          {subtitle && (
            <div className={cn('truncate text-slate-500 dark:text-slate-400', config.subtitle)}>{subtitle}</div>
          )}
        </div>
      )}
    </div>
  );
}