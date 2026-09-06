import { supabase } from './supabase';
import { questions as localQuestions, type Question } from '../data/questions';

export interface BankQuestion extends Question {
  dbId: string; // Supabase row id, used as the FK target for wrong_answers
}

let cached: BankQuestion[] | null = null;

// Upserts the local question bank (src/data/questions.ts) into Supabase
// keyed by `slug`, then returns the bank with real DB ids attached.
// Edit the local file to add/change questions — this keeps Supabase in sync.
export async function loadQuestionBank(): Promise<BankQuestion[]> {
  if (cached) return cached;

  const rows = localQuestions.map((q) => ({
    slug: q.id,
    type: q.type,
    prompt: q.prompt,
    image_ref: q.image ?? null,
    answer: q.answer,
  }));

  const { data, error } = await supabase
    .from('verbo_questions')
    .upsert(rows, { onConflict: 'slug' })
    .select('id, slug');

  if (error) throw error;

  const slugToDbId = new Map(data.map((row) => [row.slug as string, row.id as string]));

  cached = localQuestions.map((q) => ({
    ...q,
    dbId: slugToDbId.get(q.id) ?? q.id,
  }));

  return cached;
}
