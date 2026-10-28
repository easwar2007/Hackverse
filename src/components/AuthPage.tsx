import { useState, type FormEvent } from 'react';
import { signIn, signUp, type AuthUser } from '../services/authService';
import './AuthPage.css';

interface AuthPageProps {
  onAuthSuccess: (user: AuthUser) => void;
  onOpenPreview: () => void;
  initialMessage?: string;
}

export function AuthPage({
  onAuthSuccess,
  onOpenPreview,
  initialMessage = '',
}: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(initialMessage);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (isSignUp && password !== confirmPassword) {
      setError('Those passwords do not match. Please try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        const user = await signUp(
          String(formData.get('name')),
          String(formData.get('email')),
          password,
        );
        onAuthSuccess(user);
      } else {
        const user = await signIn(String(formData.get('email')), password);
        onAuthSuccess(user);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = () => {
    setError('');
    setMessage('Password reset email is not configured yet. Contact your administrator to reset your password.');
  };

  const changeMode = () => {
    setIsSignUp(!isSignUp);
    setMessage('');
    setError('');
  };

  const heading = isSignUp ? 'Create your account' : 'Welcome back';

  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="About Study Companion">
        <a className="auth-brand" href="#home" aria-label="Study Companion home">
          <span className="material-symbols-outlined auth-brand-icon">account_balance</span>
          <span>Study Companion</span>
        </a>

        <div className="auth-story-content">
          <span className="auth-eyebrow">
            <span className="material-symbols-outlined">auto_awesome</span>
            YOUR SPACE TO GROW
          </span>
          <h1>Make room for your next <em>breakthrough.</em></h1>
          <p className="auth-story-copy">
            A calmer way to plan your study sessions, find your focus, and make every learning moment count.
          </p>

          <div className="auth-quote-card">
            <div className="auth-quote-mark">“</div>
            <p>Small, focused steps add up to remarkable things.</p>
            <div className="auth-quote-footer">
              <span className="auth-avatar">S</span>
              <span><strong>Your study journey</strong><br />One session at a time</span>
              <span className="material-symbols-outlined auth-quote-sparkle">auto_awesome</span>
            </div>
          </div>
        </div>

        <div className="auth-story-footer">
          <span>FOCUS</span><span className="auth-footer-dot" />
          <span>UNDERSTAND</span><span className="auth-footer-dot" />
          <span>GROW</span>
          <span className="auth-footer-note">Made for curious minds.</span>
        </div>
      </section>

      <section className="auth-panel" aria-label={isSignUp ? 'Create an account' : 'Sign in'}>
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <span className="material-symbols-outlined auth-brand-icon">account_balance</span>
            <span>Study Companion</span>
          </div>

          <div className="auth-heading">
            <span className="auth-mobile-eyebrow">YOUR SPACE TO GROW</span>
            <h2>{heading}</h2>
            <p>
              {isSignUp
                ? 'Start building a study routine that works for you.'
                : 'Pick up where your curiosity left off.'}
            </p>
          </div>

          <form aria-busy={isSubmitting} className="auth-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <label className="auth-field">
                <span>Your name</span>
                <input
                  autoComplete="name"
                  maxLength={100}
                  name="name"
                  placeholder="e.g. Alex Morgan"
                  required
                />
              </label>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <input
                autoComplete="email"
                maxLength={254}
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <span className="auth-password-wrap">
                <input
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  minLength={8}
                  maxLength={1024}
                  name="password"
                  placeholder="At least 8 characters"
                  required
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </span>
            </label>

            {isSignUp && (
              <label className="auth-field">
                <span>Confirm password</span>
                <input
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={1024}
                  name="confirmPassword"
                  placeholder="Enter your password again"
                  required
                  type={showPassword ? 'text' : 'password'}
                />
              </label>
            )}

            {!isSignUp && (
              <button
                className="auth-forgot"
                disabled={isSubmitting}
                onClick={handlePasswordReset}
                type="button"
              >
                Forgot password?
              </button>
            )}

            {error && <p className="auth-message auth-error" role="alert">{error}</p>}
            {message && <p className="auth-message" role="status">{message}</p>}

            <button className="auth-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <p className="auth-switch">
            {isSignUp ? 'Already have an account?' : 'New to Study Companion?'}
            <button disabled={isSubmitting} onClick={changeMode} type="button">
              {isSignUp ? 'Sign in' : 'Create an account'}
            </button>
          </p>

          <div className="auth-divider"><span>OR</span></div>

          <button className="auth-preview" disabled={isSubmitting} onClick={onOpenPreview} type="button">
            Explore the planner preview
            <span className="material-symbols-outlined">open_in_new</span>
          </button>

          <p className="auth-privacy">
            <span className="material-symbols-outlined">lock</span>
            Your password is stored as a secure hash in MongoDB.
          </p>
        </div>
        <footer className="auth-legal">
          <span>© 2026 Study Companion</span>
          <span>FOCUS · UNDERSTAND · GROW</span>
        </footer>
      </section>
    </main>
  );
}
