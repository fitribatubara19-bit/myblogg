"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Post = {
  id: number;
  title: string;
  content: string;
  category: string;
  mood: string;
  author_name: string;
  is_anonymous: boolean;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPendingPosts() {
    setLoading(true);

const { data, error } = await supabase
  .from("posts")
  .select("*")
  .order("created_at", { ascending: false });

    if (data) setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPendingPosts();
  }, []);

  async function updateStatus(id: number, status: "published" | "rejected") {
    const { error } = await supabase
      .from("posts")
      .update({ status })
      .eq("id", id);

    if (!error) loadPendingPosts();
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-amber-400">Admin Cerita Kita</h1>
        <p className="mt-2 text-slate-400">
          Setujui atau tolak cerita sebelum tampil ke publik.
        </p>

        {loading ? (
          <p className="mt-8 text-slate-400">Memuat cerita...</p>
        ) : posts.length === 0 ? (
          <p className="mt-8 rounded-xl border border-slate-800 p-6 text-slate-400">
            Tidak ada cerita yang menunggu persetujuan.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-300">
                    {post.category}
                  </span>
                  <span className="rounded-full bg-slate-800 px-3 py-1">
                    {post.mood}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold">{post.title}</h2>
                <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">
                  {post.content}
                </p>

                <p className="mt-4 text-sm text-slate-500">
                  Oleh {post.is_anonymous ? "Anonim" : post.author_name}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => updateStatus(post.id, "published")}
                    className="rounded-lg bg-emerald-500 px-4 py-2 font-bold text-slate-950"
                  >
                    Terbitkan
                  </button>

                  <button
                    onClick={() => updateStatus(post.id, "rejected")}
                    className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
                  >
                    Tolak
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}