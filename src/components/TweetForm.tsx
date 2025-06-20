"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/context/AuthContext";

export default function TweetForm({ onTweet }: { onTweet?: () => void }) {
  const { session } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let imageUrl = "";
    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${session?.user.id}-${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("tweet-images")
        .upload(fileName, image);
      if (uploadError) {
        setError("Image upload failed");
        setLoading(false);
        return;
      }
      imageUrl = supabase.storage.from("tweet-images").getPublicUrl(fileName).data.publicUrl;
    }
    const { error: dbError } = await supabase.from("tweets").insert([
      {
        user_id: session?.user.id,
        text,
        image_url: imageUrl,
        likes: 0,
        retweets: 0,
        created_at: new Date().toISOString(),
      },
    ]);
    if (dbError) setError(dbError.message);
    else {
      setText("");
      setImage(null);
      if (onTweet) onTweet();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 p-6 rounded-2xl shadow-xl w-full max-w-md mb-8 border border-blue-100 backdrop-blur-md flex flex-col gap-3">
      <textarea
        className="w-full border border-blue-200 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-400 outline-none transition text-base min-h-[70px]"
        placeholder="What's happening?"
        value={text}
        onChange={e => setText(e.target.value)}
        required
        rows={3}
      />
      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2 text-sm" />
      {error && <div className="text-red-500 text-sm mb-2 text-center font-medium">{error}</div>}
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Posting..." : "Tweet"}
      </button>
    </form>
  );
}
