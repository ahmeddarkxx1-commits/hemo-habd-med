import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات على أكثر الأسئلة شيوعاً حول طلبات هيمو هاند ميد — طرق الدفع، مواعيد التسليم، الأحجام، والتخصيص.",
  keywords: [
    "أسئلة شائعة تريكو", "كيفية الطلب", "سياسة الإرجاع", "دفع عند الاستلام",
    "مواعيد التوصيل مصر", "faq handmade egypt", "كروشيه مخصص",
  ],
  openGraph: {
    title: "الأسئلة الشائعة — هيمو هاند ميد",
    description: "كل ما تحتاجين معرفته قبل الشراء من هيمو هاند ميد. إجابات واضحة وسريعة.",
    url: "https://hemohandmade.com/faq",
    type: "website",
  },
  alternates: { canonical: "/faq" },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
