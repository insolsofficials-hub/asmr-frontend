import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, LockKeyhole, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const copy = {
  signin: ['Welcome back', 'Sign in to open your member portal.'], register: ['Create your account', 'We will verify your email before creating your account.'],
  verify: ['Check your email', 'Enter the 6-digit verification code we sent you.'], forgot: ['Forgot your password?', 'Enter your account email and we will send you a reset code.'],
  reset: ['Choose a new password', 'Enter the code from your email and a secure new password.'],
};

export default function AuthPage() {
  const { user, membership, refresh } = useAuth();
  const navigate = useNavigate(); const location = useLocation();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '', code: '' });
  const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : membership ? '/portal' : '/join'} replace />;
  const change = event => setForm(value => ({ ...value, [event.target.name]: event.target.value }));
  const switchMode = next => { setMode(next); setMessage(''); setError(''); setForm(value => ({ ...value, code: '', password: next === 'forgot' ? '' : value.password })); };
  const checkEmail = async () => {
    if (!['signin', 'register'].includes(mode) || !/^\S+@\S+\.\S+$/.test(form.email)) return;
    try {
      const result = await api(`/auth/account-status?email=${encodeURIComponent(form.email)}`);
      if (result.data.hasAccount) { setMode('signin'); setMessage('Your account is ready. Enter your password to continue.'); }
      else if (result.data.hasMembership) { setMode('register'); setForm(value => ({ ...value, name: result.data.fullName || value.name })); setMessage('We found your membership application. Create a password to claim your account.'); }
      else { setMode('register'); setMessage('No membership application was found. Create an account first, then complete the membership form.'); }
    } catch { /* Submission displays validation and connectivity errors. */ }
  };
  const submit = async event => {
    event.preventDefault(); setLoading(true); setError(''); setMessage('');
    try {
      if (mode === 'register') { const result = await api('/auth/register', { method: 'POST', body: JSON.stringify(form) }); setMode('verify'); setMessage(result.message); }
      else if (mode === 'verify') { const result = await api('/auth/verify-registration', { method: 'POST', body: JSON.stringify(form) }); await refresh(); navigate(result.data.hasMembership ? location.state?.from || '/portal' : '/join', { replace: true }); }
      else if (mode === 'forgot') { const result = await api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: form.email }) }); setMode('reset'); setMessage(result.message); }
      else if (mode === 'reset') { const result = await api('/auth/reset-password', { method: 'POST', body: JSON.stringify(form) }); setMode('signin'); setForm(value => ({ ...value, code: '', password: '' })); setMessage(result.message); }
      else { const result = await api('/auth/login', { method: 'POST', body: JSON.stringify(form) }); const data = await refresh(); navigate(location.state?.from || (result.data.user.role === 'admin' || data?.user?.role === 'admin' ? '/admin' : result.data.hasMembership ? '/portal' : '/join'), { replace: true }); }
    } catch (issue) { setError(issue.message); } finally { setLoading(false); }
  };
  const primaryLabel = { signin: 'Sign in', register: 'Send verification code', verify: 'Verify and create account', forgot: 'Send reset code', reset: 'Reset password' }[mode];
  return <div className="auth-page"><Header light/><main className="auth-shell">
    <section className="auth-aside"><p className="eyebrow">ASMMR account</p><h1>Your research community, in one place.</h1><p>Manage membership, submit research, and follow every review from your personal portal.</p><div><span><CheckCircle2/> Secure member access</span><span><CheckCircle2/> Verified email accounts</span><span><CheckCircle2/> Publication review tracking</span></div></section>
    <section className="auth-card">{['signin', 'register'].includes(mode) ? <div className="auth-tabs"><button type="button" className={mode === 'signin' ? 'is-active' : ''} onClick={() => switchMode('signin')}>Sign in</button><button type="button" className={mode === 'register' ? 'is-active' : ''} onClick={() => switchMode('register')}>Register</button></div> : <button type="button" className="auth-back" onClick={() => switchMode('signin')}><ArrowLeft/> Back to sign in</button>}<h2>{copy[mode][0]}</h2><p>{copy[mode][1]}</p>
      <form onSubmit={submit}>{mode === 'register' && <label><span>Full name</span><div><User/><input name="name" value={form.name} onChange={change} required placeholder="Your full name"/></div></label>}{mode !== 'verify' && <label><span>Email address</span><div><Mail/><input name="email" type="email" value={form.email} onChange={change} onBlur={checkEmail} required placeholder="name@example.com" autoComplete="email"/></div></label>}{mode === 'verify' && <p className="auth-email-note">Code sent to <strong>{form.email}</strong></p>}{['verify', 'reset'].includes(mode) && <label><span>6-digit code</span><div><KeyRound/><input name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={form.code} onChange={change} required placeholder="000000" autoComplete="one-time-code"/></div></label>}{['signin', 'register', 'reset'].includes(mode) && <label><span>{mode === 'reset' ? 'New password' : 'Password'}</span><div><LockKeyhole/><input name="password" type="password" value={form.password} onChange={change} required minLength="8" placeholder="At least 8 characters" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}/></div></label>}{mode === 'signin' && <button type="button" className="auth-text-button" onClick={() => switchMode('forgot')}>Forgot password?</button>}{message && <p className="auth-message">{message}</p>}{error && <p className="auth-error" role="alert">{error}</p>}<button className="button auth-submit" disabled={loading}>{loading ? 'Please wait…' : primaryLabel} <ArrowRight/></button>{mode === 'verify' && <button type="button" className="auth-text-button auth-resend" disabled={loading} onClick={() => { setMode('register'); setMessage('Submit the form again to request a new code.'); }}>Need a new code?</button>}</form><Link className="auth-home" to="/">Back to ASMMR home</Link>
    </section>
  </main></div>;
}
