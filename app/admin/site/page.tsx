'use client';

import Link from 'next/link';
import {
  DollarSign, Layout, Tv, Search, Phone, Bell,
  Settings2, Globe, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';

const sections = [
  {
    href: '/admin/site/pricing',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    bg: 'group-hover:bg-green-500/5',
    border: 'group-hover:border-green-500/30',
    label: 'Gestion des Prix',
    desc: 'Modifier les forfaits, prix, promotions et visibilité',
    tags: ['Packages', 'Tarifs', 'Promos'],
  },
  {
    href: '/admin/site/content',
    icon: Layout,
    color: 'from-blue-500 to-cyan-500',
    bg: 'group-hover:bg-blue-500/5',
    border: 'group-hover:border-blue-500/30',
    label: 'Contenu du Site',
    desc: 'Hero, About, Features, Footer — tous les textes',
    tags: ['Hero', 'About', 'Features'],
  },
  {
    href: '/admin/site/iptv',
    icon: Tv,
    color: 'from-purple-500 to-pink-500',
    bg: 'group-hover:bg-purple-500/5',
    border: 'group-hover:border-purple-500/30',
    label: 'Packages IPTV',
    desc: 'Gérer les abonnements IPTV, chaînes et fonctionnalités',
    tags: ['IPTV', 'Chaînes', 'Abonnements'],
  },
  {
    href: '/admin/site/seo',
    icon: Search,
    color: 'from-amber-500 to-orange-500',
    bg: 'group-hover:bg-amber-500/5',
    border: 'group-hover:border-amber-500/30',
    label: 'SEO & Meta',
    desc: 'Titres, descriptions, mots-clés et OG images par page',
    tags: ['Title', 'Description', 'Keywords'],
  },
  {
    href: '/admin/site/contact',
    icon: Phone,
    color: 'from-teal-500 to-green-500',
    bg: 'group-hover:bg-teal-500/5',
    border: 'group-hover:border-teal-500/30',
    label: 'Contact & Infos',
    desc: 'Téléphone, email, WhatsApp, adresse et horaires',
    tags: ['WhatsApp', 'Email', 'Adresse'],
  },
  {
    href: '/admin/site/announcement',
    icon: Bell,
    color: 'from-red-500 to-rose-500',
    bg: 'group-hover:bg-red-500/5',
    border: 'group-hover:border-red-500/30',
    label: 'Annonces & Bandeaux',
    desc: 'Bannière promotionnelle, couleurs, expiration',
    tags: ['Bannière', 'Promo', 'Couleurs'],
  },
];

export default function SiteManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-from to-brand-to flex items-center justify-center shadow-lg shrink-0">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-syne font-bold text-3xl text-admin-text tracking-tight">
              Gestion du Site
            </h1>
            <p className="text-admin-text-secondary mt-1">
              Contrôlez l&apos;intégralité du contenu sans toucher au code.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={`group flex flex-col gap-4 p-5 rounded-2xl border border-admin-border bg-admin-card transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${section.border} ${section.bg}`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-md`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-admin-muted flex items-center justify-center group-hover:bg-admin-border transition-colors">
                <ArrowRight className="w-4 h-4 text-admin-text-muted group-hover:text-admin-text group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-admin-text group-hover:text-amber-400 transition-colors">
                {section.label}
              </p>
              <p className="text-sm text-admin-text-secondary mt-1 leading-relaxed">
                {section.desc}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {section.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-full bg-admin-muted border border-admin-border text-admin-text-muted font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-amber-400" />
            Comment ça fonctionne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            {[
              { step: '1', title: 'Modifiez le contenu', desc: 'Utilisez les formulaires pour éditer textes, prix, et paramètres.', color: 'bg-amber-500/15 text-amber-400' },
              { step: '2', title: 'Cliquez Enregistrer', desc: 'Les changements sont sauvegardés en base de données instantanément.', color: 'bg-green-500/15 text-green-400' },
              { step: '3', title: 'Visible sur le site', desc: 'Le frontend se met à jour automatiquement pour vos visiteurs.', color: 'bg-blue-500/15 text-blue-400' },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 p-4 rounded-xl bg-admin-muted/50 border border-admin-border/50">
                <span className={`w-8 h-8 rounded-full ${item.color} text-xs font-bold flex items-center justify-center shrink-0`}>
                  {item.step}
                </span>
                <div>
                  <p className="font-semibold text-admin-text">{item.title}</p>
                  <p className="text-admin-text-muted mt-0.5 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
