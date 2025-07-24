"use client";

type User = {
  firstName: string;
};

const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-block px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-700 ${className}`}
  >
    {children}
  </span>
);
import { UserCircle, Ruler, Weight, Target, Activity } from "lucide-react"; // Optional icons

interface ProfileData {
  age: number;
  gender: string;
  height: number;
  weight: number;
  targetWeight: number;
  activityLevel: string;
}

interface ProfileDisplayProps {
  profile: ProfileData;
  user: User;
}

export const ProfileDisplay = ({ profile, user }: ProfileDisplayProps) => {
  return (
    <div className="p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.firstName}
          </h1>
          <p className="text-gray-500">Here is your health profile summary</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-purple-600 flex items-center gap-2">
              <UserCircle className="w-5 h-5" /> Basic Info
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-medium">Age:</span> {profile.age}
              </li>
              <li>
                <span className="font-medium">Gender:</span> {profile.gender}
              </li>
              <li className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Height:</span> {profile.height} cm
              </li>
              <li className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Weight:</span> {profile.weight} kg
              </li>
              <li className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Target Weight:</span>{" "}
                {profile.targetWeight} kg
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-purple-600 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Fitness Goals
            </h2>
            <p className="text-gray-700">
              <span className="font-medium">Activity Level:</span>{" "}
              <Badge className="ml-2">{profile.activityLevel}</Badge>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
