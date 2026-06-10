import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

import { ensureCMSInitialized } from '@/lib/cms/init';
import { getPublishedPosts } from '@/lib/cms/repositories/posts';
import { getAllCategories } from '@/lib/cms/repositories/categories';
import { getAllTags } from '@/lib/cms/repositories/tags';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await ensureCMSInitialized();
  const baseUrl = SITE_CONFIG.url;

  const locales = ['fr', 'en', 'de', 'es'];

  // Helper to build localized sitemap entries with hreflang alternates
  const buildSitemapEntries = (
    path: string,
    priority: number = 0.8,
    changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly',
    lastModified: Date = new Date()
  ) => {
    const getUrl = (loc: string) => {
      if (loc === 'fr') {
        return path === '/' ? baseUrl : `${baseUrl}${path}`;
      }
      return path === '/' ? `${baseUrl}/${loc}` : `${baseUrl}/${loc}${path}`;
    };

    const alternates = {
      languages: {
        'x-default': getUrl('fr'),
        'fr': getUrl('fr'),
        'en': getUrl('en'),
        'de': getUrl('de'),
        'es': getUrl('es'),
      },
    };

    return locales.map((loc) => ({
      url: getUrl(loc),
      lastModified,
      changeFrequency,
      priority,
      alternates,
    }));
  };

  // Static Pages
  const staticPaths = [
    '/',
    '/nos-plans',
    '/blog',
    '/faq',
    '/contact',
    '/essai-gratuit',
    '/chaines',
    '/pack-iptv-1-mois',
    '/pack-iptv-3-mois',
    '/pack-iptv-6-mois',
    '/pack-iptv-12-mois',
    '/pack-iptv-24-mois',
  ];

  const staticEntries = staticPaths.flatMap((path) => {
    const priority = path === '/' ? 1.0 : path.startsWith('/pack-') || path === '/nos-plans' ? 0.9 : 0.8;
    const frequency = path === '/' || path === '/nos-plans' ? ('daily' as const) : ('weekly' as const);
    return buildSitemapEntries(path, priority, frequency);
  });

  // Dynamic CMS Pages (Posts, Categories, Tags)
  const { posts } = await getPublishedPosts({ limit: 1000 });
  const categories = await getAllCategories();
  const tags = await getAllTags();

  const blogEntries = posts.flatMap((post) =>
    buildSitemapEntries(
      `/blog/${post.slug}`,
      0.6,
      'monthly',
      new Date(post.updatedAt)
    )
  );

  const categoryEntries = categories.flatMap((cat) =>
    buildSitemapEntries(
      `/blog/category/${cat.slug}`,
      0.5,
      'weekly',
      new Date(cat.updatedAt)
    )
  );

  const tagEntries = tags.flatMap((tag) =>
    buildSitemapEntries(
      `/blog/tag/${tag.slug}`,
      0.4,
      'weekly'
    )
  );

  return [...staticEntries, ...blogEntries, ...categoryEntries, ...tagEntries];
}
