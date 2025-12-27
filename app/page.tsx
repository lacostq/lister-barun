import { getFeaturedProducts } from '@/lib/supabase';
import { HeroSection } from '@/components/home/hero-section'; // Мы его сейчас создадим
import { ValueProps } from '@/components/home/value-props';
import { ProductGrid } from '@/components/home/product-grid';
import { NewsletterSection } from '@/components/home/newsletter-section';

export default async function Home() {
  // Данные качаются на сервере еще до того, как сайт открылся
  const featured = await getFeaturedProducts('en'); // Замени 'en' на динамический язык

  return (
    <main className="w-full">
      {/* Весь этот текст и картинки прилетят как чистый HTML */}
      <HeroSection />
      <ValueProps />
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="font-playfair text-4xl font-bold text-alpine-forest">Featured Soap</h2>
          <div className="w-16 h-1 bg-alpine-gold mx-auto mt-4" />
        </div>
        {/* Товары уже в коде страницы, никакой долгой подгрузки! */}
        <ProductGrid products={featured} />
      </section>

      <NewsletterSection />
    </main>
  );
}
