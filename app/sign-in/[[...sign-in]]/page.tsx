"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Information */}
      <div className="bg-purple-600 text-white p-8 md:w-1/3 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>
          <p className="mb-4">Sign in to continue your fitness journey with NutriAi.</p>
          
          <div className="mt-8">
            <p className="text-sm text-white/80 mb-4">Don't have an account yet?</p>
            <Link 
              href="/sign-up" 
              className="inline-block bg-white text-purple-600 px-6 py-2 rounded-md font-medium hover:bg-purple-100 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
      
      {/* Right side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <SignIn signUpUrl="/sign-up" />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
