"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Heart, Menu, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BestSellers from "@/components/BestSellers";
import Footer from "@/components/Footer";

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
            className="object-cover object-center scale-105 transition-transform duration-[20s] hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/70 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 flex flex-col items-start justify-center h-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <span className="text-xs md:text-sm tracking-[0.4em] text-white mb-8 block font-semibold uppercase drop-shadow-md">صُنع بحب لأجلك</span>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-[7.5rem] leading-[1.05] mb-8 text-balance text-white font-medium drop-shadow-2xl">
              نعومة في <br/><span className="italic text-rose-200 font-light tracking-tight">كل غرزة</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-12 max-w-xl font-light leading-relaxed drop-shadow-md">
              اكتشفي مجموعتنا الفاخرة من أزياء التريكو والكروشيه المصنوعة يدوياً. تُصنع ببطء، لتدوم للأبد.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center gap-4 bg-white text-foreground px-12 py-5 rounded-full text-sm font-bold tracking-[0.2em] uppercase hover:bg-rose-50 hover:scale-105 transition-all duration-500 luxury-shadow"
            >
              <span>تسوقي الآن</span>
              <ArrowRight size={18} className="rotate-180" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Promotional Banner (New Collection) */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/60 to-transparent z-10" />
          <Image 
            src="/products/WhatsApp Image 2026-05-06 at 10.39.44 PM (5).jpeg" 
            alt="New Collection Banner"
            width={1200}
            height={400}
            className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-10 md:px-20 text-white">
            <span className="text-xs tracking-[0.3em] uppercase mb-4 opacity-80">وصل حديثاً</span>
            <h2 className="font-serif text-3xl md:text-5xl mb-4 font-semibold">تشكيلة الصيف الجديدة</h2>
            <Link href="/shop?collection=new" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-bold hover:text-rose-200 transition-colors w-fit border-b border-white/30 hover:border-white pb-1">
              تسوقي التشكيلة <ArrowRight size={16} className="rotate-180" />
            </Link>
          </div>
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 luxury-shadow luxury-shadow-hover transition-all duration-700">
              <Image 
                src={cat1Image} 
                alt="جواكت تريكو وكروشيه" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="absolute inset-0 flex items-end p-10">
                <div className="text-white font-serif text-3xl italic drop-shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">جواكت تريكو</div>
              </div>
            </div>
          </motion.div>

          {/* Category 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group cursor-pointer md:translate-y-16"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 luxury-shadow luxury-shadow-hover transition-all duration-700">
              <Image 
                src={cat2Image} 
                alt="كوفيات وجوانتيات" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="absolute inset-0 flex items-end p-10">
                <div className="text-white font-serif text-3xl italic drop-shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">إكسسوارات</div>
              </div>
            </div>
          </motion.div>

          {/* Category 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 luxury-shadow luxury-shadow-hover transition-all duration-700">
              <Image 
                src={cat3Image} 
                alt="أطفال" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="absolute inset-0 flex items-end p-10">
                <div className="text-white font-serif text-3xl italic drop-shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">أطفال</div>
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

      {/* Best Sellers Section with Distinct Background */}
      <section className="bg-[#FAF8F5] py-24">
        <BestSellers />
      </section>

      {/* Static Instagram Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm tracking-[0.2em] text-foreground/60 mb-2 block font-bold uppercase">@HEMO_HANDMADE</span>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground">تابعينا على انستجرام</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "/products/WhatsApp Image 2026-05-06 at 10.39.44 PM.jpeg",
            "/products/WhatsApp Image 2026-05-06 at 10.39.44 PM (1).jpeg",
            "/products/WhatsApp Image 2026-05-06 at 10.39.44 PM (4).jpeg",
            "/products/WhatsApp Image 2026-05-06 at 10.39.44 PM (6).jpeg"
          ].map((src, i) => (
            <motion.a 
              key={i}
              href="#"
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <Image 
                src={src} 
                alt={`Instagram Photo ${i+1}`} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-rose-900/0 group-hover:bg-rose-900/20 transition-colors duration-300 flex items-center justify-center">
                <Heart className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" fill="white" size={32} />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
