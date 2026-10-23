import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod/v4";
import type { Kind, Prompt } from "./celpip";
import { MODEL } from "./grader";
import { getTask } from "./prompts";

const PromptSchema = z.object({
  title: z.string().describe("Short title, 2-6 words"),
  body: z.string().describe("The scenario or question shown to the test taker"),
  points: z.array(z.string()).describe("Bullet points, or an empty array if this task has none"),
  options: z
    .array(z.object({ label: z.string(), detail: z.string() }))
    .describe("Exactly two choices for tasks that have options, otherwise an empty array"),
});

interface Spec {
  brief: string;
  points: number;
  options: number;
}

function specFor(kind: Kind, n: number): Spec {
  if (kind === "writing") {
    return n === 1
      ? {
          brief: `Writing Task 1, Writing an Email (27 minutes, 150-200 words). body: 1-3 sentences describing an everyday situation (a problem, request, complaint, thanks or invitation), ending with "Write an email to <recipient>." points: exactly 3 things the email must do, each starting with a verb ("Describe…", "Explain…", "Suggest…").`,
          points: 3,
          options: 0,
        }
      : {
          brief: `Writing Task 2, Responding to Survey Questions (26 minutes, 150-200 words). body: 1-2 sentences explaining who is running the survey and why, ending with "Choose the option you prefer and explain the reasons for your choice." options: exactly 2, labelled "Option A" and "Option B". Each detail is one sentence describing a realistic, balanced choice; neither should be obviously better.`,
          points: 0,
          options: 2,
        };
  }
  switch (n) {
    case 1:
      return { brief: `Speaking Task 1, Giving Advice (90 seconds). body: 1-2 sentences describing someone you know with a common problem or decision, ending by asking the test taker to give them advice.`, points: 0, options: 0 };
    case 2:
      return { brief: `Speaking Task 2, Talking about a Personal Experience (60 seconds). body: asks the test taker to talk about a time when something happened, with 2-3 guiding questions (what, how, how you felt or what you learned).`, points: 0, options: 0 };
    case 3:
      return { brief: `Speaking Task 3, Describing a Scene (60 seconds). There is no picture, so describe the scene in points. body: exactly "Imagine you are looking at this scene. Describe it in as much detail as possible to someone who cannot see it." points: exactly 6 vivid, concrete elements of one busy scene (people doing different things, objects, weather or setting), including at least one small problem or surprise.`, points: 6, options: 0 };
    case 4:
      return { brief: `Speaking Task 4, Making Predictions (60 seconds). body: exactly "Look at this scene. Predict what will most probably happen next." points: exactly 6 elements of one busy scene, several of which are clearly about to change (something about to fall, a storm coming, someone running late).`, points: 6, options: 0 };
    case 5:
      return { brief: `Speaking Task 5, Comparing and Persuading (60 seconds). body: 2 sentences: a choice the test taker and a family member or coworker must make, ending "Pick your option, then persuade <person> that your choice is better." options: exactly 2. label is a short name of the option; detail is 3-4 facts separated by " · " (price, time or distance, features).`, points: 0, options: 2 };
    case 6:
      return { brief: `Speaking Task 6, Dealing with a Difficult Situation (60 seconds). body: 1-3 sentences describing an awkward situation involving two people where the test taker must disappoint one of them. options: exactly 2. label is "Talk to your <person>"; detail is one sentence saying what you will explain to them.`, points: 0, options: 2 };
    case 7:
      return { brief: `Speaking Task 7, Expressing Opinions (90 seconds). body: presents a debatable social, workplace or community question, mentioning that people disagree, and asks for the test taker's opinion with reasons.`, points: 0, options: 0 };
    default:
      return { brief: `Speaking Task 8, Describing an Unusual Situation (60 seconds). body: the test taker sees an unusual object somewhere and must call someone, describe it in detail and ask whether to buy or get it. points: exactly 4 lines: 3 strange, specific physical features of the object and 1 line with the price.`, points: 4, options: 0 };
  }
}

export async function generatePrompt(kind: Kind, taskId: string, avoid: string[]): Promise<{ prompt: Prompt; usage: Anthropic.Usage }> {
  const task = getTask(kind, taskId);
  if (!task) throw new Error("Unknown task.");
  const spec = specFor(kind, task.number);
  const example = task.prompts[0];

  const client = new Anthropic();
  const message = await client.messages.parse({
    model: MODEL,
    max_tokens: 4000,
    output_config: { effort: "low", format: zodOutputFormat(PromptSchema) },
    system:
      "You write realistic practice prompts for the CELPIP-General test. Use everyday Canadian situations, plain English at a CLB 5-8 reading level, and invented people and places. Prompts must be answerable by anyone without specialist knowledge.",
    messages: [
      {
        role: "user",
        content: `Write one new prompt for ${spec.brief}

Example of the style (don't reuse its topic):
${JSON.stringify({ title: example.title, body: example.body, points: example.points ?? [], options: example.options ?? [] }, null, 2)}

Choose a topic different from all of these: ${[...task.prompts.map((p) => p.title), ...avoid].join("; ")}.`,
      },
    ],
  });

  if (message.stop_reason === "refusal") throw new Error("The model declined to write this prompt. Please try again.");
  const out = message.parsed_output;
  if (!out) throw new Error("Couldn't read the generated prompt. Please try again.");
  if (out.points.length !== spec.points || out.options.length !== spec.options) {
    throw new Error("The generated prompt didn't match the task format. Please try again.");
  }
  const prompt: Prompt = {
    id: `ai-${kind}-${taskId}-${Date.now().toString(36)}`,
    title: out.title.trim(),
    body: out.body.trim(),
    points: spec.points ? out.points : undefined,
    options: spec.options ? out.options : undefined,
  };
  return { prompt, usage: message.usage };
}
