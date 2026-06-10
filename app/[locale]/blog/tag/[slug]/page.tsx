import { notFound } from 'next/navigation';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { getPublicTagPosts } from '@/lib/cms/blog-public';
import { getAllTags } from '@/lib/cms/repositories/tags';
import { ensureCMSInitialized } from '@/lib/cms/init';
import { buildMetadata } from '@/lib/seo/metadata';

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  await ensureCMSInitialized();
  const tags = await getAllTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: TagPageProps) {
  const { slug } = await params;
  const data = await getPublicTagPosts(slug);
  if (!data) return {};

  return buildMetadata({
    path: `/blog/tag/${slug}`,
    title: `#${data.tag.name} - Blog IPTV`,
    description: `Articles tagués ${data.tag.name}`,
  });
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  const data = await getPublicTagPosts(slug, page);
  if (!data) notFound();

  const { tag, posts, totalPages } = data;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-bg-base pt-32">
        <div className="border-b border-border/40 bg-bg-card">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] py-16">
            <Breadcrumb
              items={[
                { label: 'Blog', href: '/blog' },
                { label: `#${tag.name}`, href: `/blog/tag/${tag.slug}` },
              ]}
            />
          </div>
        </div>

        <div className="py-64 bg-bg-card border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] text-center">
            <h1 className="font-syne font-bold text-32 md:text-56 text-text-primary mb-16 tracking-tight">#{tag.name}</h1>
          </div>
        </div>

        <div className="py-80 bg-bg-base">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            {posts.length === 0 ? (
              <p className="text-center text-text-secondary py-48">Aucun article avec ce tag.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                  {posts.map((item) => (
                    <BlogPostCard key={item.post.id} item={item} />
                  ))}
                </div>
                <BlogPagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath={`/blog/tag/${tag.slug}`}
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
