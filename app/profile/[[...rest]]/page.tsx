"use client";

import { useClerk, useUser, SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProfileData } from "@/app/types/profile";
import { LoadingSpinner, ProfileDisplay } from "@/app/components";
import { ProfileForm } from "@/app/components/ProfileForm";
import { CalorieHistory } from "@/app/components/CalorieHistory";

const ProfilePage = () => {
  const { user, isLoaded } = useUser();
  const { user: clerkUser } = useClerk();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // optional

  // Extract and convert stored profile safely
  const rawProfile = user?.unsafeMetadata?.profile as
    | Partial<ProfileData>
    | undefined;
  const profile: ProfileData | undefined =
    rawProfile &&
    rawProfile.gender !== undefined &&
    rawProfile.activityLevel !== undefined
      ? {
          ...rawProfile,
          age: Number(rawProfile.age),
          height: Number(rawProfile.height),
          weight: Number(rawProfile.weight),
          targetWeight: Number(rawProfile.targetWeight),
          gender: rawProfile.gender as string,
          activityLevel: rawProfile.activityLevel as string,
        }
      : undefined;

  const handleSubmit = async (data: ProfileData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!user || !clerkUser) {
      setError("Please sign in to update your profile.");
      setSubmitting(false);
      return;
    }

    const { age, height, weight, targetWeight, gender, activityLevel } = data;

    const isValidNumber = (val: unknown) =>
      val !== undefined && !isNaN(Number(val)) && Number(val) > 0;

    const validationErrors: string[] = [];
    if (!isValidNumber(age)) validationErrors.push("Enter a valid age.");
    if (!isValidNumber(height)) validationErrors.push("Enter a valid height.");
    if (!isValidNumber(weight)) validationErrors.push("Enter a valid weight.");
    if (!isValidNumber(targetWeight))
      validationErrors.push("Enter a valid target weight.");
    if (!gender) validationErrors.push("Select a gender.");
    if (!activityLevel) validationErrors.push("Select an activity level.");

    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      setSubmitting(false);
      return;
    }

    const profileData: ProfileData = {
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      targetWeight: Number(targetWeight),
      gender,
      activityLevel,
    };

    try {
      await clerkUser.update({
        unsafeMetadata: {
          profile: profileData,
        },
      });

      setSuccess("Profile updated successfully!"); // optional
      router.refresh();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Something went wrong while updating your profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded) return <LoadingSpinner />;
  if (!user) return <SignIn redirectUrl="/profile" />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        {profile ? (
          <ProfileDisplay
            profile={{
              ...profile,
              age: Number(profile.age),
              height: Number(profile.height),
              weight: Number(profile.weight),
              targetWeight: Number(profile.targetWeight),
            }}
            user={{ firstName: user.firstName ?? "User" }}
          />
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900">
                Complete Your Profile
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Provide your details to personalize your experience
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <ProfileForm
                onSubmit={handleSubmit}
                error={error}
                submitting={submitting}
              />
              {success && (
                <div className="mt-4 text-green-600 font-medium text-sm text-center">
                  {success}
                </div>
              )}
              {error && (
                <div className="mt-4 text-red-600 font-medium text-sm text-center">
                  {error}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <CalorieHistory />
    </div>
  );
};

export default ProfilePage;
