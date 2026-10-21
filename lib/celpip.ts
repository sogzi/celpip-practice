// CELPIP-General task bank, timings and rating criteria.
// Timings and criteria follow the official CELPIP-General test format.

export type Kind = "writing" | "speaking";

export interface Prompt {
  id: string;
  title: string;
  /** The scenario / question shown to the test taker. */
  body: string;
  /** Bullet points the response must address (writing Task 1, speaking scenes, etc). */
  points?: string[];
  /** Two choices for Writing Task 2 and Speaking Task 5. */
  options?: { label: string; detail: string }[];
}

export interface WritingTask {
  id: string;
  number: number;
  name: string;
  summary: string;
  minutes: number;
  minWords: number;
  maxWords: number;
  prompts: Prompt[];
}

export interface SpeakingTask {
  id: string;
  number: number;
  name: string;
  summary: string;
  prepSeconds: number;
  speakSeconds: number;
  prompts: Prompt[];
}

export const WRITING_CRITERIA = [
  "Content/Coherence",
  "Vocabulary",
  "Readability",
  "Task Fulfillment",
] as const;

export const SPEAKING_CRITERIA = [
  "Content/Coherence",
  "Vocabulary",
  "Listenability",
  "Task Fulfillment",
] as const;

export const CRITERIA_HELP: Record<string, string> = {
  "Content/Coherence":
    "Number and quality of ideas, organization, examples and supporting details.",
  Vocabulary:
    "Range of words and phrases, precision, and use of idiomatic language.",
  Readability:
    "Format, paragraphing, connectors and transitions, grammar, spelling and punctuation.",
  Listenability:
    "Rhythm and pausing, grammar and sentence variety, self-correction, and how easy it is to follow.",
  "Task Fulfillment":
    "Relevance, completeness, tone, and length appropriate to the task.",
};

export const LEVEL_LABELS: Record<number, string> = {
  12: "Advanced proficiency in workplace & community contexts",
  11: "Advanced proficiency",
  10: "Highly effective proficiency",
  9: "Effective proficiency",
  8: "Good proficiency",
  7: "Adequate proficiency",
  6: "Developing proficiency",
  5: "Acquiring proficiency",
  4: "Adequate for daily life in limited contexts",
  3: "Some proficiency in limited contexts",
  2: "Minimal proficiency",
  1: "Minimal proficiency",
};

/** CELPIP levels 4–10 line up with the same CLB level. */
export function clbLabel(level: number) {
  const l = Math.round(level);
  if (l >= 10) return "CLB 10+";
  if (l < 4) return "below CLB 4";
  return `CLB ${l}`;
}

export function levelLabel(level: number) {
  return LEVEL_LABELS[Math.max(1, Math.min(12, Math.round(level)))];
}

export const WRITING_TASKS: WritingTask[] = [
  {
    id: "task-1",
    number: 1,
    name: "Writing an Email",
    summary: "Write an email that addresses three points about an everyday situation.",
    minutes: 27,
    minWords: 150,
    maxWords: 200,
    prompts: [
      {
        id: "noisy-neighbour",
        title: "Noisy renovation next door",
        body: "Your neighbour has been renovating their apartment for three weeks, and the noise starts very early every morning. Write an email to your building manager.",
        points: [
          "Describe the problem and how long it has been happening.",
          "Explain how it is affecting you and your household.",
          "Suggest what the building manager could do to resolve it.",
        ],
      },
      {
        id: "gym-membership",
        title: "Cancelling a gym membership",
        body: "You signed up for a one-year gym membership, but you are moving to another city for work next month. Write an email to the gym's customer service department.",
        points: [
          "Explain why you need to cancel your membership.",
          "Describe what you were told when you signed up about cancellations.",
          "Ask what options are available to you.",
        ],
      },
      {
        id: "thank-colleague",
        title: "Thanking a former colleague",
        body: "A former colleague helped you prepare for a job interview, and you got the job. Write an email to this colleague.",
        points: [
          "Thank them and describe how their help made a difference.",
          "Tell them about your new job.",
          "Suggest a way you would like to show your appreciation.",
        ],
      },
      {
        id: "damaged-order",
        title: "Damaged online order",
        body: "You ordered a coffee table online for a family gathering this weekend. It arrived with a large crack in the glass top. Write an email to the store.",
        points: [
          "Describe what you ordered and what was wrong with it.",
          "Explain why this is especially inconvenient for you.",
          "Say what you would like the store to do.",
        ],
      },
    ],
  },
  {
    id: "task-2",
    number: 2,
    name: "Responding to Survey Questions",
    summary: "Choose one of two options in a survey and explain your choice persuasively.",
    minutes: 26,
    minWords: 150,
    maxWords: 200,
    prompts: [
      {
        id: "city-budget",
        title: "City budget priority",
        body: "Your city has extra money in its budget and is asking residents which project it should fund. Choose the option you prefer and explain the reasons for your choice.",
        options: [
          { label: "Option A", detail: "Build a new public library with free study spaces and community programs." },
          { label: "Option B", detail: "Expand public transit with more bus routes and later service hours." },
        ],
      },
      {
        id: "work-schedule",
        title: "Four-day work week",
        body: "Your employer is considering a change to work schedules and has asked employees for their opinion. Choose the option you prefer and explain the reasons for your choice.",
        options: [
          { label: "Option A", detail: "Work four 10-hour days with every Friday off." },
          { label: "Option B", detail: "Keep five 8-hour days but with flexible start and end times." },
        ],
      },
      {
        id: "school-phones",
        title: "Phones in schools",
        body: "The local school board is surveying parents and community members about student cell phone use. Choose the option you prefer and explain the reasons for your choice.",
        options: [
          { label: "Option A", detail: "Ban cell phones completely during school hours." },
          { label: "Option B", detail: "Allow cell phones, but only during breaks and for class activities." },
        ],
      },
      {
        id: "park-land",
        title: "Unused land downtown",
        body: "A piece of empty land downtown has become available, and the city wants residents' input on how to use it. Choose the option you prefer and explain the reasons for your choice.",
        options: [
          { label: "Option A", detail: "Create a park with gardens, walking paths and a playground." },
          { label: "Option B", detail: "Build affordable housing for families and seniors." },
        ],
      },
    ],
  },
];

export const SPEAKING_TASKS: SpeakingTask[] = [
  {
    id: "task-1",
    number: 1,
    name: "Giving Advice",
    summary: "Give advice to someone facing a common situation.",
    prepSeconds: 30,
    speakSeconds: 90,
    prompts: [
      {
        id: "new-to-canada",
        title: "Friend moving to Canada",
        body: "A friend is moving to Canada next month and is nervous about settling in. Advise your friend on how to prepare and adjust to life in a new country.",
      },
      {
        id: "first-car",
        title: "Buying a first car",
        body: "Your cousin wants to buy their first car but doesn't know much about cars or budgeting. Give your cousin some advice about how to make a good decision.",
      },
      {
        id: "work-stress",
        title: "Stressed coworker",
        body: "A coworker tells you they feel overwhelmed by their workload and can't sleep well. Give your coworker advice on how to manage the situation.",
      },
    ],
  },
  {
    id: "task-2",
    number: 2,
    name: "Talking about a Personal Experience",
    summary: "Describe a past experience in detail.",
    prepSeconds: 30,
    speakSeconds: 60,
    prompts: [
      {
        id: "learned-skill",
        title: "Learning something new",
        body: "Talk about a time when you learned a new skill. What was the skill, how did you learn it, and how did you feel about the experience?",
      },
      {
        id: "helped-stranger",
        title: "Helping someone",
        body: "Describe a time when you helped someone you did not know well. What happened, and what did you learn from it?",
      },
      {
        id: "unexpected-trip",
        title: "A trip that didn't go as planned",
        body: "Talk about a trip or outing that did not go as planned. What went wrong, and how did you handle it?",
      },
    ],
  },
  {
    id: "task-3",
    number: 3,
    name: "Describing a Scene",
    summary: "Describe a busy scene to someone who cannot see it.",
    prepSeconds: 30,
    speakSeconds: 60,
    prompts: [
      {
        id: "farmers-market",
        title: "Saturday farmers' market",
        body: "Imagine you are looking at this scene. Describe it in as much detail as possible to someone who cannot see it.",
        points: [
          "An outdoor market on a sunny morning with colourful tents",
          "A vendor weighing apples for an elderly woman with a shopping cart",
          "A child dropping an ice cream cone while a dog runs toward it",
          "A street musician playing guitar with an open case in front of him",
          "A couple arguing over a map near a bicycle rack",
          "Dark clouds gathering in the background",
        ],
      },
      {
        id: "airport-gate",
        title: "Crowded airport gate",
        body: "Imagine you are looking at this scene. Describe it in as much detail as possible to someone who cannot see it.",
        points: [
          "A departure board showing several flights marked 'Delayed'",
          "A businessman on a laptop with coffee spilling next to him",
          "A family with three kids asleep across a row of seats",
          "A gate agent speaking into a microphone while people line up",
          "A young woman running with a suitcase that has lost a wheel",
          "Snow falling heavily outside a large window",
        ],
      },
    ],
  },
  {
    id: "task-4",
    number: 4,
    name: "Making Predictions",
    summary: "Predict what will probably happen next in a scene.",
    prepSeconds: 30,
    speakSeconds: 60,
    prompts: [
      {
        id: "farmers-market-next",
        title: "The farmers' market, next",
        body: "Look again at the farmers' market scene. Predict what will most probably happen next.",
        points: [
          "An outdoor market on a sunny morning with colourful tents",
          "A vendor weighing apples for an elderly woman with a shopping cart",
          "A child dropping an ice cream cone while a dog runs toward it",
          "A street musician playing guitar with an open case in front of him",
          "A couple arguing over a map near a bicycle rack",
          "Dark clouds gathering in the background",
        ],
      },
      {
        id: "airport-next",
        title: "The airport gate, next",
        body: "Look again at the airport gate scene. Predict what will most probably happen next.",
        points: [
          "A departure board showing several flights marked 'Delayed'",
          "A businessman on a laptop with coffee spilling next to him",
          "A family with three kids asleep across a row of seats",
          "A gate agent speaking into a microphone while people line up",
          "A young woman running with a suitcase that has lost a wheel",
          "Snow falling heavily outside a large window",
        ],
      },
    ],
  },
  {
    id: "task-5",
    number: 5,
    name: "Comparing and Persuading",
    summary: "Choose one option and persuade someone it's better than theirs.",
    prepSeconds: 60,
    speakSeconds: 60,
    prompts: [
      {
        id: "family-vacation",
        title: "Family vacation",
        body: "Your family is choosing a vacation. You prefer one option; a family member prefers the other. Pick your option, then persuade your family member that your choice is better.",
        options: [
          { label: "Cabin by a lake", detail: "$1,200 for a week · 3-hour drive · hiking, canoeing, no Wi-Fi" },
          { label: "All-inclusive resort", detail: "$3,400 for a week · 5-hour flight · pool, beach, kids' club, restaurants" },
        ],
      },
      {
        id: "office-chair",
        title: "New office equipment",
        body: "Your team can buy one item for the office. You prefer one option; your manager prefers the other. Pick your option, then persuade your manager that your choice is better.",
        options: [
          { label: "Standing desks for everyone", detail: "$4,000 total · healthier posture · 2-week delivery" },
          { label: "New coffee machine & lounge", detail: "$3,500 total · better breaks and socializing · available now" },
        ],
      },
    ],
  },
  {
    id: "task-6",
    number: 6,
    name: "Dealing with a Difficult Situation",
    summary: "Choose how to handle a tricky situation and explain it to the person involved.",
    prepSeconds: 60,
    speakSeconds: 60,
    prompts: [
      {
        id: "two-events",
        title: "Two events, one evening",
        body: "Your best friend's birthday dinner and your manager's farewell party are on the same evening. You can only attend one.",
        options: [
          { label: "Talk to your friend", detail: "Explain that you will attend the farewell party instead of the birthday dinner." },
          { label: "Talk to your manager", detail: "Explain that you will attend the birthday dinner instead of the farewell party." },
        ],
      },
      {
        id: "roommate-rent",
        title: "Roommate is late on rent",
        body: "Your roommate has paid rent late three months in a row, and the landlord has warned you both. Your roommate says they are having money problems.",
        options: [
          { label: "Talk to your roommate", detail: "Explain that they need to pay on time or find another place." },
          { label: "Talk to your landlord", detail: "Ask for more flexibility while your roommate gets back on track." },
        ],
      },
    ],
  },
  {
    id: "task-7",
    number: 7,
    name: "Expressing Opinions",
    summary: "Give and support your opinion on a topic.",
    prepSeconds: 30,
    speakSeconds: 90,
    prompts: [
      {
        id: "remote-work",
        title: "Remote work",
        body: "Some people believe working from home is better for employees and companies. Others think people should work in the office. What is your opinion? Explain your reasons.",
      },
      {
        id: "university-free",
        title: "Free post-secondary education",
        body: "Should college and university education be free for all students? Explain your opinion with reasons and examples.",
      },
      {
        id: "social-media-age",
        title: "Social media age limit",
        body: "Some people think children under 16 should not be allowed to use social media. Do you agree or disagree? Explain your reasons.",
      },
    ],
  },
  {
    id: "task-8",
    number: 8,
    name: "Describing an Unusual Situation",
    summary: "Describe an unusual object or situation to someone on the phone.",
    prepSeconds: 30,
    speakSeconds: 60,
    prompts: [
      {
        id: "strange-chair",
        title: "An unusual chair",
        body: "You are in a furniture store and see an unusual chair you think your roommate would love. Call your roommate, describe the chair in detail, and ask whether you should buy it.",
        points: [
          "Shaped like a giant open hand, palm facing up",
          "Covered in bright green fake grass",
          "About as tall as a person, with built-in speakers in the fingers",
          "Price tag: $650, on sale from $900",
        ],
      },
      {
        id: "odd-lamp",
        title: "A strange lamp",
        body: "You are at a garage sale and find an odd lamp that your sister, who collects unusual items, might want. Call her, describe the lamp in detail, and ask whether she wants it.",
        points: [
          "The base is a ceramic octopus holding the pole with all eight arms",
          "The lampshade looks like an upside-down umbrella with tassels",
          "The light changes colour when you clap",
          "The seller is asking $40",
        ],
      },
    ],
  },
];

export function getWritingTask(id: string) {
  return WRITING_TASKS.find((t) => t.id === id);
}

export function getSpeakingTask(id: string) {
  return SPEAKING_TASKS.find((t) => t.id === id);
}
