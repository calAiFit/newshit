"use client";

import { SignUp } from "@clerk/nextjs";

const features = [
  {
    title: "Personalized Workout Plans",
    description: "Get customized workout routines tailored to your goals",
  },
  {
    title: "Nutrition Tracking",
    description: "Monitor your calorie intake and nutritional balance",
  },
  {
    title: "Progress Tracking",
    description: "Track your fitness journey with detailed analytics",
  },
];

const CheckIcon = () => (
  <span className="inline-flex items-center justify-center bg-white/30 text-white rounded-full w-8 h-8 mr-4 shadow-md">
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
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </span>
);

const SignUpPage = () => {
  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-600">
      {/* Left side - Information */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-8 py-8 sm:py-12 text-white bg-gradient-to-br from-purple-800/90 to-indigo-700/80 shadow-lg">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 drop-shadow-lg text-center md:text-left">
            Join NutriAi Today
          </h1>
          <p className="mb-8 text-base sm:text-lg text-white/90 text-center md:text-left">
            Create your account and start your fitness journey with us.
          </p>
          <div className="space-y-6">
            {features.map((feature, idx) => (
              <div className="flex items-start" key={idx}>
                <CheckIcon />
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:flex-1 flex items-center justify-center p-4 sm:p-6 bg-white/10 min-h-[400px]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 backdrop-blur-md border border-white/30 flex flex-col justify-center items-center mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-purple-700">
            Create your account
          </h2>
          <SignUp signInUrl="/sign-in" redirectUrl="/onboarding" />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
