'use client';

import { useRouter, useParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { getLocalizedPath } from '@/lib/i18n';

interface BlogSearchProps {
  defaultValue?: string;
}

export function BlogSearch({ defaultValue = '' }: BlogSearchProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'fr';

  const placeholders: Record<string, string> = {
    fr: 'Rechercher un article...',
    en: 'Search articles...',
    de: 'Artikel suchen...',
    es: 'Buscar artículos...',
  };

  const placeholder = placeholders[locale] || placeholders.fr;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    const basePath = getLocalizedPath('/blog', locale);
    if (query.trim()) {
      router.push(`${basePath}?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(basePath);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto relative group">
      <Search className="absolute left-16 top-1/2 -translate-y-1/2 w-18 h-18 text-text-muted group-focus-within:text-[var(--brand-from)] transition-colors duration-300" />
      <input
        name="search"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full pl-48 pr-16 py-12 rounded-xl bg-bg-card/40 backdrop-blur-md border border-border hover:border-border-active text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--brand-from)] focus:ring-1 focus:ring-[var(--brand-from)] transition-all duration-300 text-sm shadow-md"
      />
    </form>
  );
}
