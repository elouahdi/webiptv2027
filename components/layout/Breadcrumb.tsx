import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [{ label: 'Accueil', href: '/' }, ...items];

  return (
    <nav className="flex items-center gap-8 text-sm text-text-secondary py-16" aria-label="Fil d'ariane">
      {allItems.map((item, index) => (
        <div key={`${item.href}-${index}`} className="flex items-center gap-8">
          {index === 0 && <Home className="w-4 h-4" />}
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          {index === allItems.length - 1 ? (
            <span className="text-text-primary font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-text-primary transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
