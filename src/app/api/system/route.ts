import { NextResponse } from "next/server";
import { seed } from "@/db/seed";

export async function GET() {
  try {
    // We try to seed. In a real production environment, 
    // you'd run 'npx drizzle-kit push' from your terminal once.
    await seed();
    return NextResponse.json({ 
      message: "System initialized successfully",
      status: "Database tables verified and seed data inserted."
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ 
      error: "System initialization failed",
      details: error.message,
      hint: "Make sure you have connected your Vercel Postgres storage to this project."
    }, { status: 500 });
  }
}
