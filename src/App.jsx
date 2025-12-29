import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, MapPin, Shield, Star, Zap, Mountain, ChevronDown, Lock, 
  Timer, Mail, Award, TrendingUp, Users, Package, DollarSign, CheckCircle, 
  ArrowRight, Building2, FileText, Menu, X, BarChart3, Truck, AlertCircle, Gavel 
} from 'lucide-react';

// Импорт данных из соседнего файла
import { CONFIG, TIER_STYLES, PRODUCTS, MOCK_DB } from './data';

// --- Sub-Components Definition (Inside same file for portability) ---

const ProductCard = ({ product, onBuy, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);
  const style = TIER_STYLES[product.tier];

  return (
    <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border-2 ${style.border} transition-all duration-700 hover:scale-105 hover:${style.shadow} hover:shadow-2xl group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r ${style.gradient} text-white text-xs font-bold shadow-lg z-10 uppercase`}>{product.tier}</div>
      <div className="relative p-6">
        <div className="flex items-center justify-center mb-4 h-32">
          <div className="text-8xl group-hover:scale-110 transition-transform duration-500 filter drop-shadow-2xl">{product.emoji}</div>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white">{product.title}</h3>
          <p className={`text-sm ${style.text}`}>{product.subtitle}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white text-sm font-semibold">{product.seller}</p>
                <p className="text-gray-400 text-xs">{product.sellerType}</p>
              </div>
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-3">
            <div>
              {product.originalPrice && <span className="text-gray-500 line-through text-sm block">{product.originalPrice} CHF</span>}
              <span className="text-3xl font-bold text-white">{product.price} CHF</span>
            </div>
            {product.originalPrice && (
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
            )}
          </div>
          <button onClick={() => onBuy(product)} className={`w-full bg-gradient-to-r ${style.gradient} text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${style.shadow} flex items-center justify-center gap-2 mt-4`}>
            <ShoppingCart className="w-5 h-5" /><span>BUY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', country: '' });
  const [step, setStep] = useState('review'); // review, payment, success
  const platformFee = (product.price * CONFIG.platformFeePercent / 100).toFixed(2);
  const sellerReceives = (product.price * (100 - CONFIG.platformFeePercent) / 100).toFixed(2);

  if (step === 'success') {
      return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-slate-800 p-8 rounded-2xl max-w-md w-full text-center border border-green-500/50">
                 <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                     <CheckCircle className="w-8 h-8 text-white" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                 <p className="text-gray-400 mb-6">Order #BV-{Math.floor(Math.random()*9000)}-X created.</p>
                 <button onClick={onClose} className="w-full py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
             </div>
        </div>
      )
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto" onClick={onClose}>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-2xl w-full p-8 border-2 border-blue-500/30 shadow-2xl relative my-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">{product.title}</h3>
              <p className="text-blue-300 text-sm">Sold by {product.seller}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-4xl leading-none">×</button>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 space-y-2 text-sm border border-slate-700">
            <div className="flex justify-between text-white font-semibold text-lg">
              <span>Total due</span>
              <span>{product.price} CHF</span>
            </div>
            <p className="text-xs text-gray-500 pt-2 border-t border-slate-700 mt-2">
               Protected by Bergvault Escrow. Funds are released to {product.seller} only after tracking confirms shipment.
            </p>
        </div>
        <div className="space-y-4 mb-6">
            <input type="text" placeholder="Full Name" className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input type="email" placeholder="Email" className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>
        <button onClick={() => setStep('success')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-xl shadow-lg shadow-blue-500/50 text-lg mb-4 flex justify-center items-center gap-2">
            <Lock className="w-5 h-5" /> Pay {product.price} CHF Securely
        </button>
      </div>
    </div>
  );
};

const PartnerModal = ({ onClose }) => {
  const [status, setStatus] = useState('form');
  
  if (status === 'submitted') {
      return (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
             <div className="bg-slate-800 p-8 rounded-2xl max-w-md w-full text-center border border-purple-500/50 animate-scale-in">
                 <CheckCircle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                 <h2 className="text-2xl font-bold text-white mb-2">Application Received</h2>
                 <p className="text-gray-400 mb-6">We will review your seller profile within 48 hours.</p>
                 <button onClick={onClose} className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold">Back to Site</button>
             </div>
        </div>
      )
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto" onClick={onClose}>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-3xl w-full p-8 border-2 border-purple-500/30 shadow-2xl relative animate-scale-in my-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
            <h3 className="text-4xl font-bold text-white">Become a Partner</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-4xl">×</button>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-purple-500/20"><DollarSign className="w-6 h-6 text-purple-400 mb-2"/><h4 className="text-white font-bold">15% Fee</h4><p className="text-gray-400 text-xs">Lowest in CH market</p></div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-blue-500/20"><Users className="w-6 h-6 text-blue-400 mb-2"/><h4 className="text-white font-bold">Access</h4><p className="text-gray-400 text-xs">Intl. customer base</p></div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-green-500/20"><Shield className="w-6 h-6 text-green-400 mb-2"/><h4 className="text-white font-bold">Secure</h4><p className="text-gray-400 text-xs">Fraud protection</p></div>
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStatus('submitted'); }}>
            <div className="grid md:grid-cols-2 gap-4">
              <input required type="text" placeholder="Business Name *" className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white" />
              <input required type="text" placeholder="Contact Person *" className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white" />
            </div>
            <input required type="email" placeholder="Email Address *" className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white" />
            <select className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white">
              <option value="">Category...</option>
              <option value="minerals">Minerals</option>
              <option value="dairy">Food/Dairy</option>
              <option value="artisan">Artisan Crafts</option>
            </select>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl mt-4">Submit Application</button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => (
  <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8">Admin Console</h2>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
            {l: 'Total Revenue', v: '142,392 CHF', i: DollarSign, c: 'green'},
            {l: 'Active Sellers', v: '12', i: Users, c: 'blue'},
            {l: 'Pending Orders', v: '5', i: Package, c: 'orange'},
            {l: 'Platform Fees', v: '21,358 CHF', i: Zap, c: 'purple'}
        ].map((s,i) => (
            <div key={i} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex justify-between">
                <div><p className="text-gray-400 text-sm">{s.l}</p><h4 className="text-2xl font-bold text-white">{s.v}</h4></div>
                <s.i className={`text-${s.c}-400 w-8 h-8`} />
            </div>
        ))}
      </div>
      <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
           <table className="w-full text-left">
             <thead className="bg-slate-900/50 text-gray-400 text-xs uppercase"><tr><th className="p-4">ID</th><th className="p-4">Customer</th><th className="p-4">Status</th><th className="p-4 text-right">CHF</th></tr></thead>
             <tbody className="text-gray-300 divide-y divide-slate-700">
               {MOCK_DB.orders.map(o => (
                 <tr key={o.id}>
                   <td className="p-4 font-mono text-white">{o.id}</td>
                   <td className="p-4">{o.customer}</td>
                   <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'shipped' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{o.status.toUpperCase()}</span></td>
                   <td className="p-4 text-right font-bold text-white">{o.amount}</td>
                 </tr>
               ))}
             </tbody>
           </table>
      </div>
  </div>
);

const OrderTracking = () => {
    const [search, setSearch] = useState('');
    const [result, setResult] = useState(null);
    const doSearch = (e) => { e.preventDefault(); setResult(search.length > 5 ? 'found' : 'error'); }

    return (
        <div className="min-h-screen pt-32 px-4 max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Track Order</h2>
            <form onSubmit={doSearch} className="mb-12 relative">
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="BV-XXXX-X" className="w-full bg-slate-800 p-4 rounded-xl text-white text-center text-xl tracking-widest uppercase" />
                <button className="absolute right-2 top-2 bottom-2 bg-blue-600 px-6 rounded-lg text-white font-bold">Find</button>
            </form>
            {result === 'found' && (
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-left animate-fade-in">
                    <div className="flex gap-4 mb-4"><div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center"><CheckCircle className="text-slate-900 w-4 h-4"/></div><div><p className="text-white font-bold">Confirmed</p><p className="text-gray-500 text-xs">Yesterday</p></div></div>
                    <div className="flex gap-4"><div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center"><Truck className="text-white w-4 h-4"/></div><div><p className="text-white font-bold">In Transit</p><p className="text-gray-500 text-xs">Bern Sort Center</p></div></div>
                </div>
            )}
        </div>
    );
}

const LegalPage = ({ type, onBack }) => (
    <div className="min-h-screen pt-24 px-4 pb-12 max-w-4xl mx-auto text-gray-300">
      <button onClick={onBack} className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2">← Back</button>
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
        <h1 className="text-3xl font-bold text-white mb-6 capitalize">{type}</h1>
        <p>Bergvault acts as an intermediary marketplace...</p>
        <h3 className="text-white font-bold mt-4">1. Scope</h3>
        <p>By using this service, you agree that contracts are formed between Buyer and Seller...</p>
      </div>
    </div>
);

// --- MAIN COMPONENT ---

const BergvaultSite = () => {
  const [scrollY, setScrollY] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [view, setView] = useState('home');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ t, v }) => <button onClick={() => setView(v)} className="text-gray-300 hover:text-white font-medium text-sm uppercase">{t}</button>;

  if(view === 'admin') return <> <NavWrapper /><AdminDashboard /> </>;
  if(view === 'tracking') return <> <NavWrapper /><OrderTracking /> </>;
  if(view === 'terms' || view === 'privacy') return <> <NavWrapper /><LegalPage type={view} onBack={() => setView('home')} /> </>;

  function NavWrapper() {
      return (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 h-20 flex items-center px-4">
             <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                <div onClick={() => setView('home')} className="flex items-center gap-2 font-black text-2xl text-white cursor-pointer"><Mountain className="w-8 h-8 text-blue-500" /> BERG</div>
                <button onClick={() => setView('home')} className="text-white md:hidden">Back Home</button>
                <div className="hidden md:flex gap-6">
                    <NavLink t="Shop" v="home" />
                    <NavLink t="Admin" v="admin" />
                </div>
             </div>
        </nav>
      )
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* HOME NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${scrollY > 50 ? 'bg-slate-900/90 backdrop-blur border-slate-700' : 'bg-transparent border-transparent'}`}>
         <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-2xl text-white tracking-tighter cursor-pointer" onClick={() => setView('home')}>
              <Mountain className="w-8 h-8 text-blue-500" /> BERG<span className="text-blue-500">VAULT</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
               <NavLink t="Tracking" v="tracking" />
               <NavLink t="Admin" v="admin" />
               <button onClick={() => setShowPartnerModal(true)} className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-bold hover:bg-white hover:text-slate-900 transition-colors">Partner Access</button>
            </div>
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</button>
         </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900 z-30 pt-24 px-4 flex flex-col gap-6">
           <button onClick={() => {setView('tracking'); setMobileMenuOpen(false)}} className="text-2xl font-bold text-white text-left">Tracking</button>
           <button onClick={() => {setView('admin'); setMobileMenuOpen(false)}} className="text-2xl font-bold text-white text-left">Admin Console</button>
           <button onClick={() => setShowPartnerModal(true)} className="text-2xl font-bold text-blue-400 text-left">Become a Partner</button>
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-900 z-10"></div>
        <div className="absolute bottom-0 w-full h-[60vh] bg-gradient-to-t from-slate-900 to-transparent z-20" style={{ transform: `scale(${1 + scrollY/1000})` }}></div>
        
        <div className="relative z-30 text-center px-4 max-w-4xl mx-auto mt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-sm font-semibold mb-6">
              <Mountain className="w-4 h-4" /> <span>Official Swiss Marketplace</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400 mb-6 drop-shadow-2xl">{CONFIG.siteName}</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Access the Summit. Secure exclusive goods from <span className="text-white font-bold">{CONFIG.mountainHeight}</span>.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-gray-100 flex items-center gap-2 w-full md:w-auto justify-center">Start Climbing <ArrowRight className="w-5 h-5" /></button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 border-t border-slate-800 pt-8 max-w-2xl mx-auto">
               <div><h4 className="text-3xl font-bold text-white">43</h4><p className="text-gray-500 text-sm">Verified Sellers</p></div>
               <div><h4 className="text-3xl font-bold text-white">1.2k</h4><p className="text-gray-500 text-sm">Shipped</p></div>
               <div><h4 className="text-3xl font-bold text-white">100%</h4><p className="text-gray-500 text-sm">Escrow Secure</p></div>
            </div>
        </div>
      </section>

      {/* SHOP SECTIONS */}
      <section id="shop" className="relative z-30 bg-slate-900 py-24 px-4 max-w-7xl mx-auto">
           {/* Section 1 */}
           <div className="mb-24">
              <div className="flex items-end justify-between mb-8">
                 <div><h3 className="text-3xl font-bold text-white mb-2">The Summit</h3><p className="text-gray-400">Rare minerals found above 3,000m.</p></div>
                 <div className="hidden md:block h-px flex-1 bg-slate-800 ml-8 mb-4"></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {PRODUCTS.level1.map((p, i) => <ProductCard key={p.id} product={p} delay={i} onBuy={setSelectedProduct} />)}
              </div>
           </div>
           {/* Section 2 */}
           <div className="mb-24">
              <div className="flex items-end justify-between mb-8">
                 <div><h3 className="text-3xl font-bold text-white mb-2">Alpine Meadows</h3><p className="text-gray-400">Food & Nutrition from the green zone.</p></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {PRODUCTS.level2.map((p, i) => <ProductCard key={p.id} product={p} delay={i} onBuy={setSelectedProduct} />)}
              </div>
           </div>
           {/* Section 3 */}
           <div className="mb-24">
              <div className="flex items-end justify-between mb-8">
                 <div><h3 className="text-3xl font-bold text-white mb-2">The Valley</h3><p className="text-gray-400">Artisan crafts.</p></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {PRODUCTS.level3.map((p, i) => <ProductCard key={p.id} product={p} delay={i} onBuy={setSelectedProduct} />)}
              </div>
           </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-16 px-4">
         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm text-gray-400">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-white"><Mountain className="w-5 h-5" /> BERGVAULT</div>
              <p>Exclusive Swiss marketplace.</p>
              <p>© 2024 Bergvault AG</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">PLATFORM</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setShowPartnerModal(true)}>Sell with us</button></li>
                <li><button onClick={() => setView('tracking')}>Order Status</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">LEGAL</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setView('terms')}>Terms of Service</button></li>
                <li><button onClick={() => setView('privacy')}>Privacy Policy</button></li>
              </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-4">CONTACT</h4>
               <ul className="space-y-2"><li>{CONFIG.email}</li><li>Zürich, CH</li></ul>
            </div>
         </div>
      </footer>

      {selectedProduct && <CheckoutModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      {showPartnerModal && <PartnerModal onClose={() => setShowPartnerModal(false)} />}
    </div>
  );
};

export default BergvaultSite;
