'use client';
import { useState } from 'react';

const FAQS = [
  {
    q: 'How can I cancel order?',
    a: 'Orders can only be cancelled within 12 hours of placement. To cancel, please email orders@jtothelabel.com with your order number immediately.',
  },
  {
    q: 'How long does the return process takes?',
    a: 'Once we receive your return, it takes 5-7 business days for our quality control team to review and process your refund or exchange.',
  },
  {
    q: 'Can I exchange or return?',
    a: 'Yes, we accept returns and exchanges on unworn items with tags intact within 14 days of delivery. Custom-made pieces are final sale.',
  },
  {
    q: 'How long does it take to review my order?',
    a: 'Order verification usually takes 24-48 hours. Once approved, you will receive a confirmation email with your processing timeline.',
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
