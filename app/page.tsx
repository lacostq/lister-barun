'use client';

import React, { useState, useEffect } from 'react';
import { Mountain, Sparkles, ShoppingBag, Star, Award, Shield, Clock, Globe, Heart, ChevronRight, X, Check } from 'lucide-react';

// ==========================================
// 🛠 АДМИН-ПАНЕЛЬ (Редактируй товары здесь)
// ==========================================

// Определение типа для товара (чтобы Vercel не ругался)
interface Product {
  id: number;
  name: string;
  tagline: string;
  image: string;
  description: string;
  benefits: string[];
  exclusive: string;
  price: number;
  badge: string;
  badgeColor: string;
}

const STORE_DATA = {
  currency: 'CHF', // Валюта
  products: [
    {
      id: 1,
      name: 'Alpine Lavender',
      tagline: 'The Crown Jewel of Swiss Alps',
      image: 'https://images.unsplash.com/photo-1600857062241-98e5e6e5e0f1?w=800&q=80',
      description: 'Harvested at dawn from mountain meadows at 2000m altitude, where lavender develops its most potent therapeutic properties.',
      benefits: ['Stress Relief', 'Deep Skin Nourishment', 'Anti-Aging Properties'],
      exclusive: 'Limited to 500 bars per batch',
      price: 14.50,
      badge: 'BESTSELLER',
      badgeColor: 'bg-amber-500'
    },
    {
      id: 2,
      name: 'Glacier Mint',
      tagline: 'Pure Alpine Refreshment',
      image: 'https://images.unsplash.com/photo-1600857062241-98e5e6e5e0f1?w=800&q=80',
      description: 'Wild mint from glacier valleys, infused with mineral-rich glacier clay that has been forming for millennia.',
      benefits: ['Revitalizing Energy', 'Deep Pore Cleansing', 'Natural Cooling'],
      exclusive: 'Only 300 bars per month',
      price: 12.00,
      badge: 'RARE FIND',
      badgeColor: 'bg-cyan-500'
    },
    {
      id: 3,
      name: 'Fribourg Forest',
      tagline: 'Ancient Wisdom in Every Bar',
      image: 'https://images.unsplash.com/photo-1600857062241-98e5e6e5e0f1?w=800&q=80',
      description: 'Deep forest essence with 300-year-old pine resin and rare moss species found only in protected Swiss forests.',
      benefits: ['Masculine Confidence', 'Natural Protection', 'Timeless Elegance'],
      exclusive: 'Collectors Edition',
      price: 16.00,
      badge: 'EXCLUSIVE',
      badgeColor: 'bg-emerald-600'
    }
  ]
};

// ==========================================
// КОНЕЦ АДМИН-ПАНЕЛИ
// ==========================================

const PremiumSwissSoapStore = () => {
  // Управление состоянием
  const [scrollY, setScrollY] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Здесь мы явно указываем, что selectedProduct может быть Product или null
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Типизированный обработчик покупки
  const handleInstantBuy = (product: Product) => {
    setSelectedProduct(product);
    setShowCheckout(true);
    setFormData({ name: '', email: '', phone: '', address: '' });
  };

  // Типизированный обработчик полей
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompleteOrder = () => {
    if (formData.name && formData.email && formData.phone && formData.address) {
      setOrderComplete(true);
      setTimeout(() => {
        setShowCheckout(false);
        setOrderComplete(false);
        setSelectedProduct(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans">
      
      {/* Модальное окно мгновенной покупки */}
      {showCheckout && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setShowCheckout(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {!orderComplete ? (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{selectedProduct.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{selectedProduct.exclusive}</p>
                  <div className="text-4xl font-bold text-amber-400">
                    {STORE_DATA.currency} {selectedProduct.price.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Phone Number"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Delivery Address"
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                  
                  <button
                    onClick={handleCompleteOrder}
                    className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold py-4 rounded-xl hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Complete Purchase
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      Secure Payment
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Ships in 24h
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-3 text-white">Order Complete!</h3>
                <p className="text-gray-400 mb-6">Your Swiss luxury is on its way.</p>
                <div className="text-sm text-gray-500">A confirmation email has been sent.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <Mountain className="w-6 h-6 text-amber-400" />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              ALPINE ESSENCE
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Handcrafted in Switzerland</span>
            <span className="sm:hidden">Swiss Made</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-100 ease-linear"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
            transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0005})`,
            filter: 'brightness(0.4)'
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto mt-16">
          <div className="flex items-center justify-center gap-3 mb-8 opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-xs tracking-[0.4em] uppercase text-amber-400 font-light">
              Est. 1987 • Fribourg, Switzerland
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold mb-6 leading-tight tracking-tight opacity-0 animate-[slideUp_1s_ease-out_0.2s_forwards]">
            <span className="block mb-2 text-white">Where Alps Meet</span>
            <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent pb-4">
              Timeless Luxury
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl mb-12 font-light max-w-3xl mx-auto leading-relaxed text-gray-300 opacity-0 animate-[fadeIn_1s_ease-out_0.8s_forwards]">
            Every bar is a masterpiece. Handcrafted from herbs that grow where eagles soar and glaciers whisper ancient secrets.
          </p>
          
          <button 
            onClick={() => {
                const catalog = document.getElementById('catalog');
                if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
            }}
            className="opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards] group bg-gradient-to-r from-amber-400 to-orange-500 text-black px-12 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 hover:scale-105 inline-flex items-center gap-3"
          >
            Discover Your Essence
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto opacity-0 animate-[fadeIn_1s_ease-out_1.2s_forwards]">
            {[
              { number: '100%', label: 'Natural' },
              { number: '2000m', label: 'Altitude' },
              { number: '50K+', label: 'Worldwide' }
            ].map((stat, i) => (
              <div key={i} className="text-center border-r border-white/20 last:border-r-0">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">{stat.number}</div>
                <div className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-amber-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* Раздел Преимуществ */}
      <section className="py-24 px-6 relative bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 px-4 py-2 rounded-full text-sm font-semibold mb-8">
                <Award className="w-4 h-4" />
                Swiss Excellence
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-white">
                Why Swiss Products
                <span className="block text-amber-400">Dominate the World</span>
              </h2>
              
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Switzerland is not just a country. It is a promise. A promise of perfection, precision, and purity that has been kept for centuries.
              </p>

              <div className="space-y-8">
                {[
                  { title: 'Uncompromising Standards', desc: 'Every ingredient meets pharmaceutical-grade purity requirements' },
                  { title: 'Protected Alpine Environment', desc: 'Herbs from UNESCO-protected mountain regions untouched by pollution' },
                  { title: 'Generational Craftsmanship', desc: 'Recipes refined over three generations of master soap makers' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-black font-bold text-sm group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-2 text-lg">{item.title}</div>
                      <div className="text-gray-400 text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-1 md:order-2">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-amber-500/20 rounded-full blur-[100px]" />
              <img 
                src="https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?w=800&q=80"
                alt="Swiss Alps Soap"
                className="rounded-3xl shadow-2xl relative z-10 w-full transform transition hover:scale-[1.02] duration-700"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-gray-900 to-black border border-amber-400/20 p-6 rounded-2xl shadow-2xl z-20 backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 text-black">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg mb-1">Swiss Made</div>
                    <div className="text-xs text-gray-400 mb-2">Certificate No. CH-2847</div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Каталог (КОЛЛЕКЦИЯ) */}
      <section id="catalog" className="py-24 px-6 relative bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Limited Collection
            </div>
            <h2 className="text-4xl md:text-7xl font-bold mb-6 text-white">
              Masterpieces in
              <span className="block text-amber-400">Three Acts</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Each bar is numbered, dated, and signed. Own a piece of Alpine perfection that money usually cannot buy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STORE_DATA.products.map((product) => (
              <div 
                key={product.id}
                className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 flex flex-col"
              >
                <div className={`absolute top-6 right-6 ${product.badgeColor} text-black text-xs font-bold px-4 py-2 rounded-full z-20 shadow-lg tracking-wider`}>
                  {product.badge}
                </div>

                <div className="relative h-72 overflow-hidden bg-gray-900">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-amber-400 transition-colors">{product.name}</h3>
                  <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">{product.tagline}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{product.description}</p>

                  <div className="mb-6 space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                    {product.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                        <div className="w-1 h-1 bg-amber-400 rounded-full" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end justify-between mb-6">
                     <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase">Price</span>
                        <span className="text-3xl font-bold text-white">{STORE_DATA.currency} {product.price.toFixed(2)}</span>
                     </div>
                  </div>

                  <button 
                    onClick={() => handleInstantBuy(product)}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-amber-400 transition-colors duration-300 flex items-center justify-center gap-2 text-sm tracking-widest uppercase group-hover:shadow-lg group-hover:shadow-amber-500/50"
                  >
                    Buy Now
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="py-24 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Treasured Worldwide
            </h2>
            <div className="h-1 w-24 bg-amber-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Alexandra K.', location: 'Manhattan, NY', quote: 'This is not just soap. It is a daily moment of Swiss perfection. The Alpine Lavender has transformed my morning routine.' },
              { name: 'James W.', location: 'London, UK', quote: 'As someone who collects the finest things, I can confidently say this belongs in that category. The attention to detail is remarkable.' },
              { name: 'Yuki S.', location: 'Tokyo, Japan', quote: 'I have tried luxury soaps from around the world. Nothing compares to the purity and craftsmanship of Alpine Essence.' }
            ].map((testimonial, i) => (
              <div 
                key={i}
                className="bg-black/50 border border-white/10 rounded-2xl p-8 hover:border-amber-400/30 transition-colors duration-300"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6 italic text-sm">"{testimonial.quote}"</p>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="border-t border-gray-800 py-12 px-6 bg-black text-center relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-4">
            <Mountain className="w-6 h-6 text-amber-400" />
            <span className="text-white tracking-widest">
              ALPINE
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-8 max-w-sm mx-auto">
            Experience the purity of 100% organic ingredients sourced directly from the Swiss Alps.
          </p>

          <div className="flex justify-center gap-6 text-xs text-gray-500 tracking-wider uppercase mb-8">
            <span className="cursor-pointer hover:text-white transition-colors">Instagram</span>
            <span className="cursor-pointer hover:text-white transition-colors">Contact</span>
            <span className="cursor-pointer hover:text-white transition-colors">Legal</span>
          </div>

          <div className="text-[10px] text-gray-700">
            © 2024 Alpine Essence. Made with <Heart className="w-3 h-3 text-red-900 inline mx-1" /> in Switzerland.
          </div>
        </div>
      </footer>
      
      {/* CSS для анимаций (вставлен прямо сюда для простоты) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PremiumSwissSoapStore;
