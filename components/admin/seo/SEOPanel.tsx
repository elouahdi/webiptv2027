'use client';

import { useMemo } from 'react';
import type { SEOSettings } from '@/lib/cms/types';
import { calculateSEOScore } from '@/lib/cms/services/seo-score';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '@/lib/utils/cn';

interface SEOPanelProps {
  seo: SEOSettings;
  onChange: (seo: SEOSettings) => void;
  postTitle: string;
  postContent: string;
  siteUrl?: string;
}

function CharCounter({ current, min, max }: { current: number; min: number; max: number }) {
  const status =
    current < min ? 'warning' : current > max ? 'danger' : 'success';
  return (
    <span
      className={cn(
        'text-xs',
        status === 'success' && 'text-green-400',
        status === 'warning' && 'text-yellow-400',
        status === 'danger' && 'text-red-400'
      )}
    >
      {current}/{max}
    </span>
  );
}

export function SEOPanel({ seo, onChange, postTitle, postContent, siteUrl = '' }: SEOPanelProps) {
  const score = useMemo(
    () => calculateSEOScore(seo, postTitle, postContent),
    [seo, postTitle, postContent]
  );

  const update = (field: keyof SEOSettings, value: unknown) => {
    onChange({ ...seo, [field]: value });
  };

  const previewUrl = seo.canonicalUrl || `${siteUrl}/blog/${postTitle.toLowerCase().replace(/\s+/g, '-')}`;
  const previewTitle = seo.title || postTitle || 'Titre de la page';
  const previewDescription = seo.description || 'Description de la page...';

  return (
    <div className="space-y-6">
      {/* SEO Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Score SEO</CardTitle>
            <Badge
              variant={score.percentage >= 80 ? 'success' : score.percentage >= 50 ? 'warning' : 'danger'}
            >
              {score.percentage}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-2 bg-admin-muted rounded-full overflow-hidden mb-4">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                score.percentage >= 80 ? 'bg-green-500' : score.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              )}
              style={{ width: `${score.percentage}%` }}
            />
          </div>
          <div className="space-y-2">
            {score.checks.map((check) => (
              <div key={check.id} className="flex items-center gap-2 text-sm">
                <span className={check.passed ? 'text-green-400' : 'text-red-400'}>
                  {check.passed ? '✓' : '✗'}
                </span>
                <span className="text-admin-text-secondary">{check.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Google Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu Google</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-white text-left">
            <p className="text-sm text-[#202124] truncate">{previewUrl}</p>
            <p className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate mt-1">
              {previewTitle}
            </p>
            <p className="text-sm text-[#4d5156] line-clamp-2 mt-1">{previewDescription}</p>
          </div>
        </CardContent>
      </Card>

      {/* SEO Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-admin-text">Titre SEO</label>
              <CharCounter current={seo.title.length} min={30} max={60} />
            </div>
            <Input
              value={seo.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder={postTitle}
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-admin-text">Meta Description</label>
              <CharCounter current={seo.description.length} min={120} max={160} />
            </div>
            <Textarea
              value={seo.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
            />
          </div>

          <Input
            label="Mots-clés (séparés par des virgules)"
            value={seo.keywords.join(', ')}
            onChange={(e) =>
              update(
                'keywords',
                e.target.value.split(',').map((k) => k.trim()).filter(Boolean)
              )
            }
          />

          <Input
            label="URL Canonique"
            value={seo.canonicalUrl}
            onChange={(e) => update('canonicalUrl', e.target.value)}
            placeholder="https://..."
          />
        </CardContent>
      </Card>

      {/* Open Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Open Graph</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Titre OG"
            value={seo.ogTitle}
            onChange={(e) => update('ogTitle', e.target.value)}
            placeholder={seo.title || postTitle}
          />
          <Textarea
            label="Description OG"
            value={seo.ogDescription}
            onChange={(e) => update('ogDescription', e.target.value)}
            rows={2}
          />
        </CardContent>
      </Card>

      {/* Twitter & Robots */}
      <Card>
        <CardHeader>
          <CardTitle>Twitter & Robots</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Twitter Card"
            value={seo.twitterCard}
            onChange={(e) => update('twitterCard', e.target.value)}
            options={[
              { value: 'summary', label: 'Summary' },
              { value: 'summary_large_image', label: 'Summary Large Image' },
              { value: 'app', label: 'App' },
              { value: 'player', label: 'Player' },
            ]}
          />

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-admin-text cursor-pointer">
              <input
                type="checkbox"
                checked={seo.robotsIndex}
                onChange={(e) => update('robotsIndex', e.target.checked)}
                className="rounded border-admin-border"
              />
              Index (robots)
            </label>
            <label className="flex items-center gap-2 text-sm text-admin-text cursor-pointer">
              <input
                type="checkbox"
                checked={seo.robotsFollow}
                onChange={(e) => update('robotsFollow', e.target.checked)}
                className="rounded border-admin-border"
              />
              Follow (robots)
            </label>
          </div>

          <Textarea
            label="Schema.org JSON-LD"
            value={seo.schemaJsonLd}
            onChange={(e) => update('schemaJsonLd', e.target.value)}
            rows={6}
            placeholder='{"@context": "https://schema.org", ...}'
          />
        </CardContent>
      </Card>
    </div>
  );
}
