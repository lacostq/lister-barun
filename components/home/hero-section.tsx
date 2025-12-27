import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Улучшенная картинка Альп */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.pexels.com/photos/3621519/pexels-photo-3621519.jpeg"
          alt="Swiss Alps Nature"
          fill
          priority
          className="object-cover opacity-60 saturate-50" // Сделали более видимой (60%)
          quality={100}
        />
        {/* Градиент снизу вверх, чтобы плавно переходил в белый цвет */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <span className="text-alpine-gold font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-6 block animate-fade-in">
          Established in Fribourg • Handmade
        </span>
        <h1 className="font-playfair text-6xl md:text-9xl font-black text-alpine-forest mb-10 leading-[0.85] tracking-tight">
          Pure.<br/>Organic.<br/>Alpine.
        </h1>
        <Link 
          href="/shop" 
          className="inline-block bg-alpine-forest hover:bg-alpine-forest-dark text-white px-12 py-5 rounded-none text-xs uppercase font-black tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
}
