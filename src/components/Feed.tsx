"use client";
import { useAuth } from "@/context/AuthContext";
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
  const { session } = useAuth();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState<{ [tweetId: number]: boolean }>({});
  const [likedTweets, setLikedTweets] = useState<{ [tweetId: number]: boolean }>({});

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
    const fetchLikedTweets = async () => {
      if (!session) return;
      const { data } = await supabase
        .from("tweet_likes")
        .select("tweet_id")
        .eq("user_id", session.user.id);
      if (data) {
        const liked: { [tweetId: number]: boolean } = {};
        data.forEach((row: { tweet_id: number }) => {
          liked[row.tweet_id] = true;
        });
        setLikedTweets(liked);
      }
    };
    fetchTweets();
    fetchLikedTweets();
  }, [refresh, session]);

  const handleLike = async (tweetId: number) => {
    if (!session) return;
    setLiking(l => ({ ...l, [tweetId]: true }));
    if (likedTweets[tweetId]) {
      // Unlike
      await supabase.from("tweet_likes").delete().eq("user_id", session.user.id).eq("tweet_id", tweetId);
      await supabase.rpc('decrement_likes', { tweet_id: tweetId });
      setTweets(tweets => tweets.map(t => t.id === tweetId ? { ...t, likes: Math.max(0, t.likes - 1) } : t));
      setLikedTweets(liked => ({ ...liked, [tweetId]: false }));
    } else {
      // Like
      const { error: likeError } = await supabase
        .from("tweet_likes")
        .insert([{ user_id: session.user.id, tweet_id: tweetId }]);
      if (!likeError) {
        await supabase.rpc('increment_likes', { tweet_id: tweetId });
        setTweets(tweets => tweets.map(t => t.id === tweetId ? { ...t, likes: t.likes + 1 } : t));
        setLikedTweets(liked => ({ ...liked, [tweetId]: true }));
      }
    }
    setLiking(l => ({ ...l, [tweetId]: false }));
  };

  const handleRetweet = async (tweetId: number) => {
    await supabase.rpc('increment_retweets', { tweet_id: tweetId });
    setTweets(tweets => tweets.map(t => t.id === tweetId ? { ...t, retweets: t.retweets + 1 } : t));
  };

  if (loading) return <div>Loading feed...</div>;
  if (!tweets.length) return <div className="text-gray-500">No tweets yet.</div>;

  return (
    <div className="w-full max-w-md space-y-6">
      {tweets.map(tweet => (
        <div key={tweet.id} className="bg-white/90 p-5 rounded-2xl shadow-xl border border-blue-100 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow">
              {tweet.user_id ? tweet.user_id[0].toUpperCase() : "U"}
            </div>
            <span className="text-xs text-gray-500">{new Date(tweet.created_at).toLocaleString()}</span>
          </div>
          <div className="mb-1 text-base text-gray-800 whitespace-pre-line">{tweet.text}</div>
          {tweet.image_url && (
            <img src={tweet.image_url} alt="tweet image" className="max-h-60 rounded-lg mb-2 border border-blue-100" />
          )}
          <div className="flex gap-6 text-gray-600 text-base mt-2">
            <button
              onClick={() => handleLike(tweet.id)}
              className={`hover:text-red-500 ${likedTweets[tweet.id] ? 'font-bold text-red-500' : ''} transition`}
              disabled={liking[tweet.id]}
            >
              {likedTweets[tweet.id] ? '💔' : '❤️'} {tweet.likes}
            </button>
            <button onClick={() => handleRetweet(tweet.id)} className="hover:text-blue-500 transition">🔁 {tweet.retweets}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
