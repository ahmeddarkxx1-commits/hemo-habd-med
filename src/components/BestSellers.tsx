"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/models/Product";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { ShoppingBag, Heart } from "lucide-react";

export default function BestSellers() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickAddStatus, setQuickAddStatus] = useState<{[key: string]: boolean}>({});

  const { addToCart, setIsCartOpen } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await fetch("/api/products/best-sellers");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <div className="px-6 md:px-12 max-w-7xl mx-auto text-center py-12">
        <div className="w-64 h-10 skeleton mx-auto mb-6 rounded-lg"></div>
        <div className="w-full max-w-lg h-6 skeleton mx-auto mb-12 rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-full aspect-[4/5] rounded-2xl mb-4 skeleton"></div>
              <div className="w-2/3 h-5 skeleton mb-2 rounded-md"></div>
              <div className="w-1/3 h-4 skeleton rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleQuickAdd = (e: React.MouseEvent, product: any, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      productId: productId,
      name: product.name,
      price: product.price,
      color: product.colors?.[0] || "",
      size: product.sizes?.[0] || "",
      quantity: 1,
      image: product.images[0],
      customNote: "",
    });

    if (window.innerWidth < 1024) {
      setIsCartOpen(true);
    } else {
      setQuickAddStatus(prev => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setQuickAddStatus(prev => ({ ...prev, [productId]: false }));
      }, 2000);
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto text-center">
      <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground mb-6">الأكثر مبيعاً هذا الأسبوع</h2>
      <p className="text-foreground/80 font-medium text-lg mb-12 max-w-2xl mx-auto">
        تشكيلتنا المختارة بعناية من القطع الأكثر طلباً. قطع فريدة تخطف الأنظار في كل مناسبة.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => {
          const productId = String(product._id);
          const inWishlist = isInWishlist(productId);
          
          return (
            <motion.div whileHover={{ y: -5 }} key={productId} className="group flex flex-col items-center text-center">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 luxury-shadow luxury-shadow-hover transition-all duration-500">
                <Link href={`/shop/${productId}`}>
                  <Image 
                    src={product.images[0] || "/placeholder.jpg"} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </Link>
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-foreground shadow-sm">
                  الأكثر مبيعاً
                </div>
                
                {/* Action Buttons (Visible on Hover) */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button 
                    onClick={(e) => handleQuickAdd(e, product, productId)}
                    disabled={product.inStock === false}
                    className={`text-foreground p-3 rounded-full shadow-lg transition-colors ${
                      quickAddStatus[productId] ? 'bg-sage-400 text-white' : 'bg-white hover:bg-rose-500 hover:text-white'
                    } disabled:opacity-50`}
                    title="أضف للسلة سريعاً"
                  >
                    <ShoppingBag size={20} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      if (inWishlist) {
                        removeFromWishlist(productId);
                      } else {
                        addToWishlist({
                          id: productId,
                          name: product.name,
                          price: product.price,
                          image: product.images[0]
                        });
                      }
                    }}
                    className={`bg-white p-3 rounded-full shadow-lg transition-colors ${inWishlist ? 'text-rose-500' : 'text-foreground hover:text-rose-500'}`}
                    title="إضافة للمفضلة"
                  >
                    <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
              <Link href={`/shop/${product._id}`}>
                <h4 className="font-medium text-foreground text-lg mb-1 group-hover:text-rose-500 transition-colors">{product.name}</h4>
              </Link>
              <p className="text-foreground/70 text-sm">{product.price} ج.م</p>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-12">
        <Link href="/shop" className="inline-flex items-center gap-2 border-2 border-foreground text-foreground px-8 py-3 rounded-full font-medium hover:bg-foreground hover:text-white transition-colors duration-300">
          عرض كل المنتجات
        </Link>
      </div>
    </div>
  );
}
