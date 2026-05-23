import Link from "next/link";
import connectDB from "@/lib/db";
import Setting from "@/models/Setting";

export default async function Footer() {
  await connectDB();
  const settings = await Setting.findOne() || {};

  return (
    <footer className="bg-white pt-24 pb-8 px-6 md:px-12 border-t border-sand-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-serif text-2xl tracking-widest mb-6">{settings.storeName || "HEMO"}</h4>
          <p className="text-foreground/60 max-w-sm font-light mb-6">
            بوتيك فاخر مخصص لحركة الأزياء البطيئة، يقدم أزياء تريكو وكروشيه مصنوعة يدوياً بحب وعناية.
          </p>
          <div className="flex gap-4">
            {settings.instagram && (
              <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            )}
            {settings.facebook && (
              <a href={`https://facebook.com/${settings.facebook}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            )}
          </div>
        </div>
        <div>
          <h5 className="font-medium mb-6">التسوق</h5>
          <ul className="space-y-4 text-foreground/70 font-light">
            <li><Link href="/shop" className="hover:text-rose-400 transition-colors">كل المنتجات</Link></li>
            <li><Link href="/shop" className="hover:text-rose-400 transition-colors">جواكت تريكو</Link></li>
            <li><Link href="/shop" className="hover:text-rose-400 transition-colors">أطفال ورضع</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-medium mb-6">المساعدة</h5>
          <ul className="space-y-4 text-foreground/70 font-light">
            <li><Link href="/faq" className="hover:text-rose-400 transition-colors">الأسئلة الشائعة</Link></li>
            <li><Link href="/shipping-returns" className="hover:text-rose-400 transition-colors">الشحن والاسترجاع</Link></li>
            <li><Link href="/contact" className="hover:text-rose-400 transition-colors">تواصل معنا</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-sand-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/50 font-light">
        <p>&copy; {new Date().getFullYear()} هيمو هاند ميد. جميع الحقوق محفوظة.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-foreground transition-colors">سياسة الخصوصية</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">شروط الخدمة</Link>
        </div>
      </div>
    </footer>
  );
}
