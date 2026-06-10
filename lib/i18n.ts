import fr from '@/messages/fr.json';
import en from '@/messages/en.json';
import de from '@/messages/de.json';
import es from '@/messages/es.json';

export const locales = ['fr', 'en', 'de', 'es'] as const;
export type Locale = typeof locales[number];

export const messages: Record<Locale, typeof fr> = {
  fr,
  en,
  de,
  es
};

export function getTranslations(locale: string) {
  const activeLocale = (locales.includes(locale as Locale) ? locale : 'fr') as Locale;
  const dictionary = messages[activeLocale];

  const t = (key: string, replacements?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = dictionary;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    if (typeof value !== 'string') {
      return key;
    }
    if (replacements) {
      let str = value;
      Object.entries(replacements).forEach(([k, v]) => {
        str = str.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
      return str;
    }
    return value;
  };

  return { t, locale: activeLocale };
}

export function getLocalizedPath(href: string, locale: string) {
  // If it's a external link (e.g. WhatsApp, etc.), return as is
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('tel:') || href.startsWith('mailto:')) {
    return href;
  }
  // If default locale is 'fr', don't prefix it.
  if (locale === 'fr') {
    return href;
  }
  // Otherwise, prefix with the locale.
  if (href === '/') {
    return `/${locale}`;
  }
  return `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
}
