import { getFeaturedProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/products/product-card';
import { HeroSection } from '@/components/home/hero-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import Link from 'next/link';

export default async function Home() {
  // Вызываем функцию с защитой. Если база пуста или выдает ошибку, билд не упадет.
  let products = [];
  try {
    const data = await getFeaturedProducts('en');
    products = data || [];
  } catch (e) {
    console.error("Database connection error on Home:", e);
  }

  return (
    <main className="w-full bg-white text-alpine-forest">
      {/* 🚀 Красивый заголовок-баннер */}
      <HeroSection />

      {/* 🧼 Блок с мылом */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-alpine-forest/10 pb-8 gap-4">
            <div>
              <h2 className="font-playfair text-5xl md:text-6xl font-bold italic text-alpine-forest">The Alpine Batch</h2>
              <p className="text-alpine-gold mt-2 font-bold uppercase tracking-[0.3em] text-[10px]">Pure Organic Essence • Handmade in Fribourg</p>
            </div>
            <Link 
              href="/shop" 
              className="group text-alpine-forest hover:text-alpine-gold transition-all font-bold uppercase tracking-tighter flex items-center gap-2"
            >
              Discover all batches <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {products.length > 0 ? (
              products.map((product: any) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={Number(product.price)}
                  // Берем картинку из вложенного массива или ставим запасную
                  image={product.images?.[0]?.image_url || 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg'}
                  description={product.translation?.description}
                />
              ))
            ) : (
              <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                <p className="font-playfair text-2xl text-gray-400 italic font-light">
                  A fresh batch of soap is currently curing. Check back shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </main>
  );
}
