"use client";
import { useAuth } from "@/context/AuthContext";
import TweetForm from "@/components/TweetForm";
import { useState } from "react";

export default function TweetPage() {
  const { session } = useAuth();
  const [posted, setPosted] = useState(false);
  if (!session) return <div className="w-full max-w-xl mx-auto pt-10 text-center text-lg text-gray-600 dark:text-gray-300">Please log in to tweet.</div>;
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4 pt-10">
      <h1 className="text-2xl font-bold text-[#1D9BF0] mb-2">Compose Tweet</h1>
      {posted ? (
        <div className="text-green-600 font-semibold text-center">Tweet posted!</div>
      ) : (
        <TweetForm onTweet={() => setPosted(true)} />
      )}
    </div>
  );
}
