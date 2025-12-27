import { getFeaturedProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/products/product-card';
import { HeroSection } from '@/components/home/hero-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import Link from 'next/link';

export default async function Home() {
  // Данные прилетают еще до того, как пользователь моргнул
  const products = await getFeaturedProducts('en');

  return (
    <div className="flex flex-col w-full bg-white">
      {/* 🚀 Hero Section (Server Side) */}
      <HeroSection />

      {/* 🧼 Featured Collection */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16 border-b border-alpine-forest/10 pb-6">
            <div>
              <h2 className="font-playfair text-5xl font-bold text-alpine-forest italic">The Alpine Collection</h2>
              <p className="text-gray-600 mt-2 font-light uppercase tracking-widest text-xs">Pure Organic Essence</p>
            </div>
            <Link href="/shop" className="text-alpine-gold hover:text-alpine-forest transition-colors font-semibold uppercase tracking-tighter">
              View Collection [→]
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                image={product.images[0]?.image_url || 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg'}
                description={product.translation?.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 📩 Newsletter (Client Side Interaction) */}
      <NewsletterSection />
    </div>
  );
}
