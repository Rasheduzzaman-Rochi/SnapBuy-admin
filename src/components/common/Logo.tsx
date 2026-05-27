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

const sizeMap: Record<LogoSize, { image: number; imageClass: string; title: string; subtitle: string; gap: string }> = {
  sm: { image: 40, imageClass: 'h-10 w-10', title: 'text-lg', subtitle: 'text-xs', gap: 'gap-2' },
  md: { image: 56, imageClass: 'h-14 w-14', title: 'text-2xl', subtitle: 'text-sm', gap: 'gap-3' },
  lg: { image: 64, imageClass: 'h-14 w-14 sm:h-16 sm:w-16', title: 'text-3xl', subtitle: 'text-sm', gap: 'gap-3' },
};

export function Logo({ showText = true, subtitle, size = 'md', className }: LogoProps) {
  const config = sizeMap[size];

  return (
    <div className={cn('flex w-fit items-center min-w-0', config.gap, className)}>
      <Image
        src="/snapbuy-logo.png"
        alt="SnapBuy"
        width={config.image}
        height={config.image}
        priority
        className={cn('shrink-0 scale-110 object-contain', config.imageClass)}
      />
      {showText && (
        <div className="min-w-0 text-left leading-tight">
          <div className={cn('truncate font-bold text-slate-900 dark:text-white', config.title)}>SnapBuy</div>
          {subtitle && (
            <div className={cn('mt-1 truncate font-medium text-slate-500 dark:text-slate-400', config.subtitle)}>{subtitle}</div>
          )}
        </div>
      )}
    </div>
  );
}
