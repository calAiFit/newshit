"use client";

import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

interface CalorieCircleProps {
  consumedCalories?: number;
}

interface ScheduleItem {
  time: string;
  activity: string;
  type: "meal" | "workout" | "other";
}

export const CalorieCircle = ({ consumedCalories = 0 }: CalorieCircleProps) => {
  const { user } = useUser();
  const [targetCalories, setTargetCalories] = useState(2000);
  const [dailyConsumed, setDailyConsumed] = useState(consumedCalories);
  const [manualCalories, setManualCalories] = useState("");
  const [todaySchedule] = useState<ScheduleItem[]>([
    { time: "08:00", activity: "Breakfast", type: "meal" },
    { time: "10:30", activity: "Morning Workout", type: "workout" },
    { time: "12:30", activity: "Lunch", type: "meal" },
    { time: "15:00", activity: "Snack", type: "meal" },
    { time: "18:00", activity: "Evening Workout", type: "workout" },
    { time: "19:30", activity: "Dinner", type: "meal" },
  ]);

  // Calculate daily calorie needs from user profile
  useEffect(() => {
    if (user?.unsafeMetadata?.profile) {
      const profile = user.unsafeMetadata.profile as any;
      const { age, weight, height, gender, activityLevel } = profile;

      if (age && weight && height && gender && activityLevel) {
        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (gender === "male") {
          bmr = 66 + 13.7 * weight + 5 * height - 6.8 * age;
        } else {
          bmr = 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
        }

        // Apply activity multiplier
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
          case "veryActive":
            multiplier = 1.9;
            break;
        }

        setTargetCalories(Math.round(bmr * multiplier));
      }
    }
  }, [user]);

  // Get today's consumed calories from Clerk metadata
  useEffect(() => {
    if (user?.unsafeMetadata?.calorieData) {
      const calorieData = user.unsafeMetadata.calorieData as Record<
        string,
        number
      >;
      const today = new Date().toDateString();
      if (calorieData[today]) {
        setDailyConsumed(calorieData[today]);
      }
    }
  }, [user]);

  const remainingCalories = targetCalories - dailyConsumed;
  const percentage = Math.min((dailyConsumed / targetCalories) * 100, 100);

  // Function to add calories
  const addCalories = async (calories: number) => {
    const newTotal = dailyConsumed + calories;
    setDailyConsumed(newTotal);
    const today = new Date().toDateString();

    try {
      const existingCalorieData =
        (user?.unsafeMetadata?.calorieData as Record<string, number>) || {};
      const updatedCalorieData = { ...existingCalorieData, [today]: newTotal };

      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          calorieData: updatedCalorieData,
        },
      });
    } catch (error) {
      console.error("Failed to save calorie data:", error);
    }
  };
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="p-8 rounded-2xl shadow-lg bg-white">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Daily Calories
        </h1>

        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#f3f4f6"
                strokeWidth="8"
                fill="none"
              />

              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#8b5cf6"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-in-out"
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">
                {dailyConsumed}
              </span>
              <span className="text-xs text-gray-500">of {targetCalories}</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {remainingCalories > 0
                ? `${remainingCalories} calories remaining`
                : "Goal reached!"}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Manual calorie input */}
          <div className="mt-4 w-full">
            <div className="flex gap-2">
              <Input
                value={manualCalories}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, ""); // Remove non-digits
                  setManualCalories(onlyNumbers);
                }}
                placeholder="Enter calories"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={4}
              />
              <button
                onClick={() => {
                  const calories = parseInt(manualCalories);
                  if (calories && calories > 0) {
                    addCalories(calories);
                    setManualCalories("");
                  }
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Quick add buttons */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            <button
              onClick={() => addCalories(100)}
              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-sm hover:bg-purple-200 transition-colors"
            >
              +100
            </button>
            <button
              onClick={() => addCalories(250)}
              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-sm hover:bg-purple-200 transition-colors"
            >
              +250
            </button>
            <button
              onClick={() => addCalories(500)}
              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-sm hover:bg-purple-200 transition-colors"
            >
              +500
            </button>
            <button
              onClick={() => addCalories(1000)}
              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-sm hover:bg-purple-200 transition-colors"
            >
              +1000
            </button>
          </div>

          <button
            onClick={async () => {
              setDailyConsumed(0);
              const today = new Date().toDateString();
              try {
                const existingCalorieData =
                  (user?.unsafeMetadata?.calorieData as Record<
                    string,
                    number
                  >) || {};
                const updatedCalorieData = {
                  ...existingCalorieData,
                  [today]: 0,
                };

                await user?.update({
                  unsafeMetadata: {
                    ...user.unsafeMetadata,
                    calorieData: updatedCalorieData,
                  },
                });
              } catch (error) {
                console.error("Failed to reset calorie data:", error);
              }
            }}
            className="mt-2 w-full text-xs text-gray-500 hover:text-gray-700 transition-colors hover:underline"
          >
            Reset Today
          </button>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Today's Schedule
        </h2>
        <div className="space-y-2">
          {todaySchedule.map((item, index) => {
            const currentTime = new Date();
            const itemTime = new Date();
            const [hours, minutes] = item.time.split(":").map(Number);
            itemTime.setHours(hours, minutes, 0, 0);
            const isPast = currentTime > itemTime;
            const isUpcoming =
              !isPast &&
              itemTime.getTime() - currentTime.getTime() < 2 * 60 * 60 * 1000;

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isPast
                    ? "bg-gray-50 border-gray-200 opacity-60"
                    : isUpcoming
                    ? "bg-purple-50 border-purple-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.type === "meal"
                        ? "bg-green-500"
                        : item.type === "workout"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isPast ? "text-gray-500" : "text-gray-900"
                      }`}
                    >
                      {item.activity}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm ${
                    isPast
                      ? "text-gray-400"
                      : isUpcoming
                      ? "text-purple-600 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
