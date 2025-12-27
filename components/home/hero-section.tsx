import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-alpine-beige">
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.pexels.com/photos/3621519/pexels-photo-3621519.jpeg"
          alt="Swiss Alpine Forest"
          fill
          priority // Критически важно для скорости загрузки (LCP)
          className="object-cover opacity-30 saturate-50"
          quality={85}
        />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <span className="text-alpine-gold font-bold tracking-[0.4em] uppercase text-sm mb-4 block animate-fade-in">Established in Fribourg</span>
        <h1 className="font-playfair text-7xl md:text-9xl font-extrabold text-alpine-forest mb-8 leading-[0.85] tracking-tight">
          Pure.<br/>Organic.<br/>Alpine.
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link 
            href="/shop" 
            className="bg-alpine-forest hover:bg-alpine-forest-dark text-white px-12 py-5 rounded-none text-sm uppercase font-black tracking-widest transition-all duration-300"
          >
            Buy Soap Now
          </Link>
        </div>
      </div>
    </section>
  );
}
