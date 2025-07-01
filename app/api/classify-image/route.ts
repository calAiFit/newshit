import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();
    
    if (!imageBase64) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    if (!process.env.HF_TOKEN) {
      return NextResponse.json({ error: "HuggingFace token not configured" }, { status: 500 });
    }
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: imageBase64 }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HuggingFace API error:", response.status, errorText);
      return NextResponse.json({ error: `API request failed: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    console.log("HuggingFace response:", data);
    
    const label = data?.[0]?.label;
    
    if (!label) {
      console.error("No label found in response:", data);
      return NextResponse.json({ error: "No classification result" }, { status: 500 });
    }
    
    return NextResponse.json({ label });
  } catch (error) {
    console.error("Classification error:", error);
    return NextResponse.json({ error: "Classification failed" }, { status: 500 });
  }
}