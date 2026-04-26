from utils.role_config import ROLE_SKILLS
from utils.skill_detection import skill_mentioned_in_text


def extract_jd_skills(jd_text, role):
    jd_text = jd_text.lower()
    role = role.lower()

    skills = ROLE_SKILLS.get(role, [])
    extracted = []

    for skill in skills:
        if skill_mentioned_in_text(skill, jd_text):
            extracted.append(skill)

    return list(set(extracted))


def calculate_jd_score(resume_skills, jd_skills):
    if not jd_skills:
        return 0, []

    matched = set(resume_skills).intersection(set(jd_skills))
    score = int((len(matched) / len(jd_skills)) * 100)

    return score, sorted(list(matched))


def jd_skills_missing_from_resume(jd_text, role, resume_text):
    """Skills detected in the JD (from ROLE_SKILLS) that do not appear in resume text."""
    if not (jd_text or "").strip():
        return []

    jd_skills = extract_jd_skills(jd_text, role)
    r = (resume_text or "").lower()
    return sorted([s for s in jd_skills if not skill_mentioned_in_text(s, r)])
