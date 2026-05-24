"use client";

import { useCart } from "@/lib/CartContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, User, Truck, CreditCard, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedRate, setSelectedRate] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    phone2: "",
    governorate: "",
    address: "",
    notes: "",
  });

  // Fallback governorates in case API fails
  const FALLBACK_GOVERNORATES = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", 
    "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", 
    "السويس", "الشرقية", "سوهاج", "جنوب سيناء", "شمال سيناء", "قنا", "كفر الشيخ", 
    "مطروح", "الأقصر", "أسوان", "أسيوط", "بني سويف", "بورسعيد", "دمياط"
  ];

  useEffect(() => {
    fetch("/api/shipping-rates")
      .then(res => res.json())
      .then(data => {
        let rates = [];
        if (data.success && data.data.length > 0) {
          rates = data.data;
        } else {
          rates = FALLBACK_GOVERNORATES.map(gov => ({
            governorate: gov,
            rate: gov === "القاهرة" || gov === "الجيزة" ? 50 : 70
          }));
        }
        setShippingRates(rates);

        // Fetch current user details if logged in
        fetch("/api/auth/me")
          .then(res => res.json())
          .then(profileResult => {
            if (profileResult.success && profileResult.data) {
              const u = profileResult.data;
              setFormData(prev => ({
                ...prev,
                fullName: u.name || "",
                phone: u.phone || "",
                governorate: u.governorate || "",
                address: u.address || "",
              }));

              if (u.governorate) {
                const rate = rates.find((r: any) => r.governorate === u.governorate);
                if (rate) {
                  setSelectedRate(rate);
                }
              }
            }
          })
          .catch(() => {});
      })
      .catch(() => {
        setShippingRates(FALLBACK_GOVERNORATES.map(gov => ({
          governorate: gov,
          rate: gov === "القاهرة" || gov === "الجيزة" ? 50 : 70
        })));
      });
  }, []);

  const handleGovernorateChange = (govName: string) => {
    const rate = shippingRates.find(r => r.governorate === govName);
    setSelectedRate(rate);
    setFormData({ ...formData, governorate: govName });
  };

  const shippingCost = selectedRate ? selectedRate.rate : 0;
  const finalTotal = cartTotal + shippingCost;

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="pt-40 pb-24 px-6 text-center">
        <h2 className="font-serif text-3xl mb-4">سلة المشتريات فارغة</h2>
        <p className="text-foreground/60 mb-8">يجب إضافة منتجات للسلة لتتمكن من إتمام الطلب.</p>
        <Link href="/shop" className="bg-[#5A5452] text-white px-8 py-3 rounded-full hover:bg-rose-500 transition-all">
          العودة للمتجر
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerCity: formData.governorate,
          customerAddress: formData.address,
          customerNotes: formData.notes,
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
            image: item.image,
            customNote: item.customNote
          })),
          totalAmount: finalTotal,
          status: "pending",
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setOrderId(result.data._id);
        setIsSuccess(true);
        clearCart();
      } else {
        toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("فشل الاتصال بالخادم. يرجى التحقق من الإنترنت.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-40 pb-24 px-6 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl border border-sand-100"
        >
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl mb-4">شكراً لثقتك بنا!</h1>
          <p className="text-foreground/70 mb-8 leading-relaxed">
            لقد استلمنا طلبك بنجاح. نظرًا لأن جميع قطعنا مصنوعة يدويًا بكل حب، فقد يستغرق التجهيز من 7 إلى 14 يومًا. سنتواصل معك قريبًا لتأكيد تفاصيل التوصيل.
          </p>
          <div className="p-4 bg-sand-50 rounded-2xl mb-8 text-sm text-foreground/60">
            رقم الطلب: <span className="font-bold text-foreground">#{orderId.slice(-6).toUpperCase()}</span>
          </div>
          <Link href="/shop" className="inline-block bg-[#5A5452] text-white px-10 py-4 rounded-full hover:bg-rose-500 transition-all shadow-md">
            العودة للمتجر
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Form Section */}
        <div className="flex-1 order-2 lg:order-1">
          <div className="mb-10">
            <h1 className="font-serif text-3xl md:text-4xl mb-2">إتمام الطلب</h1>
            <p className="text-foreground/50">يرجى إدخال بياناتك لتأكيد الحجز والشحن.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info */}
            <section>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-sand-100">
                <User size={20} className="text-rose-500" />
                <h2 className="text-lg font-medium">البيانات الشخصية</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">الاسم بالكامل *</label>
                  <input 
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="الاسم الثلاثي..."
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">رقم الهاتف الأساسي *</label>
                  <input 
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="012xxxxxxx"
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all text-left"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">رقم هاتف إضافي (اختياري)</label>
                  <input 
                    type="tel"
                    value={formData.phone2}
                    onChange={(e) => setFormData({...formData, phone2: e.target.value})}
                    placeholder="رقم آخر للتواصل"
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all text-left"
                  />
                </div>
              </div>
            </section>

            {/* Address Info */}
            <section>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-sand-100">
                <MapPin size={20} className="text-rose-500" />
                <h2 className="text-lg font-medium">عنوان التوصيل</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">المحافظة *</label>
                  <select 
                    required
                    value={formData.governorate}
                    onChange={(e) => handleGovernorateChange(e.target.value)}
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">اختر المحافظة...</option>
                    {shippingRates.map((rate) => (
                      <option key={rate._id} value={rate.governorate}>
                        {rate.governorate}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">العنوان بالتفصيل *</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="اسم الشارع، رقم العمارة، الدور، الشقة..."
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">ملاحظات إضافية</label>
                  <textarea 
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="أي ملاحظات بخصوص المقاسات أو الشحن..."
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Payment & Info */}
            <div className="p-6 bg-sand-50 rounded-2xl border border-sand-100 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Truck size={20} className="text-[#5A5452]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1">مدة التجهيز والشحن</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    هذه المنتجات تُصنع يدوياً حسب الطلب. يستغرق العمل على القطعة من 7 إلى 10 أيام عمل، بالإضافة لـ 2-4 أيام للشحن.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <CreditCard size={20} className="text-[#5A5452]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1">طريقة الدفع</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    الدفع حالياً متاح "عند الاستلام" لضمان جودة القطعة ورضاكم التام.
                  </p>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#5A5452] text-white py-5 rounded-2xl font-bold text-lg hover:bg-rose-500 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>تأكيد الحجز والطلب</>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="w-full lg:w-[400px] order-1 lg:order-2">
          <div className="bg-white p-8 rounded-3xl border border-sand-100 shadow-xl sticky top-32">
            <h2 className="font-serif text-2xl mb-6 pb-4 border-b border-sand-50">ملخص الطلب</h2>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar mb-6 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden bg-sand-50 flex-shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                    <p className="text-[10px] text-foreground/50 mt-1">
                      {item.color} | {item.size} | {item.quantity} قطع
                    </p>
                    {item.customNote && (
                      <p className="text-[10px] text-foreground/70 mt-1 bg-sand-50 p-1 rounded">
                        تفاصيل مخصصة: {item.customNote}
                      </p>
                    )}
                    <p className="text-sm font-bold mt-1">{item.price * item.quantity} ج.م</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-sand-50">
              <div className="flex justify-between text-foreground/60">
                <span>المجموع الفرعي</span>
                <span>{cartTotal} ج.م</span>
              </div>
              <div className="flex justify-between text-foreground/60">
                <span>مصاريف الشحن</span>
                <span>{selectedRate ? `${shippingCost} ج.م` : "يتم التحديد"}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-sand-100 mt-2">
                <span className="font-serif">الإجمالي</span>
                <span>{finalTotal} ج.م</span>
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-3 p-4 bg-rose-50 rounded-2xl">
              <CheckCircle2 className="text-rose-500" size={18} />
              <p className="text-[11px] text-rose-700 leading-tight">
                أنت الآن تقوم بحجز قطع مصنوعة يدوياً خصيصاً لك. شكراً لدعمك للصناعة اليدوية المصرية.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
