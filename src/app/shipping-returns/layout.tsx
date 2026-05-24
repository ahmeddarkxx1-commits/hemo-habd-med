import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشحن والإرجاع",
  description: "تعرفي على سياسة الشحن والتوصيل وشروط الإرجاع والاستبدال في متجر هيمو هاند ميد. نوصل لجميع محافظات مصر.",
  keywords: [
    "شحن مصر", "توصيل تريكو", "سياسة إرجاع", "استبدال منتج", "شحن كروشيه",
    "shipping egypt handmade", "return policy", "delivery knitwear egypt",
  ],
  openGraph: {
    title: "الشحن والإرجاع — هيمو هاند ميد",
    description: "سياسة شحن وإرجاع واضحة وشفافة. نوصل لكل محافظات مصر.",
    url: "https://hemohandmade.com/shipping-returns",
    type: "website",
  },
  alternates: { canonical: "/shipping-returns" },
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
