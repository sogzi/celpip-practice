import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod/v4";
import { MODEL } from "./grader";
import { getPart, shuffleOptions, type PartDef, type Skill, type TestSet } from "./rl";

const GeneratedSchema = z.object({
  title: z.string().describe("Short title for the test, 2-5 words"),
  speakers: z
    .array(z.object({ name: z.string(), voice: z.enum(["female", "male"]) }))
    .describe("Listening: every speaker in the script. Reading: empty array."),
  sections: z.array(
    z.object({
      heading: z.string(),
      instructions: z.string().describe("One-sentence instruction shown to the test taker"),
      text: z.string().nullable().describe("Reading passage, or null for listening"),
      table: z
        .object({
          title: z.string(),
          headers: z.array(z.string()),
          rows: z.array(z.array(z.string())),
          note: z.string(),
        })
        .nullable()
        .describe("Only for Reading Part 2, otherwise null"),
      script: z
        .array(z.object({ speaker: z.string(), text: z.string() }))
        .nullable()
        .describe("Listening dialogue lines, or null for reading"),
      questions: z.array(
        z.object({
          prompt: z.string(),
          options: z.array(z.string()),
          answer: z.number().describe("0-based index of the single correct option"),
          explanation: z.string().describe("One sentence citing the evidence for the correct answer"),
        }),
      ),
    }),
  ),
});

function systemPrompt(skill: Skill) {
  return `You write practice material for the CELPIP-General ${skill === "reading" ? "Reading" : "Listening"} test, matching the official format and a difficulty around CLB 7-9.

Rules:
- Use Canadian settings, spelling and everyday situations. Invent all people, businesses and places; never use real organizations.
- Every question has exactly 4 options (except where the format says otherwise) and exactly one correct answer that is clearly supported by the ${skill === "reading" ? "text" : "audio"}. Distractors should be plausible: they mention things from the ${skill === "reading" ? "text" : "audio"} but are wrong or unsupported. Avoid "all of the above" and trick wording.
- Keep options similar in length and style so the answer can't be guessed from its form. Put the correct answer in varied positions.
- Questions follow the order of the information in the ${skill === "reading" ? "text" : "audio"}.
${skill === "listening" ? `- The script will be read aloud by text-to-speech. Write natural spoken English with contractions and occasional fillers, no stage directions, no sound effects and no narrator lines. Spell out numbers that sound odd when read, e.g. "forty-eight hours". Every script line's speaker must exactly match a name in "speakers", and voices should be distinguishable (mix female and male where there are two or more speakers).
- Questions must be answerable from listening alone; never refer to visuals.` : ""}
- Before finishing, check every answer index against the ${skill === "reading" ? "text" : "script"}.`;
}

function userPrompt(skill: Skill, part: PartDef) {
  return `Write a new CELPIP ${skill === "reading" ? "Reading" : "Listening"} Part ${part.number}: ${part.name}.

Format:
${part.brief}

Section question counts must be exactly: ${part.sections.join(", ")}.
Pick a fresh, specific topic. Avoid these overused topics: moving to a new city, flooded apartments, food banks, car-free downtowns, urban beekeeping, homework policies, community centre programs.`;
}

function validate(skill: Skill, part: PartDef, out: z.infer<typeof GeneratedSchema>, id: string): TestSet {
  if (out.sections.length !== part.sections.length) throw new Error("Generated test had the wrong number of sections.");
  const speakerNames = new Set(out.speakers.map((s) => s.name));
  let qn = 0;
  const set: TestSet = {
    id,
    skill,
    partId: part.id,
    title: out.title,
    source: "ai",
    speakers: skill === "listening" ? out.speakers : undefined,
    sections: out.sections.map((sec, si) => {
      if (sec.questions.length !== part.sections[si]) throw new Error("Generated test had the wrong number of questions.");
      if (skill === "reading" && !sec.text?.trim()) throw new Error("Generated reading section had no passage.");
      if (skill === "listening") {
        if (!sec.script?.length) throw new Error("Generated listening section had no script.");
        if (sec.script.some((l) => !speakerNames.has(l.speaker))) throw new Error("Generated script used an unknown speaker.");
      }
      return {
        heading: sec.heading,
        instructions: sec.instructions,
        text: skill === "reading" ? sec.text ?? undefined : undefined,
        table: sec.table && sec.table.rows.length ? { ...sec.table, note: sec.table.note || undefined } : undefined,
        script: skill === "listening" ? sec.script ?? undefined : undefined,
        questions: sec.questions.map((q) => {
          const options = part.fixedOptions ? ["A", "B", "C", "D", "E (Not given)"] : q.options;
          if (!part.fixedOptions && options.length !== 4) throw new Error("A generated question didn't have 4 options.");
          if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= options.length)
            throw new Error("A generated question had an invalid answer.");
          return { id: `${id}-q${++qn}`, prompt: q.prompt, options, answer: q.answer, explanation: q.explanation };
        }),
      };
    }),
  };
  return shuffleOptions(set);
}

export async function generateSet(skill: Skill, partId: string): Promise<{ set: TestSet; usage: Anthropic.Usage }> {
  const part = getPart(skill, partId);
  if (!part) throw new Error("Unknown part.");
  const client = new Anthropic();
  const message = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "low", format: zodOutputFormat(GeneratedSchema) },
    system: systemPrompt(skill),
    messages: [{ role: "user", content: userPrompt(skill, part) }],
  });
  if (message.stop_reason === "refusal") throw new Error("The model declined to write this test. Please try again.");
  if (message.stop_reason === "max_tokens") throw new Error("The test was cut off before it finished. Please try again.");
  if (!message.parsed_output) throw new Error("Couldn't read the generated test. Please try again.");
  return { set: validate(skill, part, message.parsed_output, `ai-${skill}-${partId}-${Date.now().toString(36)}`), usage: message.usage };
}
