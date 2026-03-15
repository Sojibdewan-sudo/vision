import React, { useEffect } from 'react';
import { cn } from '../lib/utils';
import { ADS_ENABLED } from '../config';

interface AdPlaceholderProps {
  className?: string;
  text?: string;
  slotId?: string;
}

export function AdPlaceholder({ className, text = 'Advertisement', slotId }: AdPlaceholderProps) {
  useEffect(() => {
    if (ADS_ENABLED && slotId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error', err);
      }
    }
  }, [slotId]);

  if (!ADS_ENABLED) return null;

  if (slotId) {
    return (
      <div className={cn('ad-container my-8 text-center flex items-center justify-center overflow-hidden', className)}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with actual client ID
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Fallback placeholder for development/testing
  return (
    <div
      className={cn(
        'ad-container my-8 text-center flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl border border-dashed border-slate-300 dark:border-slate-700',
        className
      )}
    >
      <span className="text-sm font-medium tracking-wider uppercase">{text}</span>
    </div>
  );
}

