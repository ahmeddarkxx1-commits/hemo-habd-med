"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Scissors, Clock, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      {/* Hero Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-sm tracking-[0.1em] text-rose-500 font-medium">قصتنا</span>
            <h1 className="font-serif text-5xl md:text-6xl leading-tight">
              خيوط تحكي قصة <br/><span className="italic text-rose-400">شغف وإبداع</span>
            </h1>
            <p className="text-lg text-[#5A5452]/70 font-light leading-relaxed max-w-lg">
              في هيمو هاند ميد، نؤمن بأن أجمل الأشياء هي تلك التي تُصنع ببطء وعناية فائقة. بدأ شغفنا بالتريكو والكروشيه من حبنا للدفء، للنسيج، ولإعطاء الحياة لخيوط بسيطة لتصبح قطعاً فنية ترتديها.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-rose-200 rounded-[3rem] -rotate-3 scale-105 z-0" />
            <div className="relative aspect-square md:aspect-[4/3] bg-sand-200 rounded-[3rem] z-10 flex items-center justify-center overflow-hidden shadow-xl">
              <Image 
                src="/products/WhatsApp Image 2026-05-06 at 10.39.44 PM (1).jpeg" 
                alt="غزل وإبر" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white py-24 px-6 md:px-12 border-y border-sand-200">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div>
            <h2 className="font-serif text-4xl mb-6">فلسفتنا في العمل</h2>
            <p className="text-[#5A5452]/70 font-light leading-relaxed">
              نحن نقف ضد الموضة السريعة والاستهلاك المفرط. كل قطعة في متجرنا تأخذ ساعات، وأحياناً أياماً، لتكتمل. 
              هذا ليس مجرد منتج نبيعه، بل هو جزء من وقتنا، ومشاعرنا، واهتمامنا، نهديه لكِ ليدوم سنوات طويلة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 mb-4">
                <Heart strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl mb-2">صُنع بحب</h3>
              <p className="text-sm text-[#5A5452]/60 font-light">كل غرزة تحمل معها مشاعر دافئة واهتماماً بكل التفاصيل الدقيقة.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center text-sage-500 mb-4">
                <Scissors strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl mb-2">صناعة يدوية 100%</h3>
              <p className="text-sm text-[#5A5452]/60 font-light">لا آلات، فقط أيادي ماهرة وأبر تريكو وكروشيه تتراقص لتصنع الجمال.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-sand-100 rounded-full flex items-center justify-center text-sand-500 mb-4">
                <Clock strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl mb-2">أزياء بطيئة</h3>
              <p className="text-sm text-foreground/60 font-light">نتأنى في اختيار خاماتنا وفي حياكة قطعنا لتكون مستدامة وتدوم طويلاً.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-lavender-100 rounded-full flex items-center justify-center text-lavender-500 mb-4">
                <Sparkles strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl mb-2">جودة فاخرة</h3>
              <p className="text-sm text-foreground/60 font-light">نستخدم أفضل أنواع الخيوط من الصوف والقطن لضمان الملمس الناعم والمريح.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl mb-6">كوني جزءاً من عائلتنا</h2>
        <p className="text-[#5A5452]/70 font-light mb-10 max-w-lg mx-auto">
          ندعوكِ لاكتشاف مجموعاتنا، ولمس الجودة بنفسك، واقتناء قطعة فريدة صُنعت خصيصاً لتليق بكِ.
        </p>
        <Link 
          href="/shop" 
          className="inline-flex items-center justify-center bg-[#5A5452] text-white px-10 py-4 rounded-full font-medium hover:bg-rose-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          تصفحي المتجر
        </Link>
      </section>
    </div>
  );
}
