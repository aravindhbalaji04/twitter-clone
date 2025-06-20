"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabaseClient";

interface Tweet {
  id: number;
  text: string;
  image_url?: string;
  created_at: string;
  likes: number;
  retweets: number;
}

export default function ProfilePage() {
  const { session } = useAuth();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [followers, setFollowers] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const fetchProfile = async () => {
      setLoading(true);
      // Fetch user's tweets
      const { data: tweetData } = await supabase
        .from("tweets")
        .select("id, text, image_url, created_at, likes, retweets")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      setTweets(tweetData || []);
      // Fetch follower count (assumes a followers table exists)
      const { count } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("followed_id", session.user.id);
      setFollowers(count || 0);
      setLoading(false);
    };
    fetchProfile();
  }, [session]);

  if (loading) return <div>Loading profile...</div>;
  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white/90 dark:bg-[#16181C] rounded-2xl shadow-2xl border border-blue-100 dark:border-[#222] backdrop-blur-md">
      <h2 className="text-3xl font-extrabold mb-4 text-[#1D9BF0]">Profile</h2>
      <div className="mb-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-[#1D9BF0] flex items-center justify-center text-white text-xl font-bold shadow">
          {session?.user.email ? session.user.email[0].toUpperCase() : "U"}
        </div>
        <div>
          <div className="font-semibold text-gray-800 dark:text-white">{session?.user.email || "User"}</div>
          <div className="text-sm text-gray-500 dark:text-gray-300">Followers: <span className="font-bold text-[#1D9BF0]">{followers}</span></div>
        </div>
      </div>
      <div className="flex gap-4 border-b border-gray-200 dark:border-[#222] mb-4 pb-2">
        <button className="font-bold text-[#1D9BF0] border-b-2 border-[#1D9BF0] pb-1">Tweets</button>
        <button className="text-gray-500 dark:text-gray-300">Replies</button>
        <button className="text-gray-500 dark:text-gray-300">Media</button>
        <button className="text-gray-500 dark:text-gray-300">Likes</button>
      </div>
      <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-700 dark:text-white">Your Tweets</h3>
      <div className="space-y-4">
        {tweets.length === 0 && <div className="text-gray-500 dark:text-gray-300">No tweets yet.</div>}
        {tweets.map(tweet => (
          <div key={tweet.id} className="bg-gray-50 dark:bg-[#222] p-4 rounded-lg border border-blue-100 dark:border-[#333]">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{new Date(tweet.created_at).toLocaleString()}</div>
            <div className="mb-2 text-gray-800 dark:text-white whitespace-pre-line">{tweet.text}</div>
            {tweet.image_url && (
              <img src={tweet.image_url} alt="tweet image" className="max-h-40 rounded mb-2 border border-blue-100 dark:border-[#333]" />
            )}
            <div className="flex gap-4 text-gray-600 dark:text-gray-300 text-sm mt-1">
              <span>❤️ {tweet.likes}</span>
              <span>🔁 {tweet.retweets}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
