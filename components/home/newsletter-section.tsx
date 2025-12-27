'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('You are in the Alpine Club!', {
      style: { background: '#2C5530', color: '#fff' }
    });
    setEmail('');
  };

  return (
    <section className="py-32 bg-alpine-forest text-white overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <h2 className="font-playfair text-5xl font-bold mb-6 italic tracking-tight">Join our Mountain Club</h2>
        <p className="text-alpine-beige/70 mb-10 text-lg font-light max-w-xl mx-auto">
          Get exclusive access to limited mountain batches and skincare secrets.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto border border-white/20 p-1">
          <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email" 
            placeholder="alpine.soul@example.ch" 
            className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/30 px-6 py-4 flex-grow"
          />
          <button className="bg-white text-alpine-forest px-8 py-4 font-black uppercase text-xs tracking-tighter hover:bg-alpine-gold hover:text-white transition-all">
            Join Now
          </button>
        </form>
      </div>
    </section>
  );
}
