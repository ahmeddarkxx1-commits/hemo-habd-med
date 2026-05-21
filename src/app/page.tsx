"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Heart, Menu, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Define image paths as strings
const heroImage = "/products/WhatsApp Image 2026-05-06 at 10.39.44 PM (6).jpeg";
const cat1Image = "/products/WhatsApp Image 2026-05-06 at 10.39.44 PM (7).jpeg";
const cat2Image = "/products/WhatsApp Image 2026-05-06 at 10.39.44 PM (2).jpeg";
const cat3Image = "/products/WhatsApp Image 2026-05-06 at 10.39.44 PM (3).jpeg";
const testimonialImage = "/products/WhatsApp Image 2026-05-06 at 10.39.44 PM (9).jpeg";

export default function Home() {
  return (
    <main className="min-h-screen relative bg-knit-pattern">

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImage} 
            alt="Hemo Hand Made Luxury Knitwear" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-ivory-100/95 via-ivory-100/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory-100/80 via-transparent to-black/10" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 flex flex-col items-start justify-center h-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="text-sm md:text-base tracking-[0.15em] text-foreground mb-6 block font-medium uppercase">صُنع بحب لأجلك</span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight mb-6 text-balance text-foreground font-semibold">
              نعومة في <br/><span className="italic text-rose-600 font-normal">كل غرزة</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 mb-10 max-w-lg font-normal leading-relaxed drop-shadow-sm">
              اكتشفي مجموعتنا الفاخرة من أزياء التريكو والكروشيه المصنوعة يدوياً. تُصنع ببطء، لتدوم للأبد.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center gap-2 bg-foreground text-white px-8 py-4 rounded-full font-medium hover:bg-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>تسوقي الآن</span>
              <ArrowRight size={18} className="rotate-180" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground mb-3">مختاراتنا لكِ</h2>
            <p className="text-foreground/80 font-medium text-lg">تصفحي أقسامنا الأكثر مبيعاً والأكثر حباً.</p>
          </div>
          <Link href="/shop" className="hidden md:flex items-center gap-2 text-sm font-semibold text-foreground hover:text-rose-600 transition-colors uppercase tracking-wider">
            عرض الكل <ArrowRight size={16} className="rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1 */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
              <Image 
                src={cat1Image} 
                alt="جواكت تريكو وكروشيه" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 flex items-end p-8">
                <div className="text-white font-serif text-2xl italic drop-shadow-md">جواكت تريكو</div>
              </div>
            </div>
          </motion.div>

          {/* Category 2 */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="group cursor-pointer md:translate-y-12"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
              <Image 
                src={cat2Image} 
                alt="كوفيات وجوانتيات" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 flex items-end p-8">
                <div className="text-white font-serif text-2xl italic drop-shadow-md">إكسسوارات</div>
              </div>
            </div>
          </motion.div>

          {/* Category 3 */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
              <Image 
                src={cat3Image} 
                alt="أطفال" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 flex items-end p-8">
                <div className="text-white font-serif text-2xl italic drop-shadow-md">أطفال</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonial & Editorial Section */}
      <section className="py-24 bg-rose-50 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-t-full overflow-hidden shadow-xl">
            <Image 
              src={testimonialImage} 
              alt="Editorial Artisan Image" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="text-center md:text-right">
            <div className="flex justify-center md:justify-start gap-1 text-rose-400 mb-8">
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
            </div>
            <h3 className="font-serif text-2xl md:text-4xl leading-relaxed text-balance mb-8 text-foreground font-medium drop-shadow-sm">
              "الجودة ودقة التفاصيل تأخذ الأنفاس. يمكنكِ أن تشعري بالحب والاهتمام المبذول في كل غرزة. هذه ليست مجرد ملابس، هذا فن يمكنكِ ارتدائه."
            </h3>
            <p className="text-sm text-foreground/80 font-semibold tracking-widest uppercase">— منة محمد</p>
          </div>
        </div>
      </section>

      {/* Newsletter & Community Section */}
      <section className="bg-rose-50/50 py-24 px-6 md:px-12 border-y border-rose-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sm tracking-[0.2em] text-foreground mb-4 block font-bold uppercase">عائلة هيمو</span>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold mb-6 text-foreground">انضمي لمجتمع الأزياء البطيئة</h2>
          <p className="text-foreground/80 font-normal text-lg mb-10 max-w-lg mx-auto">
            اشتركي في نشرتنا البريدية لتكوني أول من يعلم عن أحدث التشكيلات، عروضنا الخاصة، وكواليس صناعة قطعنا اليدوية.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="بريدك الإلكتروني..." 
              className="flex-1 bg-white border border-sand-200 px-6 py-4 rounded-full text-foreground focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-300 transition-all text-sm font-medium"
              required
            />
            <button 
              type="submit" 
              className="bg-[#5A5452] text-white px-8 py-4 rounded-full font-medium hover:bg-rose-400 transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
            >
              اشتراك
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-8 px-6 md:px-12 border-t border-sand-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-serif text-2xl tracking-widest mb-6">HEMO</h4>
            <p className="text-foreground/60 max-w-sm font-light mb-6">
              بوتيك فاخر مخصص لحركة الأزياء البطيئة، يقدم أزياء تريكو وكروشيه مصنوعة يدوياً بحب وعناية.
            </p>
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
              <li><Link href="/shipping" className="hover:text-rose-400 transition-colors">الشحن والاسترجاع</Link></li>
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
    </main>
  );
}
