"use client"; // Важно: Эта директива указывает Next.js, что компонент работает на клиенте.

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, MapPin, Award, Shield, Star, Zap, Mountain, ChevronDown, Lock, Timer, Mail } from 'lucide-react';
import * as THREE from 'three';

// Procedural Matterhorn generation
const createMatterhornGeometry = () => {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];

  // Matterhorn proportions: 4,478m height, ~3km base. 
  // Scaled down for visualization (e.g., height 4 units, base 2.5 units).
  const height = 4;
  const baseSize = 2.5;
  const segments = 64; // More segments -> smoother base circle

  // Peak of the mountain (vertex at the top)
  vertices.push(0, height, 0); 
  const peakIndex = 0; // Index for the peak

  // Four main ridges of Matterhorn
  const ridges = 4;
  // Layers of points going down each ridge, creating the main shape
  const layers = 32; 

  // Generate points for the ridges (sides of the mountain)
  for (let r = 0; r < ridges; r++) {
    const angleOffset = (r / ridges) * Math.PI * 2; // Angle for each ridge
    
    for (let layer = 0; layer < layers; layer++) {
      const t = layer / (layers - 1); // Progress from top to bottom (0 to 1)
      const y = height * (1 - t);    // Y position decreases from height to 0
      
      // Radius increases with t (gets wider at base). Added noise for irregularity.
      const radius = baseSize * t * (0.8 + Math.random() * 0.2); 
      
      // Add small random noise to make the surface look more "rocky"
      const noiseX = (Math.random() - 0.5) * 0.3 * t; 
      const noiseZ = (Math.random() - 0.5) * 0.3 * t; 
      
      const x = Math.cos(angleOffset) * radius + noiseX;
      const z = Math.sin(angleOffset) * radius + noiseZ;
      
      vertices.push(x, y, z);
    }
  }
  
  // Generate points for the circular base of the mountain
  // These points help define the mountain's footprint.
  const baseSegmentsCount = 64; // Number of points around the base circle
  const baseVerticesStartIdx = vertices.length / 3; // Index where base points start
  for (let i = 0; i < baseSegmentsCount; i++) {
    const angle = (i / baseSegmentsCount) * Math.PI * 2;
    const x = Math.cos(angle) * baseSize;
    const z = Math.sin(angle) * baseSize;
    vertices.push(x, 0, z); // Y position is 0 for base
  }
  
  // --- Create faces (triangles) ---
  // This approach connects the peak to all other points forming a simple "cone-like" structure.
  // It's a simplification as noted in the original code, but creates a basic solid mesh.
  
  const totalVertices = vertices.length / 3;
  const numPerimeterVertices = totalVertices - 1; // All vertices except the peak (index 0)

  for (let i = 0; i < numPerimeterVertices; i++) {
    const v1 = peakIndex + 1 + i; // Current vertex from 1 to numPerimeterVertices
    const v2 = peakIndex + 1 + ((i + 1) % numPerimeterVertices); // Next vertex, wrapping around

    // Each face connects the peak (0), the current perimeter vertex (v1), and the next perimeter vertex (v2)
    indices.push(peakIndex, v1, v2);
  }
  
  // Set vertex positions and indices for the BufferGeometry
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals(); // Crucial for correct lighting
  
  return geometry;
};

// WebGL Scene management (THREE.js)
const useThreeScene = (canvasRef, scrollProgress, crackStage) => {
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    // Add fog to enhance depth effect
    scene.fog = new THREE.Fog(0x000000, 5, 20); 
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Renderer setup (alpha: true for transparent background, antialias for smooth edges)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Use device pixel ratio for sharper rendering
    
    // --- Matterhorn Mesh ---
    const mountainGeometry = createMatterhornGeometry();
    
    // Create a 2D canvas for gradient texture (snow on top, rock on bottom)
    const canvas2d = document.createElement('canvas');
    canvas2d.width = 256;
    canvas2d.height = 256;
    const ctx = canvas2d.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 256); // Vertical gradient
    gradient.addColorStop(0, '#ffffff');    // White (snow)
    gradient.addColorStop(0.3, '#e8f0f8'); // Light greyish blue
    gradient.addColorStop(0.6, '#8899aa'); // Mid-greyish rock
    gradient.addColorStop(1, '#556677');   // Dark greyish rock
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas2d); // Convert 2D canvas to THREE.js texture
    
    // Material for the mountain (MeshStandardMaterial supports realistic lighting)
    const mountainMaterial = new THREE.MeshStandardMaterial({
      map: texture,          // Apply the gradient texture
      roughness: 0.9,        // Make it look rough like rock
      metalness: 0.1,        // Slightly metallic (minimal)
      emissive: 0x2255aa,    // Emissive color for glowing effect
      emissiveIntensity: 0   // Initially no glow
    });
    
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.y = -1; // Move mountain down slightly to be centered
    scene.add(mountain);
    
    // --- Crack Particles ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    const velocities = []; // To store particle movement vectors
    
    // Initialize particle positions and random velocities
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
      color: 0xaaccff,    // Light blue color
      size: 0.08,         // Small points
      transparent: true,
      opacity: 0,         // Initially invisible
      blending: THREE.AdditiveBlending // Blends particles brightly
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // --- Stars ---
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 3000;
    const starsPositions = new Float32Array(starsCount * 3);
    
    // Random positions for stars in a large cube
    for (let i = 0; i < starsCount * 3; i++) {
      starsPositions[i] = (Math.random() - 0.5) * 200;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, // White stars
      size: 0.15,      // Small size
      transparent: true,
      opacity: 0.6     // Slightly transparent
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x4466aa, 0.5); // Soft blue ambient light
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Strong white directional light
    directionalLight.position.set(5, 8, 3);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x6688ff, 0.8, 20); // Blue point light near mountain
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);
    
    camera.position.set(0, 1, 10); // Initial camera position
    
    // --- Animation Loop ---
    let time = 0;
    let animationId; // To manage requestAnimationFrame
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;
      
      // Camera movement based on scroll progress (zooming in as user scrolls down)
      const targetZ = 10 - scrollProgress * 8; // Zoom closer (Z decreases)
      const targetY = 1 + scrollProgress * 2;  // Move camera up slightly
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 1, 0); // Always look at the mountain center
      
      // Mountain animation effects based on `crackStage` (simulates mountain "cracking")
      mountain.rotation.y = Math.sin(time * 0.1) * 0.05; // Gentle rotation
      
      if (crackStage > 0) {
        const distort = crackStage * 0.4;
        mountain.scale.set(1 + distort * 0.5, 1 - distort * 0.3, 1 + distort * 0.5); // Mountain distorts
        mountainMaterial.emissiveIntensity = crackStage * 0.4; // Emits light
        
        // Particles explode as crackStage increases
        if (crackStage > 0.3) {
          particlesMaterial.opacity = Math.min((crackStage - 0.3) * 1.5, 0.8); // Particles fade in
          particles.rotation.y += 0.015; // Particles rotate
          
          const positions = particles.geometry.attributes.position.array;
          for (let i = 0; i < particlesCount; i++) {
            positions[i * 3] += velocities[i].x * crackStage * 2; // Move particles based on velocity
            positions[i * 3 + 1] += velocities[i].y * crackStage * 2;
            positions[i * 3 + 2] += velocities[i].z * crackStage * 2;
          }
          particles.geometry.attributes.position.needsUpdate = true; // Tell THREE.js to update particle positions
        }
      }
      
      stars.rotation.y += 0.0003; // Slowly rotate stars
      stars.rotation.x = Math.sin(time * 0.2) * 0.1;
      
      renderer.render(scene, camera); // Render the scene
    };
    
    animate(); // Start animation
    
    // Handle window resize events
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      // Dispose of THREE.js resources to prevent memory leaks
      renderer.dispose();
      mountainGeometry.dispose();
      mountainMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      texture.dispose();
    };
  }, [scrollProgress, crackStage]); // Re-run effect if scrollProgress or crackStage changes
};

// Products data (your original data + suggested properties like 'tier')
const PRODUCTS = {
  level1: [
    { id: 1, tier: 'legendary', title: 'Jungfrau Fluorite', subtitle: 'Glows in darkness', price: 899, originalPrice: 1299, stock: 1, location: 'Jungfrau Summit, 4,158m', emoji: '🔮', description: 'Rare fluorite crystal from glacier zone' },
    { id: 2, tier: 'rare', title: 'Matterhorn Amethyst', subtitle: 'Deep purple crystal', price: 149, originalPrice: 249, stock: 8, location: 'Matterhorn Ridge, 3,800m', emoji: '💜', description: 'Alpine amethyst from ice caves' },
    { id: 3, tier: 'rare', title: 'Alpine Quartz', subtitle: 'Clear mountain crystal', price: 39, originalPrice: 59, stock: 47, location: 'Zermatt Valley, 3,200m', emoji: '💎', description: 'Pure quartz from high peaks' }
  ],
  level2: [
    { id: 11, tier: 'premium', title: 'Berner Alpkäse 170g', subtitle: 'Alpine cow cheese', price: 21, stock: 23, location: 'Berner Oberland, 2,400m', emoji: '🧀', description: 'Traditional alpine cheese from mountain pastures' },
    { id: 12, tier: 'premium', title: 'Berner Alpkäse 320g', subtitle: 'Alpine cow cheese', price: 40, stock: 18, location: 'Berner Oberland, 2,400m', emoji: '🧀', description: 'Premium aged mountain cheese' },
    { id: 13, tier: 'premium', title: 'Berner Alpkäse 530g', subtitle: 'Alpine cow cheese', price: 66, stock: 12, location: 'Berner Oberland, 2,400m', emoji: '🧀', description: 'Large format alpine cheese' },
    { id: 14, tier: 'premium', title: 'Emmentaler Reserve 24mo', subtitle: 'Aged swiss cheese', price: 89, stock: 9, location: 'Emmental Valley, 1,800m', emoji: '🧀', description: '24-month aged reserve cheese' },
    { id: 15, tier: 'premium', title: 'Swiss Dark Chocolate 85%', subtitle: 'Artisan mountain chocolate', price: 19, stock: 45, location: 'Graubünden, 1,600m', emoji: '🍫', description: 'Pure alpine cocoa blend' },
    { id: 16, tier: 'premium', title: 'Alpine Honey Raw', subtitle: 'Wild mountain flower', price: 29, stock: 31, location: 'Valais Alps, 2,100m', emoji: '🍯', description: 'Raw honey from alpine meadows' },
    { id: 17, tier: 'premium', title: 'Edelweiss Herbal Tea', subtitle: 'Mountain herb blend', price: 15, stock: 56, location: 'Bernese Alps, 2,300m', emoji: '🍵', description: 'Traditional alpine herbs' },
    { id: 18, tier: 'premium', title: 'Alpine Butter 250g', subtitle: 'Mountain cow butter', price: 12, stock: 38, location: 'Jungfrau Region, 2,000m', emoji: '🧈', description: 'Creamy alpine butter' }
  ],
  level3: [
    { id: 21, tier: 'artisan', title: 'Carved Matterhorn Miniature', subtitle: 'Hand-carved wood', price: 79, stock: 5, location: 'Zermatt Workshop', emoji: '🗻', description: 'Detailed Matterhorn sculpture' },
    { id: 22, tier: 'artisan', title: 'Watercolor Alpine Painting', subtitle: 'Original artwork', price: 299, stock: 3, location: 'Interlaken Studio', emoji: '🎨', description: 'Hand-painted mountain landscape' },
    { id: 23, tier: 'artisan', title: 'Vintage Swiss Cowbell', subtitle: 'Authentic bronze', price: 149, stock: 7, location: 'Bern Antique Market', emoji: '🔔', description: 'Traditional alpine cowbell' },
    { id: 24, tier: 'artisan', title: 'Hand-thrown Ceramic Mug', subtitle: 'Alpine pottery', price: 45, stock: 14, location: 'Grindelwald Pottery', emoji: '☕', description: 'Handmade mountain design mug' },
    { id: 25, tier: 'artisan', title: 'Embroidered Edelweiss Scarf', subtitle: 'Silk & wool blend', price: 59, stock: 11, location: 'Lucerne Textile', emoji: '🧣', description: 'Traditional edelweiss pattern' },
    { id: 26, tier: 'artisan', title: 'Wood Cuckoo Clock Mini', subtitle: 'Swiss clockwork', price: 189, stock: 6, location: 'Basel Clockmaker', emoji: '🕰️', description: 'Miniature Swiss cuckoo clock' }
  ]
};

// Product Card Component (Styling uses Tailwind CSS classes and dynamic gradients)
const ProductCard = ({ product, onBuy, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Define Tailwind gradient styles for different product tiers
  const tierStyles = {
    legendary: 'from-yellow-500 to-orange-500 border-yellow-500',
    rare: 'from-purple-500 to-pink-500 border-purple-500',
    premium: 'from-blue-500 to-cyan-500 border-blue-500',
    artisan: 'from-green-500 to-emerald-500 border-green-500'
  };
  
  const style = tierStyles[product.tier] || tierStyles.premium; // Default style if tier not found
  
  return (
    <div
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border-2 border-slate-700 hover:border-opacity-100 transition-all duration-500 hover:scale-105 group"
      style={{ 
        borderColor: isHovered ? '' : 'transparent', // Make border visible on hover
        animation: `slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both` // Slide-up animation with delay
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      {/* Tier label */}
      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r ${style} text-white text-xs font-bold shadow-lg z-10`}>
        {product.tier.toUpperCase()}
      </div>

      <div className="relative p-6 flex flex-col h-full">
        {/* Emoji / Product Icon */}
        <div className="flex-1 flex items-center justify-center mb-4">
          <div className="text-7xl group-hover:scale-110 transition-transform duration-500">
            {product.emoji}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{product.title}</h3>
          <p className="text-blue-300 text-sm">{product.subtitle}</p>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>

          {/* Low Stock Indicator */}
          {product.stock <= 10 && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-2 py-1">
              <Zap className="w-3 h-3 text-red-400" />
              <span className="text-red-400 text-xs font-semibold">Only {product.stock} left</span>
            </div>
          )}

          {/* Price and Discount */}
          <div className="flex items-baseline justify-between pt-2">
            <div>
              {product.originalPrice && (
                <span className="text-gray-500 line-through text-sm block">{product.originalPrice} CHF</span>
              )}
              <span className="text-2xl font-bold text-white">{product.price} CHF</span>
            </div>
            {product.originalPrice && (
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-bold">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Buy Button */}
          <button
            onClick={() => onBuy(product)} // Triggers checkout modal
            className={`w-full bg-gradient-to-r ${style} text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mt-3`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Checkout Modal Component
const CheckoutModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', country: '' });
  const [timer, setTimer] = useState(15 * 60); // 15 minutes reservation timer

  useEffect(() => {
    if (!product) return;
    // Start countdown timer
    const interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval); // Clear timer on unmount
  }, [product]);

  if (!product) return null; // Don't render if no product is selected

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl max-w-lg w-full p-8 border-2 border-blue-500/30 shadow-2xl relative" 
           onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
           style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}> {/* Modal entry animation */}
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse rounded-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">{product.title}</h3>
              <p className="text-blue-300 text-sm">{product.location}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">×</button>
          </div>

          {/* Reservation Timer */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-3 text-yellow-300">
              <Timer className="w-5 h-5" />
              <span className="text-2xl font-bold">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">Reserved for you</p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 mb-6">
            <input type="text" placeholder="Your name" className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input type="email" placeholder="Email" className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="text" placeholder="Country" className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
          </div>

          {/* Total Price */}
          <div className="flex items-baseline justify-between mb-6 pb-6 border-b border-slate-700">
            <span className="text-gray-400">Total:</span>
            <div className="flex items-baseline gap-3">
              {product.originalPrice && <span className="text-gray-500 line-through text-xl">{product.originalPrice} CHF</span>}
              <span className="text-4xl font-bold text-white">{product.price} CHF</span>
            </div>
          </div>

          {/* Pay Button */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50 text-lg">
            Pay with Stripe →
          </button>

          {/* Security & Payment info */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-400">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4" /><span>SSL Secured</span></div>
            <div className="flex items-center gap-2"><Lock className="w-4 h-4" /><span>Safe Payment</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component - Bergvault Website Layout and Logic
const BergvaultSite = () => {
  const [scrollProgress, setScrollProgress] = useState(0); // Tracks how far user has scrolled
  const [crackStage, setCrackStage] = useState(0);       // Controls mountain "cracking" animation
  const [selectedProduct, setSelectedProduct] = useState(null); // Stores product chosen for checkout
  const canvasRef = useRef(); // Ref for the THREE.js canvas

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY; // Current scroll position
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight; // Max scrollable height
      const progress = Math.min(scrolled / maxScroll, 1); // Normalize scroll progress to 0-1
      setScrollProgress(progress);
      
      // Trigger crack animation when scrolling past a certain point
      if (progress > 0.1) setCrackStage(Math.min((progress - 0.1) / 0.5, 1)); // Gradually increase crackStage
      else setCrackStage(0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount to set initial state
    return () => window.removeEventListener('scroll', handleScroll); // Clean up scroll listener
  }, []);

  // Hook to manage the THREE.js scene, passing scroll and crack data
  useThreeScene(canvasRef, scrollProgress, crackStage);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* CSS keyframe animations (can also be in global CSS or a dedicated styling file) */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* THREE.js Canvas fixed in the background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <div className="relative z-10"> {/* Content wrapper, above the canvas */}
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4 text-blue-400 text-sm">
              <Mountain className="w-5 h-5" />
              <span className="font-semibold tracking-widest">MATTERHORN · 4,478M</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                BERGVAULT
              </span>
            </h1>
            
            <p className="text-xl md:text-3xl text-gray-400 mb-12 font-light">
              Treasures from the Peak to the Valley
            </p>

            <div className="animate-bounce">
              <ChevronDown className="w-10 h-10 text-blue-400 mx-auto" />
            </div>
          </div>
        </section>

        <div className="h-screen"></div> {/* Spacer to allow scroll-based effects */}

        {/* Level 1: Peak - Crystals */}
        <section className="min-h-screen py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16" style={{ opacity: crackStage > 0.2 ? 1 : 0, transition: 'opacity 1s' }}>
              <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-6 py-2 mb-4">
                <span className="text-yellow-300 font-bold text-sm">SUMMIT · 4,478M</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text
                text-transparent">
                  FROZEN VAULT
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-blue-200 font-light max-w-2xl mx-auto">
                Rare crystalline formations harvested from the death zone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                 style={{ opacity: crackStage > 0.3 ? 1 : 0, transform: `translateY(${crackStage > 0.3 ? 0 : 50}px)`, transition: 'all 1s ease 0.2s' }}>
              {PRODUCTS.level1.map((product, idx) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onBuy={setSelectedProduct} // Pass function to set selected product for modal
                  delay={idx * 0.1} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* Level 2: Meadows - Dairy & Honey */}
        <section className="min-h-screen py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 opacity-0 reveal-on-scroll" style={{ opacity: scrollProgress > 0.4 ? 1 : 0, transition: 'opacity 1s' }}>
              <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-6 py-2 mb-4">
                <span className="text-green-300 font-bold text-sm">ALPINE PASTURES · 2,200M</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                THE GOLDEN MEADOW
              </h2>
              <p className="text-xl md:text-2xl text-green-100 font-light max-w-2xl mx-auto">
                Organic richness from grazing cattle on high-altitude flora.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                 style={{ opacity: scrollProgress > 0.4 ? 1 : 0, transform: `translateY(${scrollProgress > 0.4 ? 0 : 50}px)`, transition: 'all 1s ease 0.2s' }}>
              {PRODUCTS.level2.map((product, idx) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onBuy={setSelectedProduct}
                  delay={idx * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Level 3: Valley - Handmade */}
        <section className="min-h-screen py-20 px-4 relative pb-40">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16" style={{ opacity: scrollProgress > 0.7 ? 1 : 0, transition: 'opacity 1s' }}>
              <div className="inline-block bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-amber-500/30 rounded-full px-6 py-2 mb-4">
                <span className="text-amber-300 font-bold text-sm">VALLEY VILLAGE · 1,600M</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                ARTISAN'S WORKSHOP
              </h2>
              <p className="text-xl md:text-2xl text-orange-100 font-light max-w-2xl mx-auto">
                Timeless Swiss craftsmanship preserved through generations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                 style={{ opacity: scrollProgress > 0.7 ? 1 : 0, transform: `translateY(${scrollProgress > 0.7 ? 0 : 50}px)`, transition: 'all 1s ease 0.2s' }}>
              {PRODUCTS.level3.map((product, idx) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onBuy={setSelectedProduct}
                  delay={idx * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 bg-gradient-to-t from-slate-900 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center items-center gap-4 mb-8">
               <div className="h-px bg-slate-700 w-24"></div>
               <Mountain className="w-8 h-8 text-blue-500" />
               <div className="h-px bg-slate-700 w-24"></div>
            </div>
            
            <h3 className="text-3xl font-bold mb-4 tracking-wider">BERGVAULT</h3>
            
            <a href="mailto:bergvault@bro.ch" 
               className="inline-flex items-center gap-2 text-xl text-blue-300 hover:text-white transition-colors border border-blue-500/30 bg-blue-900/20 px-6 py-3 rounded-full mb-8 hover:bg-blue-900/40">
              <Mail className="w-5 h-5" />
              bergvault@bro.ch
            </a>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 uppercase tracking-widest">
              <span>Made in Switzerland</span>
              <span>•</span>
              <span>Est. 2024</span>
              <span>•</span>
              <span>Global Shipping</span>
            </div>
            
            <p className="text-xs text-gray-600 mt-12">
              © 2024 Bergvault AG. All rights reserved via Lister-Barun Protocol.
            </p>
          </div>
        </footer>
      </div>

      {/* Checkout Modal - rendered conditionally */}
      {selectedProduct && (
        <CheckoutModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

export default BergvaultSite;
