'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/store'; 
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
    
    // Добавляем товар в корзину через Zustand
    addItem({ ...product, quantity: 1 });
    
    // Уведомление в швейцарском стиле: четко и красиво
    toast.success(`${product.name} added to your bag`, {
      style: { 
        background: '#2C5530', 
        color: '#fff', 
        borderRadius: '0px',
        border: 'none'
      },
    });
    
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`
        w-full h-20 flex items-center justify-center gap-4 transition-all duration-500 uppercase font-black tracking-widest text-xs
        ${loading 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-alpine-forest hover:bg-alpine-gold text-white active:scale-[0.98]'}
      `}
    >
      <ShoppingCart className={`${loading ? 'animate-bounce' : ''} transition-transform`} size={18} />
      {loading ? 'Adding...' : 'Add to Shopping Bag'}
    </button>
  );
}
