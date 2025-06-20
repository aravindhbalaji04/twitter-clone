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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading...
        </div>
      </div>
    );
  if (!session)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <AuthForm />
      </div>
    );
  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-2">
      <LogoutButton />
      <div className="w-full max-w-md mb-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-2">
          {session.user.email ? session.user.email[0].toUpperCase() : "U"}
        </div>
        <div className="text-2xl font-bold mb-1 text-gray-800">Welcome,</div>
        <div className="text-lg text-gray-600 mb-4">
          {session.user.email || "User"}
        </div>
      </div>
      <TweetForm onTweet={() => setRefreshFeed((r) => r + 1)} />
      <Feed refresh={refreshFeed} />
    </main>
  );
}
