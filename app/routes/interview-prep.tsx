import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "~/components/Navbar";

const ROLE_FOCUS: Record<string, { title: string; technical: string[]; behavioral: string[] }> = {
  frontend: {
    title: "Frontend developer",
    technical: [
      "HTML/CSS/JS",
      "React",
      "Performance",
      "UI/UX basics",
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
      "REST APIs",
      "Databases",
      "System Design",
      "Authentication",
    ],
    behavioral: [
      "An API or service outage you handled or learned from",
      "How you review code and handle disagreements",
      "Prioritizing tech debt vs new features",
    ],
  },
  "cloud-analyst": {
    title: "Cloud analyst",
    technical: ["AWS basics", "Networking", "Deployment", "Scaling"],
    behavioral: [
      "How you reduced cloud cost while keeping reliability",
      "How you debugged a deployment failure quickly",
      "How you handle incidents with clear communication",
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
  "btech-cs": {
    title: "BTech CS student",
    technical: ["DBMS", "Operating Systems", "Compiler Design", "Full Stack", "DSA"],
    behavioral: [
      "Explain one project deeply with architecture and trade-offs",
      "Describe how you debugged a hard issue under time pressure",
      "How do you prioritize fundamentals vs framework-specific learning?",
    ],
  },
};

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const COMPANY_STYLES = [
  "Product-based",
  "Service-based",
  "Amazon",
  "Google",
  "Infosys",
  "General",
] as const;

type Difficulty = (typeof DIFFICULTIES)[number];
type CompanyStyle = (typeof COMPANY_STYLES)[number];

type Question = {
  id: string;
  topic: string;
  difficulty: Difficulty;
  style: CompanyStyle;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type AttemptRecord = {
  questionId: string;
  topic: string;
  correct: boolean;
  confidence: number;
  attemptedAt: number;
};

const QUESTION_BANK: Record<string, Record<string, string[]>> = {
  backend: {
    "REST APIs": [
      "Design an idempotent endpoint for retry-safe payment confirmation. Which method and status codes do you choose?",
      "How would you version an API without breaking existing clients?",
      "What is the difference between 400, 409, and 422 in API validation scenarios?",
    ],
    Databases: [
      "Given a table with slow lookup by email, how would you design and validate an index strategy?",
      "When would you choose NoSQL over SQL for a high-write analytics service?",
      "Explain isolation levels with an example of a race condition they prevent.",
    ],
    "System Design": [
      "Design a URL shortener. What components, schema, and scaling strategy would you choose?",
      "How would you scale a notification service to handle burst traffic?",
      "How would you design a resilient order processing flow with retries and idempotency?",
    ],
    Authentication: [
      "Compare session-based auth vs JWT for a multi-device web app.",
      "How would OAuth login flow differ for SPA and server-rendered apps?",
      "What are practical steps to reduce token theft and replay risk?",
    ],
  },
  frontend: {
    "HTML/CSS/JS": [
      "Explain a bug caused by closure capture and how to fix it.",
      "What happens in the event loop when multiple promises resolve together?",
      "How do microtasks and macrotasks affect UI responsiveness?",
    ],
    React: [
      "When should state be lifted up vs kept local?",
      "Explain a render performance issue and how memoization helped.",
      "How do you prevent stale closures in hooks-based code?",
    ],
    Performance: [
      "Why does a CORS preflight happen and how do you resolve failures?",
      "How do ETags and cache-control improve frontend performance?",
      "What network metrics matter most for first contentful paint?",
    ],
    "UI/UX basics": [
      "How do you make a custom modal keyboard accessible?",
      "How would you debug layout shift across breakpoints?",
      "Name accessibility checks you always do before shipping.",
    ],
  },
  fullstack: {},
  cloud: {},
  "cloud-analyst": {
    "AWS basics": [
      "Explain EC2, S3, and RDS in one practical project scenario.",
      "When would you choose Lambda over EC2?",
      "How do security groups and IAM differ in responsibility?",
    ],
    Networking: [
      "Explain VPC, subnet, NAT, and route table in simple terms.",
      "What causes high latency between services and how do you debug it?",
      "How does DNS resolution work for cloud applications?",
    ],
    Deployment: [
      "Describe a CI/CD pipeline from commit to production deploy.",
      "How do blue-green and rolling deployments differ?",
      "How would you rollback safely after a bad release?",
    ],
    Scaling: [
      "How does auto-scaling work and which metrics would you use?",
      "How do caching and load balancing improve cloud scalability?",
      "How would you scale a read-heavy API cost-effectively?",
    ],
  },
  data: {},
  "btech-cs": {},
};

for (const roleKey of ["fullstack", "cloud", "data"]) {
  const baseTopics = ROLE_FOCUS[roleKey].technical;
  QUESTION_BANK[roleKey] = Object.fromEntries(
    baseTopics.map((topic) => [
      topic,
      [
        `Explain this topic in practice: ${topic}. Share one real scenario and your approach.`,
        `What common mistake happens in ${topic}, and how would you avoid it?`,
        `Give an interview-level example question on ${topic} and answer it step-by-step.`,
      ],
    ]),
  );
}

const CS_SUBJECT_BANK: Record<string, Record<Difficulty, string[]>> = {
  DBMS: {
    easy: [
      "What is normalization? Explain 1NF, 2NF, and 3NF with a simple schema.",
      "Difference between primary key and unique key.",
      "What is an index and why does it improve query performance?",
    ],
    medium: [
      "Design tables for an e-commerce order system and justify your normalization choices.",
      "Compare clustered vs non-clustered index and pick one for frequent range queries.",
      "How do ACID properties prevent data inconsistency in concurrent transactions?",
    ],
    hard: [
      "A query with JOIN on large tables is slow in production; how do you diagnose and fix it?",
      "Explain deadlock detection and prevention strategies in a high-concurrency system.",
      "How would you partition a very large transaction table while preserving reporting performance?",
    ],
  },
  "Operating Systems": {
    easy: [
      "Difference between process and thread.",
      "What is context switching and why is it expensive?",
      "Explain paging and virtual memory in simple terms.",
    ],
    medium: [
      "How do semaphores and mutexes differ? Give a practical race-condition example.",
      "Compare FCFS, SJF, and Round Robin scheduling.",
      "How does demand paging work and what causes page faults?",
    ],
    hard: [
      "Given a deadlock scenario with resource allocation graph, show detection and recovery steps.",
      "How does copy-on-write during fork improve performance?",
      "How would you tune Linux process and memory behavior for a latency-sensitive backend?",
    ],
  },
  "Compiler Design": {
    easy: [
      "List compiler phases and what each phase does.",
      "Difference between lexical analysis and syntax analysis.",
      "What is symbol table and why is it needed?",
    ],
    medium: [
      "Write CFG for arithmetic expressions and show parse tree for one sample expression.",
      "Explain top-down vs bottom-up parsing with examples.",
      "What kind of errors are caught in semantic analysis?",
    ],
    hard: [
      "How does LR parsing resolve shift-reduce conflicts?",
      "Explain intermediate code generation and one optimization pass on it.",
      "Design a simple type-checking strategy for a small statically typed language.",
    ],
  },
  "Full Stack": {
    easy: [
      "Explain request flow from browser to backend to database and back.",
      "Difference between client-side and server-side rendering.",
      "What is CORS and when does preflight occur?",
    ],
    medium: [
      "Design auth flow for React + Node app with refresh token strategy.",
      "How would you structure API error handling and validation across frontend and backend?",
      "How do you deploy and configure environment variables for staging vs production?",
    ],
    hard: [
      "Design a scalable real-time feature (notifications/chat) end-to-end.",
      "How would you investigate and fix a performance bottleneck across UI, API, and DB layers?",
      "Explain safe rollout strategy (feature flags/canary) for a full stack release.",
    ],
  },
  DSA: {
    easy: [
      "Reverse a linked list iteratively.",
      "Explain time and space complexity of binary search.",
      "Difference between stack and queue with one use case each.",
    ],
    medium: [
      "Find the first non-repeating character in a string efficiently.",
      "Detect cycle in linked list and explain why the approach works.",
      "Given intervals, merge overlapping intervals and analyze complexity.",
    ],
    hard: [
      "Design LRU cache with O(1) get/put operations.",
      "Find shortest path in weighted graph and justify algorithm choice.",
      "Given N jobs with deadlines/profits, derive and implement optimal scheduling strategy.",
    ],
  },
};

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function stylePrompt(style: CompanyStyle): string {
  if (style === "Product-based") {
    return "Ask in a product-company style: emphasize problem-solving, scale, trade-offs, and design depth.";
  }
  if (style === "Service-based") {
    return "Ask in a service-company style: emphasize fundamentals, theory clarity, and implementation basics.";
  }
  if (style === "Amazon") {
    return "Ask in Amazon style: ownership mindset, scalable design, and strong edge-case handling.";
  }
  if (style === "Google") {
    return "Ask in Google style: correctness, optimization, and structured reasoning.";
  }
  if (style === "Infosys") {
    return "Ask in Infosys style: strong fundamentals, practical scenarios, and clear communication.";
  }
  return "Ask in a balanced general interview style.";
}

function buildMcqs(topic: string, difficulty: Difficulty, style: CompanyStyle): Question[] {
  const styleTag = style === "General" ? "" : `[${style}] `;
  const templates: Record<Difficulty, Omit<Question, "id" | "topic" | "difficulty" | "style">[]> = {
    easy: [
      {
        text: `${styleTag}In ${topic}, what is the best basic description?`,
        options: [
          "A core concept used to build reliable solutions",
          "Only a UI styling technique",
          "A database backup format",
          "A logging framework only",
        ],
        correctIndex: 0,
        explanation: `${topic} starts with core fundamentals, not a single tool category.`,
      },
      {
        text: `${styleTag}For beginner interview prep in ${topic}, what should you prioritize first?`,
        options: [
          "Definitions and one practical use case per concept",
          "Memorizing only advanced optimizations",
          "Skipping theory and learning syntax only",
          "Ignoring real-world examples",
        ],
        correctIndex: 0,
        explanation: "Interviewers expect fundamentals plus practical understanding.",
      },
      {
        text: `${styleTag}Which approach is most effective for learning ${topic} basics?`,
        options: [
          "Learn concept -> solve small question -> explain reasoning",
          "Read answers only",
          "Solve random hard questions first",
          "Avoid writing notes",
        ],
        correctIndex: 0,
        explanation: "A concept-practice-reasoning loop builds retention and interview clarity.",
      },
      {
        text: `${styleTag}If asked an easy ${topic} question, what is the best structure?`,
        options: [
          "Definition, example, trade-off (if any)",
          "Only final answer in one line",
          "Unrelated project details",
          "Guess without explanation",
        ],
        correctIndex: 0,
        explanation: "Clear structure improves communication and confidence.",
      },
      {
        text: `${styleTag}How should you validate your understanding in ${topic}?`,
        options: [
          "Teach it back and solve at least one interview-style problem",
          "Read one blog and stop",
          "Depend only on AI summaries",
          "Skip revision completely",
        ],
        correctIndex: 0,
        explanation: "Active recall + practice is better than passive reading.",
      },
    ],
    medium: [
      {
        text: `${styleTag}In ${topic}, which response best shows medium-level depth?`,
        options: [
          "Explain concept, compare alternatives, and justify one choice",
          "Give a definition only",
          "Name tools without explanation",
          "Avoid discussing trade-offs",
        ],
        correctIndex: 0,
        explanation: "Medium questions test decision-making and trade-offs.",
      },
      {
        text: `${styleTag}You face a practical issue in ${topic}. What should you do first?`,
        options: [
          "Clarify constraints and expected outcome before choosing solution",
          "Jump to implementation immediately",
          "Pick the most complex method by default",
          "Ignore edge cases",
        ],
        correctIndex: 0,
        explanation: "Constraint-driven reasoning is expected in interviews.",
      },
      {
        text: `${styleTag}Which medium-level interview answer is strongest for ${topic}?`,
        options: [
          "Approach + complexity/impact + fallback plan",
          "Only a final conclusion",
          "A vague high-level statement",
          "Tool names without use case",
        ],
        correctIndex: 0,
        explanation: "Strong answers include method, impact, and backup strategy.",
      },
      {
        text: `${styleTag}How do you improve accuracy in ${topic} medium questions?`,
        options: [
          "Practice topic-focused sets and review mistakes by pattern",
          "Do only one mock per month",
          "Skip explanation checking",
          "Avoid timed practice",
        ],
        correctIndex: 0,
        explanation: "Pattern-based review improves both speed and correctness.",
      },
      {
        text: `${styleTag}What differentiates medium-level from easy in ${topic}?`,
        options: [
          "Applying concepts to scenarios with constraints",
          "Memorizing isolated definitions",
          "Avoiding comparison of options",
          "Ignoring practical context",
        ],
        correctIndex: 0,
        explanation: "Medium level is scenario application, not pure recall.",
      },
    ],
    hard: [
      {
        text: `${styleTag}A hard ${topic} problem has scale + reliability constraints. What matters most?`,
        options: [
          "Trade-offs, edge cases, and failure handling in the design",
          "Only naming a popular framework",
          "Ignoring bottlenecks",
          "Optimizing before understanding requirements",
        ],
        correctIndex: 0,
        explanation: "Hard questions evaluate robust thinking under constraints.",
      },
      {
        text: `${styleTag}For a hard ${topic} question, which interview flow is best?`,
        options: [
          "Clarify assumptions -> propose design -> analyze risks -> optimize",
          "Write final answer instantly",
          "Skip validation and testing concerns",
          "Avoid discussing alternatives",
        ],
        correctIndex: 0,
        explanation: "Interviewers value iterative problem solving and risk analysis.",
      },
      {
        text: `${styleTag}Which signal indicates senior-level handling of ${topic}?`,
        options: [
          "Balanced choices with measurable impact and rollback plan",
          "Over-engineering every part",
          "No mention of monitoring",
          "No consideration of cost",
        ],
        correctIndex: 0,
        explanation: "Senior answers include impact, observability, and rollback safety.",
      },
      {
        text: `${styleTag}In hard ${topic} interviews, what often causes rejection?`,
        options: [
          "Missing edge-case and failure-mode reasoning",
          "Speaking clearly",
          "Asking clarifying questions",
          "Comparing alternatives",
        ],
        correctIndex: 0,
        explanation: "Ignoring failures and edge cases is a common gap.",
      },
      {
        text: `${styleTag}How should you prepare for hard ${topic} rounds?`,
        options: [
          "Timed mocks, post-mortem reviews, and iterative refinements",
          "Only reading theory notes",
          "Avoiding whiteboard or explanation practice",
          "Practicing only easy questions",
        ],
        correctIndex: 0,
        explanation: "Hard-round readiness needs realistic practice loops.",
      },
    ],
  };

  return templates[difficulty].map((item, idx) => ({
    id: `${Date.now()}-${idx}`,
    topic,
    difficulty,
    style,
    ...item,
  }));
}

export default function InterviewPrep() {
  const navigate = useNavigate();
  const [role, setRole] = useState("backend");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [companyStyle, setCompanyStyle] = useState<CompanyStyle>("General");
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [questionConfidence, setQuestionConfidence] = useState<Record<string, number>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuestionIds, setSubmittedQuestionIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("interviewPrepAttempts");
      if (saved) {
        setAttempts(JSON.parse(saved) as AttemptRecord[]);
      }
    } catch {
      setAttempts([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("interviewPrepAttempts", JSON.stringify(attempts));
  }, [attempts]);

  const focus = ROLE_FOCUS[role] ?? ROLE_FOCUS.backend;
  const topicQuestionBank =
    role === "btech-cs"
      ? Object.fromEntries(Object.keys(CS_SUBJECT_BANK).map((topic) => [topic, CS_SUBJECT_BANK[topic].easy]))
      : QUESTION_BANK[role] ?? {};
  const topics = Object.keys(topicQuestionBank);
  const activeTopic = selectedTopic || topics[0] || "";

  useEffect(() => {
    if (topics.length === 0) {
      setSelectedTopic("");
      return;
    }
    if (!selectedTopic || !topics.includes(selectedTopic)) {
      setSelectedTopic(topics[0]);
    }
  }, [role, selectedTopic, topics]);

  const attemptsForRole = attempts.filter((item) => focus.technical.includes(item.topic));
  const totalAttempted = attemptsForRole.length;
  const totalCorrect = attemptsForRole.filter((item) => item.correct).length;
  const accuracyPercent = totalAttempted ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const avgConfidence = totalAttempted
    ? Math.round(attemptsForRole.reduce((sum, item) => sum + item.confidence, 0) / totalAttempted)
    : 0;

  const topicStats = focus.technical.map((topic) => {
    const topicAttempts = attemptsForRole.filter((item) => item.topic === topic);
    const attempted = topicAttempts.length;
    const correct = topicAttempts.filter((item) => item.correct).length;
    const topicAccuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
    const topicConfidence = attempted
      ? Math.round(topicAttempts.reduce((sum, item) => sum + item.confidence, 0) / attempted)
      : 0;
    return { topic, attempted, topicAccuracy, topicConfidence };
  });

  const weakTopics = topicStats
    .filter((item) => item.attempted > 0)
    .sort((a, b) => a.topicAccuracy - b.topicAccuracy || a.topicConfidence - b.topicConfidence)
    .slice(0, 3);

  function generateQuestions() {
    if (!activeTopic) return;
    const questions = buildMcqs(activeTopic, difficulty, companyStyle).map((q) => ({
      ...q,
      text: `${q.text} ${stylePrompt(companyStyle)}`,
    }));
    setGeneratedQuestions(questions);
    setSelectedAnswers({});
    setSubmittedQuestionIds({});
  }

  function trackAnswer(question: Question, selectedIndex: number) {
    if (submittedQuestionIds[question.id]) return;
    const correct = selectedIndex === question.correctIndex;
    const confidence = questionConfidence[question.id] ?? 70;
    const record: AttemptRecord = {
      questionId: question.id,
      topic: question.topic,
      correct,
      confidence,
      attemptedAt: Date.now(),
    };
    setAttempts((prev) => [record, ...prev]);
    setSubmittedQuestionIds((prev) => ({ ...prev, [question.id]: true }));
  }

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
        <p className="mb-8 text-slate-600">Generate questions by subject, practice them, and track your weak areas.</p>

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
            <option value="cloud-analyst">Cloud analyst</option>
            <option value="data">Data analyst</option>
            <option value="btech-cs">BTech CS student</option>
          </select>
        </div>

        <div className="space-y-8">
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Performance tracker</h2>
            <ul className="mb-4 space-y-2 text-slate-700">
              <li>Questions attempted: <span className="font-semibold">{totalAttempted}</span></li>
              <li>Accuracy: <span className="font-semibold">{accuracyPercent}%</span></li>
              <li>Average confidence: <span className="font-semibold">{avgConfidence}%</span></li>
            </ul>

            <p className="mb-2 font-medium text-slate-800">Weak topics</p>
            {weakTopics.length === 0 ? (
              <p className="text-slate-600">Attempt some questions to see weak areas.</p>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-slate-700">
                {weakTopics.map((item) => (
                  <li key={item.topic}>
                    {item.topic}: {item.topicAccuracy}% accuracy, {item.topicConfidence}% confidence
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Personalized question generator</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Subject/topic</label>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                  value={activeTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Difficulty</label>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                >
                  {DIFFICULTIES.map((level) => (
                    <option key={level} value={level}>
                      {level[0].toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Company style/type</label>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                  value={companyStyle}
                  onChange={(e) => setCompanyStyle(e.target.value as CompanyStyle)}
                >
                  {COMPANY_STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
              onClick={generateQuestions}
              disabled={!activeTopic}
            >
              Generate questions
            </button>

            {generatedQuestions.length > 0 && (
              <div className="mt-6 space-y-4">
                {generatedQuestions.map((question, index) => (
                  <div key={question.id} className="rounded-lg border border-slate-200 p-4">
                    <p className="mb-2 font-medium text-slate-900">
                      Q{index + 1}. {question.text}
                    </p>
                    <p className="mb-3 text-sm text-slate-600">
                      Topic: {question.topic} | Difficulty: {question.difficulty} | Company: {question.style}
                    </p>
                    <div className="mb-3 space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label key={option} className="flex items-start gap-2 text-sm text-slate-700">
                          <input
                            type="radio"
                            name={`answer-${question.id}`}
                            value={optionIndex}
                            checked={selectedAnswers[question.id] === optionIndex}
                            onChange={() =>
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [question.id]: optionIndex,
                              }))
                            }
                            disabled={Boolean(submittedQuestionIds[question.id])}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Your confidence: {questionConfidence[question.id] ?? 70}%
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={questionConfidence[question.id] ?? 70}
                      onChange={(e) =>
                        setQuestionConfidence((prev) => ({
                          ...prev,
                          [question.id]: Number(e.target.value),
                        }))
                      }
                      className="mb-3 w-full"
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => {
                          const selectedIndex = selectedAnswers[question.id];
                          if (selectedIndex === undefined) return;
                          trackAnswer(question, selectedIndex);
                        }}
                        disabled={submittedQuestionIds[question.id] || selectedAnswers[question.id] === undefined}
                      >
                        Submit answer
                      </button>
                    </div>
                    {submittedQuestionIds[question.id] && (
                      <p className="mt-3 text-sm text-slate-700">
                        {selectedAnswers[question.id] === question.correctIndex ? "Correct. " : "Needs work. "}
                        {question.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
