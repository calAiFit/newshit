"use client";

import { useState } from "react";
import { useAuth, SignIn } from "@clerk/nextjs";
import { FoodNutritionAnalyzer } from "../components";

export default function CaloriePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [calories, setCalories] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isLoaded) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div></div>;
  if (!isSignedIn) return <SignIn />;

  const handleNumericInput = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    maxDigits = 3
  ) => {
    const numeric = value.replace(/\D/g, "").slice(0, maxDigits);
    setter(numeric);
  };

  const feetInchesToCm = (ft: number, inch: number) => {
    return ft * 30.48 + inch * 2.54;
  };

  const calculateCalories = () => {
    setError("");
    if (!age || !weight || !activityLevel) {
      setError("Please fill in all required fields.");
      setCalories("");
      return;
    }

    const ageNum = parseFloat(age);
    if (ageNum <= 0 || ageNum > 110) {
      setError("Please enter an age between 1 and 110.");
      setCalories("");
      return;
    }

    let weightNum = parseFloat(weight);
    if (weightNum <= 0) {
      setError("Please enter a positive weight.");
      setCalories("");
      return;
    }

    let heightNum: number;
    if (heightUnit === "cm") {
      if (!heightCm) {
        setError("Please enter your height in centimeters.");
        setCalories("");
        return;
      }
      heightNum = parseFloat(heightCm);
      if (heightNum <= 0) {
        setError("Please enter a positive height.");
        setCalories("");
        return;
      }
    } else {
      const ftNum = parseFloat(heightFt);
      const inNum = parseFloat(heightIn || "0");
      if (!ftNum || ftNum <= 0) {
        setError("Please enter your height in feet.");
        setCalories("");
        return;
      }
      if (inNum < 0) {
        setError("Inches cannot be negative.");
        setCalories("");
        return;
      }
      heightNum = feetInchesToCm(ftNum, inNum);
    }

    if (weightUnit === "lb") {
      weightNum = weightNum * 0.453592;
    }

    setLoading(true);

    const bmr = 66 + 13.7 * weightNum + 5 * heightNum - 6.8 * ageNum;

    let multiplier = 1.2;
    switch (activityLevel) {
      case "light":
        multiplier = 1.375;
        break;
      case "moderate":
        multiplier = 1.55;
        break;
      case "active":
        multiplier = 1.725;
        break;
      case "very-active":
        multiplier = 1.9;
        break;
    }

    const totalCalories = Math.round(bmr * multiplier);
    setCalories(totalCalories.toString());
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-600">Calculating your daily needs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 md:gap-0">
          <h1 className="text-3xl font-bold text-gray-900 break-words text-center md:text-left">
            Daily Calorie Calculator
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
              Calculate your daily needs
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FoodNutritionAnalyzer />

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Daily Calculator
            </h2>
            <p className="text-gray-600 mb-8">
              Calculate your daily calorie needs based on your activity level
              and goals.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                calculateCalories();
              }}
              className="space-y-6 max-w-md mx-auto"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={age}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, setAge, 3)
                    }
                    placeholder="Enter your age"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-10"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    years
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  Weight
                  <select
                    value={weightUnit}
                    onChange={(e) =>
                      setWeightUnit(e.target.value === "lb" ? "lb" : "kg")
                    }
                    className="ml-2 rounded-xl border border-gray-300 bg-white text-gray-900 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={weight}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, setWeight, 3)
                    }
                    placeholder={`Enter your weight (${weightUnit})`}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-10"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    {weightUnit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  Height
                  <select
                    value={heightUnit}
                    onChange={(e) =>
                      setHeightUnit(e.target.value === "ft" ? "ft" : "cm")
                    }
                    className="ml-2 rounded-xl border border-gray-300 bg-white text-gray-900 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="cm">cm</option>
                    <option value="ft">feet/inches</option>
                  </select>
                </label>

                {heightUnit === "cm" ? (
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={heightCm}
                      onChange={(e) =>
                        handleNumericInput(e.target.value, setHeightCm, 3)
                      }
                      placeholder="Enter your height in cm"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-10"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                      cm
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={heightFt}
                        onChange={(e) =>
                          handleNumericInput(e.target.value, setHeightFt, 2)
                        }
                        placeholder="Feet"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                        ft
                      </span>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={heightIn}
                        onChange={(e) =>
                          handleNumericInput(e.target.value, setHeightIn, 2)
                        }
                        placeholder="Inches"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                        in
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="sedentary">
                    Sedentary (little or no exercise)
                  </option>
                  <option value="light">Light exercise (1-3 days/week)</option>
                  <option value="moderate">
                    Moderate exercise (3-5 days/week)
                  </option>
                  <option value="active">Heavy exercise (6-7 days/week)</option>
                  <option value="very-active">
                    Very heavy exercise (twice/day)
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate Calories"}
              </button>

              {error && (
                <div className="mt-2 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              {calories && !error && (
                <div className="mt-6 p-4 bg-purple-50 rounded-xl text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your Daily Calorie Needs
                  </h3>
                  <div className="text-2xl font-bold text-purple-600">
                    {calories} kcal/day
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
