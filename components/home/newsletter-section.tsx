'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <section className="py-20 bg-alpine-forest text-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="font-playfair text-4xl font-bold mb-4 italic">Alpine Essence Club</h2>
        <p className="text-alpine-beige/90 mb-8">Natural care tips from Swiss forests to your inbox.</p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
          <Input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email" 
            placeholder="Your email" 
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Button className="bg-alpine-gold hover:bg-white text-alpine-forest font-bold transition-colors">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
