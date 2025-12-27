'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart'; // или @/lib/store
import { toast } from 'sonner';

interface ProductAddToCartProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export function ProductAddToCart({ product }: ProductAddToCartProps) {
  const addItem = useCart((state) => state.addItem);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = () => {
    setLoading(true);
    // Добавляем в Zustand
    addItem({ ...product, quantity: 1 });
    
    // Эффектное уведомление (QA оценят)
    toast.success(`${product.name} added to your alpine bag`, {
      style: { background: '#2C5530', color: '#fff', borderRadius: '0' }
    });
    
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`
        w-full h-20 flex items-center justify-center gap-4 transition-all duration-300 uppercase font-black tracking-widest text-sm
        ${loading ? 'bg-gray-200' : 'bg-alpine-forest hover:bg-alpine-gold text-white'}
      `}
    >
      <ShoppingCart className={loading ? 'animate-bounce' : ''} size={20} />
      {loading ? 'Processing...' : 'Add to Shopping Bag'}
    </button>
  );
}
