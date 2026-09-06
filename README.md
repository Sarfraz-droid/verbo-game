# Verbo

A vocabulary training game: relearn everyday English words (kitchen tools,
clothing, containers, furniture) that you know in another language but
blank on in English.

## Setup

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL + anon key
npm run dev
```

## How it's organized

- `src/data/questions.ts` — the question bank. Add/edit questions here only;
  no component code needs to change. Each question is `image` (shown with an
  emoji/image + text input) or `typed` (a text prompt + text input).
- `src/data/scoreLines.ts` — the rage-bait meme/quote lines shown on the halt
  screen, grouped by score band. Add more bands or more lines per band here.
- `src/lib/questionBank.ts` — syncs the local question bank into the
  Supabase `verbo_questions` table (keyed by slug) so wrong answers and
  sessions can reference real question rows.
- `src/hooks/useAuth.ts` — login: stores/looks up the user by name in
  `verbo_users`, persists locally.
- `src/hooks/useGame.ts` — question selection per mode, scoring, and writing
  to `verbo_wrong_answers` / `verbo_sessions`.
- `src/screens/` — Login, ModeSelect, and Play (which manages the
  question → reveal → halt states internally for a round).

## Data model (Supabase)

- `verbo_users` — name, created_at.
- `verbo_questions` — type (image/typed), prompt, image_ref, answer, slug.
- `verbo_wrong_answers` — user_id, question_id, created_at. Powers "I train,
  I play" mode.
- `verbo_sessions` — user_id, score, total, mode, created_at.

## Modes

- **Random** — pulls a random question from the full bank.
- **I train, I play** — mostly re-quizzes words you got wrong before (pulled
  from `verbo_wrong_answers`), mixing in a few new ones so it's not the same
  set every time.

A round is 10 questions; after the 10th you hit the halt screen with your
score and a meme + quote pulled from `scoreLines.ts`.

## Placeholder content

The current question bank uses emoji as image placeholders. Swap `image` in
`src/data/questions.ts` for a real image URL/path once you have artwork —
the renderer already supports both.
