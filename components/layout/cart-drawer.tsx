'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/components/providers/language-provider';
import { getTranslation } from '@/lib/translations';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getShippingProgress = useCartStore((state) => state.getShippingProgress);
  const { language } = useLanguage();

  const total = getTotalPrice();
  const shippingThreshold = 80;
  const shippingProgress = getShippingProgress();
  const needsMoreForFreeShipping = Math.max(0, shippingThreshold - total);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="font-playfair text-2xl text-alpine-forest">
            {getTranslation('cart.title', language)}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <p className="text-gray-600">{getTranslation('cart.empty', language)}</p>
            <Button
              asChild
              className="bg-alpine-forest hover:bg-alpine-forest-dark"
              onClick={() => onOpenChange(false)}
            >
              <Link href="/shop">{getTranslation('cart.continue_shopping', language)}</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress */}
            {total < shippingThreshold && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-alpine-beige/50 border border-alpine-gold/30 rounded-lg p-3 mb-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-alpine-forest">
                    {getTranslation('cart.free_shipping_threshold', language)}
                  </p>
                  <span className="text-xs font-semibold text-alpine-gold">
                    CHF {needsMoreForFreeShipping.toFixed(2)}
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
                className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4"
              >
                <p className="text-xs font-semibold text-green-700">
                  {getTranslation('cart.free_shipping', language)} ✓
                </p>
              </motion.div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 border rounded-lg p-2"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-600">CHF {item.price.toFixed(2)}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{getTranslation('cart.subtotal', language)}</span>
                <span className="font-medium">CHF {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{getTranslation('cart.shipping', language)}</span>
                <span className="font-medium text-green-600">
                  {total >= shippingThreshold ? getTranslation('cart.free_shipping', language) : 'CHF 8.00'}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-playfair font-semibold">
                <span>{getTranslation('cart.total', language)}</span>
                <span className="text-alpine-forest">
                  CHF {(total + (total >= shippingThreshold ? 0 : 8)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              asChild
              className="w-full mt-4 bg-alpine-forest hover:bg-alpine-forest-dark text-white"
            >
              <Link href="/checkout" onClick={() => onOpenChange(false)}>
                {getTranslation('cart.checkout', language)}
              </Link>
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
