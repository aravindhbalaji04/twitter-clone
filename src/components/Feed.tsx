"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/utils/supabaseClient";
import { FaRegComment, FaRetweet, FaHeart, FaShare } from "react-icons/fa";

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTweets([]); setPage(1); setHasMore(true);
  }, [refresh]);

  useEffect(() => {
    const fetchTweets = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("tweets")
        .select("*")
        .order("created_at", { ascending: false })
        .range(0, page * 9 - 1); // 10 per page
      if (!error && data) {
        setTweets(data as Tweet[]);
        setHasMore(data.length === page * 10);
      }
      setLoading(false);
    };
    fetchTweets();
  }, [page, refresh, session]);

  useEffect(() => {
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
        <div key={tweet.id} className="bg-white/90 dark:bg-[#16181C] p-5 rounded-2xl shadow-xl border border-blue-100 dark:border-[#222] flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-[#1D9BF0] flex items-center justify-center text-white text-xl font-bold shadow">
              {tweet.user_id ? tweet.user_id[0].toUpperCase() : "U"}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 dark:text-white leading-tight">User</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">@userhandle</span>
            </div>
            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(tweet.created_at)}</span>
          </div>
          <div className="mb-1 text-base text-gray-800 dark:text-white whitespace-pre-line">{tweet.text}</div>
          {tweet.image_url && (
            <img src={tweet.image_url} alt="tweet image" className="max-h-60 rounded-lg mb-2 border border-blue-100 dark:border-[#333]" />
          )}
          <div className="flex gap-8 text-gray-600 dark:text-gray-300 text-base mt-2 items-center">
            <button className="flex items-center gap-1 hover:text-[#1D9BF0] transition"><FaRegComment size={18} /> <span className="text-xs">0</span></button>
            <button onClick={() => handleRetweet(tweet.id)} className="flex items-center gap-1 hover:text-green-500 transition"><FaRetweet size={18} /> <span className="text-xs">{tweet.retweets}</span></button>
            <button
              onClick={() => handleLike(tweet.id)}
              className={`flex items-center gap-1 hover:text-red-500 ${likedTweets[tweet.id] ? 'font-bold text-red-500' : ''} transition`}
              disabled={liking[tweet.id]}
            >
              <FaHeart size={18} /> <span className="text-xs">{tweet.likes}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-[#1D9BF0] transition"><FaShare size={18} /></button>
          </div>
        </div>
      ))}
      {hasMore && <div ref={loader} className="h-8 flex items-center justify-center text-gray-400">Loading more...</div>}
    </div>
  );
}

// Helper to format time ago
function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
