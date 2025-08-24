import { NextResponse } from "next/server";
import { getHouseTotals } from "@/lib/db";

export async function GET() {
  try {
    const houseTotals = await getHouseTotals();
    return NextResponse.json(houseTotals);
  } catch (error) {
    console.error("Error fetching house totals:", error);
    return NextResponse.json(
      { error: "Failed to fetch house totals" },
      { status: 500 }
    );
  }
} 