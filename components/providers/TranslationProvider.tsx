'use client';

import React, { createContext } from 'react';

export interface TranslationContextType {
  locale: string;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({
  children,
  locale,
  dictionary,
}: {
  children: React.ReactNode;
  locale: string;
  dictionary: any;
}) {
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

  return (
    <TranslationContext.Provider value={{ locale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}
