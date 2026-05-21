import { NextResponse } from "next/server";
import { dbHelper } from "@/lib/dbHelper";
import { comparePassword, generateToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "يرجى إدخال البريد الإلكتروني وكلمة المرور" },
        { status: 400 }
      );
    }

    // Find user
    const user = await dbHelper.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    // Compare password
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || "user",
    });

    // Set cookie
    setSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: "تم تسجيل الدخول بنجاح",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          governorate: user.governorate,
          address: user.address,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
