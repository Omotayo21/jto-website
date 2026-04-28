'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, ExternalLink } from 'lucide-react';
import { PolicyModal } from '@/components/ui/PolicyModal';

const POLICIES = {
  'SHIPPING POLICY': (
    <div className="space-y-6">
      <p className="font-bold text-black italic">At JTOtheLabel, every piece is carefully crafted and handled with the utmost attention to detail. Our shipping process reflects the same level of care, ensuring your order arrives safely and in perfect condition.</p>
    </div>
  ),
  'GENERAL INFORMATION': (
    <ul className="list-disc pl-5 space-y-3">
      <li>All orders are processed after payment confirmation.</li>
      <li>Orders are handled on business days (Monday – Friday, excluding public holidays).</li>
      <li>As many of our pieces are made-to-order or crafted in limited quantities, processing times may vary slightly.</li>
      <li>Once your order is shipped, you will receive a confirmation with tracking details (where applicable).</li>
    </ul>
  ),
  'PROCESSING & SHIPPING TIMELINE': (
    <div className="space-y-4">
      <div>
        <p className="font-black text-black uppercase text-xs mb-2 tracking-widest">Processing Time:</p>
        <ul className="list-disc pl-5">
          <li>Ready-to-wear pieces: 2–5 business days</li>
          <li>Made-to-order/custom pieces: 7–14 business days</li>
        </ul>
      </div>
      <div>
        <p className="font-black text-black uppercase text-xs mb-2 tracking-widest">Shipping Time (after dispatch):</p>
        <ul className="list-disc pl-5">
          <li>Lagos: 1–2 business days</li>
          <li>Outside Lagos (Nigeria): 2–5 business days</li>
          <li>International (UK, Europe, USA, Canada): 5–10 business days</li>
          <li>Rest of World: 7–14 business days</li>
        </ul>
      </div>
    </div>
  ),
  'SHIPPING COST ESTIMATES': (
    <div className="space-y-4">
      <p>Shipping fees are calculated at checkout based on location, package weight, and delivery method.</p>
      <div>
        <p className="font-black text-black uppercase text-xs mb-2 tracking-widest">Within Nigeria:</p>
        <ul className="list-disc pl-5">
          <li>Lagos: ₦3,000 – ₦10,000</li>
          <li>Outside Lagos: ₦10,000 – ₦25,000</li>
        </ul>
      </div>
      <div>
        <p className="font-black text-black uppercase text-xs mb-2 tracking-widest">International Shipping:</p>
        <ul className="list-disc pl-5">
          <li>United Kingdom: from £45</li>
          <li>Europe: from €60</li>
          <li>United States: from $65</li>
          <li>Canada: $70</li>
          <li>Rest of World: from $100</li>
        </ul>
      </div>
    </div>
  ),
  'SECURE DELIVERY': (
    <ul className="list-disc pl-5 space-y-3">
      <li>All orders are securely packaged to preserve the integrity of each garment.</li>
      <li>We partner with trusted courier services to ensure reliable and timely delivery.</li>
      <li>Signature may be required upon delivery for high-value orders.</li>
      <li>Please ensure accurate shipping details are provided at checkout, as we cannot guarantee delivery to incorrect addresses.</li>
    </ul>
  ),
  'POST-DELIVERY LIABILITY': (
    <ul className="list-disc pl-5 space-y-3">
      <li>Once an order has been successfully delivered and signed for (if applicable), JTOtheLabel is no longer liable for loss, theft, or damage.</li>
      <li>Any issues with your order must be reported within 48 hours of delivery.</li>
      <li>Claims made after this window may not be eligible for review.</li>
    </ul>
  ),
  'CUSTOMS, DUTIES & TAXES': (
    <ul className="list-disc pl-5 space-y-3">
      <li>International orders may be subject to customs duties, import taxes, and handling fees determined by the destination country.</li>
      <li>These charges are not included in the item price or shipping fee and must be paid by the customer upon arrival.</li>
      <li>JTOtheLabel is not responsible for delays caused by customs clearance processes.</li>
      <li>We recommend checking your country’s import policies before placing an order.</li>
    </ul>
  ),
  'IMPORTANT NOTES': (
    <ul className="list-disc pl-5 space-y-3">
      <li>Delivery timelines are estimates and not guarantees.</li>
      <li>Delays may occur during peak seasons, holidays, or due to unforeseen courier issues.</li>
      <li>Refused or unclaimed international packages may incur return shipping fees, which will be deducted from any eligible refund.</li>
    </ul>
  ),
};

export function Footer() {
  const pathname = usePathname();
  const [modal, setModal] = useState({ open: false, title: '', content: null });

  const isHiddenPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname?.startsWith('/management-portal');

  if (isHiddenPage) return null;

  return (
    <footer className="bg-black text-white">
      {/* Main grid */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">

          {/* Column 1 — Runway */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8">Runway</h4>
            <ul className="space-y-4">
              {['LBFW', 'LFDW SS18', 'S/S 23', 'S/S 24'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — Policies */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8">Policies</h4>
            <ul className="space-y-4">
              {Object.keys(POLICIES).map(title => (
                <li key={title}>
                  <button 
                    onClick={() => setModal({ open: true, title, content: POLICIES[title] })}
                    className="text-sm text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {title.toLowerCase()}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Brand Info */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8">Brand Info</h4>
            <ul className="space-y-4">
              {[
                { label: 'About us', href: '/#about' },
                { label: 'Sustainability', href: '#' },
                { label: 'Contact Us', href: '/contact' },
                { label: "FAQ's", href: '/#faq' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Follow on Shop + Copyright */}
          <div className="flex flex-col items-start gap-6 flex-1">
            <button 
              onClick={() => {
                window.open(
                  "https://shop.app/accounts/login?analytics_trace_id=3c45f2de-6183-44b4-9f7c-b1654b2a1832&auth_state=RQ1qrJxg9QZFs5eBIrlPDA&authentication_level=email&avoid_sdk_session=false&compact_layout=true&flow=follow&flow_version=unspecified&locale=en&next=OAuthContinue&preact=true&sign_up_enabled=true&storefront_domain=https%3A%2F%2Fimad-eduso.com&ux_mode=windoid",
                  "ShopFollow",
                  "width=450,height=700,left=200,top=100,menubar=no,toolbar=no,location=no,status=no"
                );
              }}
              className="h-12 px-6 bg-[#5A31F4] text-white rounded-full flex items-center gap-3 hover:scale-105 transition-all active:scale-95 font-bold text-xs"
            >
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              Follow on shop
            </button>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} JTOtheLabel · Wearable Art, That Commands Attention
            </p>
          </div>

          {/* Center: Payment Icons */}
          <div className="flex flex-wrap gap-4 items-center justify-center bg-white/5 px-8 py-4 rounded-full">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-6 opacity-50 hover:opacity-100 transition-opacity invert" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/16/Discovery_logo.svg" alt="Discover" className="h-4 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Klarna_Logo.svg" alt="Klarna" className="h-4 opacity-50 hover:opacity-100 transition-opacity" />
          </div>

          {/* Right Side: Social links */}
          <div className="flex gap-8 flex-1 justify-end">
            <a href="https://instagram.com/jtothelabel" target="_blank" rel="noopener" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
            <a href="https://twitter.com/jtothelabel" target="_blank" rel="noopener" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="mailto:support@jtothelabel.com" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
            </a>
          </div>
        </div>
      </div>

      <PolicyModal 
        isOpen={modal.open} 
        onClose={() => setModal({ ...modal, open: false })} 
        title={modal.title} 
        content={modal.content} 
      />
    </footer>
  );
}
