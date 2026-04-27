import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ChatButton } from '@/components/ui/ChatButton';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'JTOtheLabel | Premium Luxury Fashion',
  description: 'Curating luxury essentials for the modern silhouette.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black min-h-screen flex flex-col antialiased selection:bg-black selection:text-white">
        <Navbar />
        <main className="flex-grow w-full min-h-screen">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <ChatButton />
        <Toaster position="bottom-right" toastOptions={{ className: 'font-sans text-xs uppercase tracking-widest rounded-none shadow-2xl border border-gray-100' }} />
      </body>
    </html>
  );
}
