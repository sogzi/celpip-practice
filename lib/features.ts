// Feature switches. Both are off by default to keep Anthropic API costs down.
// To turn one on, set its environment variable to "true" (e.g. in Vercel's
// project settings) and redeploy. NEXT_PUBLIC_ vars are read at build time.
export const FEATURES = {
  /** The full four-section mock exam at /exam. */
  mockExam: process.env.NEXT_PUBLIC_FEATURE_MOCK_EXAM === "true",
  /** "Generate a new test" (reading/listening) and "Generate new prompt" (writing/speaking). */
  aiGeneration: process.env.NEXT_PUBLIC_FEATURE_AI_GENERATION === "true",
};
