import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { getPublicBlogPost, getAllPublicPostSlugs } from '@/lib/cms/blog-public';
import { translatePost, translateEnrichedPost } from '@/lib/cms/translations';
import { buildArticleSchema } from '@/lib/seo/schemas';
import { getTranslations, locales, getLocalizedPath } from '@/lib/i18n';
import { SITE_CONFIG } from '@/config/site';
import { Calendar, Clock, Eye, User, ArrowLeft } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPublicPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const data = await getPublicBlogPost(slug);
  if (!data) return {};

  const post = translatePost(data.post, activeLocale);
  const baseUrl = SITE_CONFIG.url;
  
  const canonical = activeLocale === 'fr' 
    ? `${baseUrl}/blog/${post.slug}` 
    : `${baseUrl}/${activeLocale}/blog/${post.slug}`;

  return {
    title: `${post.seo.title || post.title} | RegardezIPTV`,
    description: post.seo.description || post.excerpt,
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/blog/${post.slug}`,
        'fr': `${baseUrl}/blog/${post.slug}`,
        'en': `${baseUrl}/en/blog/${post.slug}`,
        'de': `${baseUrl}/de/blog/${post.slug}`,
        'es': `${baseUrl}/es/blog/${post.slug}`,
      },
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  const data = await getPublicBlogPost(slug);
  if (!data) notFound();

  // Translate post details to active locale
  const post = translatePost(data.post, activeLocale);
  const category = data.category ? {
    ...data.category,
    name: translateEnrichedPost(data, activeLocale).category?.name || data.category.name
  } : null;
  const tags = data.tags;
  const author = data.author;
  const featuredImage = data.featuredImage;
  const related = data.related.map((p) => translateEnrichedPost(p, activeLocale));

  const getLocalizedCategoryName = (name: string, lang: string) => {
    if (lang === 'fr') return name;
    if (name === 'Guide Installation') {
      return lang === 'en' ? 'Installation Guides' : lang === 'de' ? 'Anleitungen' : lang === 'es' ? 'Guías de Instalación' : name;
    }
    if (name === 'Comparatif') {
      return lang === 'en' ? 'Comparisons' : lang === 'de' ? 'Vergleiche' : lang === 'es' ? 'Comparativas' : name;
    }
    return name;
  };

  const breadcrumbItems = [
    { label: t('nav.blog'), href: getLocalizedPath('/blog', activeLocale) },
    ...(category ? [{ label: getLocalizedCategoryName(category.name, activeLocale), href: getLocalizedPath(`/blog/category/${category.slug}`, activeLocale) }] : []),
    { label: post.title, href: getLocalizedPath(`/blog/${post.slug}`, activeLocale) },
  ];

  const schemaPost = {
    slug: post.slug,
    title: post.title,
    description: post.excerpt,
    content: post.content,
    publishedAt: post.publishedAt || post.createdAt,
    updatedAt: post.updatedAt,
    category: category?.name || '',
    readTime: post.readTime,
    coverImage: featuredImage?.url || '',
  };

  const getLocalDateString = (dateString: string) => {
    const date = new Date(dateString);
    const code = activeLocale === 'en' ? 'en-US' : activeLocale === 'de' ? 'de-DE' : activeLocale === 'es' ? 'es-ES' : 'fr-FR';
    return date.toLocaleDateString(code, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const ctaInfo = {
    en: {
      title: 'Revolutionize Your Entertainment Today',
      desc: 'Access 45,000+ live premium global channels, sports networks, and over 20,000 movies & series in 4K UHD quality. Stable, buffer-free, and activated instantly.',
      plans: 'Choose a Plan',
      trial: 'Free 3H Trial',
    },
    de: {
      title: 'Revolutionieren Sie Ihr Entertainment heute',
      desc: 'Erhalten Sie sofortigen Zugang zu über 45.000 Live-Premium-Kanälen, Sportsendern und mehr als 20.000 Filmen und Serien in 4K UHD-Qualität.',
      plans: 'Abonnements ansehen',
      trial: '3 Std. Kostenloser Test',
    },
    es: {
      title: 'Revolucione su Entretenimiento Hoy Mismo',
      desc: 'Acceda instantáneamente a más de 45.000 canales de televisión en directo, deportes premium y más de 20.000 películas y series en calidad 4K UHD.',
      plans: 'Ver Planes y Precios',
      trial: 'Prueba Gratis de 3H',
    },
    fr: {
      title: 'Révolutionnez Votre Expérience TV Dès Aujourd\'hui',
      desc: 'Accédez instantanément à plus de 45 000 chaînes premium en direct, bouquets de sport et plus de 20 000 films & séries en qualité 4K UHD. Stable, sans coupure.',
      plans: 'Découvrir Nos Plans',
      trial: 'Essai Gratuit de 3 Heures',
    }
  }[activeLocale] || {
    title: 'Révolutionnez Votre Expérience TV Dès Aujourd\'hui',
    desc: 'Accédez instantanément à plus de 45 000 chaînes premium en direct, bouquets de sport et plus de 20 000 films & séries en qualité 4K UHD. Stable, sans coupure.',
    plans: 'Découvrir Nos Plans',
    trial: 'Essai Gratuit de 3 Heures',
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      
      {/* Scoped Prose Styling for blog HTML contents */}
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-content h2 {
          font-family: var(--font-syne), sans-serif;
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          letter-spacing: -0.025em;
          border-left: 4px solid var(--brand-from);
          padding-left: 1rem;
        }
        @media (min-width: 768px) {
          .blog-content h2 {
            font-size: 2rem;
          }
        }
        .blog-content h3 {
          font-family: var(--font-syne), sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .blog-content p {
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-size: 1.05rem;
        }
        .blog-content li {
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 0.5rem;
          font-size: 1.05rem;
          list-style-type: disc;
          margin-left: 1.5rem;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 1.5rem;
        }
        .blog-content ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
        }
        .blog-content blockquote {
          border-left: 4px solid var(--brand-from);
          padding: 1rem 1.5rem;
          background: rgba(0, 243, 255, 0.03);
          border-radius: 0.75rem;
          margin: 2rem 0;
          font-style: italic;
        }
        .blog-content blockquote p {
          margin-bottom: 0;
          color: var(--text-primary);
        }
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2.5rem 0;
          font-size: 0.95rem;
        }
        .blog-content th, .blog-content td {
          border: 1px solid var(--border);
          padding: 14px 18px;
          text-align: left;
        }
        .blog-content th {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
          font-weight: bold;
        }
        .blog-content td {
          color: var(--text-secondary);
        }
      `}} />

      <main className="min-h-screen bg-bg-base pt-32">
        <div className="border-b border-border/40 bg-bg-card">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] py-16">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <article className="py-64 bg-bg-card border-b border-border/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[var(--brand-from)]/5 via-transparent to-transparent pointer-events-none z-0" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-[24px] md:px-[40px]">
            
            {/* Header Content */}
            <div className="text-center mb-40">
              {category && (
                <Link
                  href={getLocalizedPath(`/blog/category/${category.slug}`, activeLocale)}
                  className="inline-block px-16 py-6 bg-[var(--brand-from)]/10 border border-brand-from/20 text-[var(--brand-from)] rounded-full text-xs font-bold mb-20 hover:bg-[var(--brand-from)]/20 transition-all duration-300"
                >
                  {getLocalizedCategoryName(category.name, activeLocale)}
                </Link>
              )}

              <h1 className="font-syne font-extrabold text-32 md:text-52 lg:text-60 text-text-primary mb-24 tracking-tight leading-tight max-w-3xl mx-auto">
                {post.title}
              </h1>

              {/* Dynamic Metadata bar */}
              <div className="flex flex-wrap items-center justify-center gap-16 md:gap-24 text-text-muted text-xs md:text-sm font-medium border-y border-border/30 py-16 max-w-2xl mx-auto">
                <span className="flex items-center gap-6">
                  <Calendar className="w-14 h-14 text-brand-from/80" />
                  <time dateTime={post.publishedAt || post.createdAt}>
                    {getLocalDateString(post.publishedAt || post.createdAt)}
                  </time>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-6">
                  <Clock className="w-14 h-14 text-brand-to/80" />
                  <span>
                    {activeLocale === 'en' 
                      ? `${post.readTime} min read` 
                      : activeLocale === 'de' 
                        ? `${post.readTime} Min. Lesezeit` 
                        : activeLocale === 'es' 
                          ? `${post.readTime} min de lectura` 
                          : `${post.readTime} min de lecture`}
                  </span>
                </span>
                {author && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-6">
                      <User className="w-14 h-14 text-brand-from/80" />
                      <span>{author.name}</span>
                    </span>
                  </>
                )}
                {post.views > 0 && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-6">
                      <Eye className="w-14 h-14 text-brand-to/80" />
                      <span>{post.views} views</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Immersive Cover Image */}
            {featuredImage && (
              <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-48 shadow-2xl border border-border/30 group">
                <Image
                  src={featuredImage.url}
                  alt={featuredImage.alt || post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-102"
                  priority
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            {/* Core HTML Body content styled by Scoped CSS above */}
            <div
              className="prose dark:prose-invert prose-lg max-w-none blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags footer */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-8 mt-40 pt-24 border-t border-border/20">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={getLocalizedPath(`/blog/tag/${tag.slug}`, activeLocale)}
                    className="px-12 py-4 text-xs rounded-full bg-bg-base border border-border text-text-secondary hover:border-brand-from hover:text-[var(--brand-from)] hover:scale-[1.02] transition-all duration-300"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Conversion Driving Bottom CTA Banner */}
            <div className="mt-64 p-32 md:p-48 rounded-3xl bg-gradient-to-br from-bg-card via-bg-elevated to-bg-card border border-brand-from/20 shadow-xl relative overflow-hidden text-center md:text-left">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-brand-from/5 via-transparent to-transparent pointer-events-none z-0" />
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-24 items-center">
                <div className="md:col-span-8">
                  <h3 className="font-syne font-bold text-22 md:text-28 text-text-primary mb-12 tracking-tight leading-tight">
                    {ctaInfo.title}
                  </h3>
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                    {ctaInfo.desc}
                  </p>
                </div>
                <div className="md:col-span-4 flex flex-col gap-12 sm:flex-row md:flex-col justify-center">
                  <Link
                    href={getLocalizedPath('/nos-plans', activeLocale)}
                    className="px-24 py-12 rounded-xl text-xs md:text-sm font-extrabold bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white text-center hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-md hover:shadow-brand-from/15"
                  >
                    {ctaInfo.plans}
                  </Link>
                  <Link
                    href={getLocalizedPath('/essai-gratuit', activeLocale)}
                    className="px-24 py-12 rounded-xl text-xs md:text-sm font-extrabold card-glass border border-border hover:border-brand-from/50 text-text-primary text-center hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-sm"
                  >
                    {ctaInfo.trial}
                  </Link>
                </div>
              </div>
            </div>

            {/* Back to Blog button */}
            <div className="mt-48 pt-24 border-t border-border/35 flex justify-between items-center">
              <Link
                href={getLocalizedPath('/blog', activeLocale)}
                className="inline-flex items-center gap-8 text-[var(--brand-from)] font-bold hover:text-[var(--brand-to)] transition-all duration-300 hover:-translate-x-4"
              >
                <ArrowLeft className="w-16 h-16" />
                {activeLocale === 'en' ? 'Back to blog' : activeLocale === 'de' ? 'Zurück zum Blog' : activeLocale === 'es' ? 'Volver al blog' : 'Retour au blog'}
              </Link>
            </div>

          </div>
        </article>

        {/* Related Articles Section */}
        {related.length > 0 && (
          <section className="py-80 bg-bg-base">
            <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
              <h2 className="font-syne font-bold text-24 md:text-32 text-text-primary mb-32 tracking-tight">
                {activeLocale === 'en' ? 'Related Articles' : activeLocale === 'de' ? 'Ähnliche Artikel' : activeLocale === 'es' ? 'Artículos similares' : 'Articles similaires'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-32">
                {related.map((item) => (
                  <BlogPostCard key={item.post.id} item={item} locale={activeLocale} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
      <WhatsappButton />

      {post.seo.schemaJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: post.seo.schemaJsonLd }} />
      ) : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleSchema(schemaPost)) }}
        />
      )}
    </>
  );
}
