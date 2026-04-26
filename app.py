from flask import Flask, request, jsonify
from flask_cors import CORS

from utils.resume_parser import extract_text_from_pdf
from utils.skill_matcher import match_skills
from utils.jd_matcher import (
    extract_jd_skills,
    calculate_jd_score,
    jd_skills_missing_from_resume,
)
from utils.ml_resume import ml_role_insights, ml_resume_jd_similarity_percent

import os

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {"pdf"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/analyze", methods=["POST"])
def analyze_resume():
    try:
        file = request.files.get("resume")
        role = request.form.get("role")
        jd_text = request.form.get("jobDescription", "")

        if not file or file.filename == "":
            return jsonify({"success": False, "error": "Resume file is required"}), 400

        if not allowed_file(file.filename):
            return jsonify({"success": False, "error": "Only PDF files are allowed"}), 400

        if not role:
            return jsonify({"success": False, "error": "Role is required"}), 400

        try:
            resume_text = extract_text_from_pdf(file.stream)
        except Exception as e:
            return jsonify({
                "success": False,
                "error": "Failed to read PDF",
                "details": str(e)
            }), 500

        matched_skills, missing_skills = match_skills(resume_text, role)

        jd_score = None
        jd_skills = []
        jd_matched_skills = []
        jd_missing_from_resume = []
        if jd_text.strip():
            jd_skills = extract_jd_skills(jd_text, role)
            jd_score, jd_matched_skills = calculate_jd_score(matched_skills, jd_skills)
            jd_missing_from_resume = jd_skills_missing_from_resume(
                jd_text, role, resume_text
            )

        suggestion_seen = set()
        suggestions = []
        for s in missing_skills + jd_missing_from_resume:
            if s not in suggestion_seen:
                suggestion_seen.add(s)
                suggestions.append(s)

        ml_role = ml_role_insights(resume_text, role)
        ml_jd_similarity = (
            ml_resume_jd_similarity_percent(resume_text, jd_text)
            if jd_text.strip()
            else None
        )

        return jsonify({
            "success": True,
            "data": {
                "role": role,
                "matchedSkills": matched_skills,
                "missingSkills": missing_skills,
                "jdMissingSkills": jd_missing_from_resume,
                "suggestions": suggestions,
                "jdSkills": jd_skills,
                "jdMatchedSkills": jd_matched_skills,
                "jdScore": jd_score,
                "mlPredictedRole": ml_role["predictedRole"],
                "mlRoleProbabilities": ml_role["roleProbabilities"],
                "mlSelectedRoleFitPercent": ml_role["selectedRoleFitPercent"],
                "mlResumeJdSimilarityPercent": ml_jd_similarity,
            }
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Internal server error",
            "details": str(e)
        }), 500


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"message": "Backend is running"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
