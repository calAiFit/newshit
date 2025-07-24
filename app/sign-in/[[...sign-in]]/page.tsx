"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-600">
      {/* Left side - Information */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-8 py-8 sm:py-12 text-white bg-gradient-to-br from-purple-800/90 to-indigo-700/80 shadow-lg">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 drop-shadow-lg text-center md:text-left">
            Welcome Back
          </h1>
          <p className="mb-8 text-base sm:text-lg text-white/90 text-center md:text-left">
            Sign in to continue your fitness journey with NutriAi.
          </p>
          <div className="mt-8 flex flex-col items-center md:items-start">
            <p className="text-sm text-white/80 mb-4">
              Don&apos;t have an account yet?
            </p>
            <Link
              href="/sign-up"
              className="inline-block bg-white text-purple-700 px-6 py-2 rounded-md font-semibold hover:bg-purple-100 transition-colors shadow"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="w-full md:flex-1 flex items-center justify-center p-4 sm:p-6 bg-white/10 min-h-[400px]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 backdrop-blur-md border border-white/30 flex flex-col justify-center items-center mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-purple-700">
            Sign in to your account
          </h2>
          <SignIn signUpUrl="/sign-up" />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
