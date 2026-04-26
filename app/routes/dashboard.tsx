import { useEffect, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";

export default function Dashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!file || !role) {
      alert("Please upload resume and select role");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);
    formData.append("jobDescription", jd);

    try {
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        navigate("/result", { state: data.data });
      } else {
        alert(data.error || "Something went wrong");
      }

    } catch (err) {
      console.error("Request failed:", err);
      alert("Server not reachable");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 bg-cover bg-center bg-no-repeat">
      <Navbar />
      <section className="flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-3xl bg-white/90 rounded-xl shadow-xl p-8">

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3">
              Upload Resume
            </h2>
            <p className="text-gray-700">
              Analyze your resume against job description
            </p>
          </div>

          {/* Role */}
          <div className="mb-5">
            <label className="font-semibold block mb-2">Target Role</label>
            <select
              className="w-full border rounded-md p-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select role</option>
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="fullstack">Fullstack Developer</option>
              <option value="cloud">Cloud / DevOps</option>
              <option value="data">Data Analyst</option>
            </select>
          </div>

          {/* JD */}
          <div className="mb-5">
            <label className="font-semibold block mb-2">Job Description</label>
            <textarea
              rows={4}
              className="w-full border rounded-md p-2"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste job description here (optional)"
            />
          </div>

          {/* Resume Upload */}
          <div className="mb-6">
            <label className="font-semibold block mb-2">Upload Resume (PDF)</label>

            <label
              htmlFor="resume-upload"
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer block hover:border-blue-500"
            >
              <FaFileUpload className="mx-auto text-3xl text-blue-600 mb-2" />
              <p>{file ? file.name : "Click to upload resume"}</p>
            </label>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Analyze Resume
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
