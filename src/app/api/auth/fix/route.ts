import { NextResponse } from "next/server";
import { isMongoConnected } from "@/lib/dbHelper";
import connectDB from "@/lib/db";
import User from "@/models/User";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const isConnected = await isMongoConnected();
  
  // Valid bcrypt hash for "admin123"
  const hash = "$2b$10$yz9tGhNoROqAl9thWVxPe.DX7YydX.J9zvID.G9wRvQI6DyhtkTj6";
  const email = "ahmedmahmoud@gmail.com";
  
  if (isConnected) {
    try {
      await connectDB();
      await User.findOneAndUpdate(
        { email },
        { 
          $set: { 
            passwordHash: hash,
            role: "admin",
            name: "ahmed admin",
            phone: "001556533745"
          }
        },
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, message: "تم إصلاح وتحديث حساب الأدمن في قاعدة بيانات MongoDB", db: "mongo" });
    } catch (e: any) {
      return NextResponse.json({ success: false, message: e.message });
    }
  } else {
    // Modify local db if not connected
    try {
      const LOCAL_DB_PATH = path.join(process.cwd(), "hemo_db.json");
      let db = fs.readFileSync(LOCAL_DB_PATH, "utf8");
      let parsed = JSON.parse(db);
      
      const userIndex = parsed.users.findIndex((u: any) => u.email === email);
      if (userIndex !== -1) {
        parsed.users[userIndex].passwordHash = hash;
        parsed.users[userIndex].role = "admin";
      } else {
        parsed.users.push({
          _id: "usr_admin_fix",
          name: "ahmed admin",
          email: email,
          passwordHash: hash,
          role: "admin",
          createdAt: new Date().toISOString()
        });
      }
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(parsed, null, 2));
      return NextResponse.json({ success: true, message: "تم إصلاح وتحديث حساب الأدمن في الملف المحلي", db: "local" });
    } catch (e: any) {
       return NextResponse.json({ success: false, message: e.message });
    }
  }
}
