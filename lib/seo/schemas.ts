import { SITE_CONFIG } from '@/config/site';
import type { Plan } from '@/lib/data/plans';
import type { FAQ } from '@/lib/data/faq';
import type { Testimonial } from '@/lib/data/testimonials';
import type { BlogPost } from '@/lib/data/blog-posts';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    sameAs: [
      SITE_CONFIG.links.twitter,
      SITE_CONFIG.links.reddit,
      SITE_CONFIG.links.discord,
      SITE_CONFIG.links.facebook,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: SITE_CONFIG.contact.phone,
      availableLanguage: ['French', 'Arabic'],
    },
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildProductSchema(plan: Plan) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Abonnement IPTV ${plan.name}`,
    description: `Abonnement IPTV Premium France - ${plan.features.slice(0, 3).join(', ')}`,
    image: `${SITE_CONFIG.url}/og-default.png`,
    offers: {
      '@type': 'Offer',
      price: plan.price,
      priceCurrency: plan.currency,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
      priceValidUntil: '2026-12-31',
      url: `${SITE_CONFIG.url}/nos-plans`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: plan.rating.toString(),
      reviewCount: plan.reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
  };
}

export function buildFAQSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(crumbs: { label: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${SITE_CONFIG.url}${crumb.url}`,
    })),
  };
}

export function buildArticleSchema(post: BlogPost) {
  const wordCount = post.content.split(/\s+/).length;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `${SITE_CONFIG.url}${post.coverImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
    wordCount,
    inLanguage: 'fr-FR',
  };
}

export function buildHowToSchema(guide: { name: string; description: string; steps: { name: string; text: string; url?: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.name,
    description: guide.description,
    totalTime: 'PT15M',
    step: guide.steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
      url: step.url ? `${SITE_CONFIG.url}${step.url}` : undefined,
    })),
  };
}

export function buildReviewSchema(reviews: Testimonial[]) {
  return reviews.map((review) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating.toString(),
      bestRating: '5',
    },
    author: {
      '@type': 'Person',
      name: review.name,
    },
    reviewBody: review.text,
  }));
}

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.contact.phone,
    description: SITE_CONFIG.description,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
  };
}
