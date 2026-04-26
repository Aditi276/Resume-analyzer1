import re

_SUBSTRING_SKILLS = frozenset({"sql"})

_SPECIAL_PATTERNS: dict[str, re.Pattern[str]] = {
    # "expression" must not count as Express.js
    "express": re.compile(r"(?<![a-z0-9])express(?![a-z0-9])", re.I),
    # "javascript" must not count as Java
    "java": re.compile(r"(?<![a-z0-9])java(?!script)(?![a-z0-9])", re.I),
    # Node / Node.js / nodejs
    "node": re.compile(
        r"(?<![a-z0-9])node(?:\.js|js)?(?![a-z0-9])|(?<![a-z0-9])nodejs(?![a-z0-9])",
        re.I,
    ),
    # "reactive" must not count as React
    "react": re.compile(r"(?<![a-z0-9])react(?![a-z0-9])", re.I),
    # "springfield" / "offspring" should not match alone
    "spring": re.compile(r"(?<![a-z0-9])spring(?![a-z0-9])", re.I),
    # RESTful APIs, capitalized APIs, etc.
    "api": re.compile(r"(?<![a-z0-9])apis?(?![a-z0-9])", re.I),
    "ui": re.compile(r"(?<![a-z0-9])ui(?![a-z0-9])", re.I),
    "ux": re.compile(r"(?<![a-z0-9])ux(?![a-z0-9])", re.I),
    "html": re.compile(r"(?<![a-z0-9])html(?![a-z0-9])", re.I),
    "css": re.compile(r"(?<![a-z0-9])css(?![a-z0-9])", re.I),
    "go": re.compile(r"(?<![a-z0-9])go(?![a-z0-9])", re.I),
    "iam": re.compile(r"(?<![a-z0-9])iam(?![a-z0-9])", re.I),
}


def skill_mentioned_in_text(skill: str, text: str) -> bool:
    """
    Return True if `skill` appears in `text` as a real mention, not a substring accident
    (e.g. Express vs expression, Java vs JavaScript).
    """
    if not skill or not text:
        return False

    s = skill.strip().lower()
    t = text.lower()
    if not s:
        return False

    if " " in s:
        return s in t

    if s in _SPECIAL_PATTERNS:
        return bool(_SPECIAL_PATTERNS[s].search(t))

    if s in _SUBSTRING_SKILLS:
        return s in t

    if len(s) <= 2:
        return bool(re.search(rf"(?<![a-z0-9]){re.escape(s)}(?![a-z0-9])", t))

    return s in t
