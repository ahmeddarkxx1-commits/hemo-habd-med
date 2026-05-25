import { MetadataRoute } from "next";
import { dbHelper } from "@/lib/dbHelper";
import { nameToSlug } from "@/lib/slug";

const BASE_URL = "https://hemohandmade.com";

const staticPages: MetadataRoute.Sitemap = [
  { url: BASE_URL,                          lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
  { url: `${BASE_URL}/shop`,                lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE_URL}/collections`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  { url: `${BASE_URL}/about`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/contact`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/process`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/faq`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/shipping-returns`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
];

const categoryPages: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/shop/category/شرابات`,          lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
  { url: `${BASE_URL}/shop/category/كوفيات`,           lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
  { url: `${BASE_URL}/shop/category/جوانتيات`,         lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
  { url: `${BASE_URL}/shop/category/جواكت`,            lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
  { url: `${BASE_URL}/shop/category/بلوفرات-تريكو`,   lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
  { url: `${BASE_URL}/shop/category/بلوفرات-كروشيه`,  lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
  { url: `${BASE_URL}/shop/category/سالوبيت-اطفال`,   lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
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
    return [...staticPages, ...categoryPages];
  }
}
