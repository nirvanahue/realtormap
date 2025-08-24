import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let type: string | undefined;
  try {
    const body = await req.json();
    const { prompt } = body;
    type = body.type;
    
    // For demo purposes, if no API key is set, return a fallback response
    if (!process.env.GPT5_API_KEY) {
      console.log("No GPT5_API_KEY found, using fallback response");
      
      // Fallback logic for sorting hat
      if (type === 'sorting_hat') {
        const houses = ['GRYFFINDOR', 'RAVENCLAW', 'HUFFLEPUFF', 'SLYTHERIN'];
        const randomHouse = houses[Math.floor(Math.random() * houses.length)];
        return NextResponse.json({ text: randomHouse });
      }
      
      return NextResponse.json({ text: "I'm sorry, I cannot process this request at the moment." });
    }

    const response = await fetch("https://api.example.com/gpt5/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GPT5_API_KEY}`,
      },
      body: JSON.stringify({ 
        model: "gpt-5", 
        prompt, 
        max_tokens: 300 
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ text: data.choices?.[0]?.text ?? "" });
    
  } catch (error) {
    console.error("Error in GPT API route:", error);
    
    // Fallback for sorting hat
    if (type && type === 'sorting_hat') {
      const houses = ['GRYFFINDOR', 'RAVENCLAW', 'HUFFLEPUFF', 'SLYTHERIN'];
      const randomHouse = houses[Math.floor(Math.random() * houses.length)];
      return NextResponse.json({ text: randomHouse });
    }
    
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
} 