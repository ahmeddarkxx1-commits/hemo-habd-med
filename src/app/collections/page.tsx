import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "أحدث التشكيلات",
  description: "اكتشفي أحدث تشكيلات هيمو هاند ميد من التريكو والكروشيه المصنوع يدوياً.",
};

export default function CollectionsPage() {
  return (
    <div className="pt-32 px-6 md:px-12 max-w-7xl mx-auto pb-24 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6 font-semibold">أحدث التشكيلات</h1>
      <p className="text-lg text-foreground/80 max-w-2xl mb-12">
        نعمل حالياً على تجهيز تشكيلة الموسم الجديد. ستكون متاحة قريباً بتفاصيل ساحرة وغرز منسوجة بحب.
      </p>
      <Link 
        href="/shop" 
        className="inline-flex items-center justify-center gap-2 bg-foreground text-white px-8 py-4 rounded-full font-medium hover:bg-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        <span>تسوقي التشكيلة الحالية</span>
        <ArrowRight size={18} className="rotate-180" />
      </Link>
    </div>
  );
}
