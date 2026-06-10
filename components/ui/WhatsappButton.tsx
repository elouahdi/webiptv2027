'use client';

import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { useTranslation } from '@/hooks/useTranslation';

export function WhatsappButton() {
  const { locale } = useTranslation();
  
  return (
    <a
      href={SITE_CONFIG.contact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-3 bg-[#25D366] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      aria-label={locale === 'en' ? 'Contact us on WhatsApp' : locale === 'de' ? 'Kontaktieren Sie uns auf WhatsApp' : locale === 'es' ? 'Contáctenos en WhatsApp' : 'Nous contacter sur WhatsApp'}
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
