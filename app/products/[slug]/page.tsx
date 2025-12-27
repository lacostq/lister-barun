'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ProductCard } from '@/components/products/product-card';
import { useLanguage } from '@/components/providers/language-provider';
import { getTranslation } from '@/lib/translations';
import { getProductBySlug } from '@/lib/supabase';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { Heart, ShoppingCart, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  images: Array<{ image_url: string; alt_text: string }>;
  translation: { description: string; how_to_use: string };
  ingredients: string[];
  relatedProducts: any[];
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { language } = useLanguage();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductBySlug(params.slug, language);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.slug, language]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.image_url || '',
        slug: product.slug,
      });
    }
    toast.success(getTranslation('message.add_to_cart_success', language));
    setQuantity(1);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.image_url || '',
    });
    if (isInWishlist(product.id)) {
      toast.success(getTranslation('message.remove_from_wishlist_success', language));
    } else {
      toast.success(getTranslation('message.add_to_wishlist_success', language));
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-200 rounded-lg h-96 md:h-full animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-playfair font-bold text-alpine-forest mb-4">Product not found</h1>
        <Button asChild className="bg-alpine-forest hover:bg-alpine-forest-dark text-white">
          <Link href="/shop">Back to shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/shop" className="flex items-center gap-2 text-sm text-gray-600 hover:text-alpine-forest">
          <ChevronLeft className="w-4 h-4" />
          Back to shop
        </Link>
      </div>

      {/* Product */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Gallery */}
          <div>
            <motion.div
              className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={product.images[selectedImage]?.image_url || ''}
                alt={product.images[selectedImage]?.alt_text || product.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-alpine-forest' : 'border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image
                      src={img.image_url}
                      alt={img.alt_text || `${product.name} ${idx}`}
                      fill
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="font-playfair text-4xl font-bold text-alpine-forest mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-alpine-gold mb-6">CHF {product.price.toFixed(2)}</p>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">{product.translation?.description}</p>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  −
                </button>
                <span className="px-6 py-2 text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-alpine-forest hover:bg-alpine-forest-dark text-white py-6 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {getTranslation('product.add_to_cart', language)}
              </Button>

              <Button
                onClick={handleToggleWishlist}
                variant="outline"
                className={`px-6 py-6 ${
                  isInWishlist(product.id)
                    ? 'border-alpine-forest text-alpine-forest'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`}
                />
              </Button>
            </div>

            {/* Info Badge */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-green-700 font-medium">
                {getTranslation('product.in_stock', language)} ✓
              </p>
            </div>

            {/* Accordions */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ingredients">
                <AccordionTrigger className="font-semibold text-lg text-alpine-forest">
                  {getTranslation('product.ingredients', language)}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {product.ingredients?.map((ingredient, idx) => (
                      <li key={idx} className="text-gray-700 flex items-center gap-2">
                        <span className="text-alpine-gold">•</span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how_to_use">
                <AccordionTrigger className="font-semibold text-lg text-alpine-forest">
                  {getTranslation('product.how_to_use', language)}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700 leading-relaxed">
                    {product.translation?.how_to_use ||
                      'Wet your hands or body, create a rich lather with the soap, and massage gently. Rinse thoroughly with water.'}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </motion.div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <motion.section
            className="mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-3xl font-bold text-alpine-forest mb-8 text-center">
              {getTranslation('product.related', language)}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {product.relatedProducts.map((related, idx) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard
                    id={related.id}
                    name={related.name}
                    slug={related.slug}
                    price={related.price}
                    image={related.images[0]?.image_url || ''}
                    description={related.translation?.description}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
