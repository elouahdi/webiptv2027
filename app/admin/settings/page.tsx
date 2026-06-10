'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { Input } from '@/components/admin/ui/Input';
export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.ok ? r.json() : null).then((d) => d && setUser(d.user));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-syne font-bold text-2xl text-admin-text">Paramètres</h1>
        <p className="text-admin-text-secondary">Configuration du panneau d&apos;administration</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Profil</CardTitle></CardHeader>
        <CardContent className="space-y-16 max-w-md">
          <Input label="Nom" value={user?.name || ''} readOnly />
          <Input label="Email" value={user?.email || ''} readOnly />
          <Input label="Rôle" value={user?.role || ''} readOnly />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Site</CardTitle></CardHeader>
        <CardContent className="space-y-16 max-w-md">
          <Input label="URL du site" defaultValue={process.env.NEXT_PUBLIC_SITE_URL || 'https://www.regardeziptv.fr'} readOnly />
          <Input label="Nom du site" defaultValue={process.env.NEXT_PUBLIC_SITE_NAME || 'RegardezIPTV'} readOnly />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Sécurité</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-admin-text-secondary mb-16">
            Changez le secret d&apos;authentification via la variable d&apos;environnement <code className="text-amber-400">CMS_AUTH_SECRET</code> en production.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
