import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "~/components/Navbar";

type TopicBucket = {
  topic: string;
  resources: { label: string; href: string }[];
};

const CURATED_LISTS: Record<string, TopicBucket[]> = {
  "Backend Developer": [
    {
      topic: "Arrays",
      resources: [
        { label: "Top 10 GFG Array Problems", href: "https://www.geeksforgeeks.org/top-50-array-coding-problems-for-interviews/" },
        { label: "LeetCode Array Question Set", href: "https://leetcode.com/tag/array/" },
        { label: "NeetCode Array Practice", href: "https://neetcode.io/practice?tab=neetcode150" },
      ],
    },
    {
      topic: "Trees",
      resources: [
        { label: "LeetCode Tree Problem Set", href: "https://leetcode.com/tag/tree/" },
        { label: "GFG Binary Tree Interview Questions", href: "https://www.geeksforgeeks.org/binary-tree-data-structure/" },
        { label: "Top Tree Questions (Mix)", href: "https://takeuforward.org/data-structure/top-tree-interview-questions/" },
      ],
    },
    {
      topic: "Graphs",
      resources: [
        { label: "LeetCode Graph Problem Set", href: "https://leetcode.com/tag/graph/" },
        { label: "GFG Graph Interview Questions", href: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" },
        { label: "Mixed Graph Questions (Striver)", href: "https://takeuforward.org/graph/striver-graph-series-top-graph-interview-questions/" },
      ],
    },
  ],
};

export default function CuratedLists() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Backend Developer");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/");
    }
  }, [navigate]);

  const topicBuckets = useMemo(() => CURATED_LISTS[role] ?? [], [role]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-8">
        <Link
          to="/hub"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-violet-700"
        >
          <FaArrowLeft className="text-xs" />
          Back to hub
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-slate-900">Topic-wise curated lists</h1>
        <p className="mb-8 text-slate-600">
          Practice by topic with curated sets instead of random links.
        </p>

        <div className="mb-8">
          <label className="mb-2 block font-semibold text-slate-800">Role</label>
          <select
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Backend Developer">Backend Developer</option>
          </select>
        </div>

        <div className="space-y-6">
          {topicBuckets.map((bucket) => (
            <article key={bucket.topic} className="rounded-xl border border-white/80 bg-white/95 p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-slate-900">{role} {"->"} {bucket.topic} Topics</h2>
              <ul className="list-disc space-y-2 pl-5 text-slate-700">
                {bucket.resources.map((resource) => (
                  <li key={resource.href}>
                    <a
                      href={resource.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-violet-700 hover:underline"
                    >
                      {resource.label}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
