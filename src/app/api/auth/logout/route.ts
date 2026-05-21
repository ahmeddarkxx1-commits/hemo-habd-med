import { NextResponse } from "next/server";
import { deleteSessionCookie } from "@/lib/auth";

export async function POST() {
  try {
    deleteSessionCookie();
    return NextResponse.json(
      { success: true, message: "تم تسجيل الخروج بنجاح" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "حدث خطأ أثناء تسجيل الخروج" },
      { status: 500 }
    );
  }
}
