import { notFound } from 'next/navigation';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsappButton } from '@/components/ui/WhatsappButton';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { getPublicCategoryPosts, getPublicCategories } from '@/lib/cms/blog-public';
import { buildMetadata } from '@/lib/seo/metadata';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const categories = await getPublicCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await getPublicCategoryPosts(slug);
  if (!data) return {};

  return buildMetadata({
    path: `/blog/category/${slug}`,
    title: `${data.category.name} - Blog IPTV`,
    description: data.category.description || `Articles sur ${data.category.name}`,
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  const data = await getPublicCategoryPosts(slug, page);
  if (!data) notFound();

  const { category, posts, totalPages } = data;

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
                { label: category.name, href: `/blog/category/${category.slug}` },
              ]}
            />
          </div>
        </div>

        <div className="py-64 bg-bg-card border-b border-border/40">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px] text-center">
            <h1 className="font-syne font-bold text-32 md:text-56 text-text-primary mb-16 tracking-tight">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">{category.description}</p>
            )}
          </div>
        </div>

        <div className="py-80 bg-bg-base">
          <div className="max-w-7xl mx-auto px-[24px] md:px-[40px]">
            {posts.length === 0 ? (
              <p className="text-center text-text-secondary py-48">Aucun article dans cette catégorie.</p>
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
                  basePath={`/blog/category/${category.slug}`}
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
