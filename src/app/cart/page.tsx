"use client";

import { useCart } from "@/lib/CartContext";
import { Trash2, Minus, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      if(data.success && data.data?.freeShippingThreshold) {
        setFreeShippingThreshold(data.data.freeShippingThreshold);
      }
    });
  }, []);

  const shipping = cartTotal > freeShippingThreshold ? 0 : 50;
  const remainingForFree = freeShippingThreshold - cartTotal;
  const total = cartTotal + (items.length > 0 ? shipping : 0);

  return (
    <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto pb-24 min-h-screen">
      <h1 className="font-serif text-4xl mb-8">سلة المشتريات</h1>

      {items.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-sand-100">
          <div className="w-24 h-24 mx-auto bg-sand-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBagIcon className="w-10 h-10 text-sand-400" />
          </div>
          <h2 className="text-2xl font-serif mb-4">سلتك فارغة</h2>
          <p className="text-foreground/60 mb-8 max-w-md mx-auto font-light">
            يبدو أنك لم تقم بإضافة أي منتجات للسلة بعد. استكشفي أحدث قطعنا المصنوعة يدوياً بحب.
          </p>
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center gap-2 bg-[#5A5452] text-white px-8 py-4 rounded-full font-medium hover:bg-rose-400 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            استكمال التسوق
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 p-6 bg-white rounded-2xl shadow-sm border border-sand-100"
              >
                <div className="relative w-24 h-32 md:w-32 md:h-40 rounded-xl overflow-hidden bg-sand-50 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-lg md:text-xl line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-foreground/60 mt-1 uppercase tracking-wider text-[10px]">
                        المقاس: {item.size} | اللون: <span className="inline-block w-2 h-2 rounded-full border border-sand-200 ml-1" style={{ backgroundColor: `var(--c-${item.color})` }} />
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-foreground/40 hover:text-rose-500 transition-colors mr-4"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4 bg-sand-50 rounded-full px-2 py-1 border border-sand-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm w-4 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-medium">{item.price * item.quantity} ج.م</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-sand-100 sticky top-24">
              <h3 className="font-serif text-2xl mb-6">ملخص الطلب</h3>
              
              <div className="space-y-4 text-sm mb-6 font-medium">
                <div className="flex justify-between text-foreground/70">
                  <span>المجموع الفرعي</span>
                  <span>{cartTotal} ج.م</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>الشحن</span>
                  <span>{shipping === 0 ? "مجاني" : `${shipping} ج.م`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-rose-500 font-normal">
                    أضف بقيمة {remainingForFree} ج.م إضافية للحصول على شحن مجاني!
                  </p>
                )}
              </div>
              
              <div className="border-t border-sand-200 pt-6 mb-8">
                <div className="flex justify-between font-serif text-2xl font-medium">
                  <span>الإجمالي</span>
                  <span>{total} ج.م</span>
                </div>
              </div>
              
              <Link href="/checkout" className="w-full bg-[#5A5452] text-white px-8 py-4 rounded-full hover:bg-rose-400 transition-colors shadow-lg font-medium flex items-center justify-center gap-2 group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>إتمام الطلب والدفع</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShoppingBagIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
