// src/components/ArteniaLayout.tsx

export function ArteniaLayout() {
  return (
    <div className="artenia-app">
      <header className="artenia-header">
        <div className="artenia-logo">
          <span className="artenia-logo-mark" />
          <span className="artenia-logo-text">ARTENIA</span>
        </div>

        <nav className="artenia-nav">
          <button className="artenia-nav-item">Mapa</button>
          <button className="artenia-nav-item">Colmena</button>
          <button className="artenia-nav-item">Oficios</button>
          <button className="artenia-nav-cta">Entrar</button>
        </nav>
      </header>

      <main className="artenia-main">
        <section className="artenia-card">
          <div className="artenia-card-top">
            <div className="artenia-card-title">
              Artesana en ruta
              <span className="artenia-card-code">ID · CV-0173</span>
            </div>

            <div className="artenia-badges">
              <span className="badge-artenia badge-ok">Activo</span>
              <span className="badge-artenia badge-soft">Riesgo medio</span>
            </div>
          </div>

          <div className="artenia-flight">
            <div className="artenia-flight-meta">
              <div>
                <div className="artenia-flight-label">Taller</div>
                <div className="artenia-flight-code">ALCOY</div>
                <div className="artenia-flight-sub">desde 1984</div>
              </div>
              <div className="artenia-flight-meta-right">
                <div className="artenia-flight-label">Disciplina</div>
                <div className="artenia-flight-status">Textil · Telar</div>
                <div className="artenia-flight-sub">Visita en 1h 20min</div>
              </div>
            </div>

            <div className="artenia-flight-arc">
              <div className="artenia-flight-line" />
              <div className="artenia-flight-plane">✧</div>
            </div>
          </div>

          <div className="artenia-card-bottom">
            <div className="artenia-card-big">
              ALC<span>OY</span> › TEL<span>AR</span>
            </div>
            <p className="artenia-card-desc">
              Tejeduría artesanal en telar manual. Piezas únicas en lana local,
              tintes naturales y diseño contemporáneo para interiorismo y moda.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
