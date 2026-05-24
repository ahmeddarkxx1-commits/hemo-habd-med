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
    
    if (body.action === 'seed') {
      await dbHelper.seedShippingRates();
      return NextResponse.json({ success: true, message: "تم تحديث جميع المحافظات بنجاح" });
    }
    
    const { governorate, rate, estimatedDays } = body;
    const updatedRate = await dbHelper.updateShippingRate(governorate, Number(rate), estimatedDays || "3-5 أيام");
    return NextResponse.json({ success: true, data: updatedRate });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const governorate = searchParams.get('governorate');
    
    if (!governorate) {
      return NextResponse.json({ success: false, message: "المحافظة مطلوبة" }, { status: 400 });
    }
    
    await dbHelper.deleteShippingRate(governorate);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
