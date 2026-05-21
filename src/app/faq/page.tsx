export const metadata = {
  title: "الأسئلة الشائعة",
  description: "الأسئلة الشائعة حول منتجات هيمو هاند ميد وخدمات التوصيل.",
};

export default function FAQPage() {
  return (
    <div className="pt-32 px-6 md:px-12 max-w-3xl mx-auto pb-24 text-right">
      <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-12 font-semibold text-center">الأسئلة الشائعة</h1>
      
      <div className="space-y-8">
        <div className="border-b border-sand-200 pb-6">
          <h3 className="font-serif text-xl font-semibold mb-3 text-foreground">كم تستغرق عملية تجهيز الطلب؟</h3>
          <p className="text-foreground/80 leading-relaxed">
            لأن جميع قطعنا تُصنع يدوياً بحب وعناية فائقة خصيصاً لكِ، تستغرق عملية التجهيز عادة من 7 إلى 14 يوم عمل قبل الشحن.
          </p>
        </div>

        <div className="border-b border-sand-200 pb-6">
          <h3 className="font-serif text-xl font-semibold mb-3 text-foreground">هل يمكنني طلب مقاسات خاصة؟</h3>
          <p className="text-foreground/80 leading-relaxed">
            نعم بالتأكيد! نحن نرحب بالطلبات الخاصة. يمكنك كتابة المقاسات المطلوبة في ملاحظات الطلب أو التواصل معنا مباشرة عبر الواتساب لتأكيد التفاصيل.
          </p>
        </div>

        <div className="border-b border-sand-200 pb-6">
          <h3 className="font-serif text-xl font-semibold mb-3 text-foreground">كيف يمكنني العناية بالقطع المحبوكة يدوياً؟</h3>
          <p className="text-foreground/80 leading-relaxed">
            للحفاظ على جودة ونعومة القطع، ننصح بالغسيل اليدوي بماء بارد ومنظف لطيف مخصص للصوف. يجب تجفيف القطع بشكل مسطح وعدم تعليقها وهي مبللة لتجنب التمدد.
          </p>
        </div>

        <div className="border-b border-sand-200 pb-6">
          <h3 className="font-serif text-xl font-semibold mb-3 text-foreground">ما هي سياسة الاسترجاع؟</h3>
          <p className="text-foreground/80 leading-relaxed">
            نظراً لأن القطع تُصنع خصيصاً بناءً على طلبك، فإننا لا نقبل الاسترجاع إلا في حالة وجود عيب مصنعي في القطعة المستلمة. يرجى مراجعة جدول المقاسات بدقة قبل الطلب.
          </p>
        </div>
      </div>
    </div>
  );
}
