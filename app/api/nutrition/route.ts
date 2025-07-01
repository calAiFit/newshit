import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { foodName, grams } = await request.json();
    
    const response = await fetch(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      {
        method: "POST",
        headers: {
          "x-app-id": process.env.NUTRITIONIX_APP_ID!,
          "x-app-key": process.env.NUTRITIONIX_APP_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: `${grams} grams ${foodName}` }),
      }
    );

    if (!response.ok) throw new Error("Nutrition data not found");
    
    const data = await response.json();
    return NextResponse.json({ nutrition: data.foods?.[0] });
  } catch (error) {
    return NextResponse.json({ error: "Nutrition fetch failed" }, { status: 500 });
  }
}