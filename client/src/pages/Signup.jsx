// client/src/pages/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './AuthPages.css';

export default function Signup() {
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await signup({ name, email, password });
      setSuccess('Account created! You can now sign in.');
      // optional: auto-redirect after a short delay
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-centered">
      <div className="auth-card">
        <h1>Create Account</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Name
            <input
              className="auth-input"
              data-cy="signup-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            Email
            <input
              className="auth-input"
              data-cy="signup-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            Password
            <input
              className="auth-input"
              data-cy="signup-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}