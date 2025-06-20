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
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow w-full max-w-md mb-6">
      <textarea
        className="w-full border rounded p-2 mb-2"
        placeholder="What's happening?"
        value={text}
        onChange={e => setText(e.target.value)}
        required
        rows={3}
      />
      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Posting..." : "Tweet"}
      </button>
    </form>
  );
}
