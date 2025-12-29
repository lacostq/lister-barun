// src/data.js

// 1. CONFIGURATION
export const CONFIG = {
    siteName: 'BERGVAULT',
    domain: 'bergvault.ch',
    email: 'legal@bergvault.ch',
    platformFeePercent: 15,
    mountainHeight: '4,478M',
    reservationMinutes: 15
  };
  
  // 2. STYLING THEMES
  export const TIER_STYLES = {
    legendary: { gradient: 'from-yellow-500 to-orange-500', border: 'border-yellow-500/50', shadow: 'shadow-yellow-500/30', text: 'text-yellow-300' },
    rare: { gradient: 'from-purple-500 to-pink-500', border: 'border-purple-500/50', shadow: 'shadow-purple-500/30', text: 'text-purple-300' },
    premium: { gradient: 'from-blue-500 to-cyan-500', border: 'border-blue-500/50', shadow: 'shadow-blue-500/30', text: 'text-blue-300' },
    artisan: { gradient: 'from-green-500 to-emerald-500', border: 'border-green-500/50', shadow: 'shadow-green-500/30', text: 'text-green-300' }
  };
  
  // 3. MOCK DATABASE (Orders & Sellers)
  export const MOCK_DB = {
    orders: [
      { id: 'BV-7782-X', customer: 'Alex Frei', amount: 899, status: 'shipped', date: '2023-10-15', items: 'Jungfrau Fluorite', tracking: 'CH-88219922' },
      { id: 'BV-9921-Z', customer: 'Sarah Miller', amount: 45, status: 'processing', date: '2023-10-16', items: 'Ceramic Mug', tracking: null },
    ],
    sellers: [
      { id: 1, name: 'Holzkunst Zermatt', sales: 12400, status: 'verified', joinDate: '2023-01-20' },
      { id: 2, name: 'Swiss Mineral Co.', sales: 4500, status: 'pending', joinDate: '2023-10-12' },
    ]
  };
  
  // 4. PRODUCTS DATA
  export const PRODUCTS = {
    level1: [
      { id: 1, tier: 'legendary', title: 'Jungfrau Fluorite', subtitle: 'Glows in darkness', price: 899, originalPrice: 1299, stock: 1, location: 'Jungfrau Summit, 4,158m', emoji: '🔮', seller: 'Dr. Heinrich Weber', sellerType: 'Licensed Geologist' },
      { id: 2, tier: 'rare', title: 'Matterhorn Amethyst', subtitle: 'Deep purple crystal', price: 149, originalPrice: 249, stock: 8, location: 'Matterhorn Ridge, 3,800m', emoji: '💜', seller: 'Alpine Geology Lab', sellerType: 'Certified Lab' },
      { id: 3, tier: 'rare', title: 'Alpine Quartz', subtitle: 'Clear crystal', price: 39, originalPrice: 59, stock: 47, location: 'Zermatt Valley, 3,200m', emoji: '💎', seller: 'Swiss Mineral Co.', sellerType: 'Licensed Dealer' }
    ],
    level2: [
      { id: 11, tier: 'premium', title: 'Berner Alpkäse 170g', subtitle: 'Alpine cow cheese', price: 21, stock: 23, location: 'Berner Oberland, 2,400m', emoji: '🧀', seller: 'Alp Käserei Bern', sellerType: 'Certified Dairy' },
      { id: 14, tier: 'premium', title: 'Emmentaler Reserve', subtitle: 'Aged swiss cheese', price: 89, stock: 9, location: 'Emmental Valley, 1,800m', emoji: '🧀', seller: 'Emmentaler Tradition AG', sellerType: 'Master Cheesemaker' },
      { id: 15, tier: 'premium', title: 'Swiss Dark Chocolate', subtitle: 'Mountain chocolate', price: 19, stock: 45, location: 'Graubünden, 1,600m', emoji: '🍫', seller: 'Chocolaterie Alpina', sellerType: 'Artisan Chocolatier' },
      { id: 16, tier: 'premium', title: 'Alpine Honey Raw', subtitle: 'Wild mountain flower', price: 29, stock: 31, location: 'Valais Alps, 2,100m', emoji: '🍯', seller: 'Bergimker Valais', sellerType: 'Alpine Beekeeper' }
    ],
    level3: [
      { id: 21, tier: 'artisan', title: 'Carved Matterhorn', subtitle: 'Hand-carved wood', price: 79, stock: 5, location: 'Zermatt Workshop', emoji: '🗻', seller: 'Holzkunst Zermatt', sellerType: 'Master Woodcarver' },
      { id: 23, tier: 'artisan', title: 'Vintage Cowbell', subtitle: 'Authentic bronze', price: 149, stock: 7, location: 'Bern Antique', emoji: '🔔', seller: 'Antiquitäten Bern', sellerType: 'Antique Dealer' },
      { id: 26, tier: 'artisan', title: 'Mini Cuckoo Clock', subtitle: 'Swiss clockwork', price: 189, stock: 6, location: 'Basel Workshop', emoji: '🕰️', seller: 'Uhrmacher Basel', sellerType: 'Clockmaker' }
    ]
  };
