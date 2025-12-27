'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import { getTranslation } from '@/lib/translations';

export function Footer() {
  const { language } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-alpine-forest text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-playfair text-lg font-semibold mb-4">Alpine Essence</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Premium handmade natural soaps from the Swiss Alps, crafted with tradition and care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{getTranslation('footer.about', language)}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/about" className="hover:text-alpine-gold transition-colors">
                  {getTranslation('nav.about', language)}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-alpine-gold transition-colors">
                  {getTranslation('nav.shop', language)}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-alpine-gold transition-colors">
                  {getTranslation('nav.contact', language)}
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{getTranslation('footer.policies', language)}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/privacy" className="hover:text-alpine-gold transition-colors">
                  {getTranslation('footer.privacy', language)}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-alpine-gold transition-colors">
                  {getTranslation('footer.terms', language)}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-alpine-gold transition-colors">
                  {getTranslation('footer.shipping', language)}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-alpine-gold transition-colors">
                  {getTranslation('footer.returns', language)}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{getTranslation('footer.social', language)}</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-alpine-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-alpine-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-alpine-gold transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-300">
              &copy; {year} Alpine Essence. {getTranslation('footer.copyright', language)}.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-400">Made in Fribourg, Switzerland</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
