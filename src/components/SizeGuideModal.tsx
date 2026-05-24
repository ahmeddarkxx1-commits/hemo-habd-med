"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SizeGuideModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sand-100"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center rounded-full bg-sand-50 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 mb-2 block">دليل القياسات</span>
              <h2 className="font-serif text-3xl text-foreground">المقاسات العامة</h2>
              <p className="text-sm text-foreground/70 mt-2">تأكدي من قياساتك الصحيحة قبل الطلب لضمان الحصول على القطعة المناسبة.</p>
            </div>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm text-right">
                <thead className="bg-sand-50/50">
                  <tr>
                    <th className="py-4 px-4 font-bold rounded-tr-xl">المقاس (Size)</th>
                    <th className="py-4 px-4 font-bold">الصدر (Chest)</th>
                    <th className="py-4 px-4 font-bold">الخصر (Waist)</th>
                    <th className="py-4 px-4 font-bold rounded-tl-xl">الطول (Length)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100/50">
                  <tr className="hover:bg-sand-50/30 transition-colors">
                    <td className="py-4 px-4 font-bold">S - صغير</td>
                    <td className="py-4 px-4 text-foreground/70">86 - 90 سم</td>
                    <td className="py-4 px-4 text-foreground/70">66 - 70 سم</td>
                    <td className="py-4 px-4 text-foreground/70">متغير حسب القطعة</td>
                  </tr>
                  <tr className="hover:bg-sand-50/30 transition-colors">
                    <td className="py-4 px-4 font-bold">M - وسط</td>
                    <td className="py-4 px-4 text-foreground/70">90 - 94 سم</td>
                    <td className="py-4 px-4 text-foreground/70">70 - 74 سم</td>
                    <td className="py-4 px-4 text-foreground/70">متغير حسب القطعة</td>
                  </tr>
                  <tr className="hover:bg-sand-50/30 transition-colors">
                    <td className="py-4 px-4 font-bold">L - كبير</td>
                    <td className="py-4 px-4 text-foreground/70">94 - 100 سم</td>
                    <td className="py-4 px-4 text-foreground/70">74 - 80 سم</td>
                    <td className="py-4 px-4 text-foreground/70">متغير حسب القطعة</td>
                  </tr>
                  <tr className="hover:bg-sand-50/30 transition-colors">
                    <td className="py-4 px-4 font-bold">XL - كبير جداً</td>
                    <td className="py-4 px-4 text-foreground/70">100 - 106 سم</td>
                    <td className="py-4 px-4 text-foreground/70">80 - 86 سم</td>
                    <td className="py-4 px-4 text-foreground/70">متغير حسب القطعة</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100">
              <h4 className="font-bold text-sm mb-2 text-rose-900">ملاحظة هامة:</h4>
              <p className="text-sm text-rose-900/70 leading-relaxed">
                جميع قطعنا تُصنع يدوياً بحب وعناية. قد يختلف القياس قليلاً بمقدار (1-2 سم) نظراً لطبيعة الغزل اليدوي. إذا كان لديكِ أي متطلبات خاصة بالمقاس، يرجى كتابتها في خانة "تفاصيل مخصصة" عند الطلب.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
