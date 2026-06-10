import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { getPublicBlogPosts, getPublicCategories } from '@/lib/cms/blog-public';
import { translateEnrichedPost } from '@/lib/cms/translations';
import { getTranslations, locales, getLocalizedPath } from '@/lib/i18n';
import { SITE_CONFIG } from '@/config/site';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);
  const baseUrl = SITE_CONFIG.url;
  
  const canonical = activeLocale === 'fr' 
    ? `${baseUrl}/blog` 
    : `${baseUrl}/${activeLocale}/blog`;

  return {
    title: `${t('nav.blog')} | RegardezIPTV`,
    description: t('nav.blog') + ' - RegardezIPTV',
    alternates: {
      canonical,
      languages: {
        'x-default': `${baseUrl}/blog`,
        'fr': `${baseUrl}/blog`,
        'en': `${baseUrl}/en/blog`,
        'de': `${baseUrl}/de/blog`,
        'es': `${baseUrl}/es/blog`,
      },
    },
  };
}

interface BlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as any) ? locale : 'fr';
  const { t } = getTranslations(activeLocale);

  const searchValues = await searchParams;
  const page = Number(searchValues.page) || 1;
  const search = searchValues.search || '';

  const [{ posts: rawPosts, totalPages }, rawCategories] = await Promise.all([
    getPublicBlogPosts({ page, limit: 10, search: search || undefined }),
    getPublicCategories(),
  ]);

  // Translate all posts to current locale
  const posts = rawPosts.map((p) => translateEnrichedPost(p, activeLocale));

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

  const getLocalDateString = (dateString: string) => {
    const date = new Date(dateString);
    const code = activeLocale === 'en' ? 'en-US' : activeLocale === 'de' ? 'de-DE' : activeLocale === 'es' ? 'es-ES' : 'fr-FR';
    return date.toLocaleDateString(code, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Extract featured post for page 1 if not searching
  const featuredPost = page === 1 && !search && posts.length > 0 ? posts[0] : null;
  const listPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-bg-base pt-32">
        <div className="border-b border-border/40 bg-bg-card">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] py-16">
            <Breadcrumb items={[{ label: t('nav.blog'), href: getLocalizedPath('/blog', activeLocale) }]} />
          </div>
        </div>

        {/* Stunning Premium Hero Header */}
        <div className="relative py-80 bg-bg-card border-b border-border/40 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[var(--brand-from)]/5 via-transparent to-transparent z-0 pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-[24px] md:px-[40px] text-center">
            <h1 className="font-syne font-bold text-40 md:text-64 text-text-primary mb-16 tracking-tight leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand-from)] via-[var(--accent-purple)] to-[var(--brand-to)]">
                {t('nav.blog')}
              </span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-32">
              {activeLocale === 'en' 
                ? 'Guides, tutorials and news to optimize your IPTV experience' 
                : activeLocale === 'de' 
                  ? 'Anleitungen, Tutorials und Neuigkeiten zur Optimierung Ihres IPTV-Erlebnisses' 
                  : activeLocale === 'es' 
                    ? 'Guías, tutoriales y noticias para optimizar su experiencia de IPTV' 
                    : "Guides, tutoriels et actualités pour optimiser votre expérience IPTV"}
            </p>
            <BlogSearch defaultValue={search} />
          </div>
        </div>

        {/* Premium Pill Category Nav */}
        {rawCategories.length > 0 && (
          <div className="py-24 bg-bg-base border-b border-border/40">
            <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
              <div className="flex flex-wrap gap-12 justify-center">
                <Link
                  href={getLocalizedPath('/blog', activeLocale)}
                  className="px-20 py-10 rounded-full text-xs md:text-sm font-semibold bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md"
                >
                  {activeLocale === 'en' ? 'All' : activeLocale === 'de' ? 'Alle' : activeLocale === 'es' ? 'Todos' : 'Tous'}
                </Link>
                {rawCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={getLocalizedPath(`/blog/category/${cat.slug}`, activeLocale)}
                    className="px-20 py-10 rounded-full text-xs md:text-sm font-semibold card-glass border border-border hover:border-brand-from hover:text-[var(--brand-from)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-sm"
                  >
                    {getLocalizedCategoryName(cat.name, activeLocale)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="py-80 bg-bg-base">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            
            {/* Spotlight Featured Post Card */}
            {featuredPost && (
              <div className="mb-48">
                <Link href={getLocalizedPath(`/blog/${featuredPost.post.slug}`, activeLocale)} className="group block">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 rounded-3xl card-glass border border-border/30 hover:border-brand-from/40 overflow-hidden p-24 md:p-32 transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:shadow-brand-from/5">
                    
                    <div className="lg:col-span-7 aspect-video relative rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)]">
                      {featuredPost.category && (
                        <span className="absolute top-20 left-20 z-10 px-16 py-8 rounded-full text-12 font-bold bg-bg-card/90 backdrop-blur-md text-text-primary border border-border/50 shadow-md">
                          {activeLocale === 'en' ? 'Featured • ' : activeLocale === 'de' ? 'Highlight • ' : activeLocale === 'es' ? 'Destacado • ' : 'À la une • '}
                          {getLocalizedCategoryName(featuredPost.category.name, activeLocale)}
                        </span>
                      )}
                      {featuredPost.featuredImage ? (
                        <Image
                          src={featuredPost.featuredImage.url}
                          alt={featuredPost.featuredImage.alt || featuredPost.post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          priority
                          sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-syne font-bold text-3xl drop-shadow-md">
                            RegardezIPTV Blog
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>

                    <div className="lg:col-span-5 flex flex-col justify-between py-12">
                      <div>
                        <div className="flex items-center gap-12 text-xs text-text-muted mb-16 font-medium">
                          <span className="flex items-center gap-4">
                            <Calendar className="w-14 h-14 text-brand-from" />
                            <time dateTime={featuredPost.post.publishedAt || featuredPost.post.createdAt}>
                              {getLocalDateString(featuredPost.post.publishedAt || featuredPost.post.createdAt)}
                            </time>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-4">
                            <Clock className="w-14 h-14 text-brand-to" />
                            <span>
                              {activeLocale === 'en' 
                                ? `${featuredPost.post.readTime} min read` 
                                : activeLocale === 'de' 
                                  ? `${featuredPost.post.readTime} Min.` 
                                  : activeLocale === 'es' 
                                    ? `${featuredPost.post.readTime} min` 
                                    : `${featuredPost.post.readTime} min`}
                            </span>
                          </span>
                        </div>

                        <h2 className="font-syne font-bold text-24 md:text-32 lg:text-36 text-text-primary mb-16 leading-tight tracking-tight group-hover:text-brand-from transition-colors duration-300">
                          {featuredPost.post.title}
                        </h2>

                        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-24 line-clamp-3">
                          {featuredPost.post.excerpt}
                        </p>
                      </div>

                      <div>
                        <span className="inline-flex items-center gap-6 text-sm font-bold text-brand-from group-hover:text-brand-to transition-colors duration-300">
                          {activeLocale === 'en' ? 'Read Article' : activeLocale === 'de' ? 'Artikel lesen' : activeLocale === 'es' ? 'Leer artículo' : 'Lire l\'article'}
                          <ArrowRight className="w-16 h-16 transition-transform duration-300 group-hover:translate-x-4" />
                        </span>
                      </div>
                    </div>

                  </div>
                </Link>
              </div>
            )}

            {posts.length === 0 ? (
              <p className="text-center text-text-secondary py-48">
                {search 
                  ? activeLocale === 'en' 
                    ? `No articles found for "${search}"` 
                    : activeLocale === 'de' 
                      ? `Keine Artikel gefunden für "${search}"` 
                      : activeLocale === 'es' 
                        ? `No se encontraron artículos para "${search}"` 
                        : `Aucun article trouvé pour "${search}"`
                  : activeLocale === 'en' 
                    ? 'No articles published yet.' 
                    : activeLocale === 'de' 
                      ? 'Noch keine Artikel veröffentlicht.' 
                      : activeLocale === 'es' 
                        ? 'Aún no se han publicado artículos.' 
                        : 'Aucun article publié pour le moment.'}
              </p>
            ) : (
              <>
                {/* 3-Column Recent Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-32">
                  {listPosts.map((item) => (
                    <BlogPostCard key={item.post.id} item={item} locale={activeLocale} />
                  ))}
                </div>

                {/* Localized Pagination */}
                <BlogPagination 
                  currentPage={page} 
                  totalPages={totalPages} 
                  basePath={getLocalizedPath('/blog', activeLocale)} 
                  prevLabel={activeLocale === 'en' ? 'Previous' : activeLocale === 'de' ? 'Zurück' : activeLocale === 'es' ? 'Anterior' : 'Précédent'}
                  nextLabel={activeLocale === 'en' ? 'Next' : activeLocale === 'de' ? 'Weiter' : activeLocale === 'es' ? 'Siguiente' : 'Suivant'}
                />
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
