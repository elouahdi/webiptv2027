'use client';

import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/admin/ui/Card';
import { Skeleton } from '@/components/admin/ui/Skeleton';

interface StatCardProps {
  name: string;
  value: number | null;
  icon: LucideIcon;
  gradient: string;
}

function useCountUp(target: number | null, duration = 900): number {
  const [display, setDisplay] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (target === null) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return display;
}

export function StatCard({ name, value, icon: Icon, gradient }: StatCardProps) {
  const display = useCountUp(value);

  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:border-amber-500/20">
      <CardContent className="pt-6">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg mb-4`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        {value === null ? (
          <Skeleton className="h-9 w-20" />
        ) : (
          <p className="text-3xl font-bold text-admin-text tracking-tight tabular-nums">
            {display.toLocaleString('fr-FR')}
          </p>
        )}
        <p className="text-xs text-admin-text-muted mt-1.5 uppercase tracking-wider font-medium">{name}</p>
      </CardContent>
    </Card>
  );
}
