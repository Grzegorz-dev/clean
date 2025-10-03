
'use client';
import { useState } from 'react';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <main className="paper">
      <h1>Zaloguj</h1>
      <div className="row">
        <div>
          <label>Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jan@domena.pl" />
        </div>
        <div>
          <label>Hasło</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
      </div>
      <a className="button" style={{marginTop:12}} href="/dashboard">Zaloguj (demo)</a>
    </main>
  )
}
