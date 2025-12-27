import { getAllProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/products/product-card';

export default async function ShopPage() {
  // Получаем абсолютно все товары из базы
  const products = await getAllProducts('en');

  return (
    <div className="bg-white min-h-screen">
      {/* Header отступа (Spacer) */}
      <div className="h-24 bg-alpine-forest"></div>

      <header className="bg-alpine-beige/30 py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-alpine-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
            Traditional Handcrafted Batch
          </span>
          <h1 className="font-playfair text-5xl md:text-7xl font-black text-alpine-forest">
            The Soap Shop
          </h1>
          <p className="mt-6 text-gray-600 max-w-xl mx-auto italic font-light">
            Discover our collection of organic soaps, slow-cured for 6 weeks in the fresh air of the Fribourg Alps.
          </p>
        </div>
      </header>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Статистика */}
          <div className="flex justify-between items-center mb-12 pb-6 border-b border-gray-50">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
              Showing {products.length} unique varieties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={Number(product.price)}
                  image={product.image}
                  description={product.description}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-gray-400 font-playfair italic text-xl">
                  We are currently preparing new alpine batches.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Футер-секция про качество */}
      <section className="bg-alpine-forest py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-playfair text-3xl mb-6">Need a custom mountain batch?</h2>
          <p className="mb-8 opacity-80 italic">For hotels or corporate gifts, we create tailor-made soaps with local scents.</p>
          <a href="mailto:hello@alpineessence.ch" className="inline-block border border-white px-8 py-3 hover:bg-white hover:text-alpine-forest transition-all uppercase text-xs tracking-widest font-bold">
            Contact Workshop
          </a>
        </div>
      </section>
    </div>
  );
}
