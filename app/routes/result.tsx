import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaHome } from "react-icons/fa";

export default function Result() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/");
    }
  }, [navigate]);

  if (!state || !Array.isArray(state.matchedSkills)) {
    return <p className="text-center mt-10">No result found</p>;
  }

  const {
    matchedSkills,
    jdScore,
    missingSkills,
    jdMissingSkills,
    role,
    mlPredictedRole,
    mlRoleProbabilities,
    mlSelectedRoleFitPercent,
    mlResumeJdSimilarityPercent,
  } = state || {};

  const jdGaps = Array.isArray(jdMissingSkills) ? jdMissingSkills : [];
  const roleGaps = Array.isArray(missingSkills) ? missingSkills : [];

  return (
    <main className="min-h-screen bg-[url('/images/bg.jpg')] bg-cover bg-center flex items-center justify-center relative">

      {/* Home Icon */}
      <Link to="/hub" className="absolute top-6 left-6 text-2xl text-slate-800" title="Back to hub">
        <FaHome />
      </Link>

      <section className="bg-white bg-opacity-90 p-10 rounded-xl shadow-xl w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Analysis Result</h2>

        <p className="mb-4">
          <strong>Target Role:</strong> {role}
        </p>
        <p className="mb-4">
          <strong>JD Match Score (rule-based):</strong>{" "}
          {typeof jdScore === "number" ? `${jdScore}%` : "N/A"}
        </p>

        <div className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50/80 p-4">
          <h3 className="mb-2 font-semibold text-indigo-900">Machine learning</h3>
          <p className="mb-2 text-sm text-slate-800">
            <strong>TF-IDF + Multinomial Naive Bayes</strong> estimates which target role your resume
            text most resembles (trained on synthetic role-labeled text derived from skill keywords).
          </p>
          <p className="mb-1">
            <strong>ML predicted role:</strong>{" "}
            {typeof mlPredictedRole === "string" ? mlPredictedRole : "N/A"}
          </p>
          <p className="mb-1">
            <strong>Fit to selected role:</strong>{" "}
            {typeof mlSelectedRoleFitPercent === "number"
              ? `${mlSelectedRoleFitPercent}%`
              : "N/A"}
          </p>
          {mlPredictedRole && role && mlPredictedRole !== role && (
            <p className="mb-2 text-sm text-amber-800">
              Your dropdown role differs from the ML prediction — consider aligning wording with that
              track or pick the closer role.
            </p>
          )}
          {mlRoleProbabilities && Object.keys(mlRoleProbabilities).length > 0 && (
            <div className="mt-2">
              <p className="mb-1 text-sm font-semibold">Role probability scores</p>
              <ul className="ml-4 list-disc text-sm text-slate-700">
                {Object.entries(mlRoleProbabilities as Record<string, number>)
                  .sort((a, b) => b[1] - a[1])
                  .map(([r, pct]) => (
                    <li key={r}>
                      {r}: {pct}%
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <p className="mt-3 text-sm text-slate-800">
            <strong>Resume ↔ JD similarity (TF-IDF cosine):</strong>{" "}
            {typeof mlResumeJdSimilarityPercent === "number"
              ? `${mlResumeJdSimilarityPercent}%`
              : "Add a longer job description to compute this."}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Matched Skills</h3>
          <ul className="list-disc ml-6">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))
            ) : (
              <li>No skills matched</li>
            )}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Skills in job description missing from your resume</h3>
          {jdGaps.length > 0 ? (
            <ul className="list-disc ml-6 text-red-600">
              {jdGaps.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">
              {typeof jdScore === "number"
                ? "Every skill we detected in your job description appears somewhere on your resume."
                : "Paste a job description on the dashboard to see skills the JD asks for that are not on your resume."}
            </p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Suggestions to improve (for your selected role)</h3>
          {roleGaps.length > 0 ? (
            <ul className="list-disc ml-6 text-amber-700">
              {roleGaps.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">
              Your resume includes every skill in the role checklist for this project.
            </p>
          )}
image.png         </div>
      </section>
    </main>
  );
}
