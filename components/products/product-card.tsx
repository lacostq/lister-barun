'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useLanguage } from '@/components/providers/language-provider';
import { getTranslation } from '@/lib/translations';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  description?: string;
}

export function ProductCard({ id, name, slug, price, image, description }: ProductCardProps) {
  const { language } = useLanguage();
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id,
      name,
      price,
      image,
      slug,
    });
    toast.success(getTranslation('message.add_to_cart_success', language));
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({ id, name, slug, image });
    if (isInWishlist) {
      toast.success(getTranslation('message.remove_from_wishlist_success', language));
    } else {
      toast.success(getTranslation('message.add_to_wishlist_success', language));
    }
  };

  return (
    <Link href={`/products/${slug}`}>
      <motion.div
        className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-alpine-gold hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
        whileHover={{ translateY: -4 }}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isInWishlist
                  ? 'fill-alpine-forest text-alpine-forest'
                  : 'text-gray-600 hover:text-alpine-forest'
              }`}
            />
          </button>

          {/* Quick Add Button */}
          <motion.button
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 bg-alpine-forest text-white py-2 px-4 flex items-center justify-center gap-2 group-hover:bg-alpine-forest-dark transition-colors"
            initial={{ y: 100 }}
            whileHover={{ y: 0 }}
          >
            <ShoppingCart className="w-4 h-4" />
            {getTranslation('product.quick_add', language)}
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-playfair text-lg font-semibold text-alpine-forest mb-1 line-clamp-2">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-alpine-gold">CHF {price.toFixed(2)}</span>
            <span className="text-xs font-medium text-gray-500 uppercase">
              {getTranslation('nav.shop', language)}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
