'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/store'; 

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  description?: string;
}

export function ProductCard({ id, name, slug, price, image, description }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, price, image, quantity: 1 });
    // Тут можно добавить софтовый эффект, но Toast из основной кнопки уже сработает
  };

  return (
    <div className="group bg-white flex flex-col h-full border border-gray-100 hover:border-alpine-gold/20 transition-all duration-700">
      <Link href={`/product/${slug}`} className="relative h-[450px] w-full overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
        />
        {/* Быстрая кнопка при наведении */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 flex items-center justify-center">
           <button 
             onClick={handleQuickAdd}
             className="translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-white text-alpine-forest p-4 rounded-full shadow-xl hover:bg-alpine-gold hover:text-white"
           >
             <ShoppingCart size={20} />
           </button>
        </div>
      </Link>
      
      <div className="p-8 flex flex-col flex-grow text-center">
        <span className="text-[10px] uppercase tracking-[0.4em] text-alpine-gold font-bold mb-3">Limited Batch</span>
        <h3 className="font-playfair text-2xl font-black text-alpine-forest mb-4 tracking-tight">
          {name}
        </h3>
        <p className="text-gray-400 text-[11px] font-light mb-8 line-clamp-2 uppercase tracking-[0.15em] leading-relaxed">
          {description}
        </p>
        <div className="mt-auto pt-4 border-t border-gray-50">
          <span className="text-xl font-light text-alpine-forest tracking-tighter italic">CHF {price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
