# Chat App MVP

This is a Next.js (TypeScript) chat app MVP using Supabase for authentication and database, and Tailwind CSS for styling.

## Features
- User signup, login, logout (Supabase Auth)
- Protected routes (only logged-in users can tweet)
- Tweet posting (text + image upload)
- Feed (reverse chronological order)
- Like & retweet functionality
- Profile page with user tweets and follower count

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your Supabase project and add your credentials to a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- Next.js (App Router, TypeScript)
- Supabase (Auth, Database, Storage)
- Tailwind CSS

---

Replace placeholder assets and environment variables with your own as needed.
