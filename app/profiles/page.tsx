
'use client';
import { useMemo, useState } from 'react';
import data from '@/data/profiles.json';

type Profile = typeof data[0];

export default function Profiles(){
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [service, setService] = useState('');

  const services = useMemo(()=>Array.from(new Set(data.flatMap(p=>p.services.map(s=>s.name)))),[]);
  const cities = useMemo(()=>Array.from(new Set(data.map(p=>p.city))),[]);

  const list = data.filter(p=>{
    const matchQ = q? (p.name.toLowerCase().includes(q.toLowerCase()) || p.bio.toLowerCase().includes(q.toLowerCase())) : true;
    const matchCity = city? p.city===city : true;
    const matchService = service? p.services.some(s=>s.name===service) : true;
    return matchQ && matchCity && matchService;
  });

  return (
    <main>
      <div className="paper">
        <h1>Profile usługodawców</h1>
        <div className="row" style={{marginTop:8}}>
          <input className="input" placeholder="Szukaj po nazwie/opisie..." value={q} onChange={e=>setQ(e.target.value)} />
          <div className="row" style={{gap:8}}>
            <select className="input" value={city} onChange={e=>setCity(e.target.value)}>
              <option value="">Miasto</option>
              {cities.map(c=>(<option key={c} value={c}>{c}</option>))}
            </select>
            <select className="input" value={service} onChange={e=>setService(e.target.value)}>
              <option value="">Usługa</option>
              {services.map(s=>(<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid" style={{marginTop:16}}>
        {list.map(p=>(
          <a key={p.id} href={`/profiles/${p.id}`} className="card">
            <div style={{display:'flex', gap:12}}>
              <img src={p.avatarUrl} alt={p.name} width={64} height={64} style={{borderRadius:12,objectFit:'cover'}}/>
              <div>
                <h3 style={{margin:'4px 0'}}>{p.name} <span className="badge">{p.city}</span></h3>
                <p className="small">{p.bio}</p>
                <div style={{display:'flex', gap:6, flexWrap:'wrap', marginTop:6}}>
                  {p.services.slice(0,3).map(s=>(<span className="badge" key={s.name}>{s.name} • {s.pricePerHour} zł/h</span>))}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
