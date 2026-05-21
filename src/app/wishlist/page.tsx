import Link from "next/link";
import { Heart } from "lucide-react";

export const metadata = {
  title: "قائمة الأمنيات",
  description: "القطع المفضلة لك من هيمو هاند ميد.",
};

export default function WishlistPage() {
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
