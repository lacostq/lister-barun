import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/supabase';
import { ShoppingCart, ShieldCheck, Truck, Droplets } from 'lucide-react';
import { ProductAddToCart } from '@/components/products/product-add-to-cart'; // Мы создадим его ниже

interface Props {
  params: { slug: string };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const mainImage = product.images[0] || 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg';

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Фото товара */}
          <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden group">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>

          {/* Инфо секция */}
          <div className="flex flex-col">
            <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-gray-400 mb-8">
              <a href="/" className="hover:text-alpine-forest transition-colors">Home</a>
              <span>/</span>
              <a href="/shop" className="hover:text-alpine-forest transition-colors">Collection</a>
              <span>/</span>
              <span className="text-alpine-forest font-bold">{product.name}</span>
            </nav>

            <h1 className="font-playfair text-5xl md:text-6xl font-black text-alpine-forest mb-6">
              {product.name}
            </h1>
            
            <p className="text-3xl font-light text-alpine-forest mb-10 italic">
              CHF {product.price.toFixed(2)}
            </p>

            <div className="prose prose-sm text-gray-600 mb-12 max-w-none">
              <p className="leading-relaxed text-lg italic mb-6">
                "{product.description}"
              </p>
              {product.ingredients && (
                <div className="bg-alpine-beige/20 p-6 border-l-2 border-alpine-gold mt-8">
                  <h4 className="text-alpine-forest font-bold uppercase tracking-widest text-xs mb-3">Composition</h4>
                  <p className="text-sm font-mono text-gray-500">{product.ingredients}</p>
                </div>
              )}
            </div>

            {/* Клиентский компонент кнопки (Zustand внутри) */}
            <ProductAddToCart 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: mainImage
              }} 
            />

            {/* Бенефиты */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16 pt-16 border-t border-gray-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-alpine-beige/30 text-alpine-forest rounded-full">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-alpine-forest text-sm">Certified Swiss Organic</h4>
                  <p className="text-xs text-gray-500">Pure nature, no chemicals.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-alpine-beige/30 text-alpine-forest rounded-full">
                  <Droplets size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-alpine-forest text-sm">Hydration Plus</h4>
                  <p className="text-xs text-gray-600">Enriched with alpine spring water.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
