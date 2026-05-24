import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التشكيلات",
  description: "استكشفي أحدث تشكيلات هيمو هاند ميد — كولكشنات مصممة بعناية من أزياء تريكو وكروشيه يدوية تناسب كل المواسم.",
  keywords: [
    "كولكشن تريكو", "تشكيلات كروشيه", "موضة شتاء مصر", "تشكيلات يدوية",
    "collections crochet egypt", "knitwear collection", "handmade fashion collection",
  ],
  openGraph: {
    title: "التشكيلات — هيمو هاند ميد",
    description: "اكتشفي كولكشنات هيمو هاند ميد — قطع تريكو وكروشيه يدوية بتصاميم حصرية.",
    url: "https://hemohandmade.com/collections",
    type: "website",
  },
  alternates: { canonical: "/collections" },
};

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
