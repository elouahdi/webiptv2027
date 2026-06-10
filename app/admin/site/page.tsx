'use client';

import Link from 'next/link';
import {
  DollarSign, Layout, Tv, Search, Phone, Bell, ChevronRight,
  Settings2, Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';

const sections = [
  {
    href: '/admin/site/pricing',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    label: 'Gestion des Prix',
    desc: 'Modifier les forfaits, prix, promotions et visibilité',
    tags: ['Packages', 'Tarifs', 'Promos'],
  },
  {
    href: '/admin/site/content',
    icon: Layout,
    color: 'from-blue-500 to-cyan-500',
    label: 'Contenu du Site',
    desc: 'Hero, About, Features, Footer — tous les textes',
    tags: ['Hero', 'About', 'Features'],
  },
  {
    href: '/admin/site/iptv',
    icon: Tv,
    color: 'from-purple-500 to-pink-500',
    label: 'Packages IPTV',
    desc: 'Gérer les abonnements IPTV, chaînes et fonctionnalités',
    tags: ['IPTV', 'Chaînes', 'Abonnements'],
  },
  {
    href: '/admin/site/seo',
    icon: Search,
    color: 'from-amber-500 to-orange-500',
    label: 'SEO & Meta',
    desc: 'Titres, descriptions, mots-clés et OG images par page',
    tags: ['Title', 'Description', 'Keywords'],
  },
  {
    href: '/admin/site/contact',
    icon: Phone,
    color: 'from-teal-500 to-green-500',
    label: 'Contact & Infos',
    desc: 'Téléphone, email, WhatsApp, adresse et horaires',
    tags: ['WhatsApp', 'Email', 'Adresse'],
  },
  {
    href: '/admin/site/announcement',
    icon: Bell,
    color: 'from-red-500 to-rose-500',
    label: 'Annonces & Bandeaux',
    desc: 'Bannière promotionnelle, couleurs, expiration',
    tags: ['Bannière', 'Promo', 'Couleurs'],
  },
];

export default function SiteManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-from to-brand-to flex items-center justify-center shadow-lg shrink-0">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-syne font-bold text-3xl text-admin-text tracking-tight">
            Gestion du Site
          </h1>
          <p className="text-admin-text-secondary mt-1">
            Contrôlez l&apos;intégralité du contenu visible sur votre site sans toucher au code.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex flex-col gap-4 p-5 rounded-2xl border border-admin-border bg-admin-card hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-md`}>
                <section.icon className="w-5 h-5 text-white" />
              </div>
              <ChevronRight className="w-5 h-5 text-admin-text-muted group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
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
                  key={`${section.href}-tag-${idx}`}
                  className="text-xs px-2 py-0.5 rounded-full bg-admin-muted border border-admin-border text-admin-text-muted"
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
              { step: '1', title: 'Modifiez le contenu', desc: 'Utilisez les formulaires pour éditer textes, prix, et paramètres.' },
              { step: '2', title: 'Cliquez Enregistrer', desc: 'Les changements sont sauvegardés en base de données instantanément.' },
              { step: '3', title: 'Visible sur le site', desc: 'Le frontend se met à jour automatiquement pour vos visiteurs.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </span>
                <div>
                  <p className="font-medium text-admin-text">{item.title}</p>
                  <p className="text-admin-text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
