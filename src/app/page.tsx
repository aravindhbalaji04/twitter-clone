"use client";
import AuthForm from "@/components/AuthForm";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import TweetForm from "@/components/TweetForm";
import Feed from "@/components/Feed";
import { useState } from "react";

export default function Home() {
  const { session, loading } = useAuth();
  const [refreshFeed, setRefreshFeed] = useState(0);
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F9F9] dark:bg-black">
        <div className="text-lg font-semibold text-gray-600 dark:text-gray-300 animate-pulse">
          Loading...
        </div>
      </div>
    );
  if (!session)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F9F9] dark:bg-black">
        <AuthForm />
      </div>
    );
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-[#1D9BF0] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {session.user.email ? session.user.email[0].toUpperCase() : "U"}
          </div>
          <div>
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              Welcome,
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300">
              {session.user.email || "User"}
            </div>
          </div>
        </div>
        <LogoutButton />
      </div>
      <TweetForm onTweet={() => setRefreshFeed((r) => r + 1)} />
      <Feed refresh={refreshFeed} />
    </div>
  );
}
