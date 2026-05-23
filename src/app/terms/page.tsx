import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-sand-50">
      <Navbar />
      <div className="container mx-auto px-4 py-32 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8 text-center">شروط الخدمة</h1>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. مقدمة</h2>
            <p>مرحباً بك في متجر هيمو هاند ميد. باستخدامك لموقعنا، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية قبل إجراء أي عملية شراء.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. المنتجات والطلبات</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>جميع منتجاتنا مصنوعة يدوياً بحب واهتمام، لذلك قد توجد اختلافات طفيفة بين المنتج والصورة المعروضة، وهو ما يميز العمل اليدوي.</li>
              <li>نحتفظ بالحق في رفض أو إلغاء أي طلب لأي سبب، بما في ذلك قيود توفر المنتج أو الأخطاء في تسعير المنتج.</li>
              <li>قد يختلف وقت التنفيذ للمنتجات المخصصة حسب طبيعة الطلب وسيتم إبلاغك بالوقت المتوقع للتسليم.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. الدفع والتسعير</h2>
            <p>جميع الأسعار معروضة بالجنيه المصري. نحتفظ بالحق في تعديل الأسعار في أي وقت دون إشعار مسبق. الأسعار لا تشمل تكلفة الشحن إلا إذا تم ذكر ذلك صراحة.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. الاستبدال والاسترجاع</h2>
            <p>نظراً لطبيعة المنتجات اليدوية (الهاند ميد)، لا يمكننا قبول الاسترجاع إلا في حالة وجود عيب مصنعي واضح في المنتج عند استلامه. في حالة وجود عيب، يرجى التواصل معنا خلال 3 أيام من تاريخ الاستلام ليتم استبدال المنتج.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. حقوق الملكية الفكرية</h2>
            <p>جميع المحتويات المعروضة على هذا الموقع، بما في ذلك الصور والتصميمات والنصوص، هي ملك لمتجر هيمو هاند ميد ولا يجوز استخدامها أو نسخها دون إذن كتابي مسبق.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
