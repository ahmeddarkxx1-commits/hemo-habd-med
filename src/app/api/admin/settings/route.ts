import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSessionUser } from "@/lib/auth";
import { dbHelper } from "@/lib/dbHelper";

const SETTINGS_PATH = path.join(process.cwd(), "store_settings.json");

function getSettings() {
  if (!fs.existsSync(SETTINGS_PATH)) {
    const defaults = {
      storeName: "HEMO HAND",
      storePhone: "01234567890",
      storeEmail: "contact@hemohand.com",
      whatsapp: "201234567890",
      instagram: "hemo.hand",
      facebook: "hemohand",
    };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(defaults, null, 2), "utf8");
    return defaults;
  }
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
  } catch (e) {
    return {};
  }
}

export async function GET() {
  try {
    const settings = getSettings();
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
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ success: true, message: "تم حفظ الإعدادات بنجاح" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
