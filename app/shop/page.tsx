'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { useLanguage } from '@/components/providers/language-provider';
import { getTranslation } from '@/lib/translations';
import { getProducts } from '@/lib/supabase';
import { ChevronDown, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  featured: boolean;
  skin_types?: string[];
  scents?: string[];
  created_at: string;
  images: Array<{ image_url: string }>;
  translation: { description: string };
}

export default function Shop() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    skinTypes: [] as string[],
    scents: [] as string[],
    priceRange: [0, 100] as [number, number],
  });

  const [sortBy, setSortBy] = useState('featured');
  const [expandedFilters, setExpandedFilters] = useState({
    skinTypes: true,
    scents: true,
    price: true,
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts(language);
        setProducts(data);
        applyFilters(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [language]);

  const applyFilters = (productsToFilter: Product[] = products) => {
    let result = [...productsToFilter];

    // Apply filters
    if (filters.skinTypes.length > 0) {
      result = result.filter((p) =>
        filters.skinTypes.some((st) => p.skin_types?.includes(st) ?? false)
      );
    }

    if (filters.scents.length > 0) {
      result = result.filter((p) =>
        filters.scents.some((s) => p.scents?.includes(s) ?? false)
      );
    }

    result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(result);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, sortBy]);

  const skinTypes = ['all', 'sensitive', 'dry', 'oily', 'normal'];
  const scents = ['cedarwood', 'lavender', 'eucalyptus', 'rose', 'mint', 'honey'];

  const toggleFilter = (filterType: 'skinTypes' | 'scents', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((v) => v !== value)
        : [...prev[filterType], value],
    }));
  };

  const clearFilters = () => {
    setFilters({ skinTypes: [], scents: [], priceRange: [0, 100] });
  };

  const hasActiveFilters = filters.skinTypes.length > 0 || filters.scents.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-alpine-beige/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="font-playfair text-4xl font-bold text-alpine-forest mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {getTranslation('shop.title', language)}
          </motion.h1>
          <p className="text-gray-600">{filteredProducts.length} products</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-playfair text-lg font-bold text-alpine-forest">
                  {getTranslation('shop.filters', language)}
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-medium text-alpine-forest hover:text-alpine-forest-dark"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Skin Type Filter */}
              <div className="mb-6 border-b pb-6">
                <button
                  onClick={() => setExpandedFilters((p) => ({ ...p, skinTypes: !p.skinTypes }))}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <span className="font-semibold text-gray-900">{getTranslation('shop.skin_type', language)}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${expandedFilters.skinTypes ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFilters.skinTypes && (
                  <div className="space-y-2">
                    {skinTypes.map((st) => (
                      <label key={st} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.skinTypes.includes(st)}
                          onChange={() => toggleFilter('skinTypes', st)}
                          className="w-4 h-4 rounded border-gray-300 text-alpine-forest"
                        />
                        <span className="text-sm text-gray-700 capitalize">{st}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Scent Filter */}
              <div className="mb-6 border-b pb-6">
                <button
                  onClick={() => setExpandedFilters((p) => ({ ...p, scents: !p.scents }))}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <span className="font-semibold text-gray-900">{getTranslation('shop.scent', language)}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${expandedFilters.scents ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFilters.scents && (
                  <div className="space-y-2">
                    {scents.map((scent) => (
                      <label key={scent} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.scents.includes(scent)}
                          onChange={() => toggleFilter('scents', scent)}
                          className="w-4 h-4 rounded border-gray-300 text-alpine-forest"
                        />
                        <span className="text-sm text-gray-700 capitalize">{scent}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div>
                <button
                  onClick={() => setExpandedFilters((p) => ({ ...p, price: !p.price }))}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <span className="font-semibold text-gray-900">{getTranslation('shop.price', language)}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${expandedFilters.price ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFilters.price && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CHF {filters.priceRange[0]}</span>
                      <span className="text-sm text-gray-600">CHF {filters.priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        setFilters((p) => ({
                          ...p,
                          priceRange: [parseInt(e.target.value), p.priceRange[1]],
                        }))
                      }
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters((p) => ({
                          ...p,
                          priceRange: [p.priceRange[0], parseInt(e.target.value)],
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} {getTranslation('shop.products', language)}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-alpine-forest"
              >
                <option value="featured">{getTranslation('shop.sort.featured', language)}</option>
                <option value="price_low">{getTranslation('shop.sort.price_low', language)}</option>
                <option value="price_high">{getTranslation('shop.sort.price_high', language)}</option>
                <option value="newest">{getTranslation('shop.sort.newest', language)}</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No products found matching your filters</p>
                <Button onClick={clearFilters} className="bg-alpine-forest hover:bg-alpine-forest-dark text-white">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      image={product.images[0]?.image_url || ''}
                      description={product.translation?.description}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
