'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-16">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`rounded-2xl border transition-all duration-300 ${
              isOpen
                ? 'bg-bg-elevated border-[var(--brand-from)]/40 shadow-sm'
                : 'card-glass hover:border-border-active'
            } overflow-hidden`}
          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full px-24 py-16 flex items-center justify-between text-left transition-colors"
              aria-expanded={isOpen}
              aria-controls={`faq-3mois-content-${index}`}
            >
              <div className="flex items-center gap-12">
                <HelpCircle className="w-[20px] h-[20px] text-[var(--brand-from)] flex-shrink-0" />
                <span className="font-bold text-sm md:text-base text-text-primary">
                  {faq.question}
                </span>
              </div>
              <ChevronDown
                className={`w-[20px] h-[20px] text-text-muted transition-transform duration-300 flex-shrink-0 ${
                  isOpen ? 'rotate-180 text-[var(--brand-from)]' : ''
                }`}
              />
            </button>

            <div
              id={`faq-3mois-content-${index}`}
              className={`grid transition-all duration-300 ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-24 pb-20">
                  <div className="pt-16 border-t border-border/40 text-text-secondary text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
