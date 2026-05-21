import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { products } from "@/lib/data";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";
    
    if (force) {
      await Product.deleteMany({});
    }

    const existingCount = await Product.countDocuments();
    
    if (existingCount === 0) {
      // Prepare products for Mongo
      const preparedProducts = products.map((p, i) => {
        // Use the explicit imageFileName if available, otherwise fallback
        const fileName = (p as any).imageFileName || `product-${p.id}.jpeg`;
        let imagePath = `/products/${fileName}`;
        
        return {
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          images: [imagePath],
          colors: p.colors,
          sizes: p.sizes,
          isFeatured: p.featured || false
        };
      });

      await Product.insertMany(preparedProducts);
      return NextResponse.json({ success: true, message: "تمت إضافة المنتجات بنجاح إلى قاعدة البيانات" });
    }

    return NextResponse.json({ success: true, message: "Database already has products" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
