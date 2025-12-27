'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

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
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-gray-100">
      <Link href={`/product/${slug}`} className="relative h-64 w-full overflow-hidden rounded-t-lg bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/product/${slug}`}>
          <h3 className="font-playfair text-xl font-bold text-alpine-forest mb-2 hover:text-alpine-gold transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <span className="text-lg font-bold text-alpine-forest">CHF {price.toFixed(2)}</span>
          <Button 
            onClick={() => addItem({ id, name, price, image, quantity: 1 })}
            size="sm" 
            className="bg-alpine-forest hover:bg-alpine-gold text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
