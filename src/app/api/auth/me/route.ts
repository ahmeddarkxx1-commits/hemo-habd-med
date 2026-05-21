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
    if (!user) {
      return NextResponse.json(
        { success: false, message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          governorate: user.governorate || "",
          address: user.address || "",
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Auth status error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "حدث خطأ أثناء جلب بيانات الجلسة" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const sessionUser = getSessionUser();
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, message: "غير مصرح بالدخول" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, governorate, address } = body;

    const updatedUser = await dbHelper.updateUser(sessionUser.userId, {
      name,
      phone,
      governorate,
      address,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "فشل تحديث بيانات المستخدم" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث البيانات بنجاح",
        data: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone || "",
          governorate: updatedUser.governorate || "",
          address: updatedUser.address || "",
          role: updatedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "حدث خطأ أثناء تحديث البيانات" },
      { status: 500 }
    );
  }
}
