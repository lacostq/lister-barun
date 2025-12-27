import { getFeaturedProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/products/product-card';
import { NewsletterSection } from '@/components/home/newsletter-section';
import Link from 'next/link';
import Image from 'next/image';

// Эта функция теперь выполняется НА СЕРВЕРЕ. Клиент получает уже готовый HTML.
export default async function Home() {
  const products = await getFeaturedProducts('en'); // Позже добавим динамику языков

  return (
    <div className="flex flex-col w-full">
      {/* Мгновенный Hero блок без тяжелого JS */}
      <section className="relative h-[85vh] flex items-center justify-center bg-alpine-beige/30">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.pexels.com/photos/3621519/pexels-photo-3621519.jpeg"
            alt="Swiss Alps Background"
            fill
            priority // Загружается первым делом!
            className="object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="font-playfair text-6xl md:text-8xl font-bold text-alpine-forest mb-6 tracking-tight">
            Swiss Essence. <br/>Pure Soul.
          </h1>
          <p className="text-xl text-gray-700 mb-8 font-light tracking-wide">
            Handcrafted natural soap from the heart of Fribourg.
          </p>
          <Link 
            href="/shop" 
            className="inline-block bg-alpine-forest hover:bg-alpine-forest-dark text-white px-10 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105"
          >
            Explore Shop
          </Link>
        </div>
      </section>

      {/* Сетка товаров - данные приходят мгновенно */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <h2 className="font-playfair text-4xl font-bold text-alpine-forest italic">Featured Bars</h2>
            <Link href="/shop" className="text-alpine-gold hover:underline font-medium">View all collection →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {products.map((p) => (
              <ProductCard 
                key={p.id} 
                id={p.id}
                name={p.name}
                slug={p.slug}
                price={p.price}
                image={p.images[0]?.image_url}
                description={p.translation?.description}
              />
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
