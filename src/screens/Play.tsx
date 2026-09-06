import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { VerboUser } from '../hooks/useAuth';
import { ROUND_LENGTH, useGame, type GameMode } from '../hooks/useGame';
import { getScoreBand, pickLine } from '../data/scoreLines';

interface Props {
  user: VerboUser;
}

type Stage = 'loading' | 'question' | 'reveal' | 'halt';

export function Play({ user }: Props) {
  const { mode: modeParam } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const mode = (modeParam === 'train' ? 'train' : 'random') as GameMode;

  const game = useGame({ user, mode });
  const [stage, setStage] = useState<Stage>('loading');
  const [guess, setGuess] = useState('');
  const [lastCorrect, setLastCorrect] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    game.resetRound();
    startNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  async function startNext() {
    setGuess('');
    setGaveUp(false);
    setStage('loading');
    await game.pickNext();
    setStage('question');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guess.trim()) return;
    const { correct } = await game.submitAnswer(guess);
    setLastCorrect(correct);
    setStage('reveal');
  }

  async function handleGiveUp() {
    setGaveUp(true);
    const { correct } = await game.submitAnswer('');
    setLastCorrect(correct);
    setStage('reveal');
  }

  async function handleContinue() {
    const nextCount = game.questionCount;
    if (nextCount > 0 && nextCount % ROUND_LENGTH === 0) {
      await game.recordSession(game.score, nextCount);
      setStage('halt');
    } else {
      startNext();
    }
  }

  function handlePlayAgain() {
    game.resetRound();
    startNext();
  }

  if (stage === 'loading' || !game.current) {
    return (
      <div className="card">
        <p className="subtitle">Loading…</p>
      </div>
    );
  }

  if (stage === 'halt') {
    return <HaltScreen score={game.score} onPlayAgain={handlePlayAgain} onExit={() => navigate('/mode')} />;
  }

  const q = game.current;

  if (stage === 'reveal') {
    return (
      <div className="card">
        <div className="progress">
          Question {game.questionCount} / {ROUND_LENGTH}
        </div>
        {lastCorrect ? (
          <>
            <div className="reveal-status correct">Nice one! ✅</div>
            <p className="subtitle">That's exactly right.</p>
          </>
        ) : (
          <>
            <div className="reveal-status wrong">
              {gaveUp ? "NO SHAME, IT'S A" : "OOPSIEESS, IT'S A"} {q.answer.toUpperCase()}
            </div>
            {q.type === 'image' && q.image && <div className="question-image">{renderImage(q.image)}</div>}
          </>
        )}
        <button className="primary" onClick={handleContinue}>
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="progress">
        Question {game.questionCount + 1} / {ROUND_LENGTH}
      </div>
      {q.type === 'image' && q.image && <div className="question-image">{renderImage(q.image)}</div>}
      <div className="question-prompt">{q.prompt}</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your answer"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          autoFocus
        />
        <button type="submit" className="primary" disabled={!guess.trim()}>
          Submit
        </button>
      </form>
      {q.type === 'image' && (
        <button className="give-up-link" onClick={handleGiveUp}>
          I should play more, show answer
        </button>
      )}
    </div>
  );
}

function renderImage(image: string) {
  const isUrl = image.startsWith('http') || image.startsWith('/');
  return isUrl ? <img src={image} alt="" /> : <span>{image}</span>;
}

function HaltScreen({
  score,
  onPlayAgain,
  onExit,
}: {
  score: number;
  onPlayAgain: () => void;
  onExit: () => void;
}) {
  const band = useMemo(() => {
    const b = getScoreBand(score, ROUND_LENGTH);
    return { meme: b.meme, line: pickLine(b) };
  }, [score]);

  return (
    <div className="card">
      <div className="halt-meme">{band.meme}</div>
      <h1>Brain needs shut.</h1>
      <p className="subtitle">Come back tomorrow.</p>
      <div className="halt-score">
        {score} / {ROUND_LENGTH}
      </div>
      <div className="halt-line">"{band.line}"</div>
      <button className="primary" onClick={onPlayAgain}>
        Play another round
      </button>
      <button className="secondary" onClick={onExit}>
        Back to modes
      </button>
    </div>
  );
}
