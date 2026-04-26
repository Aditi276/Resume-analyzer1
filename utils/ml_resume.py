import random
from functools import lru_cache

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

from utils.role_config import ROLE_SKILLS

_RESUME_NOISE = [
    "developer", "engineer", "software", "team", "project", "experience",
    "built", "designed", "implemented", "agile", "github",
]


def _synthetic_training_corpus(role_skills: dict[str, list[str]], seed: int = 42, samples_per_role: int = 80):
    rng = random.Random(seed)
    X: list[str] = []
    y: list[str] = []
    for role, skills in role_skills.items():
        if not skills:
            continue
        for _ in range(samples_per_role):
            k = max(1, rng.randint(max(1, len(skills) // 3), len(skills)))
            subset = rng.sample(skills, k)
            phrases = [f"experience with {s}" for s in subset]
            phrases += [f"worked on {s}" for s in subset[: max(1, k // 2)]]
            extra = rng.sample(_RESUME_NOISE, min(4, len(_RESUME_NOISE)))
            parts = phrases + extra
            rng.shuffle(parts)
            X.append(" ".join(parts))
            y.append(role)
    return X, y


@lru_cache(maxsize=1)
def _role_classifier_pipeline() -> Pipeline:
    X, y = _synthetic_training_corpus(ROLE_SKILLS)
    pipeline = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    lowercase=True,
                    ngram_range=(1, 2),
                    min_df=1,
                    max_features=4096,
                    stop_words="english",
                ),
            ),
            ("clf", MultinomialNB(alpha=0.1)),
        ]
    )
    pipeline.fit(X, y)
    return pipeline


def ml_role_insights(resume_text: str, selected_role: str) -> dict:
    text = (resume_text or "").strip()
    if not text:
        return {
            "predictedRole": None,
            "roleProbabilities": {},
            "selectedRoleFitPercent": None,
        }

    pipeline = _role_classifier_pipeline()
    classes = [str(c) for c in pipeline.named_steps["clf"].classes_]
    proba = pipeline.predict_proba([text])[0]
    probs = {classes[i]: round(float(proba[i]) * 100, 1) for i in range(len(classes))}
    predicted = max(probs, key=probs.get)
    selected = (selected_role or "").lower().strip()
    fit = probs.get(selected) if selected in probs else None

    return {
        "predictedRole": predicted,
        "roleProbabilities": probs,
        "selectedRoleFitPercent": fit,
    }


def ml_resume_jd_similarity_percent(resume_text: str, jd_text: str) -> int | None:
    r = (resume_text or "").strip()
    j = (jd_text or "").strip()
    if len(r) < 20 or len(j) < 20:
        return None

    vectorizer = TfidfVectorizer(
        lowercase=True,
        ngram_range=(1, 2),
        min_df=1,
        max_features=8192,
        stop_words="english",
    )
    matrix = vectorizer.fit_transform([r, j])
    sim = cosine_similarity(matrix[0:1], matrix[1:2])[0, 0]
    return int(round(float(sim) * 100))
