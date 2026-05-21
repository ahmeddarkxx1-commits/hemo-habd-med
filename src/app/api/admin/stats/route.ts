export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbHelper } from "@/lib/dbHelper";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const sessionUser = getSessionUser();
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, message: "غير مصرح بالدخول" },
        { status: 401 }
      );
    }

    const user = await dbHelper.getUserById(sessionUser.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "غير مصرح بالدخول" },
        { status: 403 }
      );
    }

    const stats = await dbHelper.getStats();
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
