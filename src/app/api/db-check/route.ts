import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    const conn = await connectDB();
    const state = mongoose.connection.readyState;
    
    // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    
    return NextResponse.json({ 
      success: true, 
      status: states[state],
      database: mongoose.connection.name,
      host: mongoose.connection.host
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      status: "error",
      message: error.message,
      hint: error.message.includes("authentication failed") 
        ? "Please check your MongoDB password in .env.local" 
        : "Please check your network and MongoDB URI"
    }, { status: 500 });
  }
}
