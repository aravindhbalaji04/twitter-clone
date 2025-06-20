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
    <div className="max-w-md mx-auto mt-12 p-8 bg-white/90 rounded-2xl shadow-2xl border border-blue-100 backdrop-blur-md">
      <h2 className="text-3xl font-extrabold mb-4 text-blue-700">Profile</h2>
      <div className="mb-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow">
          {session?.user.email ? session.user.email[0].toUpperCase() : "U"}
        </div>
        <div>
          <div className="font-semibold text-gray-800">{session?.user.email || "User"}</div>
          <div className="text-sm text-gray-500">Followers: <span className="font-bold text-blue-600">{followers}</span></div>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-700">Your Tweets</h3>
      <div className="space-y-4">
        {tweets.length === 0 && <div className="text-gray-500">No tweets yet.</div>}
        {tweets.map(tweet => (
          <div key={tweet.id} className="bg-gray-50 p-4 rounded-lg border border-blue-100">
            <div className="text-xs text-gray-500 mb-1">{new Date(tweet.created_at).toLocaleString()}</div>
            <div className="mb-2 text-gray-800 whitespace-pre-line">{tweet.text}</div>
            {tweet.image_url && (
              <img src={tweet.image_url} alt="tweet image" className="max-h-40 rounded mb-2 border border-blue-100" />
            )}
            <div className="flex gap-4 text-gray-600 text-sm mt-1">
              <span>❤️ {tweet.likes}</span>
              <span>🔁 {tweet.retweets}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
