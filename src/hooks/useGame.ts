import { useCallback, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { loadQuestionBank, type BankQuestion } from '../lib/questionBank';
import type { VerboUser } from './useAuth';

export type GameMode = 'random' | 'train';

export const ROUND_LENGTH = 10;

interface UseGameOptions {
  user: VerboUser;
  mode: GameMode;
}

export function useGame({ user, mode }: UseGameOptions) {
  const [current, setCurrent] = useState<BankQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const lastIdRef = useRef<string | null>(null);
  const wrongPoolRef = useRef<BankQuestion[] | null>(null);

  const pickNext = useCallback(async () => {
    setLoading(true);
    try {
      const bank = await loadQuestionBank();

      let pool = bank;

      if (mode === 'train') {
        if (wrongPoolRef.current === null) {
          const { data, error } = await supabase
            .from('verbo_wrong_answers')
            .select('question_id')
            .eq('user_id', user.id);
          if (error) throw error;

          const wrongIds = new Set((data ?? []).map((r) => r.question_id as string));
          wrongPoolRef.current = bank.filter((q) => wrongIds.has(q.dbId));
        }

        const hasWrong = wrongPoolRef.current.length > 0;
        // Mostly quiz previously-missed words, but mix in new ones so it's
        // not the exact same set every session.
        const useWrongPool = hasWrong && Math.random() < 0.75;
        pool = useWrongPool ? wrongPoolRef.current : bank;
      }

      let candidates = pool.filter((q) => q.id !== lastIdRef.current);
      if (candidates.length === 0) candidates = pool;

      const next = candidates[Math.floor(Math.random() * candidates.length)];
      lastIdRef.current = next.id;
      setCurrent(next);
    } finally {
      setLoading(false);
    }
  }, [mode, user.id]);

  const submitAnswer = useCallback(
    async (rawGuess: string) => {
      if (!current) return { correct: false };

      const normalize = (s: string) => s.trim().toLowerCase();
      const guess = normalize(rawGuess);
      const validAnswers = [current.answer, ...(current.altAnswers ?? [])].map(normalize);
      const correct = validAnswers.includes(guess);

      if (correct) {
        setScore((s) => s + 1);
      } else {
        await supabase.from('verbo_wrong_answers').insert({
          user_id: user.id,
          question_id: current.dbId,
        });
      }

      setQuestionCount((c) => c + 1);
      return { correct };
    },
    [current, user.id]
  );

  const recordSession = useCallback(
    async (finalScore: number, total: number) => {
      await supabase.from('verbo_sessions').insert({
        user_id: user.id,
        score: finalScore,
        total,
        mode,
      });
    },
    [user.id, mode]
  );

  const resetRound = useCallback(() => {
    setScore(0);
    setQuestionCount(0);
    wrongPoolRef.current = null;
  }, []);

  return {
    current,
    score,
    questionCount,
    loading,
    pickNext,
    submitAnswer,
    recordSession,
    resetRound,
  };
}
