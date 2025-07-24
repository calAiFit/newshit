"use client";

import { useState } from "react";
import { useAuth, SignIn } from "@clerk/nextjs";

interface ActivityLevel {
  [key: string]: number;
}

interface METValues {
  [key: string]: ActivityLevel;
}

interface WorkoutCategory {
  name: string;
  icon: string;
  description: string;
  benefits: string[];
}

const CATEGORIES: WorkoutCategory[] = [
  {
    name: "Strength Training",
    icon: "💪",
    description: "Build muscle and increase strength",
    benefits: [
      "Build lean muscle mass",
      "Improve bone density",
      "Enhance metabolism",
    ],
  },
  {
    name: "Cardio",
    icon: "🏃",
    description: "Improve cardiovascular health",
    benefits: [
      "Boost heart health",
      "Increase endurance",
      "Burn calories efficiently",
    ],
  },
  {
    name: "Yoga",
    icon: "🧘",
    description: "Flexibility and mind-body connection",
    benefits: ["Improve flexibility", "Reduce stress", "Enhance balance"],
  },
  {
    name: "HIIT",
    icon: "⚡",
    description: "High Intensity Interval Training",
    benefits: [
      "Maximize calorie burn",
      "Improve cardiovascular fitness",
      "Time-efficient workouts",
    ],
  },
];

const CATEGORY_MET_KEYS: { [key: string]: string } = {
  "Strength Training": "Strength",
  Cardio: "Cardio",
  Yoga: "Yoga",
  HIIT: "HIIT",
};

const MET_VALUES: METValues = {
  Light: {
    Strength: 3.5,
    Cardio: 4.0,
    Yoga: 2.5,
    HIIT: 5.0,
  },
  Moderate: {
    Strength: 6.0,
    Cardio: 6.0,
    Yoga: 3.0,
    HIIT: 8.0,
  },
  Heavy: {
    Strength: 8.0,
    Cardio: 9.0,
    Yoga: 4.0,
    HIIT: 12.0,
  },
};

export default function WorkoutPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [duration, setDuration] = useState("");
  const [activityLevel, setActivityLevel] = useState("Light");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>;
  if (!isSignedIn) return <SignIn />;

  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    const numeric = value.replace(/\D/g, "").slice(0, 3);
    setter(numeric);
  };

  const convertLbToKg = (lb: number) => lb * 0.453592;

  const calculateCalories = () => {
    setError("");
    if (!weight || !duration || !selectedCategory || !activityLevel) {
      setError("Please fill in all fields including workout category.");
      return;
    }

    let w = parseFloat(weight);
    const d = parseFloat(duration);

    if (weightUnit === "lb") {
      w = convertLbToKg(w);
    }

    const categoryKey = CATEGORY_MET_KEYS[selectedCategory];
    const met = MET_VALUES[activityLevel][categoryKey];

    if (!met) {
      setError("MET value not found for selected category.");
      setCaloriesBurned("");
      return;
    }

    setLoading(true);
    const calories = (met * w * (d / 60)).toFixed(1);
    setCaloriesBurned(calories);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Workout Planner
          </h1>
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-sm text-gray-600">
              Plan your perfect workout
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Categories (Left on large screens) */}
          <div className="bg-white rounded-2xl shadow-md order-2 lg:order-1">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Workout Categories
              </h2>
              <div className="space-y-6">
                {CATEGORIES.map((category, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-4 transition cursor-pointer border ${
                      selectedCategory === category.name
                        ? "bg-purple-100 border-purple-600"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-2xl text-purple-600">
                          {category.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <ul className="mt-2 text-sm text-gray-600 list-disc ml-6">
                      {category.benefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calculator (Right on large screens) */}
          <div className="bg-white rounded-2xl shadow-md order-1 lg:order-2">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Workout Calculator
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Weight
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={weight}
                      onChange={(e) =>
                        handleNumericInput(e.target.value, setWeight)
                      }
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder={`Enter your weight in ${weightUnit}`}
                    />
                    <select
                      value={weightUnit}
                      onChange={(e) =>
                        setWeightUnit(e.target.value as "kg" | "lb")
                      }
                      className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={duration}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, setDuration)
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Enter workout duration"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Activity Level
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Light">Light</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>

                <button
                  onClick={calculateCalories}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Calculating..." : "Calculate Calories Burned"}
                </button>

                {error && (
                  <div className="mt-2 text-red-600 text-sm">{error}</div>
                )}

                {caloriesBurned && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-xl text-purple-800">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Calories Burned
                        </h3>
                        <p className="text-sm text-purple-700">
                          Based on input and MET values
                        </p>
                      </div>
                      <div className="text-2xl font-bold">
                        {caloriesBurned} kcal
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
