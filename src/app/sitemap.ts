import { MetadataRoute } from "next";
import { dbHelper } from "@/lib/dbHelper";

const BASE_URL = "https://hemohandmade.com";

// الصفحات الثابتة مع أولوياتها وتكرار التحديث
const staticPages: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/shop`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/collections`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/process`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/faq`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/shipping-returns`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
];

// صفحات الأقسام
const categoryPages: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/shop/category/شرابات`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    url: `${BASE_URL}/shop/category/كوفيات`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    url: `${BASE_URL}/shop/category/جوانتيات`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    url: `${BASE_URL}/shop/category/جواكت`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    url: `${BASE_URL}/shop/category/بلوفرات-تريكو`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    url: `${BASE_URL}/shop/category/بلوفرات-كروشيه`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    url: `${BASE_URL}/shop/category/سالوبيت-اطفال`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  },
];

/**
 * تحويل اسم المنتج العربي إلى slug صالح لـ URL
 * مثال: "بلوفر صوف ألباكا تريكو" → "بلوفر-صوف-ألباكا-تريكو"
 */
function nameToSlug(name: string): string {
  return name
    .trim()
    // استبدال المسافات والشرطات السفلية بشرطة عادية
    .replace(/[\s_]+/g, "-")
    // حذف أي حرف ليس حرفاً عربياً أو إنجليزياً أو رقماً أو شرطة
    .replace(/[^\u0600-\u06FF\w-]/g, "")
    // حذف الشرطات المتكررة
    .replace(/-{2,}/g, "-")
    // حذف الشرطة من البداية أو النهاية
    .replace(/^-+|-+$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // جلب المنتجات ديناميكياً
    const products = await dbHelper.getProducts();

    const productPages: MetadataRoute.Sitemap = products.map((product: any) => {
      const slug = nameToSlug(product.name || product._id || product.id);
      return {
        url: `${BASE_URL}/shop/${slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });

    return [...staticPages, ...categoryPages, ...productPages];
  } catch {
    // في حالة فشل جلب المنتجات، نرجع الصفحات الثابتة وصفحات الأقسام
    return [...staticPages, ...categoryPages];
  }
}
