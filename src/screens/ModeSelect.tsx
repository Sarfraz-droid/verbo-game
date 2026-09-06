import { useNavigate } from 'react-router-dom';
import type { VerboUser } from '../hooks/useAuth';
import type { GameMode } from '../hooks/useGame';

interface Props {
  user: VerboUser;
}

export function ModeSelect({ user }: Props) {
  const navigate = useNavigate();

  function choose(mode: GameMode) {
    navigate(`/play/${mode}`);
  }

  return (
    <div className="card">
      <h1>Hey, {user.name}</h1>
      <p className="subtitle">Pick a mode to start training.</p>
      <div className="mode-options">
        <button className="mode-card" onClick={() => choose('random')}>
          <h3>Random</h3>
          <p>Pulls a random question from the full question bank.</p>
        </button>
        <button className="mode-card" onClick={() => choose('train')}>
          <h3>I train, I play</h3>
          <p>Focuses on words you got wrong before, with a few new ones mixed in.</p>
        </button>
      </div>
    </div>
  );
}
