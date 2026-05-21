export const metadata = {
  title: "كيف نصنع قطعنا",
  description: "اكتشفي رحلة صناعة قطع هيمو هاند ميد خطوة بخطوة.",
};

export default function ProcessPage() {
  return (
    <div className="pt-32 px-6 md:px-12 max-w-4xl mx-auto pb-24 text-center">
      <span className="text-sm tracking-[0.2em] text-foreground mb-4 block font-bold uppercase">كيف نعمل</span>
      <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-12 font-semibold">صناعة يدوية بكل حب</h1>
      
      <div className="space-y-16 text-right mt-16">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-sand-100">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4 text-foreground">١. اختيار الخيوط</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            نبدأ باختيار أجود أنواع الخيوط الصوفية والقطنية التي تضمن لكِ الدفء والنعومة. لا نستخدم سوى الخامات التي تليق ببشرتك وبشرة أطفالك، لنضمن متانة القطعة وجمال ملمسها.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-sand-100">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4 text-foreground">٢. التصميم والحياكة</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            تأخذ كل قطعة ساعات طويلة من الحياكة اليدوية المتقنة. نعتني بكل غرزة وكل تفصيلة لضمان خروج التصميم بأبهى صورة. نحن لا نصنع ملابس، نحن نصنع فناً يمكن ارتدائه.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-sand-100">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4 text-foreground">٣. المراجعة والتغليف</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            قبل أن تصل القطعة بين يديكِ، نقوم بمراجعة جودتها بدقة عالية. ثم تُغلف بحب واهتمام لتصلك كتجربة فاخرة تليق بعائلة هيمو.
          </p>
        </div>
      </div>
    </div>
  );
}
