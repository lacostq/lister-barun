'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { useLanguage } from '@/components/providers/language-provider';
import { getTranslation } from '@/lib/translations';
import { useWishlistStore } from '@/store/wishlist';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { language } = useLanguage();
  const items = useWishlistStore((state) => state.items);
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="w-16 h-16 mx-auto text-gray-300 mb-6" />
            <h1 className="font-playfair text-4xl font-bold text-alpine-forest mb-4">
              {getTranslation('nav.wishlist', language)}
            </h1>
            <p className="text-gray-600 mb-8">
              Your wishlist is empty. Start adding your favorite soaps!
            </p>
            <Button
              asChild
              className="bg-alpine-forest hover:bg-alpine-forest-dark text-white px-8 py-6 text-lg"
            >
              <Link href="/shop">{getTranslation('nav.shop', language)}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          className="font-playfair text-4xl font-bold text-alpine-forest mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {getTranslation('nav.wishlist', language)} ({items.length})
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard
                id={item.id}
                name={item.name}
                slug={item.slug}
                price={0}
                image={item.image}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
