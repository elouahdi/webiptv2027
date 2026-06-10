'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { staggerContainer, fadeInUp } from '@/lib/utils/animations';

export interface BlogPreviewPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: number;
  category?: string;
}

interface BlogPreviewSectionProps {
  posts: BlogPreviewPost[];
}

export function BlogPreviewSection({ posts }: BlogPreviewSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-80 bg-bg-base relative">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-7xl mx-auto px-[24px] md:px-[40px]"
      >
        <motion.div variants={fadeInUp} className="text-center mb-64">
          <h2 className="font-syne font-bold text-32 md:text-48 text-text-primary mb-16 tracking-tight">
            Derniers articles
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Guides, astuces et tutoriels complets pour profiter au maximum de votre abonnement IPTV.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-48">
          {posts.map((post, index) => (
            <motion.div key={post.slug} variants={fadeInUp} custom={index}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <article className="h-full rounded-2xl card-glass card-hover overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="aspect-video bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)] flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                      {/* Top highlight overlay */}
                      <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                      <span className="text-white font-syne font-bold text-lg px-16 text-center relative z-10 drop-shadow-md">
                        {post.category || 'Blog'}
                      </span>
                    </div>
                    <div className="p-24">
                      <div className="flex items-center gap-8 text-xs text-text-muted mb-12 font-medium">
                        <Calendar className="w-14 h-14 text-[var(--brand-from)]" />
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </time>
                        <span>•</span>
                        <span>{post.readTime} min de lecture</span>
                      </div>
                      <h3 className="font-syne font-bold text-lg text-text-primary mb-8 group-hover:text-[var(--brand-from)] transition-colors duration-300 line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    </div>
                  </div>
                  <div className="px-24 pb-24 pt-0">
                    <span className="inline-flex items-center gap-4 text-xs font-bold text-[var(--brand-from)] group-hover:text-[var(--brand-to)] transition-colors duration-300">
                      Lire la suite <ArrowRight className="w-12 h-12" />
                    </span>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUp} className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-8 px-32 py-16 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white font-bold rounded-xl hover:shadow-[0_0_25px_rgba(0,243,255,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm"
          >
            Voir tous les articles
            <ArrowRight className="w-16 h-16" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
