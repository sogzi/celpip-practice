// CELPIP-General Reading & Listening: part definitions, test-set types, scoring.

export type Skill = "reading" | "listening";

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface Section {
  heading?: string;
  instructions?: string;
  /** Reading passage. Blanks are written as "(7) ______". */
  text?: string;
  /** Reading Part 2 diagram. */
  table?: { title: string; headers: string[]; rows: string[][]; note?: string };
  /** Listening script, spoken with text-to-speech and never shown until review. */
  script?: { speaker: string; text: string }[];
  questions: Question[];
}

export interface TestSet {
  id: string;
  skill: Skill;
  partId: string;
  title: string;
  source: "builtin" | "ai";
  speakers?: { name: string; voice: "female" | "male" }[];
  sections: Section[];
}

export interface PartDef {
  id: string;
  number: number;
  name: string;
  summary: string;
  /** Question count per section, in order. */
  sections: number[];
  /** Reading only: time limit for the whole part. */
  minutes?: number;
  /** Options are fixed labels (A–E) and must not be shuffled. */
  fixedOptions?: boolean;
  /** What Claude should write for this part. */
  brief: string;
}

export const READING_PARTS: PartDef[] = [
  {
    id: "part-1",
    number: 1,
    name: "Reading Correspondence",
    summary: "Read a personal message, then complete a reply.",
    sections: [6, 5],
    minutes: 11,
    brief: `Section 1: heading "Message". text: a personal email between friends, family members or neighbours about an everyday situation (230-280 words, greeting and sign-off included). 6 multiple-choice questions about it covering main idea, details, the writer's feelings, inference and purpose.
Section 2: heading "Reply". text: the other person's reply email (150-200 words) containing exactly 5 numbered blanks written as "(7) ______", "(8) ______", "(9) ______", "(10) ______", "(11) ______" in that order. 5 questions, one per blank in order, each with prompt "Blank 7", "Blank 8", etc. All four options must fit grammatically; only one fits the meaning of both emails.`,
  },
  {
    id: "part-2",
    number: 2,
    name: "Reading to Apply a Diagram",
    summary: "Use a schedule or chart to complete an email.",
    sections: [8],
    minutes: 9,
    brief: `One section with heading "Diagram and email".
table: a realistic diagram such as a schedule, price list, program guide or comparison chart. 4-6 rows, 3-5 columns, with a note line for discounts, deadlines or conditions.
text: an email (150-200 words) from someone planning something using the diagram. It contains exactly 5 blanks written as "(1) ______" to "(5) ______". Questions 1-5 have prompts "Blank 1" to "Blank 5", and answering each one requires the diagram.
Questions 6-8 are ordinary multiple-choice questions that need both the email and the diagram. One of them involves a simple calculation such as applying a discount or adding fees.
8 questions in total.`,
  },
  {
    id: "part-3",
    number: 3,
    name: "Reading for Information",
    summary: "Match statements to the paragraph that contains the information.",
    sections: [9],
    minutes: 10,
    fixedOptions: true,
    brief: `One section with heading "Article".
text: an informational article in exactly 4 paragraphs that begin "A. ", "B. ", "C. ", "D. " (70-100 words each). Separate paragraphs with a blank line.
9 questions. Each prompt is a statement that paraphrases information; do not copy the article's wording. options must be exactly ["A", "B", "C", "D", "E (Not given)"]. answer is the index of the paragraph that contains the information, or 4 if the article does not give it. Use E for 1 or 2 questions, use every paragraph at least once, and mix the order.`,
  },
  {
    id: "part-4",
    number: 4,
    name: "Reading for Viewpoints",
    summary: "Understand different opinions in an article and a reader's comment.",
    sections: [5, 5],
    minutes: 13,
    brief: `Section 1: heading "Article". text: a news-style article (330-400 words) on a local or community issue. It presents at least two viewpoints and quotes named people (invented). 5 multiple-choice questions on viewpoints, attitudes, reasons and inference.
Section 2: heading "Reader comment". text: a reader's comment responding to the article (120-170 words) with exactly 5 blanks written as "(6) ______" to "(10) ______". 5 questions with prompts "Blank 6" to "Blank 10". Choosing the right answer requires understanding the article.`,
  },
];

export const LISTENING_PARTS: PartDef[] = [
  {
    id: "part-1",
    number: 1,
    name: "Listening to Problem Solving",
    summary: "Follow a conversation in three sections where someone works through a problem.",
    sections: [3, 3, 2],
    brief: `One conversation between two people, where one has a problem and the other helps solve it. Split it into 3 sections that continue the same conversation, each 120-170 words of dialogue. Section questions: 3, 3 and 2. Headings "Section 1", "Section 2", "Section 3".`,
  },
  {
    id: "part-2",
    number: 2,
    name: "Listening to a Daily Life Conversation",
    summary: "An everyday conversation, for example at a store, a clinic or with a neighbour.",
    sections: [5],
    brief: `One everyday conversation between two people (at a store, clinic, office, school, with a landlord or neighbour) of 200-260 words. 5 questions.`,
  },
  {
    id: "part-3",
    number: 3,
    name: "Listening for Information",
    summary: "An interview or conversation packed with details.",
    sections: [6],
    brief: `One information-rich conversation or radio interview (260-330 words) about a service, program, event or topic, including numbers and specific details. 6 questions.`,
  },
  {
    id: "part-4",
    number: 4,
    name: "Listening to a News Item",
    summary: "A short news report.",
    sections: [5],
    brief: `One news report read by a single newscaster (220-280 words) about a local development, with facts, a reaction from some group, and numbers. 5 questions.`,
  },
  {
    id: "part-5",
    number: 5,
    name: "Listening to a Discussion",
    summary: "Three people discuss options and reach a decision.",
    sections: [8],
    brief: `A discussion among exactly three people (a workplace or community meeting) of 320-400 words. They propose options, raise concerns, compromise and reach a decision. 8 questions, including who holds which opinion and what was finally decided.`,
  },
  {
    id: "part-6",
    number: 6,
    name: "Listening to Viewpoints",
    summary: "A talk presenting contrasting opinions on an issue.",
    sections: [6],
    brief: `A single speaker presenting a talk or report on an issue with at least two contrasting viewpoints from named people, ending with an outcome or next step (300-360 words). 6 questions.`,
  },
];

export const PARTS: Record<Skill, PartDef[]> = { reading: READING_PARTS, listening: LISTENING_PARTS };

export function getPart(skill: Skill, partId: string) {
  return PARTS[skill].find((p) => p.id === partId);
}

/** Seconds allowed to answer each listening question after the audio ends. */
export const LISTENING_SECONDS_PER_QUESTION = 40;

export const SKILL_INFO: Record<Skill, { label: string; totalQuestions: number; duration: string }> = {
  reading: { label: "Reading", totalQuestions: 38, duration: "about 45 minutes" },
  listening: { label: "Listening", totalQuestions: 38, duration: "about 40 minutes" },
};

// Approximate raw score (out of 38) to CELPIP level, based on commonly published
// conversion charts. Official scores are equated per test form, so this is only a guide.
const LEVEL_TABLE: Record<Skill, [minRaw: number, level: number][]> = {
  listening: [[38, 12], [37, 11], [35, 10], [33, 9], [28, 8], [22, 7], [17, 6], [11, 5], [7, 4], [0, 3]],
  reading: [[38, 12], [37, 11], [33, 10], [31, 9], [27, 8], [22, 7], [17, 6], [11, 5], [8, 4], [0, 3]],
};

/** Estimated CELPIP level from a score, scaled to the full 38-question test. */
export function estimateLevel(skill: Skill, correct: number, total: number) {
  if (total === 0) return 3;
  const raw = Math.round((correct / total) * SKILL_INFO[skill].totalQuestions);
  return LEVEL_TABLE[skill].find(([min]) => raw >= min)![1];
}

// --- option shuffling -------------------------------------------------------

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Shuffle each question's options (keeping the answer index in sync). Deterministic per seed. */
export function shuffleOptions(set: TestSet, seed = set.id): TestSet {
  if (getPart(set.skill, set.partId)?.fixedOptions) return set;
  const rand = mulberry32(hash(seed));
  return {
    ...set,
    sections: set.sections.map((sec) => ({
      ...sec,
      questions: sec.questions.map((q) => {
        const order = q.options.map((_, i) => i);
        for (let i = order.length - 1; i > 0; i--) {
          const j = Math.floor(rand() * (i + 1));
          [order[i], order[j]] = [order[j], order[i]];
        }
        return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
      }),
    })),
  };
}

export function questionCount(set: TestSet) {
  return set.sections.reduce((n, s) => n + s.questions.length, 0);
}
