'use client';
import { useState } from 'react';
import cls from 'classnames';

const [passwordHash, setPasswordHash] = useState<string | null>(null);

async function verifyCode() {
  setError(null);
  setLoading(true);
  try {
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if(!res.ok || !data.ok) throw new Error(data.error || 'Nieprawidłowy kod');

    setPasswordHash(data.passwordHash); // zapamiętaj hash
    setStep(3);
  } catch (e:any) {
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
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if(!res.ok || !data.ok) throw new Error(data.error || 'Nie udało się wysłać kodu');
    setStep(2);
  } catch (e:any) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
}

async function uploadToServer(file: File, folder: 'avatar' | 'gallery' | 'uploads' = 'uploads') {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || 'Upload nie powiódł się');
  return data.url as string; // publiczny URL (lokalnie /uploads/..., prod: Cloudinary https://...)
}


type Role = 'provider' | 'client';

export default function Register(){
  const [role, setRole] = useState<Role>('provider');
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // provider profile fields
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
    services: [{name:'Sprzątanie', pricePerHour: 50}],
    availability: { mon:['08:00-16:00'], tue:['08:00-16:00'], wed:['08:00-16:00'], thu:['08:00-16:00'], fri:['08:00-16:00'], sat:[], sun:[] }
  });

  // client fields
  const [client, setClient] = useState({ firstName:'', city:'', street:'', phone:'', country:'Polska' });

  const canGoStep1 = email.trim() !== '' && password.trim().length >= 6;
  const canGoStep2 = /^\d{6}$/.test(code) || code.trim().length > 0; // demo
  const canFinishProvider = profile.name.trim() !== '' && profile.city.trim() !== '';
  const canFinishClient = true; // imię/miasto opcjonalne w MVP

  const next = () => {
    setError(null);
    setStep(s => Math.min(s+1, role==='provider'?4:3));
  }
  const prev = () => setStep(s => Math.max(1, s-1));

  async function submitProvider() {
    setError(null);
    if (!passwordHash) { setError('Brak weryfikacji e-mail. Wróć do kroku 1.'); return; }
    if (!canFinishProvider) { setError('Uzupełnij nazwę i miasto.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/register/provider', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ email, passwordHash, profile })
      });
      const data = await res.json();
      if(!res.ok || !data.ok) throw new Error(data.error || 'Rejestracja nie powiodła się');
      window.location.href = '/dashboard';
    } catch (e:any) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  async function submitClient() {
    setError(null);
    if (!passwordHash) { setError('Brak weryfikacji e-mail. Wróć do kroku 1.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/register/client', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ email, passwordHash, client })
      });
      const data = await res.json();
      if(!res.ok || !data.ok) throw new Error(data.error || 'Rejestracja nie powiodła się');
      window.location.href = '/profiles';
    } catch (e:any) {
      setError(e.message);
    } finally { setLoading(false); }
  }


  return (
    <main className="paper">
      <h1>Załóż konto</h1>

      <div className="tabbar">
        <button onClick={()=>{setRole('provider'); setStep(1); setError(null)}} className={cls('tab', {active: role==='provider'})}>Usługodawca</button>
        <button onClick={()=>{setRole('client'); setStep(1); setError(null)}} className={cls('tab', {active: role==='client'})}>Klient</button>
      </div>

      {error && <div className="card" style={{borderColor:'#ff6666', color:'#ffaaaa'}}>{error}</div>}

      {step===1 && (
        <section className="card">
          <h3>Krok 1: E-mail i hasło</h3>
          <div className="row">
            <div>
              <label>Email</label>
              <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jan@domena.pl" />
            </div>
            <div>
              <label>Hasło (min. 6 znaków)</label>
              <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <button className="button" style={{marginTop:12}} onClick={requestCode} disabled={!canGoStep1 || loading}>
            {loading ? 'Wysyłanie...' : 'Wyślij kod i dalej'}
          </button>

        </section>
      )}

      {step===2 && (
        <section className="card">
          <h3>Krok 2: Wpisz kod z e-maila</h3>
          <p className="small">MVP: wpisz dowolny 6-cyfrowy kod (bez wysyłki e-mail).</p>
          <input className="input" value={code} onChange={e=>setCode(e.target.value)} placeholder="123456" />
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button className="button secondary" onClick={prev}>Wstecz</button>
            <button className="button" onClick={verifyCode} disabled={!canGoStep2 || loading}>
              {loading ? 'Sprawdzanie...' : 'Zweryfikuj'}
            </button>
          </div>
        </section>
      )}

      {role==='provider' && step===3 && (
        <section className="card">
          <h3>Krok 3: Kreator profilu</h3>
          <div className="row">
            <div>
              <label>Nazwa/Imię *</label>
              <input className="input" value={profile.name} onChange={e=>setProfile({...profile, name:e.target.value})} />
            </div>
            <div>
              <label>Telefon</label>
              <input className="input" value={profile.phone} onChange={e=>setProfile({...profile, phone:e.target.value})} />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Miasto *</label>
              <input className="input" value={profile.city} onChange={e=>setProfile({...profile, city:e.target.value})} />
            </div>
            <div>
              <label>Ulica (opcjonalnie)</label>
              <input className="input" value={profile.street} onChange={e=>setProfile({...profile, street:e.target.value})} />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Kraj</label>
              <input className="input" value={profile.country} onChange={e=>setProfile({...profile, country:e.target.value})} />
            </div>
            <div>
              <label>Koszt dojazdu (PLN)</label>
              <input type="number" className="input" value={profile.travelCost} onChange={e=>setProfile({...profile, travelCost:Number(e.target.value)})} />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Zdjęcie profilowe (z komputera)</label>
              <input className="input" type="file" accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    const url = await uploadToServer(f, 'avatar');
                    setProfile({ ...profile, avatarUrl: url });
                  } catch (err:any) {
                    alert(err.message || 'Błąd uploadu');
                  }
                }}
              />
              {profile.avatarUrl && (
                <div style={{marginTop:8}}>
                  <img src={profile.avatarUrl} alt="podgląd" width={96} height={96} style={{borderRadius:12,objectFit:'cover'}} />
                </div>
              )}
            </div>

            <div>
              <label>Galeria (wiele zdjęć)</label>
              <input className="input" type="file" accept="image/*" multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length) return;
                  try {
                    const urls: string[] = [];
                    for (const f of files) {
                      const url = await uploadToServer(f, 'gallery');
                      urls.push(url);
                    }
                    setProfile({ ...profile, gallery: [...profile.gallery, ...urls] });
                  } catch (err:any) {
                    alert(err.message || 'Błąd uploadu');
                  }
                }}
              />
              {!!profile.gallery.length && (
                <div className="grid" style={{marginTop:8}}>
                  {profile.gallery.map((u, i) => (
                    <img key={i} src={u} alt={`g-${i}`} style={{width:'100%',height:120,objectFit:'cover',borderRadius:12}}/>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label>Opis</label>
            <textarea className="input" rows={4} value={profile.bio} onChange={e=>setProfile({...profile, bio:e.target.value})} />
          </div>
          <div style={{marginTop:10}}>
            <label>Usługi i stawki (za godzinę)</label>
            {profile.services.map((s,idx)=>(
              <div key={idx} className="row" style={{marginBottom:8}}>
                <input className="input" value={s.name} onChange={e=>{
                  const arr=[...profile.services]; arr[idx].name=e.target.value; setProfile({...profile, services:arr});
                }} placeholder="Nazwa usługi"/>
                <input type="number" className="input" value={s.pricePerHour} onChange={e=>{
                  const arr=[...profile.services]; arr[idx].pricePerHour=Number(e.target.value); setProfile({...profile, services:arr});
                }} placeholder="Cena / h"/>
              </div>
            ))}
            <button className="button secondary" onClick={()=>setProfile({...profile, services:[...profile.services, {name:'', pricePerHour:0}]})}>+ Dodaj usługę</button>
          </div>
          <hr/>
          <div>
            <label><input type="checkbox" checked={profile.calcClientRoute} onChange={e=>setProfile({...profile, calcClientRoute:e.target.checked})}/> Obliczaj trasę klienta od jego ulicy (opcjonalnie)</label>
          </div>
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button className="button secondary" onClick={prev} disabled={loading}>Wstecz</button>
            <button className="button" onClick={submitProvider} disabled={loading || !canFinishProvider}>
              {loading ? 'Zapisywanie...' : 'Zakończ i utwórz konto'}
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

