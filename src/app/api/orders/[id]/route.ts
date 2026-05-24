import { NextResponse } from "next/server";
import { dbHelper } from "@/lib/dbHelper";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const { status, depositPaid } = body;

    // Update deposit confirmation
    if (depositPaid === true) {
      const updatedOrder = await dbHelper.updateOrder(params.id, { depositPaid: true });
      if (!updatedOrder) {
        return NextResponse.json({ success: false, message: "الطلب غير موجود" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updatedOrder });
    }

    // Update order status
    if (!status || !["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return NextResponse.json({ success: false, message: "حالة الطلب غير صالحة" }, { status: 400 });
    }

    const updatedOrder = await dbHelper.updateOrderStatus(params.id, status);
    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
