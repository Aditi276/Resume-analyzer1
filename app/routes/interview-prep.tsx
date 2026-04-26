import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "~/components/Navbar";

const ROLE_FOCUS: Record<string, { title: string; technical: string[]; behavioral: string[] }> = {
  frontend: {
    title: "Frontend developer",
    technical: [
      "JavaScript fundamentals (closures, async, event loop)",
      "DOM, accessibility, and responsive layout",
      "React (or your framework): components, state, hooks, performance basics",
      "CSS layout (Flexbox/Grid) and common UI patterns",
      "Browser networking: HTTP, CORS, caching at a high level",
    ],
    behavioral: [
      "Describe a UI bug you debugged end-to-end",
      "How you collaborate with designers and backend engineers",
      "Trade-offs you made for performance vs shipping speed",
    ],
  },
  backend: {
    title: "Backend developer",
    technical: [
      "REST design, status codes, idempotency",
      "Databases: SQL vs NoSQL, indexing, transactions",
      "Authentication (sessions/JWT/OAuth) at a conceptual level",
      "Scaling basics: caching, queues, horizontal scaling",
      "One deep dive on a stack you list on your resume",
    ],
    behavioral: [
      "An API or service outage you handled or learned from",
      "How you review code and handle disagreements",
      "Prioritizing tech debt vs new features",
    ],
  },
  fullstack: {
    title: "Fullstack developer",
    technical: [
      "End-to-end feature: API + persistence + UI consumption",
      "Where you draw the line between frontend and backend ownership",
      "Testing: what you unit test vs integration test",
      "Deployment basics you have used (CI, envs, rollbacks)",
    ],
    behavioral: [
      "Owning a feature across the stack",
      "Learning a new framework or language under time pressure",
    ],
  },
  cloud: {
    title: "Cloud / DevOps",
    technical: [
      "IaC concepts (Terraform/CloudFormation) if you use them",
      "Containers vs VMs, Docker basics, orchestration overview",
      "Observability: logs, metrics, alerts",
      "Security hygiene: IAM, secrets, least privilege",
    ],
    behavioral: [
      "Improving reliability or cost of a system",
      "Incident response or on-call lessons",
    ],
  },
  data: {
    title: "Data analyst",
    technical: [
      "SQL: joins, aggregations, window functions",
      "Data quality: missing data, duplicates, sanity checks",
      "Visualization choices for a given audience",
      "Basics of metrics and experimentation if relevant",
    ],
    behavioral: [
      "Stakeholder asked for a vague report—how you clarified",
      "A time data contradicted intuition; what you did",
    ],
  },
};

export default function InterviewPrep() {
  const navigate = useNavigate();
  const [role, setRole] = useState("backend");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/");
    }
  }, [navigate]);

  const focus = ROLE_FOCUS[role] ?? ROLE_FOCUS.backend;

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-cyan-50">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/hub"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-700"
        >
          <FaArrowLeft className="text-xs" />
          Back to hub
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-slate-900">Interview preparation</h1>
        <p className="mb-8 text-slate-600">
          Use this as a study outline. Your team can plug in mock interviews, timed drills, or a backend
          question API later.
        </p>

        <div className="mb-8">
          <label className="mb-2 block font-semibold text-slate-800">Focus role</label>
          <select
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="frontend">Frontend developer</option>
            <option value="backend">Backend developer</option>
            <option value="fullstack">Fullstack developer</option>
            <option value="cloud">Cloud / DevOps</option>
            <option value="data">Data analyst</option>
          </select>
        </div>

        <div className="space-y-8">
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Technical topics — {focus.title}</h2>
            <ul className="list-disc space-y-2 pl-5 text-slate-700">
              {focus.technical.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Behavioral prompts to practice</h2>
            <ul className="list-disc space-y-2 pl-5 text-slate-700">
              {focus.behavioral.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
