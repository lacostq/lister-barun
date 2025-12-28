// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, MapPin, Zap, Mountain, ChevronDown, Timer, Mail, Shield, Award, Star } from 'lucide-react';
import * as THREE from 'three';

// --- Procedural Matterhorn Generation ---
const createMatterhornGeometry = () => {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];
  
  const height = 4;
  const baseSize = 2.5;
  
  // Peak
  vertices.push(0, height, 0); 
  const peakIndex = 0;
  
  const ridges = 4;
  const layers = 32;
  
  for (let r = 0; r < ridges; r++) {
    const angleOffset = (r / ridges) * Math.PI * 2;
    for (let layer = 0; layer < layers; layer++) {
      const t = layer / (layers - 1);
      const y = height * (1 - t);
      const radius = baseSize * t * (0.8 + Math.random() * 0.2);
      
      const noiseX = (Math.random() - 0.5) * 0.3 * t;
      const noiseZ = (Math.random() - 0.5) * 0.3 * t;
      
      const x = Math.cos(angleOffset) * radius + noiseX;
      const z = Math.sin(angleOffset) * radius + noiseZ;
      
      vertices.push(x, y, z);
    }
  }
  
  // Base circle to close shape somewhat
  const baseSegmentsCount = 64;
  for (let i = 0; i < baseSegmentsCount; i++) {
    const angle = (i / baseSegmentsCount) * Math.PI * 2;
    const x = Math.cos(angle) * baseSize;
    const z = Math.sin(angle) * baseSize;
    vertices.push(x, 0, z);
  }
  
  // Faces construction
  const totalVertices = vertices.length / 3;
  const numPerimeterVertices = totalVertices - 1;

  for (let i = 0; i < numPerimeterVertices; i++) {
    const v1 = peakIndex + 1 + i;
    const v2 = peakIndex + 1 + ((i + 1) % numPerimeterVertices);
    indices.push(peakIndex, v1, v2);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  return geometry;
};

// --- WebGL Scene ---
const useThreeScene = (canvasRef, scrollProgress, crackStage) => {
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    // Basic Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 5, 20);
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Mountain
    const mountainGeometry = createMatterhornGeometry();
    
    // Texture creation (Gradient)
    const canvas2d = document.createElement('canvas');
    canvas2d.width = 256;
    canvas2d.height = 256;
    const ctx = canvas2d.getContext('2d');
    if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#e8f0f8');
        gradient.addColorStop(0.6, '#8899aa');
        gradient.addColorStop(1, '#556677');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
    }
    
    const texture = new THREE.CanvasTexture(canvas2d);
    
    const mountainMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0.1,
      emissive: 0x2255aa,
      emissiveIntensity: 0
    });
    
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.y = -1;
    scene.add(mountain);
    
    // Particles System (Ice cracks)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    const velocities = [];
    
    for (let i = 0; i < particlesCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 4 - 1;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      });
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xaaccff,
      size: 0.08,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Stars Background
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 3000;
    const starsPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      starsPositions[i] = (Math.random() - 0.5) * 200;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x4466aa, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 8, 3);
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0x6688ff, 0.8, 20);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);
    
    camera.position.set(0, 1, 10);
    
    // Animation Loop
    let time = 0;
    let animationId;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;
      
      const targetZ = 10 - scrollProgress * 8;
      const targetY = 1 + scrollProgress * 2;
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 1, 0);
      
      mountain.rotation.y = Math.sin(time * 0.1) * 0.05;
      
      if (crackStage > 0) {
        const distort = crackStage * 0.4;
        mountain.scale.set(1 + distort * 0.5, 1 - distort * 0.3, 1 + distort * 0.5);
        mountainMaterial.emissiveIntensity = crackStage * 0.4;
        
        if (crackStage > 0.3) {
          particlesMaterial.opacity = Math.min((crackStage - 0.3) * 1.5, 0.8);
          particles.rotation.y += 0.015;
          const pos = particles.geometry.attributes.position.array;
          for (let i = 0; i < particlesCount; i++) {
            pos[i * 3] += velocities[i].x * crackStage * 2;
            pos[i * 3 + 1] += velocities[i].y * crackStage * 2;
            pos[i * 3 + 2] += velocities[i].z * crackStage * 2;
          }
          particles.geometry.attributes.position.needsUpdate = true;
        }
      }
      
      stars.rotation.y += 0.0003;
      stars.rotation.x = Math.sin(time * 0.2) * 0.1;
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      // Clean up three.js to avoid memory leaks
      renderer.dispose();
      mountainGeometry.dispose();
      mountainMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      texture.dispose();
    };
  }, [scrollProgress, crackStage]);
};

// --- DATA ---
const PRODUCTS = {
  level1: [
    { id: 1, tier: 'legendary', title: 'Jungfrau Fluorite', subtitle: 'Glows in darkness', price: 899, originalPrice: 1299, stock: 1, location: 'Jungfrau Summit, 4,158m', emoji: '🔮', description: 'Rare fluorite crystal' },
    { id: 2, tier: 'rare', title: 'Matterhorn Amethyst', subtitle: 'Deep purple crystal', price: 149, originalPrice: 249, stock: 8, location: 'Matterhorn Ridge, 3,800m', emoji: '💜', description: 'Alpine amethyst' },
    { id: 3, tier: 'rare', title: 'Alpine Quartz', subtitle: 'Clear mountain crystal', price: 39, originalPrice: 59, stock: 47, location: 'Zermatt Valley, 3,200m', emoji: '💎', description: 'Pure quartz' }
  ],
  level2: [
    { id: 11, tier: 'premium', title: 'Berner Alpkäse 170g', subtitle: 'Alpine cow cheese', price: 21, stock: 23, location: 'Berner Oberland, 2,400m', emoji: '🧀', description: 'Traditional alpine cheese' },
    { id: 12, tier: 'premium', title: 'Berner Alpkäse 320g', subtitle: 'Alpine cow cheese', price: 40, stock: 18, location: 'Berner Oberland, 2,400m', emoji: '🧀', description: 'Premium aged cheese' },
    { id: 13, tier: 'premium', title: 'Emmentaler Reserve', subtitle: 'Aged 24 months', price: 89, stock: 9, location: 'Emmental Valley, 1,800m', emoji: '🧀', description: 'Reserved quality' },
    { id: 14, tier: 'premium', title: 'Swiss Dark Chocolate', subtitle: '85% Artisan blend', price: 19, stock: 45, location: 'Graubünden, 1,600m', emoji: '🍫', description: 'Pure alpine cocoa' },
    { id: 15, tier: 'premium', title: 'Alpine Honey Raw', subtitle: 'Wild flower honey', price: 29, stock: 31, location: 'Valais Alps, 2,100m', emoji: '🍯', description: 'Raw honey' }
  ],
  level3: [
    { id: 21, tier: 'artisan', title: 'Matterhorn Miniature', subtitle: 'Hand-carved wood', price: 79, stock: 5, location: 'Zermatt Workshop', emoji: '🗻', description: 'Hand-carved wood' },
    { id: 22, tier: 'artisan', title: 'Vintage Cowbell', subtitle: 'Authentic bronze', price: 149, stock: 7, location: 'Bern Antique Market', emoji: '🔔', description: 'Traditional cowbell' },
    { id: 23, tier: 'artisan', title: 'Ceramic Mug', subtitle: 'Alpine pottery', price: 45, stock: 14, location: 'Grindelwald Pottery', emoji: '☕', description: 'Handmade mug' },
    { id: 24, tier: 'artisan', title: 'Edelweiss Scarf', subtitle: 'Silk & wool blend', price: 59, stock: 11, location: 'Lucerne Textile', emoji: '🧣', description: 'Embroidered scarf' }
  ]
};

// --- COMPONENTS ---
const ProductCard = ({ product, onBuy, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const tierStyles = {
    legendary: 'from-yellow-500 to-orange-500 border-yellow-500',
    rare: 'from-purple-500 to-pink-500 border-purple-500',
    premium: 'from-blue-500 to-cyan-500 border-blue-500',
    artisan: 'from-green-500 to-emerald-500 border-green-500'
  };
  
  const style = tierStyles[product.tier] || tierStyles.premium;
  
  return (
    <div
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border-2 border-slate-700 hover:border-opacity-100 transition-all duration-500 hover:scale-105 group"
      style={{ 
        borderColor: isHovered ? '' : 'transparent',
        animation: `slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${style} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r ${style} text-white text-xs font-bold shadow-lg z-10`}>
        {product.tier.toUpperCase()}
      </div>
      <div className="relative p-6 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center mb-4">
          <div className="text-7xl group-hover:scale-110 transition-transform duration-500">
            {product.emoji}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{product.title}</h3>
          <p className="text-blue-300 text-sm">{product.subtitle}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>
          
           {product.stock <= 10 && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-2 py-1 w-max">
              <Zap className="w-3 h-3 text-red-400" />
              <span className="text-red-400 text-xs font-semibold">Only {product.stock} left</span>
            </div>
          )}
          
          <div className="flex items-baseline justify-between pt-2">
            <div>
              {product.originalPrice && <span className="text-gray-500 line-through text-sm block">{product.originalPrice} CHF</span>}
              <span className="text-2xl font-bold text-white">{product.price} CHF</span>
            </div>
          </div>
          <button onClick={() => onBuy(product)} className={`w-full bg-gradient-to-r ${style} text-white font-bold py-3 rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2 mt-3`}>
            <ShoppingCart className="w-4 h-4" /> <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', country: '' });
  const [timer, setTimer] = useState(15 * 60);

  useEffect(() => {
    if (!product) return;
    const interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, [product]);

  if (!product) return null;
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-lg w-full p-8 border-2 border-blue-500/30 shadow-2xl relative" onClick={e => e.stopPropagation()} style={{ animation: 'scaleIn 0.3s' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse rounded-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-3xl font-bold text-white mb-2">{product.title}</h3>
                <p className="text-blue-300 text-sm">{product.location}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">×</button>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6 text-center">
             <div className="text-yellow-300 font-bold text-2xl flex justify-center items-center gap-2">
                 <Timer className="w-5 h-5" /> {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
             </div>
             <p className="text-gray-400 text-xs">Reserved for you</p>
          </div>
          <div className="space-y-4 mb-6 text-black">
            <input className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-600 text-white" placeholder="Name" />
            <input className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-600 text-white" placeholder="Email" />
            <button className="w-full bg-blue-600 text-white font-bold py-5 rounded-xl hover:scale-105 transition shadow-lg shadow-blue-500/50">
                Pay with Stripe ({product.price} CHF)
            </button>
          </div>
          <div className="flex justify-center gap-6 text-gray-500 text-xs">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3"/> SSL Secured</span>
              <span className="flex items-center gap-1"><Lock className="w-3 h-3"/> Safe Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function BergvaultPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [crackStage, setCrackStage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);
      if (progress > 0.1) setCrackStage(Math.min((progress - 0.1) / 0.5, 1));
      else setCrackStage(0);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useThreeScene(canvasRef, scrollProgress, crackStage);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <style>{`
        @keyframes slideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .reveal-on-scroll { transition: opacity 1s, transform 1s; }
      `}</style>
      
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      
      <div className="relative z-10">
        {/* HERO */}
        <section className="h-screen flex items-center justify-center px-4">
          <div className="text-center">
             <div className="flex items-center justify-center gap-2 mb-4 text-blue-400 text-sm"><Mountain className="w-5 h-5"/> MATT.4478</div>
             <h1 className="text-7xl md:text-9xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">BERGVAULT</h1>
             <p className="text-gray-400 text-xl md:text-2xl mb-12 font-light">Treasures from the Peak to the Valley</p>
             <div className="animate-bounce"><ChevronDown className="w-10 h-10 text-blue-400 mx-auto"/></div>
          </div>
        </section>
        
        <div className="h-screen"></div>

        {/* PRODUCTS GRID 1 (Peak) */}
        <section className="min-h-screen py-20 px-4">
           <div className="max-w-7xl mx-auto text-center" style={{ opacity: crackStage > 0.2 ? 1 : 0, transition: 'opacity 1s' }}>
             <div className="inline-block px-4 py-1 border border-yellow-500/30 rounded-full mb-4 text-yellow-300 text-sm">SUMMIT · 4,478M</div>
             <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">FROZEN VAULT</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16"
                  style={{ transform: `translateY(${crackStage > 0.3 ? 0 : 50}px)`, transition: 'all 1s' }}>
               {PRODUCTS.level1.map((p, i) => <ProductCard key={p.id} product={p} onBuy={setSelectedProduct} delay={i*0.1} />)}
             </div>
           </div>
        </section>

        {/* PRODUCTS GRID 2 (Meadow) */}
        <section className="min-h-screen py-20 px-4 relative">
           <div className="max-w-7xl mx-auto text-center" style={{ opacity: scrollProgress > 0.4 ? 1 : 0, transition: 'opacity 1s' }}>
             <div className="inline-block px-4 py-1 border border-green-500/30 rounded-full mb-4 text-green-300 text-sm">ALPINE PASTURES · 2,200M</div>
             <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">GOLDEN MEADOW</h2>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left mt-16">
               {PRODUCTS.level2.map((p, i) => <ProductCard key={p.id} product={p} onBuy={setSelectedProduct} delay={i*0.1} />)}
             </div>
           </div>
        </section>

        {/* PRODUCTS GRID 3 (Valley) */}
        <section className="min-h-screen py-20 px-4 relative">
           <div className="max-w-7xl mx-auto text-center" style={{ opacity: scrollProgress > 0.7 ? 1 : 0, transition: 'opacity 1s' }}>
             <div className="inline-block px-4 py-1 border border-amber-500/30 rounded-full mb-4 text-amber-300 text-sm">VALLEY · 1,600M</div>
             <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">ARTISAN WORKSHOP</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16 pb-40">
               {PRODUCTS.level3.map((p, i) => <ProductCard key={p.id} product={p} onBuy={setSelectedProduct} delay={i*0.1} />)}
             </div>
           </div>
        </section>

        {/* FOOTER */}
        <footer className="py-20 text-center bg-gradient-to-t from-slate-900 to-transparent">
          <div className="flex justify-center items-center gap-4 mb-8">
               <div className="h-px bg-slate-700 w-24"></div>
               <Mountain className="w-8 h-8 text-blue-500" />
               <div className="h-px bg-slate-700 w-24"></div>
          </div>
          <h3 className="text-3xl font-bold tracking-wider mb-8">BERGVAULT</h3>
          <a href="mailto:bergvault@bro.ch" className="flex items-center justify-center gap-2 text-blue-400 mb-8 hover:text-white transition"><Mail className="w-4 h-4"/> bergvault@bro.ch</a>
          <p className="text-gray-500 text-sm">© 2025 Made in Switzerland · Lister-Barun Protocol</p>
        </footer>
      </div>

      {selectedProduct && <CheckoutModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}
