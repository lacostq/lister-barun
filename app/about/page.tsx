'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/components/providers/language-provider';
import { getTranslation } from '@/lib/translations';
import { Leaf, Globe, Recycle, Heart } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  const { language } = useLanguage();

  const values = [
    {
      icon: Leaf,
      title: 'Pure & Organic',
      description: 'All ingredients are certified organic and ethically sourced from sustainable suppliers.',
    },
    {
      icon: Globe,
      title: 'Swiss Heritage',
      description: 'Handcrafted in Fribourg using traditional Swiss soap-making methods passed down through generations.',
    },
    {
      icon: Recycle,
      title: 'Eco-Conscious',
      description: 'Zero waste packaging and sustainable practices that respect our planet and its resources.',
    },
    {
      icon: Heart,
      title: 'Cruelty-Free',
      description: 'No animal testing ever. We believe in ethical production that respects all living beings.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden bg-gradient-to-b from-alpine-beige to-white">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3621519/pexels-photo-3621519.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <motion.h1
            className="font-playfair text-5xl font-bold text-alpine-forest mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Made in Fribourg, Switzerland
          </motion.h1>
          <motion.p
            className="text-xl text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Premium handmade natural soaps crafted with passion and tradition
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Alpine Essence story"
                className="rounded-lg shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-playfair text-4xl font-bold text-alpine-forest mb-6">Our Story</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Alpine Essence was born from a passion for natural wellness and a deep respect for the Alpine
                environment. Founded in the heart of Fribourg, Switzerland, we've dedicated ourselves to crafting
                premium handmade soaps using only the finest organic ingredients.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Each bar is carefully handcrafted using traditional Swiss methods, passed down through generations of
                artisans. We believe that luxury should be natural, ethical, and kind to our planet.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Today, Alpine Essence soaps are enjoyed by wellness enthusiasts across the world who share our
                commitment to purity, sustainability, and timeless craftsmanship.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-4xl font-bold text-alpine-forest mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're committed to principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow border-0 bg-white">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-alpine-forest mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-playfair text-xl font-semibold text-alpine-forest mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-alpine-forest text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-4xl font-bold mb-4">Experience the Difference</h2>
            <p className="text-xl text-alpine-beige/90 mb-8">
              Discover our collection of premium handmade natural soaps
            </p>
            <Button
              asChild
              className="bg-alpine-gold hover:bg-alpine-gold-dark text-alpine-forest font-semibold px-8 py-6 text-lg"
            >
              <Link href="/shop">Shop Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
