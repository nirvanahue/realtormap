import { NextResponse } from "next/server";
import { updateAgentPoints, getAgent } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, points, action } = body;

    if (!address || !points) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if agent exists
    const agent = await getAgent(address);
    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Award points
    const updatedAgent = await updateAgentPoints(address, points);

    return NextResponse.json({
      success: true,
      agent: updatedAgent,
      pointsAwarded: points,
      action,
    });
  } catch (error) {
    console.error("Error awarding points:", error);
    return NextResponse.json(
      { error: "Failed to award points" },
      { status: 500 }
    );
  }
} 