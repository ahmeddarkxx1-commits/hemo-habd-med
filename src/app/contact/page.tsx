import { Mail, MapPin, Phone } from "lucide-react";
import connectDB from "@/lib/db";
import Setting from "@/models/Setting";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "تواصل معنا",
  description: "نحن هنا للإجابة على جميع استفساراتك حول منتجات هيمو هاند ميد — للطلبات المخصصة والاستفسارات تواصلي معنا الآن.",
  keywords: [
    "تواصل هيمو هاند ميد", "طلب مخصص تريكو", "استفسار كروشيه",
    "contact handmade egypt", "custom order knitwear",
  ],
  openGraph: {
    title: "تواصل معنا — هيمو هاند ميد",
    description: "تواصلي معنا للاستفسار أو لطلب قطعة مخصصة. يسعدنا مساعدتك.",
    url: "https://hemohandmade.com/contact",
    type: "website",
  },
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  await connectDB();
  const settings = await Setting.findOne() || {};

  return (
    <div className="pt-32 px-6 md:px-12 max-w-6xl mx-auto pb-24 text-right">
      <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6 font-semibold text-center">تواصل معنا</h1>
      <p className="text-foreground/80 text-center max-w-2xl mx-auto mb-16 text-lg">
        سعداء دائماً بالتواصل معك. سواء كان لديك استفسار عن منتج، أو ترغبين في طلب تصميم خاص، لا تترددي في مراسلتنا.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <h2 className="font-serif text-3xl font-semibold mb-6 text-foreground">معلومات التواصل</h2>
          
          <div className="flex items-start gap-4">
            <div className="bg-sand-100 p-3 rounded-full text-foreground mt-1">
              <Phone size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-lg text-foreground mb-1">الواتساب / الهاتف</h4>
              <p className="text-foreground/80 text-left" dir="ltr">{settings.storePhone || "+20 100 000 0000"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-sand-100 p-3 rounded-full text-foreground mt-1">
              <Mail size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-lg text-foreground mb-1">البريد الإلكتروني</h4>
              <p className="text-foreground/80">{settings.storeEmail || "hello@hemohandmade.com"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-sand-100 p-3 rounded-full text-foreground mt-1">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-lg text-foreground mb-1">المشغل</h4>
              <p className="text-foreground/80">الإسكندرية، المنتزه (زيارات المشغل بموعد مسبق فقط)</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-sand-100">
          <h2 className="font-serif text-2xl font-semibold mb-6 text-foreground">أرسلي رسالة</h2>
          <ContactForm whatsappNumber={settings.whatsapp || "201000000000"} />
        </div>
      </div>
    </div>
  );
}
