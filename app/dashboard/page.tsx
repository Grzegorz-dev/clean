
'use client';
import { useState } from 'react';
import data from '@/data/profiles.json';

const Me = data[0]; // demo zalogowany usługodawca

export default function Dashboard(){
  const tabs = ['Moje konto','Moje zlecenia','Powiadomienia','Moje opinie','Wiadomości','Subskrypcje','Pomoc'] as const;
  const [tab, setTab] = useState<typeof tabs[number]>('Moje konto');

  return (
    <main className="paper">
      <h1>Kokpit usługodawcy</h1>
      <div className="tabbar">
        {tabs.map(t=>(
          <button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</button>
        ))}
      </div>

      {tab==='Moje konto' && <AccountTab/>}
      {tab==='Moje zlecenia' && <OrdersTab/>}
      {tab==='Powiadomienia' && <div className="card">Brak nowych powiadomień.</div>}
      {tab==='Moje opinie' && <div className="card">Twoje opinie pojawią się tutaj.</div>}
      {tab==='Wiadomości' && <MessagesTab/>}
      {tab==='Subskrypcje' && <div className="card">Pakiety: Basic (0 zł), Pro (49 zł/mies). (demo)</div>}
      {tab==='Pomoc' && <div className="card">Napisz do nas: pomoc@cleanly.example</div>}
    </main>
  );
}

function AccountTab(){
  const [name, setName] = useState(Me.name);
  const [city, setCity] = useState(Me.city);
  const [bio, setBio] = useState(Me.bio);
  const [services, setServices] = useState(Me.services);

  return (
    <div className="card">
      <h3>Dane profilu</h3>
      <div className="row">
        <div>
          <label>Nazwa/Imię</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label>Miasto</label>
          <input className="input" value={city} onChange={e=>setCity(e.target.value)} />
        </div>
      </div>
      <div style={{marginTop:8}}>
        <label>Opis</label>
        <textarea className="input" rows={4} value={bio} onChange={e=>setBio(e.target.value)} />
      </div>
      <hr/>
      <h3>Usługi i ceny</h3>
      {services.map((s:any, idx:number)=>(
        <div key={idx} className="row" style={{marginBottom:8}}>
          <input className="input" value={s.name} onChange={e=>{const a=[...services]; a[idx].name=e.target.value; setServices(a)}}/>
          <input className="input" type="number" value={s.pricePerHour} onChange={e=>{const a=[...services]; a[idx].pricePerHour=Number(e.target.value); setServices(a)}}/>
        </div>
      ))}
      <button className="button secondary" onClick={()=>setServices([...services, {name:'', pricePerHour:0}])}>+ Dodaj</button>
      <div style={{display:'flex', gap:8, marginTop:12}}>
        <button className="button">Zapisz (demo)</button>
        <span className="small">Dane nie są jeszcze zapisywane (mock).</span>
      </div>
    </div>
  )
}

function OrdersTab(){
  const orders = [
    {id:1, client:'Anna K.', service:'Sprzątanie', hours:3, date:'2025-10-05', city:'Warszawa', status:'Nowe'},
    {id:2, client:'Piotr M.', service:'Mycie okien', hours:2, date:'2025-10-07', city:'Warszawa', status:'Zaakceptowane'},
  ];
  return (
    <div className="grid">
      {orders.map(o=>(
        <div className="card" key={o.id}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <strong>#{o.id} • {o.service}</strong><span className="badge">{o.status}</span>
          </div>
          <div className="small" style={{marginTop:6}}>{o.date} • {o.hours} h • {o.city}</div>
          <div style={{display:'flex', gap:8, marginTop:10}}>
            <button className="button">Akceptuj</button>
            <button className="button secondary">Odrzuć</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function MessagesTab(){
  const msgs=[
    {from:'Anna', text:'Dzień dobry, czy piątek 10:00 pasuje?', time:'10:21'},
    {from:'Ty', text:'Tak, potwierdzam.', time:'10:22'}
  ];
  return (
    <div className="card">
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{alignSelf: m.from==='Ty'?'flex-end':'flex-start'}} className="badge">{m.from}: {m.text}</div>
        ))}
      </div>
      <div className="row" style={{marginTop:10}}>
        <input className="input" placeholder="Napisz wiadomość..." />
        <button className="button">Wyślij</button>
      </div>
    </div>
  )
}
