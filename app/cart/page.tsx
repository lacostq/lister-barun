'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/components/providers/language-provider';
import { getTranslation } from '@/lib/translations';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { language } = useLanguage();
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getShippingProgress = useCartStore((state) => state.getShippingProgress);

  const total = getTotalPrice();
  const shippingThreshold = 80;
  const shippingProgress = getShippingProgress();
  const needsMoreForFreeShipping = Math.max(0, shippingThreshold - total);
  const shippingCost = total >= shippingThreshold ? 0 : 8;

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
            <h1 className="font-playfair text-4xl font-bold text-alpine-forest mb-4">
              {getTranslation('cart.empty', language)}
            </h1>
            <p className="text-gray-600 mb-8">
              Discover our premium natural soaps and add them to your cart.
            </p>
            <Button
              asChild
              className="bg-alpine-forest hover:bg-alpine-forest-dark text-white px-8 py-6 text-lg"
            >
              <Link href="/shop">{getTranslation('cart.continue_shopping', language)}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          className="font-playfair text-4xl font-bold text-alpine-forest mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {getTranslation('cart.title', language)}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Free Shipping Progress */}
            {total < shippingThreshold && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-alpine-beige/50 border border-alpine-gold/30 rounded-lg p-4 mb-8"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-alpine-forest">
                    {getTranslation('cart.free_shipping_threshold', language)}
                  </p>
                  <span className="text-sm font-semibold text-alpine-gold">
                    CHF {needsMoreForFreeShipping.toFixed(2)} left
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-alpine-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            )}

            {total >= shippingThreshold && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8"
              >
                <p className="text-sm font-semibold text-green-700">
                  {getTranslation('cart.free_shipping', language)} ✓
                </p>
              </motion.div>
            )}

            {/* Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border rounded-lg p-4 flex gap-4"
                >
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-playfair text-lg font-semibold text-alpine-forest mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">CHF {item.price.toFixed(2)}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end justify-between">
                    <p className="text-lg font-semibold text-alpine-forest">
                      CHF {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
              <h2 className="font-playfair text-xl font-bold text-alpine-forest mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{getTranslation('cart.subtotal', language)}</span>
                  <span className="font-semibold">CHF {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{getTranslation('cart.shipping', language)}</span>
                  <span className="font-semibold text-green-600">
                    {shippingCost === 0 ? (
                      getTranslation('cart.free_shipping', language)
                    ) : (
                      `CHF ${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between mb-6">
                <span className="font-playfair text-lg font-bold text-alpine-forest">
                  {getTranslation('cart.total', language)}
                </span>
                <span className="font-playfair text-2xl font-bold text-alpine-forest">
                  CHF {(total + shippingCost).toFixed(2)}
                </span>
              </div>

              <Button
                asChild
                className="w-full bg-alpine-forest hover:bg-alpine-forest-dark text-white py-6 text-lg font-semibold"
              >
                <Link href="/checkout" className="flex items-center justify-center gap-2">
                  {getTranslation('cart.checkout', language)}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full mt-3 border-alpine-forest text-alpine-forest hover:bg-alpine-forest/5"
              >
                <Link href="/shop">{getTranslation('cart.continue_shopping', language)}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
