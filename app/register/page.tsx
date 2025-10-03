
'use client';
import { useState } from 'react';
import cls from 'classnames';

type Role = 'provider' | 'client';

export default function Register(){
  const [role, setRole] = useState<Role>('provider');
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

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

  const next = () => setStep(s => Math.min(s+1, role==='provider'?4:3));
  const prev = () => setStep(s => Math.max(1, s-1));

  return (
    <main className="paper">
      <h1>Załóż konto</h1>

      <div className="tabbar">
        <button onClick={()=>{setRole('provider'); setStep(1)}} className={cls('tab', {active: role==='provider'})}>Usługodawca</button>
        <button onClick={()=>{setRole('client'); setStep(1)}} className={cls('tab', {active: role==='client'})}>Klient</button>
      </div>

      {step===1 && (
        <section className="card">
          <h3>Krok 1: E-mail i hasło</h3>
          <div className="row">
            <div>
              <label>Email</label>
              <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jan@domena.pl" />
            </div>
            <div>
              <label>Hasło</label>
              <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <button className="button" style={{marginTop:12}} onClick={next}>Dalej</button>
        </section>
      )}

      {step===2 && (
        <section className="card">
          <h3>Krok 2: Wpisz kod z e-maila</h3>
          <p className="small">Wersja demo – wpisz dowolny 6-cyfrowy kod.</p>
          <input className="input" value={code} onChange={e=>setCode(e.target.value)} placeholder="123456" />
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button className="button secondary" onClick={prev}>Wstecz</button>
            <button className="button" onClick={next}>Zweryfikuj</button>
          </div>
        </section>
      )}

      {role==='provider' && step===3 && (
        <section className="card">
          <h3>Krok 3: Kreator profilu</h3>
          <div className="row">
            <div>
              <label>Nazwa/Imię</label>
              <input className="input" value={profile.name} onChange={e=>setProfile({...profile, name:e.target.value})} />
            </div>
            <div>
              <label>Telefon</label>
              <input className="input" value={profile.phone} onChange={e=>setProfile({...profile, phone:e.target.value})} />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Miasto</label>
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
              <label>Zdjęcie profilowe (URL)</label>
              <input className="input" value={profile.avatarUrl} onChange={e=>setProfile({...profile, avatarUrl:e.target.value})} placeholder="https://..." />
            </div>
            <div>
              <label>Galeria (URL-e, rozdzielone przecinkami)</label>
              <input className="input" onChange={e=>setProfile({...profile, gallery:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} placeholder="https://... , https://..." />
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
            <button className="button secondary" onClick={prev}>Wstecz</button>
            <button className="button" onClick={next}>Zakończ</button>
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
            <button className="button secondary" onClick={prev}>Wstecz</button>
            <a className="button" href="/profiles">Zakończ i przeglądaj profile</a>
          </div>
        </section>
      )}

      {(role==='provider' && step===4) && (
        <section className="card">
          <h3>Gotowe! 🎉</h3>
          <p>Profil utworzony (demo). Możesz przejść do kokpitu i uzupełnić szczegóły.</p>
          <a className="button" href="/dashboard">Przejdź do kokpitu</a>
        </section>
      )}
    </main>
  );
}
