import { NextResponse } from "next/server";

type Listing = {
  id: string;
  title: string;
  price: number;
  status: "VISIBLE" | "HIDDEN" | "SOLD";
  lat: number; // latitude
  lng: number; // longitude
  images?: string[];
  desc?: string;
  house?: string;
  owner?: string;
};

export const dynamic = "force-dynamic"; // avoid caching during dev

// GET: return an array wrapped as { listings: [...] }
export async function GET() {
  try {
    // Demo data with Harry Potter themed properties
    const listings: Listing[] = [
      { 
        id: "1", 
        title: "Gryffindor Tower Suite", 
        price: 1500, 
        status: "VISIBLE", 
        lat: 40.7128, 
        lng: -74.0060,
        desc: "A magnificent suite in the iconic Gryffindor Tower with views of the Forbidden Forest. Features a roaring fireplace and enchanted ceiling that shows the night sky.",
        house: "GRYFFINDOR",
        owner: "0x1234567890123456789012345678901234567890",
        images: ["/placeholder-house.jpg"]
      },
      { 
        id: "2", 
        title: "Slytherin Dungeon Chambers", 
        price: 1800, 
        status: "VISIBLE", 
        lat: 40.7589, 
        lng: -73.9851,
        desc: "Elegant chambers beneath the lake with green-tinted windows and silver furnishings. Perfect for those who appreciate ambition and cunning.",
        house: "SLYTHERIN",
        owner: "0x2345678901234567890123456789012345678901",
        images: ["/placeholder-house.jpg"]
      },
      { 
        id: "3", 
        title: "Ravenclaw Eagle's Nest", 
        price: 1200, 
        status: "VISIBLE", 
        lat: 40.7505, 
        lng: -73.9934,
        desc: "A cozy apartment in the Ravenclaw Tower with a library and study nooks. Ideal for scholars and those who value wisdom.",
        house: "RAVENCLAW",
        owner: "0x3456789012345678901234567890123456789012",
        images: ["/placeholder-house.jpg"]
      },
      { 
        id: "4", 
        title: "Hufflepuff Badger Burrow", 
        price: 1000, 
        status: "VISIBLE", 
        lat: 40.7829, 
        lng: -73.9654,
        desc: "A warm and welcoming home near the kitchens with plenty of space for gatherings. Perfect for those who value loyalty and hard work.",
        house: "HUFFLEPUFF",
        owner: "0x4567890123456789012345678901234567890123",
        images: ["/placeholder-house.jpg"]
      },
      { 
        id: "5", 
        title: "Diagon Alley Shop", 
        price: 2200, 
        status: "VISIBLE", 
        lat: 40.7648, 
        lng: -73.9808,
        desc: "A charming shop space in the heart of Diagon Alley, perfect for magical commerce. Includes living quarters above the store.",
        house: "GRYFFINDOR",
        owner: "0x5678901234567890123456789012345678901234",
        images: ["/placeholder-house.jpg"]
      },
      { 
        id: "6", 
        title: "Hogsmeade Cottage", 
        price: 900, 
        status: "VISIBLE", 
        lat: 40.7568, 
        lng: -73.9745,
        desc: "A quaint cottage in the magical village of Hogsmeade with views of Hogwarts Castle. Features a garden with magical plants.",
        house: "HUFFLEPUFF",
        owner: "0x6789012345678901234567890123456789012345",
        images: ["/placeholder-house.jpg"]
      }
    ];
    
    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error in listings API:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

// POST: (optional) create listing — keeps shape consistent
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // minimal validation
    const newItem: Listing = {
      id: crypto.randomUUID(),
      title: String(body.title ?? ""),
      price: Number(body.price ?? 0),
      status: (body.status as Listing["status"]) ?? "VISIBLE",
      lat: Number(body.lat),
      lng: Number(body.lng),
      desc: String(body.desc ?? ""),
      house: String(body.house ?? "GRYFFINDOR"),
      owner: String(body.owner ?? ""),
      images: Array.isArray(body.images) ? body.images : [],
    };
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
} 