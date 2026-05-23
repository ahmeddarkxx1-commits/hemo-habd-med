import { NextRequest, NextResponse } from "next";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    // Fetch top 4 products sorted by salesCount
    const products = await Product.find({})
      .sort({ salesCount: -1 })
      .limit(4);
    
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
