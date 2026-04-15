import { useState } from 'react';

function LoginPanel({ onLogin, t }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(t.errors.required);
      return;
    }

    try {
      setIsLoading(true);
      await onLogin(username, password);
    } catch (e) {
      setError(t.errors.invalid);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }

  return (
    <div className="login-panel">
      <input
        className="login-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder={t.username}
        onKeyDown={handleKeyDown}
      />

      <input
        className="login-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t.password}
        onKeyDown={handleKeyDown}
      />

      {error && <div className="login-error">{error}</div>}

      <button
        className="login-button"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? t.loading : t.login}
      </button>
    </div>
  );
}

export default LoginPanel;
