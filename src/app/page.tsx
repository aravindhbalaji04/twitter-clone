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
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (!session) return <AuthForm />;
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <LogoutButton />
      <div className="text-2xl font-bold mb-6">
        Welcome, {session.user.email}!
      </div>
      <TweetForm onTweet={() => setRefreshFeed((r) => r + 1)} />
      <Feed refresh={refreshFeed} />
    </main>
  );
}
