import { BMICalculator } from "./components";
import { CalorieCircle } from "./components/CalorieCircle";
import { useAuth, SignIn } from "@clerk/nextjs";

const Home = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>;
  if (!isSignedIn) return <SignIn />;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to NutriAi
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
              Your fitness journey starts here
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm">
            <BMICalculator />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <CalorieCircle />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
