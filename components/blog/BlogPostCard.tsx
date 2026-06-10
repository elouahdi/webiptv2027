import Link from 'next/link';
import Image from 'next/image';
import type { EnrichedPost } from '@/lib/cms/blog-public';
import { getLocalizedPath } from '@/lib/i18n';
import { Calendar, Clock } from 'lucide-react';

interface BlogPostCardProps {
  item: EnrichedPost;
  locale?: string;
}

export function BlogPostCard({ item, locale = 'fr' }: BlogPostCardProps) {
  const { post, category, featuredImage } = item;
  const href = getLocalizedPath(`/blog/${post.slug}`, locale);

  const getLocalDateString = (dateString: string) => {
    const date = new Date(dateString);
    const code = locale === 'en' ? 'en-US' : locale === 'de' ? 'de-DE' : locale === 'es' ? 'es-ES' : 'fr-FR';
    return date.toLocaleDateString(code, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Link href={href} className="group block h-full">
      <article className="h-full rounded-2xl card-glass border border-border/30 hover:border-brand-from/40 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-brand-from/5 group-hover:-translate-y-4">
        <div>
          <div className="aspect-video relative bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)] overflow-hidden">
            {category && (
              <span className="absolute top-16 left-16 z-10 px-12 py-6 rounded-full text-12 font-bold bg-bg-card/90 backdrop-blur-md text-text-primary border border-border/50 shadow-sm transition-all duration-300 group-hover:border-brand-from">
                {category.name}
              </span>
            )}
            {featuredImage ? (
              <Image
                src={featuredImage.url}
                alt={featuredImage.alt || post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-syne font-bold text-2xl drop-shadow-md">
                  {category?.name || 'Blog'}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
          </div>

          <div className="p-24">
            <div className="flex items-center gap-12 text-xs text-text-muted mb-12 font-medium">
              <span className="flex items-center gap-4">
                <Calendar className="w-12 h-12 text-brand-from/80" />
                <time dateTime={post.publishedAt || post.createdAt}>
                  {getLocalDateString(post.publishedAt || post.createdAt)}
                </time>
              </span>
              <span>•</span>
              <span className="flex items-center gap-4">
                <Clock className="w-12 h-12 text-brand-to/80" />
                <span>
                  {locale === 'en'
                    ? `${post.readTime} min read`
                    : locale === 'de'
                      ? `${post.readTime} Min.`
                      : locale === 'es'
                        ? `${post.readTime} min`
                        : `${post.readTime} min`}
                </span>
              </span>
            </div>

            <h2 className="font-syne font-bold text-18 md:text-20 text-text-primary mb-8 group-hover:text-[var(--brand-from)] transition-colors duration-300 leading-snug">
              {post.title}
            </h2>

            <p className="text-text-secondary text-14 leading-relaxed line-clamp-2 group-hover:text-text-primary/90 transition-colors duration-300">{post.excerpt}</p>
          </div>
        </div>
        <div className="px-24 pb-24 pt-0">
          <span className="inline-flex items-center gap-4 text-xs font-bold text-brand-from group-hover:text-brand-to transition-colors duration-300">
            {locale === 'en' ? 'Read Article' : locale === 'de' ? 'Artikel lesen' : locale === 'es' ? 'Leer artículo' : 'Lire l\'article'}
            <span className="transition-transform duration-300 group-hover:translate-x-4">→</span>
          </span>
        </div>
      </article>
    </Link>
  );
}
