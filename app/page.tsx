
export default function Home() {
  return (
    <main>
      <div className="paper" style={{marginTop:10}}>
        <h1>Znajdź zaufaną pomoc do domu</h1>
        <p>Sprzątacze, opiekunki, złote rączki. Przeglądaj profile i zamawiaj usługi bezpośrednio.</p>
        <div style={{display:'flex', gap:12, marginTop:10}}>
          <a href="/profiles" className="button">Przeglądaj profile</a>
          <a href="/register" className="button secondary">Dołącz jako usługodawca</a>
        </div>
      </div>
    </main>
  );
}
