import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { dbHelper } from "@/lib/dbHelper";
import connectDB from "@/lib/db";
import Setting from "@/models/Setting";

export async function GET() {
  try {
    await connectDB();
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: "غير مصرح بالدخول" }, { status: 401 });
    }
    
    const user = await dbHelper.getUserById(sessionUser.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "غير مصرح بالدخول" }, { status: 403 });
    }

    const body = await request.json();
    await connectDB();
    
    let settings = await Setting.findOne();
    if (settings) {
      settings = await Setting.findByIdAndUpdate(settings._id, body, { new: true });
    } else {
      settings = await Setting.create(body);
    }
    
    return NextResponse.json({ success: true, message: "تم حفظ الإعدادات بنجاح", data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
