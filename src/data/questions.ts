// Single source of truth for the question bank.
// Add new questions here — no component code needs to change.
//
// type: 'image'  -> shown with `image` (an emoji placeholder or an image URL/path)
// type: 'typed'  -> shown as a text prompt only, no image
//
// `answer` is matched case-insensitively, trimmed, and allows any of `altAnswers`.

export type QuestionType = 'image' | 'typed';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  image?: string; // emoji or image URL — used when type is 'image'
  answer: string;
  altAnswers?: string[];
}

export const questions: Question[] = [
  {
    id: 'q1',
    type: 'image',
    prompt: 'What is this called?',
    image: '🍴',
    answer: 'fork',
  },
  {
    id: 'q2',
    type: 'image',
    prompt: 'What is this called?',
    image: '🥄',
    answer: 'spoon',
  },
  {
    id: 'q3',
    type: 'image',
    prompt: 'What is this called?',
    image: '🧦',
    answer: 'sock',
    altAnswers: ['socks'],
  },
  {
    id: 'q4',
    type: 'image',
    prompt: 'What is this called?',
    image: '🧣',
    answer: 'scarf',
  },
  {
    id: 'q5',
    type: 'image',
    prompt: 'What is this called?',
    image: '🪣',
    answer: 'bucket',
  },
  {
    id: 'q6',
    type: 'image',
    prompt: 'What is this called?',
    image: '🛋️',
    answer: 'sofa',
    altAnswers: ['couch'],
  },
  {
    id: 'q7',
    type: 'typed',
    prompt: "What's that thing called that's used for cleaning your tongue?",
    answer: 'tongue scraper',
    altAnswers: ['tongue cleaner'],
  },
  {
    id: 'q8',
    type: 'typed',
    prompt: 'What do you call the small container you keep spices in?',
    answer: 'spice jar',
    altAnswers: ['spice container', 'spice tin'],
  },
  {
    id: 'q9',
    type: 'typed',
    prompt: 'What do you call the piece of furniture you sleep on?',
    answer: 'bed',
  },
  {
    id: 'q10',
    type: 'typed',
    prompt: 'What do you call the container used to carry liquids, usually with a handle and a lid?',
    answer: 'flask',
    altAnswers: ['bottle', 'jug'],
  },
];
