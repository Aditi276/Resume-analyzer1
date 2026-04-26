import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FaChalkboardTeacher, FaFileAlt } from "react-icons/fa";
import Navbar from "~/components/Navbar";

export default function Hub() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">Career preparation hub</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Link
            to="/dashboard"
            className="group flex flex-col rounded-2xl border-2 border-white/80 bg-white/95 p-8 shadow-lg transition hover:border-indigo-300 hover:shadow-xl"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
              <FaFileAlt className="text-2xl" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Resume analyzer</h2>
            <p className="mb-6 flex-1 text-sm text-slate-600">
              Upload a PDF resume, pick a target role, and optionally paste a job description. Get skill
              matches, JD gaps, and ML-based role and similarity scores.
            </p>
            <span className="font-semibold text-indigo-600 group-hover:underline">Open resume analyzer →</span>
          </Link>

          <Link
            to="/interview-prep"
            className="group flex flex-col rounded-2xl border-2 border-white/80 bg-white/95 p-8 shadow-lg transition hover:border-emerald-300 hover:shadow-xl"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
              <FaChalkboardTeacher className="text-2xl" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Interview preparation</h2>
            <p className="mb-6 flex-1 text-sm text-slate-600">
              Role-focused checklists and question outlines to practice before interviews. Expand this area
              with your own content, timers, or a question bank.
            </p>
            <span className="font-semibold text-emerald-700 group-hover:underline">Open interview prep →</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
