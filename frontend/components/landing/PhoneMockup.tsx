'use client';

/* iPhone mockup con estilos scoped — migrado desde nami-landing */
const mockupStyles = `
.nami-iphone-mockup .scene { display: flex; align-items: center; justify-content: center; padding: 0; position: relative; }
.nami-iphone-mockup .phone { position: relative; width: 290px; height: 600px; background: #111; border-radius: 52px; padding: 10px; box-shadow: 0 40px 80px -20px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.06) inset, 0 2px 0 rgba(255,255,255,.04) inset; }
.nami-iphone-mockup .phone::before { content: ''; position: absolute; top: 10px; right: -2px; width: 3px; height: 28px; background: #222; border-radius: 0 2px 2px 0; }
.nami-iphone-mockup .phone::after { content: ''; position: absolute; top: 68px; left: -2px; width: 3px; height: 55px; background: #222; border-radius: 2px 0 0 2px; box-shadow: 0 36px 0 #222, 0 -20px 0 #222; }
.nami-iphone-mockup .screen { position: relative; width: 100%; height: 100%; background: #0a0a0a; border-radius: 42px; overflow: hidden; }
.nami-iphone-mockup .di { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 100px; height: 28px; background: #000; border-radius: 20px; z-index: 30; box-shadow: 0 0 0 1px rgba(255,255,255,.04); }
.nami-iphone-mockup .di::after { content: ''; position: absolute; top: 8px; right: 24px; width: 10px; height: 10px; background: radial-gradient(circle, #1a1a2e 40%, #111 41%); border-radius: 50%; }
.nami-iphone-mockup .status { position: absolute; top: 8px; left: 0; right: 0; z-index: 20; display: flex; justify-content: space-between; align-items: center; padding: 0 28px; font: 500 11px var(--font-body), sans-serif; color: rgba(255,255,255,.7); }
.nami-iphone-mockup .header { padding: 50px 20px 16px; background: linear-gradient(135deg, #FF7A00 0%, #e06800 100%); position: relative; overflow: hidden; }
.nami-iphone-mockup .header::after { content: ''; position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: rgba(255,255,255,.08); border-radius: 50%; }
.nami-iphone-mockup .header-top { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; }
.nami-iphone-mockup .logo { font: 800 16px var(--font-display), sans-serif; color: #fff; letter-spacing: -0.02em; }
.nami-iphone-mockup .location { display: flex; align-items: center; gap: 4px; margin-top: 6px; position: relative; z-index: 2; }
.nami-iphone-mockup .location span { font: 400 10.5px var(--font-body), sans-serif; color: rgba(255,255,255,.7); }
.nami-iphone-mockup .loc-dot { width: 5px; height: 5px; background: #fff; border-radius: 50%; opacity: .7; }
.nami-iphone-mockup .search { margin: 0 16px; position: relative; z-index: 5; transform: translateY(-14px); }
.nami-iphone-mockup .search-bar { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #fff; border-radius: 14px; box-shadow: 0 4px 20px rgba(0,0,0,.12), 0 0 0 .5px rgba(0,0,0,.04); }
.nami-iphone-mockup .search-bar svg { opacity: .3; flex-shrink: 0; }
.nami-iphone-mockup .search-bar span { font: 400 12px var(--font-body), sans-serif; color: rgba(0,0,0,.3); }
.nami-iphone-mockup .cards { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; transform: translateY(-6px); }
.nami-iphone-mockup .card { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: rgba(255,255,255,.04); border: 0.5px solid rgba(255,255,255,.06); border-radius: 16px; opacity: 0; animation: namiCardIn .5s ease forwards; }
.nami-iphone-mockup .card:nth-child(1) { animation-delay: .3s; }
.nami-iphone-mockup .card:nth-child(2) { animation-delay: .5s; }
.nami-iphone-mockup .card:nth-child(3) { animation-delay: .7s; }
@keyframes namiCardIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
.nami-iphone-mockup .card-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; background: linear-gradient(135deg, rgba(255,122,0,.12), rgba(176,136,201,.12)); }
.nami-iphone-mockup .card-info { flex: 1; min-width: 0; }
.nami-iphone-mockup .card-name { font: 600 12px var(--font-body), sans-serif; color: #f0f0f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nami-iphone-mockup .card-meta { display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.nami-iphone-mockup .card-cat { font: 400 10px var(--font-body), sans-serif; color: rgba(255,255,255,.4); }
.nami-iphone-mockup .card-rating { display: flex; align-items: center; gap: 2px; font: 600 10px var(--font-body), sans-serif; color: #FF7A00; }
.nami-iphone-mockup .card-rating svg { width: 9px; height: 9px; fill: #FF7A00; }
.nami-iphone-mockup .card-wa { width: 30px; height: 30px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.nami-iphone-mockup .card-wa svg { width: 14px; height: 14px; fill: #fff; }
.nami-iphone-mockup .bottom-nav { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 24px 24px; display: flex; justify-content: space-around; align-items: center; background: linear-gradient(transparent, rgba(10,10,10,.95) 40%); }
.nami-iphone-mockup .nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.nami-iphone-mockup .nav-item svg { width: 18px; height: 18px; stroke: rgba(255,255,255,.3); fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.nami-iphone-mockup .nav-item.active svg { stroke: #FF7A00; }
.nami-iphone-mockup .nav-item span { font: 500 9px var(--font-body), sans-serif; color: rgba(255,255,255,.3); }
.nami-iphone-mockup .nav-item.active span { color: #FF7A00; }
.nami-iphone-mockup .home-bar { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); width: 110px; height: 4px; background: rgba(255,255,255,.15); border-radius: 4px; }
.nami-iphone-mockup .float { position: absolute; z-index: 40; background: #fff; border-radius: 16px; padding: 8px 14px; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 30px rgba(0,0,0,.15), 0 0 0 .5px rgba(0,0,0,.04); animation: namiFloatUp 3s ease-in-out infinite; }
.nami-iphone-mockup .float-1 { top: 60px; right: -50px; animation-delay: 0s; }
.nami-iphone-mockup .float-2 { bottom: 160px; left: -44px; animation-delay: 1.2s; }
@keyframes namiFloatUp { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.nami-iphone-mockup .float-icon { width: 24px; height: 24px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.nami-iphone-mockup .float-text { font: 600 11px var(--font-body), sans-serif; color: #111; white-space: nowrap; }
.nami-iphone-mockup .promo { margin: 0 16px; padding: 10px 14px; border-radius: 14px; background: linear-gradient(135deg, rgba(255,122,0,.1), rgba(176,136,201,.1)); border: 0.5px solid rgba(255,122,0,.15); display: flex; align-items: center; gap: 10px; transform: translateY(-2px); opacity: 0; animation: namiCardIn .5s ease forwards; animation-delay: 1.1s; }
.nami-iphone-mockup .promo-badge { font: 700 9px var(--font-display), sans-serif; color: #FF7A00; background: rgba(255,122,0,.15); padding: 3px 8px; border-radius: 6px; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap; }
.nami-iphone-mockup .promo-text { font: 400 10px var(--font-body), sans-serif; color: rgba(255,255,255,.5); line-height: 1.35; }
`;

const cards = [
  { name: 'El Clasico Burgers', cat: 'Hamburguesas', rating: '4.8', emoji: '🍔' },
  { name: 'Sabor Criollo', cat: 'Comida típica', rating: '4.6', emoji: '🍲' },
  { name: 'Pizza Nova', cat: 'Pizzería', rating: '4.9', emoji: '🍕' },
];

export function PhoneMockup() {
  return (
    <div className="nami-iphone-mockup relative">
      <style dangerouslySetInnerHTML={{ __html: mockupStyles }} />
      {/* Glow detrás */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <div className="w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-[80px]" />
      </div>

      <div className="scene relative">
        {/* Floating badge 1 */}
        <div className="float float-1">
          <div className="float-icon" style={{ background: 'rgba(37,211,102,.1)' }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
          </div>
          <span className="float-text">Pedido nuevo!</span>
        </div>
        {/* Floating badge 2 */}
        <div className="float float-2">
          <div className="float-icon" style={{ background: 'rgba(255,122,0,.1)' }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#FF7A00" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="float-text">0% comisión para ti</span>
        </div>

        {/* Phone */}
        <div className="phone">
          <div className="screen">
            <div className="di" aria-hidden />
            <div className="status">
              <span>9:41</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width={14} height={10} viewBox="0 0 14 10">
                  <rect x={0} y={4} width={2.5} height={6} rx={0.5} fill="currentColor" opacity={0.3} />
                  <rect x={3.5} y={2.5} width={2.5} height={7.5} rx={0.5} fill="currentColor" opacity={0.5} />
                  <rect x={7} y={1} width={2.5} height={9} rx={0.5} fill="currentColor" opacity={0.7} />
                  <rect x={10.5} y={0} width={2.5} height={10} rx={0.5} fill="currentColor" />
                </svg>
                <svg width={15} height={10} viewBox="0 0 20 12">
                  <rect x={0} y={1} width={16} height={10} rx={2} stroke="currentColor" strokeWidth={1} fill="none" />
                  <rect x={17} y={4} width={2} height={4} rx={1} fill="currentColor" opacity={0.4} />
                  <rect x={1.5} y={2.5} width={11} height={7} rx={1} fill="#25D366" />
                </svg>
              </span>
            </div>
            <div className="header">
              <div className="header-top">
                <div className="logo">ÑAMI</div>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round">
                  <circle cx={11} cy={11} r={8} />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <div className="location">
                <div className="loc-dot" />
                <span>Yumbo, Valle del Cauca</span>
              </div>
            </div>
            <div className="search">
              <div className="search-bar">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <circle cx={11} cy={11} r={8} />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <span>Buscar restaurantes...</span>
              </div>
            </div>
            <div className="cards">
              {cards.map((r) => (
                <div key={r.name} className="card">
                  <div className="card-icon">{r.emoji}</div>
                  <div className="card-info">
                    <div className="card-name">{r.name}</div>
                    <div className="card-meta">
                      <span className="card-cat">{r.cat}</span>
                      <span className="card-rating">
                        <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        {r.rating}
                      </span>
                    </div>
                  </div>
                  <div className="card-wa">
                    <svg viewBox="0 0 24 24" fill="white" width={14} height={14}>
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <div className="promo">
              <span className="promo-badge">Nuevo</span>
              <span className="promo-text">Registra tu restaurante y recibe pedidos hoy</span>
            </div>
            <div className="bottom-nav">
              <div className="nav-item active">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                <span>Inicio</span>
              </div>
              <div className="nav-item">
                <svg viewBox="0 0 24 24"><circle cx={11} cy={11} r={8} /><path d="M21 21l-4.35-4.35" /></svg>
                <span>Buscar</span>
              </div>
              <div className="nav-item">
                <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                <span>Favoritos</span>
              </div>
              <div className="nav-item">
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>
                <span>Perfil</span>
              </div>
            </div>
            <div className="home-bar" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
