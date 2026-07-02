"use client";

import { useState } from "react";

const stories = [
  {
    id: 1,
    title: "Belajar menerima hal yang tidak bisa diubah",
    category: "Kehidupan",
    author: "Anonim",
    time: "5 menit lalu",
    content:
      "Ada masa ketika saya terus memikirkan sesuatu yang sudah berlalu. Perlahan saya belajar bahwa menerima bukan berarti menyerah.",
  },
  {
    id: 2,
    title: "Perjuangan mencari pekerjaan pertama",
    category: "Karier",
    author: "Diana",
    time: "20 menit lalu",
    content:
      "Setelah beberapa kali ditolak, saya hampir berhenti mencoba. Tetapi satu kesempatan akhirnya mengubah semuanya.",
  },
];

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between border-b border-slate-800 px-8 py-5">
        <h1 className="text-2xl font-bold text-amber-400">Cerita Kita</h1>

        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-amber-400 px-5 py-2 font-semibold text-slate-950"
        >
          Tulis Cerita
        </button>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-400">
          Ruang untuk semua cerita
        </p>

        <h2 className="text-4xl font-bold md:text-6xl">
          Setiap orang punya cerita yang layak didengar.
        </h2>

        <p className="mt-6 text-lg text-slate-400">
          Bagikan pengalaman, perjuangan, perasaan, dan cerita hidupmu.
          Kamu dapat menulis secara anonim.
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="mt-8 rounded-xl bg-amber-400 px-6 py-3 font-bold text-slate-950"
        >
          Mulai Menulis Ceritamu
        </button>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h3 className="mb-6 text-2xl font-bold">Cerita Terbaru</h3>

        <div className="space-y-5">
          {stories.map((story) => (
            <article
              key={story.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="mb-3 flex gap-3 text-sm">
                <span className="rounded-full bg-amber-400/10 px-3 py-1 text-amber-300">
                  {story.category}
                </span>
                <span className="text-slate-500">{story.time}</span>
              </div>

              <h4 className="text-xl font-bold">{story.title}</h4>
              <p className="mt-3 text-slate-400">{story.content}</p>

              <p className="mt-5 border-t border-slate-800 pt-4 text-sm text-slate-500">
                Oleh {story.author}
              </p>
            </article>
          ))}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Tulis Ceritamu</h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-2xl text-slate-400"
              >
                ×
              </button>
            </div>

            <input
              placeholder="Judul cerita"
              className="mt-6 w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
            />

            <textarea
              placeholder="Tuliskan ceritamu di sini..."
              rows={7}
              className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
            />

            <button
              onClick={() => setShowForm(false)}
              className="mt-4 w-full rounded-lg bg-amber-400 py-3 font-bold text-slate-950"
            >
              Kirim Cerita
            </button>
          </div>
        </div>
      )}
    </main>
  );
}