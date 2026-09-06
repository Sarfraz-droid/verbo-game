import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await login(name);
      navigate('/mode');
    } catch (err) {
      setError('Could not log in. Try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      <h1>Verbo</h1>
      <p className="subtitle">Relearn the everyday words you keep blanking on.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        {error && <div className="error-text">{error}</div>}
        <button type="submit" className="primary" disabled={submitting || !name.trim()}>
          {submitting ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
