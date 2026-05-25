import { NextResponse } from "next/server";
import { dbHelper } from "@/lib/dbHelper";
import { findProductBySlugOrId } from "@/lib/slug";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // أولاً: جرّب الـ ID المباشر (الأسرع)
    let product = await dbHelper.getProductById(params.id);

    // ثانياً: لو ما وجدناش بالـ ID، جرّب الـ slug
    if (!product) {
      const allProducts = await dbHelper.getProducts();
      product = findProductBySlugOrId(allProducts, params.id);
    }

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedProduct = await dbHelper.updateProduct(params.id, body);
    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedProduct = await dbHelper.deleteProduct(params.id);
    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
