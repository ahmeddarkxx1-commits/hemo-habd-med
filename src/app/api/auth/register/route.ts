import { NextResponse } from "next/server";
import { dbHelper } from "@/lib/dbHelper";
import { hashPassword, generateToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, governorate, address } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "يرجى تعبئة جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، كلمة المرور)" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await dbHelper.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // For local testing or production, assign admin role based on ADMIN_EMAILS env variable if set
    const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
    const adminEmails = adminEmailsEnv
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0);

    let role: "user" | "admin" = "user";
    if (adminEmails.length > 0) {
      if (adminEmails.includes(email.toLowerCase().trim())) {
        role = "admin";
      }
    } else {
      // Fallback: first user or email containing "admin"
      const isFirstUser = (await dbHelper.getAllUsers()).length === 0;
      const isAdminEmail = email.toLowerCase().includes("admin");
      role = (isFirstUser || isAdminEmail) ? "admin" : "user";
    }

    // Create user
    const newUser = await dbHelper.createUser({
      name,
      email,
      passwordHash,
      phone,
      governorate,
      address,
      role,
    });

    // Generate token
    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role || "user",
    });

    // Set cookie
    setSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء الحساب بنجاح",
        data: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          governorate: newUser.governorate,
          address: newUser.address,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "حدث خطأ غير متوقع أثناء التسجيل" },
      { status: 500 }
    );
  }
}
