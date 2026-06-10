'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SiteSettings } from '@/lib/cms/settings-storage';

interface UseSettingsReturn {
  settings: SiteSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  save: (section: Partial<SiteSettings>) => Promise<void>;
  refresh: () => void;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Impossible de charger les paramètres');
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async (section: Partial<SiteSettings>) => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(section),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }
      const updated = await res.json();
      setSettings(updated);
      setSuccess('Enregistré avec succès !');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setSaving(false);
    }
  }, []);

  return { settings, loading, saving, error, success, save, refresh: load };
}
