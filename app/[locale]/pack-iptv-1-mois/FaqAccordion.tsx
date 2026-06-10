'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-12">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl card-glass overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex items-center justify-between gap-16 p-24 text-left cursor-pointer"
            aria-expanded={openIndex === index}
          >
            <span className="font-bold text-text-primary text-sm md:text-base pr-8">
              {item.question}
            </span>
            <ChevronDown
              className={`w-[20px] h-[20px] text-text-muted flex-shrink-0 transition-transform duration-300 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openIndex === index
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="px-24 pb-24 text-text-secondary text-sm leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
