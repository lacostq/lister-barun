import { getFeaturedProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/products/product-card';
import { HeroSection } from '@/components/home/hero-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import Link from 'next/link';

export default async function Home() {
  // Получаем товары или пустой массив, если база еще не готова
  const featuredProducts = await getFeaturedProducts('en').catch(() => []) || [];

  return (
    <div className="flex flex-col w-full bg-white text-alpine-forest">
      {/* 🚀 Hero Section - Первый экран */}
      <HeroSection />

      {/* 🧼 Секция товаров */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16 border-b border-alpine-forest/10 pb-6">
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold italic">The Alpine Collection</h2>
              <p className="text-gray-600 mt-2 font-light uppercase tracking-widest text-xs">Pure Organic Essence</p>
            </div>
            <Link 
              href="/shop" 
              className="text-alpine-gold hover:text-alpine-forest transition-colors font-semibold uppercase tracking-tighter"
            >
              View All [→]
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product: any) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={Number(product.price)}
                  // Безопасно берем первое фото или ставим заглушку
                  image={product.images?.[0]?.image_url || 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg'}
                  description={product.translation?.description}
                />
              ))
            ) : (
              // Это покажется, если товаров в базе еще нет
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 italic font-playfair text-xl">
                  New soap batches are coming soon...
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 📩 Подписка (Client Component) */}
      <NewsletterSection />
    </div>
  );
}
