import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    // Fetch only active notifications
    const activeNotifications = await Notification.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: activeNotifications });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch active notifications" }, { status: 500 });
  }
}
