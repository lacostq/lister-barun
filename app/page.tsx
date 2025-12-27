'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ProductCard } from '@/components/products/product-card';
import { useLanguage } from '@/components/providers/language-provider';
import { getTranslation } from '@/lib/translations';
import { getFeaturedProducts, subscribeToNewsletter } from '@/lib/supabase';
import { Leaf, Globe, Recycle, Heart } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: Array<{ image_url: string }>;
  translation: { description: string };
}

export default function Home() {
  const { language } = useLanguage();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const products = await getFeaturedProducts(language);
        setFeatured(products);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, [language]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(getTranslation('message.subscribe_error', language));
      return;
    }

    setSubscribing(true);
    try {
      await subscribeToNewsletter(email, language);
      toast.success(getTranslation('message.subscribe_success', language));
      setEmail('');
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('This email is already subscribed');
      } else {
        toast.error(getTranslation('message.subscribe_error', language));
      }
    } finally {
      setSubscribing(false);
    }
  };

  const valueProps = [
    {
      icon: Leaf,
      title: getTranslation('home.value.organic', language),
      description: getTranslation('home.value.organic.desc', language),
    },
    {
      icon: Globe,
      title: getTranslation('home.value.swiss', language),
      description: getTranslation('home.value.swiss.desc', language),
    },
    {
      icon: Recycle,
      title: getTranslation('home.value.zero_waste', language),
      description: getTranslation('home.value.zero_waste.desc', language),
    },
    {
      icon: Heart,
      title: getTranslation('home.value.cruelty_free', language),
      description: getTranslation('home.value.cruelty_free.desc', language),
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-alpine-beige/50 to-white">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3621519/pexels-photo-3621519.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-alpine-forest mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {getTranslation('home.hero.headline', language)}
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {getTranslation('home.hero.subheadline', language)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-alpine-forest hover:bg-alpine-forest-dark text-white px-8 py-6 text-lg"
            >
              <Link href="/shop">{getTranslation('home.hero.cta', language)}</Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-alpine-forest opacity-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Value Props Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-0 bg-alpine-beige/30">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-alpine-forest mb-4">
                    <prop.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-alpine-forest mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{prop.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-4xl font-bold text-alpine-forest mb-4">
              {getTranslation('home.featured', language)}
            </h2>
            <div className="w-16 h-1 bg-alpine-gold mx-auto"></div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
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

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-alpine-forest text-alpine-forest hover:bg-alpine-forest hover:text-white"
            >
              <Link href="/shop">{getTranslation('nav.shop', language)}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              className="h-96 lg:h-full rounded-lg overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Soap making process"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-playfair text-4xl font-bold text-alpine-forest mb-6">
                {getTranslation('home.process', language)}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {getTranslation('home.process.desc', language)}
              </p>
              <Button
                asChild
                className="bg-alpine-forest hover:bg-alpine-forest-dark text-white"
              >
                <Link href="/about">{getTranslation('nav.about', language)}</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-alpine-forest text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-4xl font-bold mb-4">
              {getTranslation('home.newsletter', language)}
            </h2>
            <p className="text-lg text-alpine-beige/90 mb-8">
              {getTranslation('home.newsletter.desc', language)}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder={getTranslation('home.newsletter.placeholder', language)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/90 border-0 placeholder:text-gray-500"
                disabled={subscribing}
              />
              <Button
                type="submit"
                className="bg-alpine-gold hover:bg-alpine-gold-dark text-alpine-forest font-semibold whitespace-nowrap"
                disabled={subscribing}
              >
                {subscribing ? 'Subscribing...' : getTranslation('home.newsletter.subscribe', language)}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
