"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useClerk } from "@clerk/nextjs";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const navLinks = ["Home", "Workout", "Calorie", "Shop"];
  if (isSignedIn) {
    navLinks.push("Profile");
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
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
            NutriAi
          </Link>

          <div className="hidden md:flex space-x-6">
            {navLinks.map((label) => (
              <Link
                key={label}
                href={`/${
                  label.toLowerCase() === "home" ? "" : label.toLowerCase()
                }`}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                {label}
              </Link>
            ))}
            {!isSignedIn ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => signOut()}
                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col mt-2 space-y-1 pb-4">
                {navLinks.map((label) => (
                  <Link
                    key={label}
                    href={`/${
                      label.toLowerCase() === "home" ? "" : label.toLowerCase()
                    }`}
                    className="block px-4 py-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                {!isSignedIn ? (
                  <>
                    <Link
                      href="/sign-in"
                      className="block px-4 py-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="block px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
