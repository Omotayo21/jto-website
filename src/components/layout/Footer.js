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
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Tagline */}
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} JTOtheLabel · Wearable Art, That Commands Attention
          </p>

          {/* Social links */}
          <div className="flex gap-8">
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
