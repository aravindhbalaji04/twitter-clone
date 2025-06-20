import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat App",
  description: "Twitter/X style chat app MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="[color-scheme:light dark]:bg-black">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F7F9F9] dark:bg-black text-black dark:text-white min-h-screen`}>
        <AuthProvider>
          <div className="flex min-h-screen w-full">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 px-4 py-8 border-r border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#16181C] gap-2 sticky top-0 h-screen">
              <div className="mb-8 text-2xl font-extrabold text-[#1D9BF0] tracking-tight">X</div>
              <nav className="flex flex-col gap-2 text-lg font-semibold">
                <Link href="/" className="hover:bg-[#E8F5FE] dark:hover:bg-[#222] rounded px-3 py-2 transition">Home</Link>
                <Link href="/explore" className="hover:bg-[#E8F5FE] dark:hover:bg-[#222] rounded px-3 py-2 transition">Explore</Link>
                <Link href="/profile" className="hover:bg-[#E8F5FE] dark:hover:bg-[#222] rounded px-3 py-2 transition">Profile</Link>
                <Link href="/notifications" className="hover:bg-[#E8F5FE] dark:hover:bg-[#222] rounded px-3 py-2 transition flex items-center gap-2">Notifications <span className="ml-2 w-2 h-2 bg-[#1D9BF0] rounded-full animate-pulse"></span></Link>
              </nav>
              <Link href="/tweet" className="mt-8 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold py-3 rounded-full text-center shadow transition">Tweet</Link>
            </aside>
            {/* Main Feed */}
            <main className="flex-1 flex flex-col items-center min-h-screen bg-[#F7F9F9] dark:bg-black px-2 md:px-0">
              {children}
            </main>
            {/* Rightbar */}
            <aside className="hidden lg:flex flex-col w-80 px-4 py-8 border-l border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#16181C] gap-6 sticky top-0 h-screen">
              <input type="text" placeholder="Search Twitter" className="w-full px-4 py-2 rounded-full bg-[#EFF3F4] dark:bg-[#222] border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#1D9BF0] outline-none" />
              <div className="bg-[#F7F9F9] dark:bg-[#222] rounded-2xl p-4">
                <div className="font-bold mb-2">Trends for you</div>
                <div className="text-sm text-gray-500">#React #NextJS #Supabase</div>
              </div>
              <div className="bg-[#F7F9F9] dark:bg-[#222] rounded-2xl p-4">
                <div className="font-bold mb-2">Who to follow</div>
                <div className="text-sm text-gray-500">@aravindhbalaji04, @nextjs, @supabase</div>
              </div>
            </aside>
          </div>
          {/* Mobile Bottom Nav */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden justify-around bg-white/90 dark:bg-[#16181C] border-t border-gray-200 dark:border-gray-800 py-2 shadow-lg">
            <Link href="/" className="flex flex-col items-center text-[#1D9BF0] font-bold"><span className="material-icons">home</span><span className="text-xs">Home</span></Link>
            <Link href="/explore" className="flex flex-col items-center text-gray-500"><span className="material-icons">search</span><span className="text-xs">Explore</span></Link>
            <Link href="/tweet" className="flex flex-col items-center text-gray-500"><span className="material-icons">add_circle</span><span className="text-xs">Tweet</span></Link>
            <Link href="/profile" className="flex flex-col items-center text-gray-500"><span className="material-icons">person</span><span className="text-xs">Profile</span></Link>
          </nav>
        </AuthProvider>
      </body>
    </html>
  );
}
