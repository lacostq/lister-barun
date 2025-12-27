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

  return (
    <div className="group bg-white flex flex-col h-full border border-gray-100 hover:border-alpine-gold/30 transition-all duration-500">
      <Link href={`/product/${slug}`} className="relative h-80 w-full overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="p-8 flex flex-col flex-grow text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-alpine-gold font-bold mb-2">Mountain Batch</span>
        <h3 className="font-playfair text-2xl font-black text-alpine-forest mb-3">
          {name}
        </h3>
        <p className="text-gray-400 text-xs font-light mb-6 line-clamp-2 uppercase tracking-wide italic">
          {description}
        </p>
        <div className="mt-auto pt-6 flex flex-col gap-4">
          <span className="text-xl font-medium text-alpine-forest">CHF {price.toFixed(2)}</span>
          <button 
            onClick={() => addItem({ id, name, price, image, quantity: 1 })}
            className="w-full bg-alpine-forest hover:bg-alpine-gold text-white py-4 flex items-center justify-center gap-3 transition-all duration-300 uppercase text-[10px] font-bold tracking-[0.2em]"
          >
            <ShoppingCart className="w-4 h-4" /> Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}
