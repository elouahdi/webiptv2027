'use client';

import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';

interface SaveBarProps {
  saving: boolean;
  success: string | null;
  error: string | null;
  onSave: () => void;
  label?: string;
}

export function SaveBar({ saving, success, error, onSave, label = 'Enregistrer' }: SaveBarProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-admin-border mt-6">
      <div className="flex items-center gap-2 min-h-[24px]">
        {success && (
          <span className="flex items-center gap-1.5 text-sm text-green-400 font-medium">
            <CheckCircle className="w-4 h-4" /> {success}
          </span>
        )}
        {error && (
          <span className="flex items-center gap-1.5 text-sm text-red-400 font-medium">
            <AlertCircle className="w-4 h-4" /> {error}
          </span>
        )}
      </div>
      <Button onClick={onSave} disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enregistrement…
          </>
        ) : label}
      </Button>
    </div>
  );
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function SectionHeader({ icon, title, description }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-10 h-10 rounded-xl bg-admin-muted border border-admin-border flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h1 className="font-syne font-bold text-2xl text-admin-text tracking-tight">{title}</h1>
        <p className="text-admin-text-secondary text-sm mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-12 bg-admin-muted rounded-xl" />
      ))}
    </div>
  );
}
