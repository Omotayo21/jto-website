'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
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
              {[
                'Privacy Policy',
                'Terms of Service',
                'Shipping Policy',
                'Return Policy',
                'Initiate Refund',
              ].map(item => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Brand Info */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-8">Brand Info</h4>
            <ul className="space-y-4">
              {[
                'About us',
                'Sustainability',
                'Contact Us',
                "FAQ's",
                'Size Chart',
                'Stockists',
                'Careers',
              ].map(item => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
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
            {[
              { label: 'Instagram', href: 'https://instagram.com/jtothelabel' },
              { label: 'X / Twitter', href: 'https://twitter.com/jtothelabel' },
              { label: 'Contact', href: 'mailto:contact@jtothelabel.com' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
