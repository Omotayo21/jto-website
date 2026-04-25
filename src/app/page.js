import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { ProductCard } from '@/components/products/ProductCard';
import { Hero } from '@/components/home/Hero';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { FaqAccordion } from '@/components/home/FaqAccordion';

export const revalidate = 60;

export default async function Home() {
  let products = [];

  try {
    await connectDB();
    const snapshot = await Product.find({ status: 'active' }).limit(8).populate('category');
    products = JSON.parse(JSON.stringify(snapshot));
  } catch (error) {
    console.error('Home Products Fetch Error:', error);
  }

  return (
    <div>
      {/* Hero Carousel */}
      <Hero />

      {/* Featured Collection */}
      <section className="section-padding max-w-[1440px] mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl serif-font italic mb-4">The Curated Selection</h2>
          <div className="w-12 h-[1px] bg-black mb-6" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            Essential Pieces for the Modern Silhouette
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-400 text-center py-12 serif-font italic">New arrivals coming soon…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <a
            href="/products"
            className="text-[10px] font-black uppercase tracking-[0.3em] border-b border-black pb-2 hover:opacity-50 transition-opacity"
          >
            View All Collections
          </a>
        </div>
      </section>

      {/* Luxury Statement — off-white bg */}
      <section className="bg-[#f9f9f7] section-padding text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Our Ethos</span>
          <h3 className="text-4xl serif-font italic leading-snug">
            &ldquo;Wearable Art, That Commands Attention&rdquo;
          </h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Every piece in our collection is a testament to the intersection of craftsmanship and contemporary art. Designed with the precision of a sculptor and the soul of a poet.
          </p>
        </div>
      </section>

      {/* Newsletter Section (dark, split) */}
      <NewsletterSection />

      {/* FAQ Accordion (dark) */}
      <FaqAccordion />
    </div>
  );
}
