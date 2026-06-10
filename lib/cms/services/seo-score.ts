import type { SEOSettings } from '../types';

export interface SEOScoreResult {
  score: number;
  maxScore: number;
  percentage: number;
  checks: SEOCheck[];
}

export interface SEOCheck {
  id: string;
  label: string;
  passed: boolean;
  weight: number;
  message: string;
}

export function calculateSEOScore(
  seo: SEOSettings,
  postTitle: string,
  postContent: string
): SEOScoreResult {
  const checks: SEOCheck[] = [
    {
      id: 'title-length',
      label: 'Longueur du titre SEO',
      passed: seo.title.length >= 30 && seo.title.length <= 60,
      weight: 15,
      message: seo.title.length < 30
        ? 'Titre trop court (30-60 caractères recommandés)'
        : seo.title.length > 60
          ? 'Titre trop long (max 60 caractères)'
          : 'Longueur du titre optimale',
    },
    {
      id: 'description-length',
      label: 'Longueur de la meta description',
      passed: seo.description.length >= 120 && seo.description.length <= 160,
      weight: 15,
      message: seo.description.length < 120
        ? 'Description trop courte (120-160 caractères)'
        : seo.description.length > 160
          ? 'Description trop longue (max 160 caractères)'
          : 'Longueur de description optimale',
    },
    {
      id: 'keywords',
      label: 'Mots-clés définis',
      passed: seo.keywords.length >= 1,
      weight: 10,
      message: seo.keywords.length > 0 ? 'Mots-clés définis' : 'Ajoutez des mots-clés',
    },
    {
      id: 'og-title',
      label: 'Titre Open Graph',
      passed: !!seo.ogTitle || !!seo.title,
      weight: 10,
      message: seo.ogTitle || seo.title ? 'Titre OG défini' : 'Définissez un titre Open Graph',
    },
    {
      id: 'og-description',
      label: 'Description Open Graph',
      passed: !!seo.ogDescription || !!seo.description,
      weight: 10,
      message: seo.ogDescription || seo.description ? 'Description OG définie' : 'Définissez une description OG',
    },
    {
      id: 'og-image',
      label: 'Image Open Graph',
      passed: !!seo.ogImageId,
      weight: 15,
      message: seo.ogImageId ? 'Image OG définie' : 'Ajoutez une image Open Graph',
    },
    {
      id: 'canonical',
      label: 'URL canonique',
      passed: !!seo.canonicalUrl,
      weight: 10,
      message: seo.canonicalUrl ? 'URL canonique définie' : 'Définissez une URL canonique',
    },
    {
      id: 'content-length',
      label: 'Longueur du contenu',
      passed: postContent.replace(/<[^>]*>/g, '').length >= 300,
      weight: 10,
      message: postContent.length >= 300 ? 'Contenu suffisant' : 'Contenu trop court (min 300 caractères)',
    },
    {
      id: 'title-in-content',
      label: 'Mot-clé dans le titre',
      passed: postTitle.length > 0 && (seo.title.includes(postTitle.split(' ')[0]) || seo.title.length > 0),
      weight: 5,
      message: 'Titre SEO aligné avec le contenu',
    },
  ];

  const maxScore = checks.reduce((sum, c) => sum + c.weight, 0);
  const score = checks.filter((c) => c.passed).reduce((sum, c) => sum + c.weight, 0);
  const percentage = Math.round((score / maxScore) * 100);

  return { score, maxScore, percentage, checks };
}
