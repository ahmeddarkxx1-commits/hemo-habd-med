"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Filter, ShoppingBag, Heart, Loader2 } from "lucide-react";
import { categories } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";

export default function ShopPage() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickAddStatus, setQuickAddStatus] = useState<{[key: string]: boolean}>({});

  const { setIsCartOpen } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto pb-24">
        {/* Skeleton Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="w-full">
            <div className="w-48 h-12 skeleton mb-4 rounded-lg ml-auto"></div>
            <div className="w-full max-w-xl h-16 skeleton rounded-lg ml-auto"></div>
          </div>
        </div>
        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="flex flex-col">
              <div className="w-full aspect-[4/5] rounded-2xl mb-4 skeleton"></div>
              <div className="flex justify-between items-start mb-2">
                <div className="w-1/2 h-6 skeleton rounded-md"></div>
                <div className="w-1/4 h-5 skeleton rounded-md"></div>
              </div>
              <div className="w-1/3 h-4 skeleton rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      color: product.colors?.[0] || "",
      size: product.sizes?.[0] || "",
      quantity: 1,
      image: product.images[0],
      customNote: "",
    });

    // Check if mobile (width < 1024px)
    if (window.innerWidth < 1024) {
      setIsCartOpen(true);
    } else {
      setQuickAddStatus(prev => ({ ...prev, [product._id]: true }));
      setTimeout(() => {
        setQuickAddStatus(prev => ({ ...prev, [product._id]: false }));
      }, 2000);
    }
  };

  return (
    <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-12 text-center md:text-right flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">التشكيلة</h1>
          <p className="text-foreground/60 font-light max-w-xl text-balance">
            أزياء بطيئة، مصنوعة بوعي. اكتشفي مجموعتنا من أزياء التريكو والكروشيه المصنوعة يدوياً والتي صُممت لتضفي الدفء على يومك.
          </p>
        </div>
        
        {/* Category Filter (Unified Desktop & Mobile) */}
        <div className="flex overflow-x-auto hide-scrollbar pb-2 md:pb-0 md:flex-wrap gap-2 justify-start md:justify-end w-full md:w-auto -mx-6 px-6 md:mx-0 md:px-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm transition-all duration-300 font-medium ${
                activeCategory === cat.id 
                  ? "bg-foreground text-white shadow-md" 
                  : "bg-white text-foreground/70 hover:bg-sand-100 border border-sand-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {filteredProducts.map((product, idx) => (
          <motion.div 
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 luxury-shadow luxury-shadow-hover transition-all duration-500">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isInWishlist(product._id)) {
                    removeFromWishlist(product._id);
                  } else {
                    addToWishlist({
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0]
                    });
                  }
                }}
                className={`absolute top-3 left-3 p-2 rounded-full transition-all duration-300 z-10 
                  ${isInWishlist(product._id) 
                    ? 'bg-white/90 text-rose-500 backdrop-blur-md' 
                    : 'bg-white/0 text-[#5A5452]/0 group-hover:bg-white/50 group-hover:backdrop-blur-md group-hover:text-[#5A5452] hover:!bg-rose-100 hover:!text-rose-500'}`}
              >
                <Heart size={18} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
              </button>

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0" />
              
              {/* Quick Add Button Overlay */}
              <div className="absolute bottom-4 left-4 right-4 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 z-10">
                <button 
                  onClick={(e) => handleQuickAdd(e, product)}
                  disabled={product.inStock === false}
                  className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                    quickAddStatus[product._id] 
                      ? 'bg-sage-400 text-white' 
                      : 'bg-white/90 backdrop-blur-md text-[#5A5452] hover:bg-white'
                  }`}
                >
                  <ShoppingBag size={16} />
                  {quickAddStatus[product._id] ? "تمت الإضافة" : (product.inStock === false ? "نفذت الكمية" : "إضافة سريعة")}
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex justify-between items-start mb-1">
                <Link href={`/shop/${product._id}`} className="font-serif text-lg hover:text-rose-400 transition-colors line-clamp-1">
                  {product.name}
                </Link>
                <span className="text-sm font-medium whitespace-nowrap mr-2">{product.price} ج.م</span>
              </div>
              <p className="text-xs text-foreground/50 tracking-wide">{categories.find(c => c.id === product.category)?.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-24">
          <p className="text-foreground/50 font-light">لا توجد منتجات في هذا القسم حالياً.</p>
        </div>
      )}
    </div>
  );
}
