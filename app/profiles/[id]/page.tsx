
import data from '@/data/profiles.json';
import { notFound } from 'next/navigation';

export default function ProfileDetail({ params }: { params: { id: string } }){
  const profile = data.find(p=>String(p.id)===params.id);
  if(!profile) return notFound();
  return (
    <main className="paper">
      <div style={{display:'flex', gap:16}}>
        <img src={profile.avatarUrl} alt={profile.name} width={96} height={96} style={{borderRadius:12,objectFit:'cover'}}/>
        <div>
          <h1>{profile.name} <span className="badge">{profile.city}</span></h1>
          <p>{profile.bio}</p>
          <div style={{display:'flex', gap:6, flexWrap:'wrap', marginTop:6}}>
            {profile.services.map(s=>(<span className="badge" key={s.name}>{s.name} • {s.pricePerHour} zł/h</span>))}
          </div>
        </div>
      </div>
      <hr/>
      <h3>Umów usługę</h3>
      <form action="#" onSubmit={(e)=>{e.preventDefault(); alert('Zamówienie wysłane (demo)');}}>
        <div className="row">
          <div>
            <label>Usługa</label>
            <select className="input">
              {profile.services.map(s=>(<option key={s.name} value={s.name}>{s.name}</option>))}
            </select>
          </div>
          <div>
            <label>Liczba godzin</label>
            <input className="input" type="number" min={1} defaultValue={2} />
          </div>
        </div>
        <div className="row" style={{marginTop:8}}>
          <div>
            <label>Miasto</label>
            <input className="input" placeholder="Warszawa" />
          </div>
          <div>
            <label>Ulica</label>
            <input className="input" placeholder="Prosta 1" />
          </div>
        </div>
        <button className="button" style={{marginTop:12}}>Wyślij zapytanie</button>
      </form>
      {profile.gallery?.length ? (
        <>
          <hr/>
          <h3>Galeria</h3>
          <div className="grid">
            {profile.gallery.map((url,i)=>(<img key={i} src={url} alt={`galeria-${i}`} style={{width:'100%', height:180, objectFit:'cover', borderRadius:12}}/>))}
          </div>
        </>
      ):null}
    </main>
  )
}
