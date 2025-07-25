"use client";

import { useState } from "react";
import Image from "next/image";

interface NutritionData {
  food_name: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_fat: number;
  nf_total_carbohydrate: number;
  serving_qty: number;
  serving_unit: string;
  serving_weight_grams: number;
}

export const FoodNutritionAnalyzer = () => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [detectedFood, setDetectedFood] = useState<string>("");
  const [foodSearch, setFoodSearch] = useState<string>("");
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);
  const [grams, setGrams] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("Failed to read file"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  async function classifyImage(imageBase64: string): Promise<string> {
    const response = await fetch("/api/classify-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64 }),
    });

    if (!response.ok) throw new Error("Classification failed");
    const data = await response.json();
    return data.label;
  }

  async function fetchNutrition(foodName: string): Promise<NutritionData> {
    const response = await fetch("/api/nutrition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foodName, grams }),
    });

    if (!response.ok) throw new Error("Nutrition fetch failed");
    const data = await response.json();
    return data.nutrition;
  }

  const handleImageAnalyze = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);
    try {
      const label = await classifyImage(imageBase64);
      setDetectedFood(label);
      const nutri = await fetchNutrition(label);
      setNutrition(nutri);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setImageBase64(base64);
    setNutrition(null);
    setDetectedFood("");
    setError(null);
  };

  const handleFoodSearch = async () => {
    if (!foodSearch.trim()) return;
    setSearchLoading(true);
    setError(null);
    try {
      const nutri = await fetchNutrition(foodSearch.trim());
      setNutrition(nutri);
      setDetectedFood(foodSearch.trim());
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Food not found");
      }
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Food Nutrition Analyzer
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Analyze food nutrition using image upload or search
      </p>

      {!imageBase64 && (
        <label className="flex flex-col items-center justify-center w-full h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors mb-4">
          <div className="flex flex-col items-center justify-center pt-3 pb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-1 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Click to upload</span>{" "}
              or drag and drop
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      )}

      {imageBase64 && (
        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden border border-gray-300">
          <Image
            src={imageBase64}
            alt="Selected"
            fill
            style={{ objectFit: "contain" }}
            sizes="100vw"
          />
          <button
            onClick={() => setImageBase64(null)}
            className="absolute top-2 right-2 bg-gray-50 text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
            aria-label="Remove uploaded image"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Grams:
        </label>
        <input
          type="number"
          min={1}
          value={grams === 0 ? "" : grams}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 4) {
              setGrams(value === "" ? 0 : Number(value));
            }
          }}
          className="w-24 px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <button
        disabled={loading || !imageBase64}
        onClick={handleImageAnalyze}
        className="w-full mb-6 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>

      <div className="relative mb-4">
        <input
          type="text"
          value={foodSearch}
          onChange={(e) => setFoodSearch(e.target.value)}
          placeholder="Search food..."
          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
        <button
          disabled={searchLoading}
          onClick={handleFoodSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-2 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Search food"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {searchLoading && (
        <div className="mb-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 rounded-lg bg-red-50 text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      {detectedFood && (
        <p className="hidden mb-2 text-center text-gray-700 font-semibold">
          Detected Food: {detectedFood}
        </p>
      )}

      {nutrition && (
        <div className="bg-purple-50 p-3 rounded-xl">
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-900">
            <div>
              <p className="text-gray-600">Calories:</p>
              <p className="font-medium">{nutrition.nf_calories || 0} kcal</p>
            </div>
            <div>
              <p className="text-gray-600">Protein:</p>
              <p className="font-medium">{nutrition.nf_protein || 0} g</p>
            </div>
            <div>
              <p className="text-gray-600">Fat:</p>
              <p className="font-medium">{nutrition.nf_total_fat || 0} g</p>
            </div>
            <div>
              <p className="text-gray-600">Carbs:</p>
              <p className="font-medium">
                {nutrition.nf_total_carbohydrate || 0} g
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
