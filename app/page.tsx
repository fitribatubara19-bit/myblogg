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
  likes: number;
  created_at: string;
};

const categories = [
  "Kehidupan",
  "Curhat Anonim",
  "Cinta",
  "Keluarga",
  "Karier",
  "Keuangan",
  "Cerita Lucu",
];

const moods = ["Sedih", "Bahagia", "Cemas", "Bersyukur", "Butuh Didengar"];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Kehidupan");
  const [mood, setMood] = useState("Butuh Didengar");
  const [authorName, setAuthorName] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  async function loadPosts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (!error && data) setPosts(data);

    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function submitStory(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Judul dan isi cerita wajib diisi.");
      return;
    }

    setSending(true);

    const { error } = await supabase.from("posts").insert({
      title,
      content,
      category,
      mood,
      author_name: anonymous ? "Anonim" : authorName || "Penulis Cerita",
      is_anonymous: anonymous,
      status: "pending",
    });

    setSending(false);

    if (error) {
      alert("Cerita gagal dikirim. Coba lagi.");
      return;
    }

    alert("Cerita berhasil dikirim dan sedang menunggu persetujuan admin.");
    setTitle("");
    setContent("");
    setAuthorName("");
    setAnonymous(true);
    setShowForm(false);
  }

  async function addLike(post: Post) {
    const { error } = await supabase
      .from("posts")
      .update({ likes: post.likes + 1 })
      .eq("id", post.id);

    if (!error) loadPosts();
  }

  const filteredPosts = posts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "Semua" || post.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-amber-400">Cerita Kita</h1>

          <div className="hidden flex-1 justify-center md:flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari cerita..."
              className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-amber-400"
            />
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-300"
          >
            Tulis Cerita
          </button>
        </div>
      </nav>

      <section className="border-b border-slate-800 px-6 py-20 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
          Ruang untuk semua cerita
        </p>

        <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-bold md:text-6xl">
          Setiap orang punya cerita yang layak didengar.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-slate-400">
          Bagikan pengalaman, perjuangan, perasaan, dan kisah hidupmu.
          Kamu dapat menulis secara anonim.
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="mt-8 rounded-xl bg-amber-400 px-6 py-3 font-bold text-slate-950 hover:bg-amber-300"
        >
          Mulai Menulis Ceritamu
        </button>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-bold">Cerita Terbaru</h3>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm"
          >
            <option>Semua</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="mb-6 md:hidden">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari cerita..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
          />
        </div>

        {loading ? (
          <p className="text-slate-400">Memuat cerita...</p>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
            Belum ada cerita yang cocok. Jadilah orang pertama yang berbagi.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="mb-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-300">
                    {post.category}
                  </span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                    {post.mood}
                  </span>
                </div>

                <h4 className="text-xl font-bold">{post.title}</h4>

                <p className="mt-3 line-clamp-4 leading-7 text-slate-400">
                  {post.content}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4 text-sm">
                  <span className="text-slate-500">
                    Oleh {post.is_anonymous ? "Anonim" : post.author_name}
                  </span>

                  <button
                    onClick={() => addLike(post)}
                    className="rounded-lg border border-slate-700 px-3 py-1 text-slate-300 hover:border-amber-400 hover:text-amber-300"
                  >
                    ❤️ Menguatkan {post.likes}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-slate-800 px-6 py-10 text-center text-sm text-slate-500">
        <p>© 2026 Cerita Kita · Ruang aman untuk berbagi cerita.</p>
        <div className="mt-3 flex justify-center gap-4">
          <span>Panduan Komunitas</span>
          <span>Privasi</span>
          <span>Laporkan Konten</span>
        </div>
      </footer>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Tulis Ceritamu</h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={submitStory} className="mt-6 space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul cerita"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 outline-none focus:border-amber-400"
              />

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan ceritamu di sini..."
                rows={8}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 outline-none focus:border-amber-400"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 p-3"
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 p-3"
                >
                  {moods.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              {!anonymous && (
                <input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Nama penulis"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
                />
              )}

              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                Publikasikan sebagai Anonim
              </label>

              <p className="rounded-lg bg-amber-400/10 p-3 text-xs leading-5 text-amber-200">
                Jangan menulis alamat, nomor telepon, kata sandi, atau data pribadi
                orang lain. Cerita akan ditinjau sebelum diterbitkan.
              </p>

              <button
                disabled={sending}
                className="w-full rounded-lg bg-amber-400 py-3 font-bold text-slate-950 disabled:opacity-60"
              >
                {sending ? "Mengirim..." : "Kirim Cerita untuk Ditinjau"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}