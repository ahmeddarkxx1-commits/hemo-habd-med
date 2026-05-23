import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-sand-50">
      <Navbar />
      <div className="container mx-auto px-4 py-32 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8 text-center">سياسة الخصوصية</h1>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. جمع المعلومات</h2>
            <p>في متجر هيمو هاند ميد، نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. نقوم بجمع المعلومات التي تقدمها لنا طواعية عند إنشاء حساب، إتمام عملية شراء، أو التواصل معنا. هذه المعلومات تشمل الاسم، رقم الهاتف، عنوان الشحن، والبريد الإلكتروني.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. استخدام المعلومات</h2>
            <p>نستخدم معلوماتك الشخصية للأغراض التالية:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>معالجة طلباتك وتوصيل المنتجات إليك.</li>
              <li>التواصل معك بخصوص حالة طلبك أو للرد على استفساراتك.</li>
              <li>تحسين تجربة التسوق الخاصة بك وتقديم خدمة عملاء أفضل.</li>
              <li>إرسال تحديثات أو عروض ترويجية (إذا كنت قد وافقت على ذلك).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. حماية البيانات</h2>
            <p>نحن نتخذ كافة التدابير الأمنية اللازمة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الكشف عنها. لا نقوم ببيع أو تأجير أو مشاركة معلوماتك الشخصية مع أطراف ثالثة إلا لغرض إتمام طلبك (مثل شركات الشحن).</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. ملفات تعريف الارتباط (Cookies)</h2>
            <p>يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربتك وتذكر تفضيلاتك وسلتك الشرائية. يمكنك تعطيل ملفات تعريف الارتباط من إعدادات المتصفح الخاص بك، ولكن قد يؤثر ذلك على بعض وظائف الموقع.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. التعديلات على سياسة الخصوصية</h2>
            <p>نحتفظ بالحق في تحديث سياسة الخصوصية في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة، ونشجعك على مراجعتها بشكل دوري لتبقى على اطلاع بكيفية حمايتنا لبياناتك.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
