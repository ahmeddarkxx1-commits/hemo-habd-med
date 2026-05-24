import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import { CartProvider } from "@/lib/CartContext";
import { WishlistProvider } from "@/lib/WishlistContext";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import GlobalNotification from "@/components/GlobalNotification";
import WhatsAppButton from "@/components/WhatsAppButton";
import VisitTracker from "@/components/VisitTracker";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
});

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  // ── Base ──────────────────────────────────────────────────────────────────
  metadataBase: new URL("https://hemohandmade.com"),

  // ── Title ─────────────────────────────────────────────────────────────────
  title: {
    default: "هيمو هاند ميد | تريكو وكروشيه يدوي فاخر من مصر",
    template: "%s | هيمو هاند ميد",
  },

  // ── Description ───────────────────────────────────────────────────────────
  description:
    "متجر هيمو هاند ميد — بوتيك مصري متخصص في أزياء التريكو والكروشيه اليدوية الفاخرة. ملابس نساء، ملابس أطفال، إكسسوارات مصنوعة بحب وعناية في الإسكندرية، مصر.",

  // ── Keywords (عربي + إنجليزي) ─────────────────────────────────────────────
  keywords: [
    "تريكو يدوي", "كروشيه مصر", "ملابس شتوي يدوية", "أزياء بطيئة",
    "ملابس أطفال كروشيه", "شنطة كروشيه", "بلوفر تريكو", "طاقية كروشيه",
    "متجر اون لاين مصر", "إكسسوارات يدوية", "هيمو هاند ميد",
    "handmade egypt", "crochet online", "knitwear egypt",
    "slow fashion", "handmade knitwear", "crochet bags egypt",
  ],

  // ── Authors & Creator ─────────────────────────────────────────────────────
  authors: [{ name: "هيمو هاند ميد", url: "https://hemohandmade.com" }],
  creator: "هيمو هاند ميد",
  publisher: "هيمو هاند ميد",

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://hemohandmade.com",
    siteName: "هيمو هاند ميد",
    title: "هيمو هاند ميد | تريكو وكروشيه يدوي فاخر من مصر",
    description:
      "بوتيك مصري فاخر متخصص في تريكو وكروشيه يدوي. أزياء فريدة لكل امرأة تقدّر الأصالة والجمال اليدوي.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "متجر هيمو هاند ميد — تريكو وكروشيه يدوي",
      },
    ],
  },

  // ── Twitter Card ──────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "هيمو هاند ميد | تريكو وكروشيه يدوي فاخر من مصر",
    description:
      "بوتيك مصري فاخر متخصص في تريكو وكروشيه يدوي. أزياء فريدة لكل امرأة تقدّر الأصالة.",
    images: ["/og-image.jpg"],
  },

  // ── Canonical ─────────────────────────────────────────────────────────────
  alternates: {
    canonical: "/",
    languages: {
      "ar-EG": "/",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cormorant.variable} ${nunito.variable}`}>
      <body className="font-sans min-h-screen bg-ivory-100 text-foreground overflow-x-hidden">
        <WishlistProvider>
          <CartProvider>
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#333',
                  color: '#fff',
                  fontFamily: 'var(--font-nunito)',
                },
              }} 
            />
            <VisitTracker />
            <Navbar />
            <CartSidebar />
            <GlobalNotification />
            <WhatsAppButton />
            {children}
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
