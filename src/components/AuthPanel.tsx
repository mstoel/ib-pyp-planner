import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { LogIn, LogOut, UserRound } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) { setMessage('Supabase settings are not available in this build. Check the GitHub Actions secrets and redeploy.'); return; }
    setBusy(true); setMessage('');
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + window.location.pathname } });
        if (error) throw error;
        setMessage(data.session ? 'Account created and signed in.' : 'Account created. Check your email for a confirmation link before signing in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('You are signed in.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Sign-in failed. Please try again.');
    } finally { setBusy(false); }
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    setMessage(error ? error.message : 'You have signed out.');
  }

  return <div className="authPanel" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    {session ? <><span style={{ fontSize: 12, color: '#426177', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}><UserRound size={14} style={{ verticalAlign: 'middle', marginRight: 5 }}/>{session.user.email}</span><button className="btn light" onClick={signOut}><LogOut size={14}/> Sign out</button></> : <button className="btn light" onClick={() => { setOpen(v => !v); setMessage(''); }}><LogIn size={14}/> Teacher sign in</button>}
    {open && !session && <section style={{ position: 'absolute', zIndex: 50, top: 'calc(100% + 10px)', right: 0, width: 310, padding: 18, background: '#fff', border: '1px solid #dbe5eb', borderRadius: 14, boxShadow: '0 12px 35px #17344a20', color: '#17344a' }}>
      <h3 style={{ margin: '0 0 6px' }}>{mode === 'signin' ? 'Teacher sign in' : 'Create teacher account'}</h3>
      <p style={{ margin: '0 0 14px', fontSize: 12, lineHeight: 1.5, color: '#5c7180' }}>Sign in to prepare for secure cloud planning. The public learning guide remains available without an account.</p>
      <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
        <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" style={{ padding: 10, border: '1px solid #cbd8e0', borderRadius: 8, width: '100%', boxSizing: 'border-box' }}/></label>
        <label style={{ display: 'grid', gap: 4, fontSize: 12 }}>Password<input required minLength={6} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} style={{ padding: 10, border: '1px solid #cbd8e0', borderRadius: 8, width: '100%', boxSizing: 'border-box' }}/></label>
        <button className="btn primary" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
      </form>
      <button className="btn light" style={{ marginTop: 8, width: '100%', justifyContent: 'center' }} onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(''); }}>{mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button>
      {message && <p role="status" style={{ fontSize: 12, lineHeight: 1.45, margin: '12px 0 0', color: '#426177' }}>{message}</p>}
      <button onClick={() => setOpen(false)} style={{ border: 0, background: 'transparent', color: '#60798a', cursor: 'pointer', marginTop: 8, padding: 0, fontSize: 12 }}>Close</button>
    </section>}
    {!supabase && <span title="Supabase environment variables are not configured" style={{ fontSize: 11, color: '#9b5b20' }}>Cloud sign-in needs configuration</span>}
  </div>;
}
