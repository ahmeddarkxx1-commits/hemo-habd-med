import type { Metadata } from "next";
import { dbHelper } from "@/lib/dbHelper";

// ──────────────────────────────────────────────────────────
// Dynamic Metadata — يجلب بيانات المنتج لكل صفحة منتج
// ──────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    const product = await dbHelper.getProductById(params.id);

    if (!product) {
      return {
        title: "منتج غير موجود",
        description: "هذا المنتج غير متوفر حالياً في متجر هيمو هاند ميد.",
      };
    }

    const productName: string = product.name || "منتج من هيمو هاند ميد";
    const productDesc: string =
      product.description ||
      `${productName} — مصنوع يدوياً بالحب في مصر من هيمو هاند ميد.`;
    const productImage: string =
      (product.images && product.images[0]) || "/og-image.jpg";
    const productPrice: number = product.price || 0;
    const productUrl = `https://hemohandmade.com/shop/${params.id}`;

    return {
      title: `${productName} — هيمو هاند ميد`,
      description: `${productDesc.slice(0, 155)} | السعر: ${productPrice} جنيه`,
      keywords: [
        productName,
        "تريكو يدوي",
        "كروشيه مصر",
        "هيمو هاند ميد",
        "handmade egypt",
        "knitwear",
        "crochet",
      ],
      openGraph: {
        title: `${productName} — هيمو هاند ميد`,
        description: productDesc.slice(0, 200),
        url: productUrl,
        type: "website",
        images: [
          {
            url: productImage.startsWith("http")
              ? productImage
              : `https://hemohandmade.com${productImage}`,
            width: 800,
            height: 800,
            alt: productName,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${productName} — هيمو هاند ميد`,
        description: productDesc.slice(0, 200),
        images: [
          productImage.startsWith("http")
            ? productImage
            : `https://hemohandmade.com${productImage}`,
        ],
      },
      alternates: { canonical: `/shop/${params.id}` },
    };
  } catch {
    return {
      title: "هيمو هاند ميد",
      description: "متجر تريكو وكروشيه يدوي من مصر.",
    };
  }
}

// ──────────────────────────────────────────────────────────
// Product JSON-LD Schema — يُعرّف المنتج لـ Google Rich Results
// ──────────────────────────────────────────────────────────
async function ProductJsonLd({ id }: { id: string }) {
  try {
    const product = await dbHelper.getProductById(id);
    if (!product) return null;

    const productImage: string =
      (product.images && product.images[0]) || "/og-image.jpg";
    const imageUrl = productImage.startsWith("http")
      ? productImage
      : `https://hemohandmade.com${productImage}`;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description:
        product.description ||
        `${product.name} — مصنوع يدوياً من هيمو هاند ميد.`,
      image: imageUrl,
      brand: {
        "@type": "Brand",
        name: "هيمو هاند ميد",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "EGP",
        price: product.price,
        availability:
          product.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: `https://hemohandmade.com/shop/${id}`,
        seller: {
          "@type": "Organization",
          name: "هيمو هاند ميد",
        },
      },
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────────────────
// Layout Wrapper
// ──────────────────────────────────────────────────────────
export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <>
      <ProductJsonLd id={params.id} />
      {children}
    </>
  );
}
