"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  content: string;
  category: string;
  mood: string;
  author_name: string;
  created_at: string;
};

export default function DetailCerita({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      const { id } = await params;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .eq("status", "published")
        .single();

      if (!error) setPost(data);
      setLoading(false);
    };

    loadPost();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        Memuat cerita...
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <Link href="/" className="text-amber-400">
          ← Kembali ke Beranda
        </Link>
        <h1 className="mt-8 text-2xl font-bold">Cerita tidak ditemukan</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <article className="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-6 md:p-10">
        <Link href="/" className="text-sm text-amber-400 hover:underline">
          ← Kembali ke semua cerita
        </Link>

        <div className="mt-8 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-400/15 px-3 py-1 text-sm text-amber-300">
            {post.category}
          </span>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
            {post.mood}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
          {post.title}
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          Oleh {post.author_name || "Anonim"} ·{" "}
          {new Date(post.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="mt-8 whitespace-pre-wrap text-lg leading-8 text-slate-200">
          {post.content}
        </div>
      </article>
    </main>
  );
}