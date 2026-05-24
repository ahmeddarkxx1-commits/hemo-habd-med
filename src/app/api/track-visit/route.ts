import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Setting from "@/models/Setting";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const LOCAL_DB_PATH = path.join(process.cwd(), "hemo_db.json");

export async function POST() {
  try {
    // ── Try MongoDB first ────────────────────────────────────────
    await connectDB();
    let doc = await Setting.findOne({});
    if (!doc) {
      doc = await Setting.create({ totalVisits: 1 });
    } else {
      doc = await Setting.findOneAndUpdate(
        {},
        { $inc: { totalVisits: 1 } },
        { new: true }
      );
    }
    return NextResponse.json({ success: true, totalVisits: doc.totalVisits });
  } catch {
    // ── Fallback: local JSON DB ──────────────────────────────────
    try {
      if (!fs.existsSync(LOCAL_DB_PATH)) {
        return NextResponse.json({ success: true, totalVisits: 0 });
      }
      const raw = fs.readFileSync(LOCAL_DB_PATH, "utf8");
      const db = JSON.parse(raw);
      db.totalVisits = (db.totalVisits ?? 0) + 1;
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(db, null, 2), "utf8");
      return NextResponse.json({ success: true, totalVisits: db.totalVisits });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 500 }
      );
    }
  }
}
