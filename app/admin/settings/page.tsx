'use client';

import { useEffect, useState } from 'react';
import { Settings, User, Globe, BarChart3, Facebook, Twitter, Instagram, Youtube, Save, Loader2, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { Input } from '@/components/admin/ui/Input';
import { useToast } from '@/components/admin/ui/Toast';

interface SiteSettings {
  site_name: string; site_tagline: string; site_logo: string;
  analytics_id: string; social_facebook: string; social_twitter: string;
  social_instagram: string; social_youtube: string;
  admin_email: string; admin_phone: string;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: '', site_tagline: '', site_logo: '', analytics_id: '',
    social_facebook: '', social_twitter: '', social_instagram: '',
    social_youtube: '', admin_email: '', admin_phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.ok ? r.json() : null),
      fetch('/api/cms/settings').then(r => r.ok ? r.json() : null),
    ]).then(([userData, settingsData]) => {
      if (userData) setUser(userData.user);
      if (settingsData) setSettings(prev => ({ ...prev, ...settingsData }));
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      toast('Paramètres enregistrés', 'success');
    } catch {
      toast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSettings(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-from to-brand-to flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-syne font-bold text-2xl text-admin-text">Paramètres</h1>
            <p className="text-admin-text-secondary text-sm">Configuration générale</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving || loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-medium text-sm transition-all disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />Profil Administrateur
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Nom" value={user?.name || ''} readOnly />
          <Input label="Email" value={user?.email || ''} readOnly />
          <Input label="Rôle" value={user?.role || ''} readOnly />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />Informations du Site
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nom du site" value={settings.site_name} onChange={update('site_name')} />
          <Input label="Slogan / Tagline" value={settings.site_tagline} onChange={update('site_tagline')} />
          <Input label="URL Logo" value={settings.site_logo} onChange={update('site_logo')} placeholder="https://..." />
          <Input label="URL du site" defaultValue={process.env.NEXT_PUBLIC_SITE_URL || 'https://www.regardeziptv.fr'} readOnly />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />Contact Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Email admin" value={settings.admin_email} onChange={update('admin_email')} placeholder="admin@exemple.fr" />
          <Input label="Téléphone" value={settings.admin_phone} onChange={update('admin_phone')} placeholder="+33 6 00 00 00 00" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />Réseaux Sociaux
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
            <Input label="Facebook URL" value={settings.social_facebook} onChange={update('social_facebook')} placeholder="https://facebook.com/..." />
          </div>
          <div className="flex items-center gap-2">
            <Twitter className="w-4 h-4 text-sky-400 shrink-0" />
            <Input label="Twitter / X URL" value={settings.social_twitter} onChange={update('social_twitter')} placeholder="https://twitter.com/..." />
          </div>
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
            <Input label="Instagram URL" value={settings.social_instagram} onChange={update('social_instagram')} placeholder="https://instagram.com/..." />
          </div>
          <div className="flex items-center gap-2">
            <Youtube className="w-4 h-4 text-red-500 shrink-0" />
            <Input label="YouTube URL" value={settings.social_youtube} onChange={update('social_youtube')} placeholder="https://youtube.com/..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="max-w-md space-y-2">
          <Input label="Google Analytics ID" value={settings.analytics_id} onChange={update('analytics_id')} placeholder="G-XXXXXXXXXX" />
          <p className="text-xs text-admin-text-muted">Format: G-XXXXXXXXXX (Google Analytics 4)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Sécurité</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-admin-text-secondary">
            Changez le secret via la variable d&apos;environnement{' '}
            <code className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">CMS_AUTH_SECRET</code> en production.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
