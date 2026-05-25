/**
 * تحويل اسم المنتج العربي إلى slug صالح لـ URL
 * مثال: "بلوفر صوف ألباكا تريكو" → "بلوفر-صوف-ألباكا-تريكو"
 */
export function nameToSlug(name: string): string {
  return name
    .trim()
    .replace(/[\s_]+/g, "-")            // مسافات → شرطة
    .replace(/[^\u0600-\u06FF\w-]/g, "") // احذف ما ليس عربي/إنجليزي/رقم/شرطة
    .replace(/-{2,}/g, "-")             // شرطات متكررة → شرطة واحدة
    .replace(/^-+|-+$/g, "");           // احذف شرطة من الطرفين
}

/**
 * ابحث عن منتج بالـ slug أو الـ ID
 */
export function findProductBySlugOrId(products: any[], slugOrId: string): any | null {
  // جرّب الـ ID أولاً (أسرع)
  const byId = products.find(
    (p) => p._id === slugOrId || p.id === slugOrId
  );
  if (byId) return byId;

  // جرّب الـ slug (اسم المنتج)
  const decodedSlug = decodeURIComponent(slugOrId);
  return products.find(
    (p) => nameToSlug(p.name) === decodedSlug || nameToSlug(p.name) === slugOrId
  ) || null;
}
