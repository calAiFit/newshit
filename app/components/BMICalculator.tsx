"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [heightCm, setHeightCm] = useState("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">("cm");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [errors, setErrors] = useState({
    weight: "",
    heightCm: "",
    age: "",
    gender: "",
  });

  const [bmi, setBMI] = useState("");
  const [bmiCategory, setBMICategory] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleNumericInput = (
    value: string,
    setter: (val: string) => void,
    maxLength = 3
  ) => {
    const numeric = value.replace(/\D/g, "").slice(0, maxLength);
    setter(numeric);
  };

  const validateInputs = () => {
    const newErrors = {
      weight: weight ? "" : "Weight is required",
      heightCm: heightCm ? "" : "Height is required",
      age: age ? "" : "Age is required",
      gender: gender ? "" : "Gender is required",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const calculateBMI = () => {
    if (!validateInputs()) return;

    let w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      setErrors((prev) => ({
        ...prev,
        weight: "Weight must be a positive number",
      }));
      return;
    }
    // Convert lbs to kg if needed
    if (weightUnit === "lbs") {
      w = w * 0.453592;
    }

    let h = parseFloat(heightCm);
    if (isNaN(h) || h <= 0) {
      setErrors((prev) => ({
        ...prev,
        heightCm: "Height must be a positive number",
      }));
      return;
    }
    // Convert inches to cm if needed
    if (heightUnit === "in") {
      h = h * 2.54;
    }
    h = h / 100; // convert cm to meters

    if (h === 0) {
      setErrors((prev) => ({ ...prev, heightCm: "Height cannot be zero" }));
      return;
    }

    const bmiNumber = w / (h * h);
    const bmiValue = bmiNumber.toFixed(1);
    setBMI(bmiValue);
    setShowResults(true);

    if (bmiNumber < 18.5) setBMICategory("Underweight");
    else if (bmiNumber < 25) setBMICategory("Normal weight");
    else if (bmiNumber < 30) setBMICategory("Overweight");
    else setBMICategory("Obese");
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <Card className="p-8 rounded-2xl shadow-lg bg-white">
        <h1 className="text-3xl font-bold text-purple-700 mb-8 text-center">
          BMI Calculator
        </h1>

        <div className="space-y-6">
          {/* Weight with unit selector */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Weight
            </label>
            <div className="flex gap-3">
              <Input
                type="text"
                inputMode="numeric"
                value={weight}
                onChange={(e) => handleNumericInput(e.target.value, setWeight)}
                placeholder="Enter weight"
                className="flex-grow"
                maxLength={3}
              />
              <Select
                value={weightUnit}
                onValueChange={(val) => setWeightUnit(val as "kg" | "lbs")}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.weight && (
              <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
            )}
          </div>

          {/* Height with unit selector */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Height
            </label>
            <div className="flex gap-3">
              <Input
                type="text"
                inputMode="numeric"
                value={heightCm}
                onChange={(e) =>
                  handleNumericInput(e.target.value, setHeightCm)
                }
                placeholder={`Enter height in ${heightUnit}`}
                className="flex-grow"
                maxLength={3}
              />
              <Select
                value={heightUnit}
                onValueChange={(val) => setHeightUnit(val as "cm" | "in")}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="in">in</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.heightCm && (
              <p className="text-red-500 text-sm mt-1">{errors.heightCm}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Age</label>
            <Input
              type="text"
              inputMode="numeric"
              value={age}
              onChange={(e) => handleNumericInput(e.target.value, setAge)}
              placeholder="Enter age"
              maxLength={3}
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Gender
            </label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center mt-6">
            <Button
              onClick={calculateBMI}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl px-8 py-3 font-semibold transition-all duration-300"
            >
              Calculate BMI
            </Button>
            {showResults && (
              <Button
                onClick={() => {
                  setWeight("");
                  setHeightCm("");
                  setAge("");
                  setGender("");
                  setBMI("");
                  setBMICategory("");
                  setShowResults(false);
                  setErrors({ weight: "", heightCm: "", age: "", gender: "" });
                  setHeightUnit("cm");
                  setWeightUnit("kg");
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl px-8 py-3 font-semibold transition-all duration-300"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10"
          >
            <Card className="p-6 rounded-xl bg-white border border-gray-200">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-4xl font-bold text-purple-700 mb-4">
                  {bmi}
                </h2>
                <p className="text-xl text-gray-700 mb-6">{bmiCategory}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <motion.div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{
                      width: `${(parseFloat(bmi) / 40) * 100}%`,
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 w-full">
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-xl bg-white border border-gray-200 mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                BMI Categories
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Underweight (18.5 or less)
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Normal weight (18.5 - 24.9)
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Overweight (25 - 29.9)
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Obese (30 or more)
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </Card>
    </div>
  );
};
