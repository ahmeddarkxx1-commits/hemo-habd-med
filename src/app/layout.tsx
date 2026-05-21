import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import { CartProvider } from "@/lib/CartContext";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import "./globals.css";

const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const tajawal = Tajawal({ 
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hemohandmade.com'),
  title: {
    default: "HEMO HAND MADE | أزياء تريكو وكروشيه فاخرة",
    template: "%s | HEMO HAND MADE"
  },
  description: "بوتيك فاخر مخصص لحركة الأزياء البطيئة، يقدم أزياء تريكو وكروشيه وملابس أطفال مصنوعة يدوياً بحب وعناية في مصر.",
  keywords: ["تريكو", "كروشيه", "أزياء بطيئة", "صناعة يدوية", "ملابس أطفال", "حقائب كروشيه", "مصر", "handmade", "knitwear", "crochet"],
  authors: [{ name: "HEMO HAND MADE" }],
  creator: "HEMO HAND MADE",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://hemohandmade.com",
    title: "HEMO HAND MADE | أزياء تريكو وكروشيه فاخرة",
    description: "بوتيك فاخر مخصص لحركة الأزياء البطيئة، يقدم أزياء تريكو وكروشيه وملابس أطفال مصنوعة يدوياً بحب وعناية.",
    siteName: "HEMO HAND MADE",
    images: [
      {
        url: "/og-image.jpg", // We will create this or use existing later
        width: 1200,
        height: 630,
        alt: "HEMO HAND MADE Boutique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HEMO HAND MADE | أزياء تريكو وكروشيه فاخرة",
    description: "بوتيك فاخر مخصص لحركة الأزياء البطيئة.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
    languages: {
      "ar-EG": "/",
      "en-US": "/en",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body className="font-sans min-h-screen bg-ivory-100 text-foreground overflow-x-hidden">
        <CartProvider>
          <Navbar />
          <CartSidebar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
