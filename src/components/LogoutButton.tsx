"use client";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
  const { logout, session } = useAuth();
  if (!session) return null;
  return (
    <button
      onClick={logout}
      className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 z-50"
    >
      Logout
    </button>
  );
}
