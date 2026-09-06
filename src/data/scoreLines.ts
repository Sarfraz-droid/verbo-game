// Score-based rage-bait lines for the halt screen.
// Add more bands or more lines per band any time — no component code needs to change.
// `min`/`max` are inclusive, out of `roundLength` (default 10) questions.

export interface ScoreBand {
  min: number;
  max: number;
  meme: string; // emoji stand-in for a meme image
  lines: string[];
}

export const scoreBands: ScoreBand[] = [
  {
    min: 0,
    max: 3,
    meme: '💀',
    lines: [
      "Did you even go to an english school?",
      "Bro forgot the language exists.",
      "This is giving 'never opened a dictionary' energy.",
      "Even autocorrect gave up on you.",
    ],
  },
  {
    min: 4,
    max: 6,
    meme: '😬',
    lines: [
      "Mid. Truly, deeply mid.",
      "You know some words. Not these ones, but some.",
      "Passable if the bar was on the floor. It wasn't.",
      "Room for improvement is an understatement.",
    ],
  },
  {
    min: 7,
    max: 8,
    meme: '🙃',
    lines: [
      "Could have done better, but I challenge next time you will lose.",
      "Decent. Don't let it go to your head.",
      "Almost impressive. Almost.",
      "Not bad, for someone who probably guessed twice.",
    ],
  },
  {
    min: 9,
    max: 10,
    meme: '😏',
    lines: [
      "Could have done better, but I challenge next time you will lose.",
      "Show off. We get it, you know words.",
      "Suspiciously good. Did you cheat?",
      "Fine, you win this round. This round.",
    ],
  },
];

export function getScoreBand(score: number, roundLength: number): ScoreBand {
  const normalized = Math.round((score / roundLength) * 10);
  const band = scoreBands.find((b) => normalized >= b.min && normalized <= b.max);
  return band ?? scoreBands[0];
}

export function pickLine(band: ScoreBand): string {
  return band.lines[Math.floor(Math.random() * band.lines.length)];
}
