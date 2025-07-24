"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export const CalorieHistory = () => {
  const { user } = useUser();
  const [calorieData, setCalorieData] = useState<Record<string, number>>({});

  useEffect(() => {
    if (user?.unsafeMetadata?.calorieData) {
      const data = user.unsafeMetadata.calorieData as Record<string, number>;
      setCalorieData(data || {});
    }
  }, [user]);

  const sortedDates = Object.keys(calorieData)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 7);

  if (sortedDates.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 text-center">
          📊 Calorie History
        </h2>
        <p className="text-gray-500 text-center text-sm">
          No calorie data available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
        📊 Calorie History (Last 7 Days)
      </h2>
      <ul className="space-y-3">
        {sortedDates.map((date) => (
          <li
            key={date}
            className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl border border-gray-200"
          >
            <span className="text-sm font-medium text-gray-600">
              {new Date(date).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-sm font-bold text-purple-600">
              {calorieData[date]} kcal
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
