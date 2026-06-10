import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  prevLabel?: string;
  nextLabel?: string;
}

export function BlogPagination({
  currentPage,
  totalPages,
  basePath,
  prevLabel = 'Précédent',
  nextLabel = 'Suivant',
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-12 mt-48" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="flex items-center gap-4 px-16 py-10 rounded-xl card-glass border border-border hover:border-border-active text-text-secondary hover:text-text-primary transition-all duration-300 text-sm font-semibold hover:scale-[1.02] active:scale-[0.98]"
        >
          <ChevronLeft className="w-16 h-16" />
          {prevLabel}
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={`w-40 h-40 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 hover:scale-[1.05] ${
            page === currentPage
              ? 'bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)] text-white shadow-md shadow-brand-from/10'
              : 'card-glass hover:border-border-active text-text-secondary hover:text-text-primary'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="flex items-center gap-4 px-16 py-10 rounded-xl card-glass border border-border hover:border-border-active text-text-secondary hover:text-text-primary transition-all duration-300 text-sm font-semibold hover:scale-[1.02] active:scale-[0.98]"
        >
          {nextLabel}
          <ChevronRight className="w-16 h-16" />
        </Link>
      )}
    </nav>
  );
}
