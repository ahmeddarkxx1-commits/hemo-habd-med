import { NextResponse } from "next/server";
import { dbHelper } from "@/lib/dbHelper";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    if (!body.userName || !body.rating || !body.comment) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const updatedProduct = await dbHelper.addProductReview(params.id, {
      userName: body.userName,
      rating: body.rating,
      comment: body.comment
    });

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProduct.reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
