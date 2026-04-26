import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Career prep suite | Student login" },
    {
      name: "description",
      content: "Login for resume analyzer and interview preparation modules.",
    },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/hub");
    }
  }, [navigate]);

  const handleLogin = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("studentName", name.trim());
    localStorage.setItem("studentEmail", email.trim());
    navigate("/hub");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 p-6">
      <section className="mx-auto grid min-h-[90vh] w-full max-w-6xl gap-8 lg:grid-cols-2">
        <div className="flex flex-col justify-center rounded-2xl bg-slate-900 p-10 text-white shadow-2xl">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-cyan-300">CSE Mini Project</p>
          <h1 className="mb-5 text-4xl font-bold leading-tight text-white">Career prep suite</h1>
          <p className="text-base text-slate-200">
            Login to open the hub: resume analysis (PDF + ML) and interview preparation outlines. Built for
            team demos and clear module ownership.
          </p>
          <div className="mt-8 rounded-xl bg-white/10 p-4">
            <p className="text-sm text-slate-200">
              Stack: React Router + Tailwind + Flask + PyPDF2 + scikit-learn (TF-IDF, Naive Bayes)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="mb-2 text-2xl font-bold text-slate-800">Student Login</h2>
            <p className="mb-6 text-sm text-slate-500">Use any credentials to continue.</p>

            <label className="mb-2 block text-sm font-semibold">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mb-4 w-full rounded-lg border border-slate-200 p-3"
            />

            <label className="mb-2 block text-sm font-semibold">College Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@college.edu"
              className="mb-4 w-full rounded-lg border border-slate-200 p-3"
            />

            <label className="mb-2 block text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="mb-6 w-full rounded-lg border border-slate-200 p-3"
            />

            <button
              onClick={handleLogin}
              className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Login & Continue
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
