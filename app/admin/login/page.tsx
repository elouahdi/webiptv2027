'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Erreur de connexion');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel min-h-screen flex items-center justify-center p-4 bg-admin-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-from to-brand-to items-center justify-center mb-4 shadow-lg shadow-brand-from/30">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-syne font-bold text-2xl text-admin-text">Administration</h1>
          <p className="text-admin-text-secondary mt-2">Connectez-vous à votre panneau CMS</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-admin-card border border-admin-border rounded-2xl p-8 shadow-xl space-y-5"
        >
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@regardez-iptv.fr"
            required
            autoComplete="email"
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-admin-text">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 pr-10 rounded-lg border bg-admin-input text-admin-text border-admin-border focus:outline-none focus:ring-2 focus:ring-brand-from/50"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-text-muted"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>

          <p className="text-xs text-center text-admin-text-muted">
            Démo : admin@regardez-iptv.fr / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
