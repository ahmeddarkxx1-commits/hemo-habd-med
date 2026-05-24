"use client";

import { useCart } from "@/lib/CartContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, User, Truck, ShieldAlert, CheckCircle2, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [depositAccepted, setDepositAccepted] = useState(false);

  // نحفظ القيم قبل مسح السلة علشان شاشة النجاح تبان صح
  const [savedTotal, setSavedTotal] = useState(0);
  const [savedDeposit, setSavedDeposit] = useState(0);

  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedRate, setSelectedRate] = useState<any>(null);
  const [storeWhatsapp, setStoreWhatsapp] = useState("201201944837");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    phone2: "",
    governorate: "",
    address: "",
    notes: "",
  });

  const FALLBACK_GOVERNORATES = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم",
    "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد",
    "السويس", "الشرقية", "سوهاج", "جنوب سيناء", "شمال سيناء", "قنا", "كفر الشيخ",
    "مطروح", "الأقصر", "أسوان", "أسيوط", "بني سويف", "بورسعيد", "دمياط"
  ];

  useEffect(() => {
    // Fetch shipping rates
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

        // Prefill if logged in
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
                if (rate) setSelectedRate(rate);
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

    // Fetch WhatsApp number
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.whatsapp) {
          setStoreWhatsapp(data.data.whatsapp.replace(/[^0-9]/g, ""));
        }
      })
      .catch(() => {});
  }, []);

  const handleGovernorateChange = (govName: string) => {
    const rate = shippingRates.find(r => r.governorate === govName);
    setSelectedRate(rate);
    setFormData({ ...formData, governorate: govName });
  };

  const shippingCost = selectedRate ? selectedRate.rate : 0;
  const finalTotal = cartTotal + shippingCost;
  const depositAmount = Math.ceil(finalTotal / 2); // نص المبلغ مقرّب لأعلى
  const remainingAmount = finalTotal - depositAmount;

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
    if (!depositAccepted) {
      toast.error("يرجى الموافقة على شرط العربون لإتمام الطلب");
      return;
    }
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
            customNote: item.customNote,
          })),
          totalAmount: finalTotal,
          depositAmount,
          depositPaid: false,
          status: "pending",
        }),
      });

      const result = await response.json();

      if (result.success) {
        // ✅ نحفظ القيم الصح قبل مسح السلة
        setSavedTotal(finalTotal);
        setSavedDeposit(depositAmount);
        setOrderId(result.data._id || result.data.id || "");
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

  // ── شاشة النجاح ──────────────────────────────────────────────
  if (isSuccess) {
    const shortId = orderId ? `#${orderId.slice(-6).toUpperCase()}` : "";
    // نستخدم القيم المحفوظة قبل مسح السلة — مش المحسوبة من سلة فاضية
    const displayTotal = savedTotal;
    const displayDeposit = savedDeposit;
    const displayRemaining = displayTotal - displayDeposit;
    const waMessage = encodeURIComponent(
      `مرحباً هيمو هاند ميد 👋\nأريد إتمام دفع العربون للطلب ${shortId}\n\nتفاصيل الطلب:\n- إجمالي الطلب: ${displayTotal} ج.م\n- العربون المطلوب (50%): ${displayDeposit} ج.م\n- المبلغ المتبقي عند الاستلام: ${displayRemaining} ج.م\n\nشكراً 🌸`
    );
    const waLink = `https://wa.me/${storeWhatsapp}?text=${waMessage}`;

    return (
      <div className="pt-40 pb-24 px-4 max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-sand-100 text-center"
        >
          {/* أيقونة النجاح */}
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl mb-2">تم استلام طلبك! 🎉</h1>
          <p className="text-foreground/50 text-sm mb-6">رقم الطلب: <span className="font-bold text-foreground">{shortId}</span></p>

          {/* بطاقة تفاصيل الدفع */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 text-right space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={18} className="text-amber-600 flex-shrink-0" />
              <h2 className="font-bold text-amber-800 text-sm">خطوة مهمة — دفع العربون</h2>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed mb-4">
              لأن منتجاتنا تُصنع يدوياً خصيصاً لكِ، يُرجى دفع العربون لتأكيد الطلب وبدء التصنيع. باقي المبلغ يُدفع عند الاستلام.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white rounded-xl px-4 py-2.5 border border-amber-100">
                <span className="text-sm text-foreground/60">إجمالي الطلب</span>
                <span className="font-bold text-foreground">{displayTotal} ج.م</span>
              </div>
              <div className="flex justify-between items-center bg-amber-100 rounded-xl px-4 py-3 border border-amber-200">
                <span className="text-sm font-bold text-amber-900">العربون المطلوب الآن (50%)</span>
                <span className="text-xl font-serif font-bold text-amber-700">{displayDeposit} ج.م</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-xl px-4 py-2.5 border border-amber-100">
                <span className="text-sm text-foreground/60">المتبقي عند الاستلام</span>
                <span className="font-bold text-foreground">{displayRemaining} ج.م</span>
              </div>
            </div>
          </div>

          {/* زر واتساب لدفع العربون */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#1ebe5d] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mb-4"
          >
            <MessageCircle size={20} />
            دفع العربون عبر واتساب
          </a>

          <p className="text-[11px] text-foreground/40 leading-relaxed mb-6">
            اضغط الزر أعلاه لفتح واتساب وإرسال تفاصيل الطلب للتأكيد. سنتواصل معك خلال 24 ساعة.
          </p>

          <Link
            href="/shop"
            className="inline-block text-sm text-foreground/50 hover:text-foreground underline underline-offset-2 transition-colors"
          >
            العودة للمتجر
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

        {/* ── Form Section ── */}
        <div className="flex-1 order-2 lg:order-1">
          <div className="mb-10">
            <h1 className="font-serif text-3xl md:text-4xl mb-2">إتمام الطلب</h1>
            <p className="text-foreground/50">يرجى إدخال بياناتك لتأكيد الحجز والشحن.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* البيانات الشخصية */}
            <section>
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-sand-100">
                <User size={20} className="text-rose-500" />
                <h2 className="text-lg font-medium">البيانات الشخصية</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">الاسم بالكامل *</label>
                  <input
                    required type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="الاسم الثلاثي..."
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">رقم الهاتف الأساسي *</label>
                  <input
                    required type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="012xxxxxxx"
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all text-left"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">رقم هاتف إضافي (اختياري)</label>
                  <input
                    type="tel"
                    value={formData.phone2}
                    onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                    placeholder="رقم آخر للتواصل"
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all text-left"
                  />
                </div>
              </div>
            </section>

            {/* عنوان التوصيل */}
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
                      <option key={rate._id || rate.governorate} value={rate.governorate}>
                        {rate.governorate}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">العنوان بالتفصيل *</label>
                  <textarea
                    required rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="اسم الشارع، رقم العمارة، الدور، الشقة..."
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">ملاحظات إضافية</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="أي ملاحظات بخصوص المقاسات أو الشحن..."
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* ── شرط العربون ── */}
            <section>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-sand-100">
                <ShieldAlert size={20} className="text-amber-500" />
                <h2 className="text-lg font-medium">سياسة الدفع والعربون</h2>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-4 mb-5">
                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                  🧶 لأن جميع قطعنا تُصنع يدوياً بحب وجهد حسب طلبك، يُشترط دفع عربون بقيمة <strong>50% من إجمالي الطلب</strong> عند التأكيد.
                </p>
                <ul className="text-xs text-amber-700 space-y-1.5 pr-2">
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> العربون يضمن حجز يدك الكريمة وبدء التصنيع فوراً.</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> باقي المبلغ يُدفع عند استلام الطلب (كاش أو إنستاباي).</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> العربون غير قابل للاسترداد إذا تم إلغاء الطلب بعد بدء التصنيع.</li>
                </ul>

                {/* حساب الديبوزيت */}
                {finalTotal > 0 && (
                  <div className="bg-white rounded-xl border border-amber-100 divide-y divide-amber-50 mt-3">
                    <div className="flex justify-between px-4 py-2.5 text-sm">
                      <span className="text-foreground/60">إجمالي الطلب</span>
                      <span className="font-semibold">{finalTotal} ج.م</span>
                    </div>
                    <div className="flex justify-between px-4 py-3 bg-amber-50/80">
                      <span className="text-sm font-bold text-amber-800">العربون الآن (50%)</span>
                      <span className="text-lg font-serif font-bold text-amber-700">{depositAmount} ج.م</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5 text-sm">
                      <span className="text-foreground/60">عند الاستلام</span>
                      <span className="font-semibold">{remainingAmount} ج.م</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Checkbox الموافقة */}
              <label className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                depositAccepted
                  ? "border-amber-400 bg-amber-50"
                  : "border-sand-200 bg-white hover:border-amber-200"
              }`}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  depositAccepted ? "border-amber-500 bg-amber-500" : "border-sand-300"
                }`}>
                  {depositAccepted && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={depositAccepted}
                  onChange={(e) => setDepositAccepted(e.target.checked)}
                />
                <span className="text-sm text-foreground/80 leading-relaxed">
                  أوافق على دفع عربون بقيمة <strong className="text-amber-700">{depositAmount > 0 ? `${depositAmount} ج.م` : "نصف المبلغ"}</strong> لتأكيد الطلب وبدء التصنيع، وأفهم أن العربون غير مسترد في حالة الإلغاء بعد بدء العمل.
                </span>
              </label>
            </section>

            {/* معلومات الشحن */}
            <div className="p-5 bg-sand-50 rounded-2xl border border-sand-100 flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                <Truck size={18} className="text-[#5A5452]" />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">مدة التجهيز والشحن</h4>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  تُصنع القطع يدوياً من 7 إلى 10 أيام عمل + 2-4 أيام للشحن. ستُرسل إشعار التتبع عبر واتساب.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !depositAccepted}
              className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
                depositAccepted
                  ? "bg-[#5A5452] text-white hover:bg-rose-500 cursor-pointer"
                  : "bg-sand-200 text-sand-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>تأكيد الطلب ودفع العربون</>
              )}
            </button>
          </form>
        </div>

        {/* ── Order Summary ── */}
        <div className="w-full lg:w-[400px] order-1 lg:order-2">
          <div className="bg-white p-8 rounded-3xl border border-sand-100 shadow-xl sticky top-32">
            <h2 className="font-serif text-2xl mb-6 pb-4 border-b border-sand-50">ملخص الطلب</h2>

            <div className="space-y-4 max-h-[280px] overflow-y-auto hide-scrollbar mb-6 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden bg-sand-50 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
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
              <div className="flex justify-between text-foreground/60 text-sm">
                <span>المجموع الفرعي</span>
                <span>{cartTotal} ج.م</span>
              </div>
              <div className="flex justify-between text-foreground/60 text-sm">
                <span>مصاريف الشحن</span>
                <span>{selectedRate ? `${shippingCost} ج.م` : "يتم التحديد"}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3 border-t border-sand-100">
                <span className="font-serif">الإجمالي</span>
                <span>{finalTotal} ج.م</span>
              </div>

              {/* ملخص الديبوزيت في الـ Summary */}
              {finalTotal > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-2 space-y-2">
                  <p className="text-[11px] font-bold text-amber-700 mb-2">💰 ملخص الدفع:</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-700 font-bold">العربون الآن (50%)</span>
                    <span className="font-bold text-amber-700">{depositAmount} ج.م</span>
                  </div>
                  <div className="flex justify-between text-xs text-foreground/50">
                    <span>عند الاستلام</span>
                    <span>{remainingAmount} ج.م</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
