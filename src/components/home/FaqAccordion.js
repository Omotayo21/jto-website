'use client';
import { useState } from 'react';

const FAQS = [
  {
    q: 'How long does it take to receive my order?',
    a: 'Our Lagos orders take 2-4 working days, and international orders take 7-10 working days. For express orders, please contact us at orders@jtothelabel.com to confirm.',
  },
  {
    q: 'When are orders processed and what payment methods are accepted?',
    a: 'Orders are processed within 24-48 hours of payment confirmation. We accept all major cards, bank transfers, and PayStack.',
  },
  {
    q: 'Are your pieces true to size?',
    a: 'Our pieces are designed for a tailored fit. We recommend consulting our size guide on each product page before ordering.',
  },
  {
    q: 'Does the fabric have stretch in it?',
    a: 'It depends on the fabric composition. Each product description includes fabric details. Woven fabrics have minimal stretch while jersey blends have more give.',
  },
  {
    q: 'How can I take care of my outfits?',
    a: 'We recommend dry-cleaning or hand-washing in cold water for most pieces. Always check the care label inside your garment.',
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-black text-white section-padding">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl serif-font italic text-center mb-16">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-white/10">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-start py-7 text-left group"
              >
                <span className="text-lg md:text-xl serif-font pr-8 leading-snug">{faq.q}</span>
                <span className="shrink-0 w-7 h-7 rounded-full border border-white/30 flex items-center justify-center mt-0.5 group-hover:border-white transition-colors">
                  {open === i ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  )}
                </span>
              </button>
              {open === i && (
                <p className="text-sm text-gray-400 leading-relaxed pb-7 max-w-2xl">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
