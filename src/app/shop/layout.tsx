import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المتجر",
  description: "تسوقي أجمل قطع التريكو والكروشيه اليدوية من هيمو هاند ميد — ملابس نساء وأطفال وإكسسوارات مصنوعة بحب في مصر.",
  keywords: [
    "متجر تريكو", "كروشيه اون لاين", "ملابس شتوي يدوية", "تريكو مصر",
    "بلوفر كروشيه", "طاقية تريكو", "شنطة كروشيه", "handmade shop egypt",
    "crochet online", "knitwear egypt", "slow fashion", "هيمو هاند ميد",
  ],
  openGraph: {
    title: "تسوقي الآن — هيمو هاند ميد",
    description: "قطع تريكو وكروشيه يدوية فريدة من نوعها. تسوقي بأمان وتسليم لجميع محافظات مصر.",
    url: "https://hemohandmade.com/shop",
    type: "website",
  },
  alternates: { canonical: "/shop" },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
