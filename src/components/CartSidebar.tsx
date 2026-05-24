"use client";

import { useCart } from "@/lib/CartContext";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if(data.success && data.data?.freeShippingThreshold) {
        setFreeShippingThreshold(data.data.freeShippingThreshold);
      }
    });
  }, []);

  const progress = Math.min((cartTotal / freeShippingThreshold) * 100, 100);
  const remainingForFree = freeShippingThreshold - cartTotal;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-sand-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-rose-500" />
                <h2 className="font-serif text-xl">سلة المشتريات</h2>
                <span className="bg-sand-100 text-foreground/60 text-xs px-2 py-0.5 rounded-full mr-2">
                  {items.length} قطع
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-sand-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-sand-50 rounded-full flex items-center justify-center text-sand-300">
                    <ShoppingBag size={40} />
                  </div>
                  <p className="text-foreground/50 font-light">سلة المشتريات فارغة حالياً</p>
                  <Link
                    href="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="text-rose-500 font-medium hover:underline underline-offset-4"
                  >
                    ابدئي التسوق الآن
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-24 aspect-[3/4] rounded-xl overflow-hidden bg-sand-50 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-base line-clamp-1">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-foreground/30 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-foreground/40 mt-1">
                          اللون: {item.color} | المقاس: {item.size}
                        </p>
                        {item.customNote && (
                          <p className="text-[10px] text-foreground/70 mt-1 bg-sand-50 p-1 rounded">
                            تخصيص: {item.customNote}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-sand-50 rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded-md transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded-md transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-medium text-sm">{item.price * item.quantity} ج.م</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-sand-50 border-t border-sand-100 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-serif">الإجمالي</span>
                  <span className="font-bold">{cartTotal} ج.م</span>
                </div>
                
                {/* Free Shipping Progress */}
                <div className="space-y-2 bg-white p-3 rounded-xl border border-sand-100">
                  <div className="flex justify-between text-xs font-medium">
                    {progress >= 100 ? (
                      <span className="text-green-600 font-bold">🎉 لقد حصلت على شحن مجاني!</span>
                    ) : (
                      <span className="text-foreground/70">
                        أضف <span className="font-bold text-rose-500">{remainingForFree} ج.م</span> للحصول على شحن مجاني
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 w-full bg-sand-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full rounded-full transition-colors duration-500 ${progress >= 100 ? 'bg-green-500' : 'bg-rose-400'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-[#5A5452] text-white py-4 rounded-xl font-medium text-center hover:bg-rose-500 transition-all shadow-lg"
                  >
                    إتمام الشراء
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-white text-[#5A5452] py-3 rounded-xl font-medium text-center border border-sand-200 hover:bg-sand-50 transition-all"
                  >
                    عرض السلة كاملة
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
