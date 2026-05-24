import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "كيف نصنع قطعنا",
  description: "اكتشفي رحلة الخيط حتى يصبح قطعة فنية — عملية التصنيع اليدوي في هيمو هاند ميد خطوة بخطوة. حب وإتقان في كل غرزة.",
  keywords: [
    "طريقة صنع تريكو", "عملية كروشيه يدوي", "صناعة يدوية مصر", "handmade process",
    "crochet making process", "knitwear production", "slow fashion process",
  ],
  openGraph: {
    title: "كيف نصنع قطعنا — هيمو هاند ميد",
    description: "من اختيار الخيط إلى التغليف — تعرفي على عملية الصنع اليدوي لكل قطعة من هيمو هاند ميد.",
    url: "https://hemohandmade.com/process",
    type: "website",
  },
  alternates: { canonical: "/process" },
};

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
