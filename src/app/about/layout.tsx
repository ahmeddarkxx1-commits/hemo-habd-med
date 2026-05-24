import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن",
  description: "تعرفي على قصة هيمو هاند ميد — بوتيك مصري مخصص لأزياء الحركة البطيئة، يصنع بالحب قطع تريكو وكروشيه يدوية فاخرة لكل امرأة تقدّر الأصالة.",
  keywords: [
    "هيمو هاند ميد", "قصة البراند", "صناعة يدوية مصر", "أزياء بطيئة",
    "slow fashion egypt", "handmade brand egypt", "crochet brand",
  ],
  openGraph: {
    title: "من نحن — هيمو هاند ميد",
    description: "بوتيك مصري فاخر يصنع بالحب قطع تريكو وكروشيه يدوية. تعرفي على قصتنا وقيمنا.",
    url: "https://hemohandmade.com/about",
    type: "website",
  },
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
