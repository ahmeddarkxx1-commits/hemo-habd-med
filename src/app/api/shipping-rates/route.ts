import { NextResponse } from "next/server";
import { dbHelper } from "@/lib/dbHelper";

export async function GET() {
  try {
    const rates = await dbHelper.getShippingRates();
    return NextResponse.json({ success: true, data: rates });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { governorate, rate, estimatedDays } = body;
    
    const updatedRate = await dbHelper.updateShippingRate(governorate, Number(rate), estimatedDays);
    return NextResponse.json({ success: true, data: updatedRate });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
