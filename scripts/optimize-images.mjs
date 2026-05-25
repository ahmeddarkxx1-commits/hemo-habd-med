import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(__dirname, "..", "public", "products");

// ضغط أقوى: جودة 70 وحجم أصغر
const WEBP_QUALITY = 70;
const MAX_WIDTH    = 1000;
const MAX_HEIGHT   = 1400;

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  // تجاهل ملفات WebP الموجودة (تم إنشاؤها مسبقاً)
  if (ext === ".webp") return null;
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return null;

  const originalSize = fs.statSync(filePath).size;
  const dir  = path.dirname(filePath);
  const base = path.basename(filePath, ext);
  const webpPath = path.join(dir, base + ".webp");

  // تجاهل إذا كان WebP موجود بالفعل وأصغر
  if (fs.existsSync(webpPath)) {
    const existingWebpSize = fs.statSync(webpPath).size;
    // احذف وأعد الإنشاء بإعدادات أفضل
    fs.unlinkSync(webpPath);
  }

  try {
    // الخطوة 1: اعرف أبعاد الصورة الأصلية
    const meta = await sharp(filePath).metadata();
    const origW = meta.width  || 0;
    const origH = meta.height || 0;

    // الخطوة 2: حوّل لـ WebP بجودة عالية
    await sharp(filePath)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(webpPath);

    const newWebpSize = fs.statSync(webpPath).size;
    const saved = ((1 - newWebpSize / originalSize) * 100).toFixed(0);
    const savedKB = ((originalSize - newWebpSize) / 1024).toFixed(0);

    return {
      name: path.basename(filePath, ext),
      origKB:  (originalSize  / 1024).toFixed(0),
      webpKB:  (newWebpSize   / 1024).toFixed(0),
      saved:   saved,
      savedKB: savedKB,
      origDims: `${origW}x${origH}`,
    };
  } catch (err) {
    console.error(`❌ خطأ: ${path.basename(filePath)} → ${err.message}`);
    return null;
  }
}

async function main() {
  console.log("━".repeat(75));
  console.log("  🖼️  HEMO HAND — ضغط الصور لـ WebP (جودة مُحسَّنة)");
  console.log("━".repeat(75) + "\n");

  const files = fs.readdirSync(PRODUCTS_DIR)
    .map(f => path.join(PRODUCTS_DIR, f))
    .filter(f => {
      if (!fs.statSync(f).isFile()) return false;
      const ext = path.extname(f).toLowerCase();
      return [".jpg", ".jpeg", ".png"].includes(ext);
    });

  console.log(`📂 إجمالي الصور: ${files.length} صورة\n`);

  let totalOrig  = 0;
  let totalWebP  = 0;

  for (const file of files) {
    totalOrig += fs.statSync(file).size;
    const r = await optimizeImage(file);
    if (r) {
      totalWebP += fs.statSync(path.join(PRODUCTS_DIR, r.name + ".webp")).size;
      const bar = "█".repeat(Math.max(0, Number(r.saved) / 5));
      const sign = Number(r.saved) >= 0 ? "▼" : "▲";
      console.log(
        `  ✅ ${r.name.substring(0, 40).padEnd(40)} ` +
        `${String(r.origKB).padStart(4)} KB → ${String(r.webpKB).padStart(4)} KB WebP  ` +
        `${sign}${Math.abs(Number(r.saved))}%  ${bar}`
      );
    }
  }

  const totalSavedMB = ((totalOrig - totalWebP) / 1024 / 1024).toFixed(2);
  const totalSavedPct = Math.round((1 - totalWebP / totalOrig) * 100);

  console.log("\n" + "━".repeat(75));
  console.log(`  📊 النتيجة النهائية:`);
  console.log(`     JPEG الأصلية : ${(totalOrig  / 1024 / 1024).toFixed(2)} MB`);
  console.log(`     WebP الجديدة : ${(totalWebP  / 1024 / 1024).toFixed(2)} MB`);
  console.log(`     ✨ وفّرنا     : ${totalSavedMB} MB (${totalSavedPct}%)`);
  console.log("━".repeat(75));
  console.log("\n  🎉 ملفات WebP جاهزة في /public/products/");
  console.log("  💡 الخطوة التالية: عدّل الكود يستخدم .webp بدل .jpeg\n");
}

main();
