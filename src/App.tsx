import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Login } from './screens/Login';
import { ModeSelect } from './screens/ModeSelect';
import { Play } from './screens/Play';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-shell">
        <div className="card">
          <p className="subtitle">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/mode" replace /> : <Login />} />
        <Route
          path="/mode"
          element={user ? <ModeSelect user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/play/:mode"
          element={user ? <Play user={user} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={user ? '/mode' : '/login'} replace />} />
      </Routes>
    </div>
  );
}

export default App;
