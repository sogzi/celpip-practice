# CELPIP Practice

Timed CELPIP-General writing and speaking practice, scored by Claude on the official 1–12 CELPIP scale.

## Features

- **Writing**: both tasks (Email, 27 min; Survey Response, 26 min), 4 prompts each. Countdown timer, live word count against the 150–200 target, spell check off like the real test.
- **Speaking**: all 8 tasks with the official prep/speaking times. Recording starts automatically when prep ends, with a live transcript (Web Speech API in Chrome, Edge and Safari) and audio playback before you submit.
- **Scoring**: Claude rates the four official CELPIP dimensions:
  - Writing: Content/Coherence, Vocabulary, Readability, Task Fulfillment
  - Speaking: Content/Coherence, Vocabulary, Listenability, Task Fulfillment

  You get an overall level, a comment for each dimension, strengths, next-level tips, line-by-line language fixes, and a level 10–11 rewrite of your own answer.
- **Automatic checks**: length, paragraphing, greeting and sign-off, pace (words per minute), filler words, linking words and repeated words. These run even without an API key.
- **Progress**: every attempt is saved in your browser, with a level trend for writing and for speaking.

## Setup

```bash
npm install
cp .env.example .env.local   # then paste your key into ANTHROPIC_API_KEY
npm run dev -- -p 3001
```

Open http://localhost:3001.

Without a key the app still works, but it only runs the automatic checks and doesn't give a CELPIP level. It never makes up a score.

### Model

Grading uses `claude-opus-5-5` by default. To use a different model, set `ANTHROPIC_MODEL` in `.env.local`, for example `claude-sonnet-5-5` for lower cost. If the key or model doesn't work, the app shows the exact reason (invalid key, model not available, no credits, rate limit).

## Notes

- Speaking is scored from the transcript. Claude can't hear your pronunciation, so Listenability is judged from fluency signals in the text (grammar, fillers, self-corrections, pace).
- Live transcription needs Chrome, Edge or Safari. In other browsers you can still record and then type what you said.
- Tasks 3, 4 and 8 use written scene descriptions in place of the pictures used in the real test.

## Structure

```
app/
  page.tsx                 home
  writing/[taskId]/        writing practice
  speaking/[taskId]/       speaking practice
  history/                 progress
  api/grade/route.ts       POST: automatic checks + Claude grading
components/
  WritingSession.tsx, SpeakingSession.tsx, FeedbackView.tsx, HistoryView.tsx
  useRecorder.ts           MediaRecorder + Web Speech API
lib/
  celpip.ts                task bank, timings, criteria, level labels
  grader.ts                Claude prompt, structured output schema, error mapping
  checks.ts                rule-based checks
  history.ts               localStorage history
```
