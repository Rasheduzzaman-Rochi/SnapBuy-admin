'use client';

import { ImageIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getImageCandidates } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  imageUrl?: string | null;
  alt: string;
  className?: string;
}

export function ProductImage({ imageUrl, alt, className }: ProductImageProps) {
  const candidates = useMemo(() => getImageCandidates(imageUrl), [imageUrl]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failed, setFailed] = useState(candidates.length === 0);

  useEffect(() => {
    setCurrentIndex(0);
    setFailed(candidates.length === 0);
  }, [candidates]);

  const currentSrc = candidates[currentIndex];

  const handleError = () => {
    setCurrentIndex((index) => {
      const nextIndex = index + 1;

      if (nextIndex < candidates.length) {
        return nextIndex;
      }

      setFailed(true);
      return index;
    });
  };

  if (failed || !currentSrc) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500',
          className
        )}
        title="No image"
      >
        <ImageIcon size={20} aria-hidden="true" />
        <span className="sr-only">No image</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      className={cn('rounded-lg object-cover', className)}
      onError={handleError}
    />
  );
}
