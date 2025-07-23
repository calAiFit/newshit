"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProfileData } from "@/app/types/profile";
import { ProfileForm } from "@/app/components/ProfileForm";

const OnboardingPage = () => {
  const { user, isLoaded } = useUser();
  const { user: clerkUser } = useClerk();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ProfileData) => {
    setError(null);
    setSubmitting(true);

    if (!user || !clerkUser) {
      setError("Please sign in to complete your profile");
      setSubmitting(false);
      return;
    }

    try {
      const validationErrors: string[] = [];

      if (
        !data.age ||
        isNaN(Number(data.age)) ||
        !data.height ||
        isNaN(Number(data.height)) ||
        !data.weight ||
        isNaN(Number(data.weight)) ||
        !data.targetWeight ||
        isNaN(Number(data.targetWeight))
      ) {
        validationErrors.push("All numeric fields must have valid numbers.");
      }

      if (!data.gender) validationErrors.push("Select a gender.");
      if (!data.activityLevel) validationErrors.push("Select activity level.");

      if (validationErrors.length > 0) {
        setError(validationErrors.join(" "));
        setSubmitting(false);
        return;
      }

      const profileData = {
        age: Number(data.age),
        height: Number(data.height),
        weight: Number(data.weight),
        targetWeight: Number(data.targetWeight),
        gender: data.gender,
        activityLevel: data.activityLevel,
      };

      // Save to Clerk public metadata
      await clerkUser.update({
        unsafeMetadata: {
          profile: profileData
        }
      });

      // Redirect to dashboard or home page after successful profile creation
      router.push("/");
    } catch (err) {
      console.error("Error creating profile:", err);
      setError("Failed to create profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect to sign-in if not authenticated
  if (isLoaded && !user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to NutriAi!
          </h1>
          <p className="mt-2 text-gray-600">
            Let's set up your profile to personalize your fitness journey
          </p>

          <div className="flex items-center justify-center mt-6 mb-8">
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <div className="w-12 h-1 bg-purple-600"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Fitness Profile</h2>
          <p className="text-gray-600 mb-6">
            This information helps us create personalized recommendations for
            you
          </p>

          <ProfileForm
            onSubmit={handleSubmit}
            error={error}
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
