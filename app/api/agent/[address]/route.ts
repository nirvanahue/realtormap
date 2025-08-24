import { NextResponse } from "next/server";
import { getAgent } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const agent = await getAgent(params.address);
    
    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent" },
      { status: 500 }
    );
  }
} 