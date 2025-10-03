'use client';
import { useState } from 'react';
import cls from 'classnames';

type Role = 'provider' | 'client';

// helper do uploadu plików – może być poza komponentem
async function uploadToServer(
  file: File,
  folder: 'avatar' | 'gallery' | 'uploads' = 'uploads'
) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || 'Upload nie powiódł się');
  return data.url as string;
}

export default function Register() {
  const [role, setRole] = useState<Role>('provider');
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordHash, setPasswordHash] = useState<string | null>(null);

  // provider profile
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    city: '',
    street: '',
    country: 'Polska',
    avatarUrl: '',
    gallery: [] as string[],
    bio: '',
    travelCost: 0,
    calcClientRoute: true,
    services: [{ name: 'Sprzątanie', pricePerHour: 50 }],
    availability: {
      mon: ['08:00-16:00'],
      tue: ['08:00-16:00'],
      wed: ['08:00-16:00'],
      thu: ['08:00-16:00'],
      fri: ['08:00-16:00'],
      sat: [],
      sun: [],
    },
  });

  // client profile
  const [client, setClient] = useState({
    firstName: '',
    city: '',
    street: '',
    phone: '',
    country: 'Polska',
  });

  const canGoStep1 = email.trim() !== '' && password.trim().length >= 6;
  const canGoStep2 = /^\d{6}$/.test(code) || code.trim().length > 0;
  const canFinishProvider = profile.name.trim() !== '' && profile.city.trim() !== '';
  const canFinishClient = true;

  const next = () => {
    setError(null);
    setStep((s) => Math.min(s + 1, role === 'provider' ? 4 : 3));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  async function verifyCode() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok)
        throw new Error(data.error || 'Nieprawidłowy kod');

      setPasswordHash(data.passwordHash);
      setStep(3);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function requestCode() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok)
        throw new Error(data.error || 'Nie udało się wysłać kodu');
      setStep(2);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitProvider() {
    setError(null);
    if (!passwordHash) {
      setError('Brak weryfikacji e-mail. Wróć do kroku 1.');
      return;
    }
    if (!canFinishProvider) {
      setError('Uzupełnij nazwę i miasto.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/register/provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passwordHash, profile }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok)
        throw new Error(data.error || 'Rejestracja nie powiodła się');
      window.location.href = '/dashboard';
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitClient() {
    setError(null);
    if (!passwordHash) {
      setError('Brak weryfikacji e-mail. Wróć do kroku 1.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/register/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passwordHash, client }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok)
        throw new Error(data.error || 'Rejestracja nie powiodła się');
      window.location.href = '/profiles';
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="paper">
      <h1>Załóż konto</h1>

      <div className="tabbar">
        <button
          onClick={() => {
            setRole('provider');
            setStep(1);
            setError(null);
          }}
          className={cls('tab', { active: role === 'provider' })}
        >
          Usługodawca
        </button>
        <button
          onClick={() => {
            setRole('client');
            setStep(1);
            setError(null);
          }}
          className={cls('tab', { active: role === 'client' })}
        >
          Klient
        </button>
      </div>

      {error && (
        <div className="card" style={{ borderColor: '#ff6666', color: '#ffaaaa' }}>
          {error}
        </div>
      )}

      {step === 1 && (
        <section className="card">
          <h3>Krok 1: E-mail i hasło</h3>
          <div className="row">
            <div>
              <label>Email</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jan@domena.pl"
              />
            </div>
            <div>
              <label>Hasło (min. 6 znaków)</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            className="button"
            style={{ marginTop: 12 }}
            onClick={requestCode}
            disabled={!canGoStep1 || loading}
          >
            {loading ? 'Wysyłanie...' : 'Wyślij kod i dalej'}
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="card">
          <h3>Krok 2: Wpisz kod z e-maila</h3>
          <p className="small">MVP: wpisz dowolny 6-cyfrowy kod (bez wysyłki e-mail).</p>
          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="button secondary" onClick={prev}>
              Wstecz
            </button>
            <button className="button" onClick={verifyCode} disabled={!canGoStep2 || loading}>
              {loading ? 'Sprawdzanie...' : 'Zweryfikuj'}
            </button>
          </div>
        </section>
      )}

      {role==='client' && step===3 && (
        <section className="card">
          <h3>Krok 3: Dane klienta</h3>
          <div className="row">
            <div>
              <label>Imię</label>
              <input className="input" value={client.firstName} onChange={e=>setClient({...client, firstName:e.target.value})} />
            </div>
            <div>
              <label>Telefon (opcjonalnie)</label>
              <input className="input" value={client.phone} onChange={e=>setClient({...client, phone:e.target.value})} />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Miasto</label>
              <input className="input" value={client.city} onChange={e=>setClient({...client, city:e.target.value})} />
            </div>
            <div>
              <label>Ulica</label>
              <input className="input" value={client.street} onChange={e=>setClient({...client, street:e.target.value})} />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Kraj</label>
              <input className="input" value={client.country} onChange={e=>setClient({...client, country:e.target.value})} />
            </div>
          </div>
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button className="button secondary" onClick={prev} disabled={loading}>Wstecz</button>
            <button className="button" onClick={submitClient} disabled={loading || !canFinishClient}>
              {loading ? 'Zapisywanie...' : 'Zakończ i przeglądaj profile'}
            </button>
          </div>
        </section>
      )}

      {(role==='provider' && step===4) && (
        <section className="card">
          <h3>Gotowe! 🎉</h3>
          <p>Profil utworzony. Za chwilę przejdziesz do kokpitu.</p>
          <a className="button" href="/dashboard">Przejdź do kokpitu</a>
        </section>
      )}
    </main>
  );
}

