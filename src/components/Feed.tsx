"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface Tweet {
  id: number;
  user_id: string;
  text: string;
  image_url?: string;
  likes: number;
  retweets: number;
  created_at: string;
}

export default function Feed({ refresh }: { refresh?: number }) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("tweets")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setTweets(data as Tweet[]);
      setLoading(false);
    };
    fetchTweets();
  }, [refresh]);

  if (loading) return <div>Loading feed...</div>;
  if (!tweets.length) return <div className="text-gray-500">No tweets yet.</div>;

  return (
    <div className="w-full max-w-md space-y-4">
      {tweets.map(tweet => (
        <div key={tweet.id} className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500 mb-1">{new Date(tweet.created_at).toLocaleString()}</div>
          <div className="mb-2">{tweet.text}</div>
          {tweet.image_url && (
            <img src={tweet.image_url} alt="tweet image" className="max-h-60 rounded mb-2" />
          )}
          <div className="flex gap-4 text-gray-600 text-sm">
            <span>❤️ {tweet.likes}</span>
            <span>🔁 {tweet.retweets}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
