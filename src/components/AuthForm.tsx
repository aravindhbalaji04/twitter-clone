"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-sm w-full mx-auto mt-10 p-8 bg-white/90 rounded-2xl shadow-2xl border border-blue-100 backdrop-blur-md">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-[#1D9BF0] tracking-tight drop-shadow">{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleAuth} className="space-y-5">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-[#1D9BF0] outline-none transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-[#1D9BF0] outline-none transition"
          required
        />
        {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}
        <button
          type="submit"
          className="w-full bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white py-3 rounded-lg font-bold shadow transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <button
        className="mt-6 text-[#1D9BF0] hover:text-[#1A8CD8] underline w-full font-semibold transition"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
      </button>
    </div>
  );
}
