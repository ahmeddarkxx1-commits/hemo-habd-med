"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/lib/WishlistContext";
import { useCart } from "@/lib/CartContext";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-32 px-6 md:px-12 max-w-7xl mx-auto pb-24 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="bg-sand-100 p-6 rounded-full text-foreground mb-8">
          <Heart size={48} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-6 font-semibold">قائمة الأمنيات فارغة</h1>
        <p className="text-lg text-foreground/80 max-w-xl mb-12">
          لم تقومي بإضافة أي قطع إلى قائمة الأمنيات الخاصة بك حتى الآن. تصفحي مجموعاتنا واكتشفي القطع التي تناسب ذوقك.
        </p>
        <Link 
          href="/shop" 
          className="inline-flex items-center justify-center bg-foreground text-white px-8 py-4 rounded-full font-medium hover:bg-rose-600 transition-all duration-300 shadow-lg hover:-translate-y-1"
        >
          العودة للتسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 md:px-12 max-w-7xl mx-auto pb-24 min-h-[70vh]">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4 font-semibold">قائمة الأمنيات</h1>
        <p className="text-lg text-foreground/70">لديك {items.length} قطع في مفضلتك</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="group flex flex-col"
          >
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
              <Link href={`/shop/${item.id}`}>
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </Link>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWishlist(item.id);
                }}
                className="absolute top-4 left-4 bg-white/90 p-2 rounded-full text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white transition-colors"
                title="إزالة من المفضلة"
              >
                <Trash2 size={18} />
              </button>
              
              {/* Action Buttons (Visible on Hover) */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart({
                      productId: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      color: "افتراضي",
                      size: "افتراضي",
                      quantity: 1
                    });
                    setIsCartOpen(true);
                  }}
                  className="bg-white text-foreground px-6 py-3 rounded-full shadow-lg hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-2 font-medium text-sm"
                >
                  <ShoppingBag size={18} />
                  نقل إلى السلة
                </button>
              </div>
            </div>
            <Link href={`/shop/${item.id}`}>
              <h4 className="font-medium text-foreground text-lg mb-1 group-hover:text-rose-500 transition-colors line-clamp-1">{item.name}</h4>
            </Link>
            <p className="text-foreground/70">{item.price} ج.م</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
