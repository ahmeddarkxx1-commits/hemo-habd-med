export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbHelper } from "@/lib/dbHelper";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    const sessionUser = getSessionUser();
    
    if (userId) {
      // Validate that user is requesting their own orders or is admin
      if (!sessionUser) {
        return NextResponse.json({ success: false, message: "غير مصرح لك بمشاهدة هذه الطلبات" }, { status: 401 });
      }
      
      const user = await dbHelper.getUserById(sessionUser.userId);
      const isAdmin = user?.role === "admin";
      
      if (sessionUser.userId !== userId && !isAdmin) {
        return NextResponse.json({ success: false, message: "غير مصرح لك بمشاهدة هذه الطلبات" }, { status: 403 });
      }
      const orders = await dbHelper.getOrders(userId);
      return NextResponse.json({ success: true, data: orders }, { status: 200 });
    }
    
    // If getting all orders, user must be admin
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: "غير مصرح بالدخول" }, { status: 401 });
    }
    
    const user = await dbHelper.getUserById(sessionUser.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "غير مصرح بالدخول" }, { status: 403 });
    }
    
    const orders = await dbHelper.getOrders();
    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionUser = getSessionUser();
    
    const orderData = {
      ...body,
      userId: sessionUser ? sessionUser.userId : (body.userId || null)
    };
    
    const newOrder = await dbHelper.createOrder(orderData);
    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
