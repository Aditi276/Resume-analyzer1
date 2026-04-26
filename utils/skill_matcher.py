from utils.role_config import ROLE_SKILLS
from utils.skill_detection import skill_mentioned_in_text


def match_skills(resume_text, role):
    resume_text = resume_text.lower()
    required_skills = ROLE_SKILLS.get(role, [])

    matched = [skill for skill in required_skills if skill_mentioned_in_text(skill, resume_text)]
    missing = [skill for skill in required_skills if not skill_mentioned_in_text(skill, resume_text)]

    return matched, missing
