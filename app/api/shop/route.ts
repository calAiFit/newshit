// app/api/shop/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query param is required" },
      { status: 400 }
    );
  }

  const API_KEY = process.env.SPOONACULAR_API_KEY;

  const spoonacularRes = await fetch(
    `https://api.spoonacular.com/food/products/search?query=${query}&number=5&apiKey=${API_KEY}`
  );

  if (!spoonacularRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from Spoonacular" },
      { status: 500 }
    );
  }

  const data = await spoonacularRes.json();

  return NextResponse.json(data);
}
