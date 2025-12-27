'use client';

import React, { useState, useEffect } from 'react';
import { Mountain, Sparkles, ShoppingBag, Star, Award, Leaf, Shield, Clock, Globe, Heart, ChevronRight, X, Check } from 'lucide-react';

const PremiumSwissSoapStore = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const products = [
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
  ];

  const handleInstantBuy = (product) => {
    setSelectedProduct(product);
    setShowCheckout(true);
    setFormData({ name: '', email: '', phone: '', address: '' });
  };

  const handleInputChange = (field, value) => {
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
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
                  <h3 className="text-2xl font-bold mb-2">{selectedProduct?.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{selectedProduct?.exclusive}</p>
                  <div className="text-4xl font-bold text-amber-400">CHF {selectedProduct?.price}</div>
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
                <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-3">Order Complete!</h3>
                <p className="text-gray-400 mb-6">Your Swiss luxury is on its way</p>
                <div className="text-sm text-gray-500">Confirmation sent to your email</div>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Mountain className="w-6 h-6 text-amber-400" />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              ALPINE ESSENCE
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Globe className="w-4 h-4" />
            <span>Handcrafted in Switzerland</span>
          </div>
        </div>
      </nav>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
            transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0005})`,
            filter: 'brightness(0.4)'
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-xs tracking-[0.4em] uppercase text-amber-400 font-light">
              Est. 1987 • Fribourg, Switzerland
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight tracking-tight">
            <span className="block mb-2 text-white">Where Alps Meet</span>
            <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
              Timeless Luxury
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 font-light max-w-3xl mx-auto leading-relaxed text-gray-300">
            Every bar is a masterpiece. Handcrafted from herbs that grow where eagles soar and glaciers whisper ancient secrets.
          </p>
          
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="group bg-gradient-to-r from-amber-400 to-orange-500 text-black px-12 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 hover:scale-105 inline-flex items-center gap-3"
          >
            Discover Your Essence
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { number: '100%', label: 'Natural' },
              { number: '2000m', label: 'Altitude' },
              { number: '50K+', label: 'Worldwide' }
            ].map((stat, i) => (
              <div key={i} className="text-center border-r border-white/20 last:border-r-0">
                <div className="text-4xl font-bold text-amber-400 mb-2">{stat.number}</div>
                <div className="text-xs uppercase tracking-wider text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-amber-400 rounded-full" />
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 px-4 py-2 rounded-full text-sm font-semibold mb-8">
                <Award className="w-4 h-4" />
                Swiss Excellence
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Why Swiss Products
                <span className="block text-amber-400">Dominate the World</span>
              </h2>
              
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Switzerland is not just a country. It is a promise. A promise of perfection, precision, and purity that has been kept for centuries. When you hold Swiss soap, you hold a piece of this legacy.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Uncompromising Standards', desc: 'Every ingredient meets pharmaceutical-grade purity requirements' },
                  { title: 'Protected Alpine Environment', desc: 'Herbs from UNESCO-protected mountain regions untouched by pollution' },
                  { title: 'Generational Craftsmanship', desc: 'Recipes refined over three generations of master soap makers' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-black font-bold text-sm group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">{item.title}</div>
                      <div className="text-gray-400 text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="Swiss Alps"
                className="rounded-3xl shadow-2xl relative z-10"
                loading="lazy"
              />
              <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-gray-900 to-black border border-amber-400/20 p-8 rounded-2xl shadow-2xl z-20 backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <div className="font-bold text-xl mb-1">Swiss Made</div>
                    <div className="text-sm text-gray-400 mb-2">Certificate No. CH-2847</div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Limited Collection
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              Masterpieces in
              <span className="block text-amber-400">Three Acts</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Each bar is numbered, dated, and signed. Own a piece of Alpine perfection that money usually cannot buy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id}
                className="group relative bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-2"
              >
                <div className={`absolute top-6 right-6 ${product.badgeColor} text-black text-xs font-bold px-4 py-2 rounded-full z-20 shadow-lg`}>
                  {product.badge}
                </div>

                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="p-8">
                  <h3 className="text-3xl font-bold mb-2">{product.name}</h3>
                  <p className="text-amber-400 text-sm mb-4 font-semibold">{product.tagline}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{product.description}</p>

                  <div className="mb-6 space-y-2">
                    {product.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-amber-400 mb-6 border-t border-gray-800 pt-4">
                    <Sparkles className="w-4 h-4" />
                    {product.exclusive}
                  </div>

                  <button 
                    onClick={() => handleInstantBuy(product)}
                    className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold py-4 rounded-xl hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3"
                  >
                    Claim Yours Now
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Treasured Worldwide
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join discerning individuals from New York to Tokyo who trust Alpine Essence for their daily ritual
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Alexandra K.', location: 'Manhattan, NY', quote: 'This is not just soap. It is a daily moment of Swiss perfection. The Alpine Lavender has transformed my morning routine into a spa experience.' },
              { name: 'James W.', location: 'London, UK', quote: 'As someone who collects the finest things, I can confidently say this belongs in that category. The attention to detail is remarkable.' },
              { name: 'Yuki S.', location: 'Tokyo, Japan', quote: 'I have tried luxury soaps from around the world. Nothing compares to the purity and craftsmanship of Alpine Essence. Worth every franc.' }
            ].map((testimonial, i) => (
              <div 
                key={i}
                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 hover:border-amber-400/50 transition-all duration-500"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-8 italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center gap-4 border-t border-gray-800 pt-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-xl">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-500/20 blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Heart className="w-16 h-16 text-amber-400 mx-auto mb-8" />
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Your Alpine Journey
            <span className="block text-amber-400">Begins Today</span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Do not settle for ordinary. Choose soap that tells a story, carries tradition, and delivers transformation.
          </p>

          <button 
            onClick={() => window.scrollTo({ top: document.body.scrollHeight * 0.5, behavior: 'smooth' })}
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-black px-16 py-6 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 hover:scale-105 inline-flex items-center gap-3"
          >
            Explore Collection
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="mt-12 flex justify-center gap-12 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Secure Payment
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Ships in 24h
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Worldwide Delivery
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-900 py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-6">
            <Mountain className="w-6 h-6 text-amber-400" />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              ALPINE ESSENCE
            </span>
          </div>
          
          <p className="text-gray-500 text-sm mb-8">
            Handcrafted in Fribourg, Switzerland since 1987
          </p>

          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <button className="hover:text-amber-400 transition-colors">Privacy</button>
            <button className="hover:text-amber-400 transition-colors">Terms</button>
            <button className="hover:text-amber-400 transition-colors">Contact</button>
          </div>

          <div className="mt-8 text-xs text-gray-600">
            © 2024 Alpine Essence. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumSwissSoapStore;
