import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // منع صفحات الإدمن والحساب الشخصي من الأرشفة
        disallow: ["/admin/", "/account/", "/checkout/", "/cart/", "/api/"],
      },
    ],
    sitemap: "https://hemohandmade.com/sitemap.xml",
    host: "https://hemohandmade.com",
  };
}
