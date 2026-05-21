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

    const customers = await dbHelper.getAllUsers();
    
    // Map out the sensitive fields like password hashes
    const sanitizedCustomers = customers.map((c: any) => ({
      id: c._id || c.id,
      name: c.name,
      email: c.email,
      phone: c.phone || "",
      governorate: c.governorate || "",
      address: c.address || "",
      role: c.role,
      createdAt: c.createdAt,
    }));

    return NextResponse.json(
      { success: true, data: sanitizedCustomers },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch customers error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "حدث خطأ أثناء جلب بيانات العملاء" },
      { status: 500 }
    );
  }
}
