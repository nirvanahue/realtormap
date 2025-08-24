import { NextResponse } from "next/server";
import { createAgent } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, house } = body;

    if (!address || !house) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const agent = await createAgent(address, house);
    return NextResponse.json(agent);
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    );
  }
} 