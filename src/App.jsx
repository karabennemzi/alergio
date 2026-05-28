import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════
   REÁLNE DÁTA  —  ÚVZ SR / pelovespravodajstvo.sk
   Týždeň 21–22 / 2026  (aktualizované 27.5.2026)
   Zdroj: Mgr. Lucia Rendlová, RÚVZ BB + stanice RÚVZ NR/TT/ZA/BA
   ══════════════════════════════════════════════════════════════ */
const POLLEN_DATA = {
  "borovica": {
    label: "Borovica / Ihličnany", emoji: "🌲",
    uroven: "Veľmi vysoká", skore: 5,
    sezona: true,
    pelZrn: "2 373 zŕn/m³ (Žilina) · 656 zŕn/m³ (Nitra)",
    trend: "↘ klesá",
    komentar: "Dominantný alergén týždňa — viditeľné žlté povlaky na autách a terasách. Ihličnany dokvitajú.",
    outlook: [4, 3, 2],
  },
  "travy": {
    label: "Trávy (lipnicovité)", emoji: "🌾",
    uroven: "Vysoká", skore: 4,
    sezona: true,
    pelZrn: "rastúce koncentrácie",
    trend: "↗ rastie",
    komentar: "Sezóna práve začína — trávy sa stanú DOMINANTNÝM alergénom na najbližšie 2 mesiace.",
    outlook: [5, 5, 5],
  },
  "breza": {
    label: "Breza", emoji: "🌳",
    uroven: "Nízka", skore: 2,
    sezona: false,
    pelZrn: "nízke koncentrácie",
    trend: "↘ klesá",
    komentar: "Sezóna brezy sa končí, koncentrácie sú nízke.",
    outlook: [1, 1, 1],
  },
  "lieska": {
    label: "Lieska", emoji: "🌰",
    uroven: "Veľmi nízka", skore: 1,
    sezona: false,
    pelZrn: "stopové množstvá",
    trend: "— ukončená",
    komentar: "Sezóna liesky je dávno ukončená.",
    outlook: [1, 1, 1],
  },
  "ambrozia": {
    label: "Ambrózia", emoji: "🌿",
    uroven: "Veľmi nízka", skore: 1,
    sezona: false,
    pelZrn: "zatiaľ 0",
    trend: "— sezóna ešte nezačala",
    komentar: "Ambrózia začína až v júli–auguste. Zatiaľ nie je v ovzduší.",
    outlook: [1, 1, 1],
  },
  "byliny": {
    label: "Byliny (štiav, skorocel, pŕhľava)", emoji: "🌱",
    uroven: "Stredná", skore: 3,
    sezona: true,
    pelZrn: "nízke až stredné",
    trend: "↗ rastie",
    komentar: "Pŕhľavovité, štiav a skorocel dosahujú stredné hodnoty — na celom území SR stúpajú.",
    outlook: [3, 4, 4],
  },
  "huby": {
    label: "Spóry húb (Cladospórium)", emoji: "🍄",
    uroven: "Vysoká", skore: 4,
    sezona: true,
    pelZrn: "vysoké hodnoty",
    trend: "↗ rastie",
    komentar: "Spóry plesní Cladospórium a Alternária dosahujú vysoké hodnoty po nedávnom oteplení.",
    outlook: [4, 4, 3],
  },
};

const OUTLOOK_DAYS = ["Zajtra", "Pozajtra", "Za 3 dni"];

const SCORE_TO_LEVEL = ["","Veľmi nízka","Nízka","Stredná","Vysoká","Veľmi vysoká"];

const CITIES = [
  "Bratislava","Košice","Prešov","Žilina","Banská Bystrica","Nitra","Trnava","Trenčín",
];

// Slight regional modifiers (multiplied on score, then rounded, capped at 5)
const CITY_MOD = {
  "Žilina": { "borovica": 1.3, "travy": 1.1 },
  "Nitra":  { "borovica": 1.1, "travy": 1.2, "byliny": 1.2 },
  "Banská Bystrica": { "borovica": 1.2 },
  "Bratislava": { "travy": 1.1, "huby": 1.1 },
  "Trnava": { "travy": 1.15 },
};

const SENS_MULT = { "nízka": 0.8, "stredná": 1.0, "vysoká": 1.25 };

const C = { "Veľmi nízka":"#43A047","Nízka":"#7CB342","Stredná":"#F9A825","Vysoká":"#FB8C00","Veľmi vysoká":"#E53935" };
const B = { "Veľmi nízka":"#E8F5E9","Nízka":"#F1F8E9","Stredná":"#FFFDE7","Vysoká":"#FFF3E0","Veľmi vysoká":"#FFEBEE" };
const ICON = { "Veľmi nízka":"🟢","Nízka":"🟡","Stredná":"🟠","Vysoká":"🔴","Veľmi vysoká":"🚨" };

const ALL_IDS = Object.keys(POLLEN_DATA);

/* ── Recommendations database ─────────────────────────────── */
function buildRecommendations(allergens, sensitivity, maxScore) {
  const recs = [];
  const high = allergens.filter(id => {
    const d = POLLEN_DATA[id]; return d && d.skore >= 4;
  });
  const hasTravy = allergens.includes("travy") && POLLEN_DATA.travy.skore >= 3;
  const hasBorovica = allergens.includes("borovica") && POLLEN_DATA.borovica.skore >= 4;

  if (maxScore >= 4) {
    recs.push("🚪 Pokiaľ možno zostaňte vnútri počas ranných hodín (6:00–10:00), keď sú koncentrácie peľu najvyššie.");
    recs.push("🪟 Zatvorte okná, najmä v noci a ráno — používajte klimatizáciu s peľovým filtrom.");
  }
  if (sensitivity === "vysoká" && maxScore >= 3) {
    recs.push("💊 Poraďte sa s lekárom o nasadení alebo úprave antihistaminickej liečby — sezóna vrcholí.");
  }
  if (hasTravy) {
    recs.push("🌾 Vyhýbajte sa trávnatým plochám, parkovi a poľným cestám — trávy sú teraz v plnej sezóne.");
    recs.push("🚿 Po príchode domov sa okamžite osprchujte a prezlečte — peľ tráv sa ľahko zachytáva na vlasoch a oblečení.");
  }
  if (hasBorovica) {
    recs.push("🌲 Po daždi môže dôjsť k náhlemu uvoľneniu peľu borovíc — radšej vyčkajte hodinu doma.");
  }
  if (allergens.includes("huby") && POLLEN_DATA.huby.skore >= 3) {
    recs.push("🍄 Spóry húb sú vysoké — vyhýbajte sa vlhkým miestam, kompostom a listovej pôde.");
  }
  if (recs.length < 3) {
    recs.push("🕕 Najlepší čas na vonkajšie aktivity je podvečer (18:00–21:00), keď koncentrácie klesajú.");
  }
  if (recs.length < 4) {
    recs.push("😎 Noste wrap-around slnečné okuliare vonku — zredukujú kontakt peľu s očami až o 30 %.");
  }
  if (sensitivity === "vysoká") {
    recs.push("🏠 Zvýšená citlivosť: zvážte nosenie FFP1 respirátora pri dlhšom pobyte vonku počas vrcholu peľu.");
  }
  return recs.slice(0, 5);
}

/* ── Core forecast calculation ─────────────────────────────── */
function calcForecast(city, selectedIds, sensitivity) {
  const cityMods = CITY_MOD[city] || {};
  const sensMult = SENS_MULT[sensitivity] || 1;

  const allergens = selectedIds.map(id => {
    const base = POLLEN_DATA[id];
    if (!base) return null;
    const cityFactor = cityMods[id] || 1;
    const rawScore = Math.min(5, Math.round(base.skore * cityFactor * sensMult));
    return {
      ...base,
      id,
      adjustedSkore: rawScore,
      adjustedUroven: SCORE_TO_LEVEL[rawScore] || base.uroven,
      outlook: base.outlook.map(s => ({
        skore: Math.min(5, Math.round(s * cityFactor * sensMult)),
        get uroven() { return SCORE_TO_LEVEL[this.skore]; },
      })),
    };
  }).filter(Boolean);

  // Sort by score descending
  allergens.sort((a, b) => b.adjustedSkore - a.adjustedSkore);

  const maxScore = allergens.reduce((m, a) => Math.max(m, a.adjustedSkore), 0);
  const celkovySkore = Math.round(allergens.reduce((s, a) => s + a.adjustedSkore, 0) / Math.max(allergens.length, 1));
  const displayScore = Math.max(maxScore, celkovySkore);

  // 3-day total outlook
  const dayOutlooks = OUTLOOK_DAYS.map((den, i) => {
    const scores = allergens.map(a => a.outlook[i]?.skore || 1);
    const maxDay = Math.max(...scores);
    return { den, skore: maxDay, riziko: SCORE_TO_LEVEL[maxDay] };
  });

  const recs = buildRecommendations(selectedIds, sensitivity, maxScore);

  // Special warning
  let varovanie = null;
  if (sensitivity === "vysoká" && displayScore >= 4) {
    varovanie = "⚠️ Vysoká citlivosť + vysoký peľ: zvýšte pozornosť, majte po ruke záchranné lieky.";
  } else if (displayScore === 5) {
    varovanie = "🚨 Extrémne vysoké koncentrácie — zvážte obmedzenie pobytu vonku na minimum.";
  }

  return {
    allergens,
    celkovySkore: displayScore,
    celkovyRiziko: SCORE_TO_LEVEL[displayScore],
    dayOutlooks,
    recs,
    varovanie,
  };
}

/* ── UI components ─────────────────────────────────────────── */
function Bar({ score, color, big }) {
  const w = big ? 24 : 20, h = big ? 9 : 7;
  return (
    <div style={{ display:"flex", gap:3 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width:w, height:h, borderRadius:4, background: i<=score ? color : "#E8E8E8", transition:"background .3s" }}/>
      ))}
    </div>
  );
}

function Tag({ text, color, bg }) {
  return (
    <span style={{ background:bg||"#eee", color:color||"#555", fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
      {text}
    </span>
  );
}

/* ── APP ───────────────────────────────────────────────────── */
export default function App() {
  const [city,    setCity]   = useState("Bratislava");
  const [chosen,  setChosen] = useState(["travy","borovica"]);
  const [sens,    setSens]   = useState("stredná");
  const [view,    setView]   = useState("setup"); // setup | result
  const [forecast,setForecast] = useState(null);

  const toggle = id => setChosen(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);

  const go = () => {
    if (!chosen.length) return;
    setForecast(calcForecast(city, chosen, sens));
    setView("result");
  };

  const today = new Date().toLocaleDateString("sk-SK",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

  const rc  = forecast ? (C[forecast.celkovyRiziko]||"#888") : "#888";
  const rbg = forecast ? (B[forecast.celkovyRiziko]||"#f5f5f5") : "#f5f5f5";
  const ri  = forecast ? (ICON[forecast.celkovyRiziko]||"❓") : "❓";

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#f0fdf4 0%,#fafaf9 55%,#f0f9ff 100%)", fontFamily:"'DM Sans',sans-serif", padding:"18px 14px 48px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fade{from{opacity:0}to{opacity:1}}
        .up{animation:up .35s ease both}
        .fade{animation:fade .3s ease both}
        .card{background:#fff;border-radius:18px;box-shadow:0 2px 18px rgba(0,0,0,.07)}
        .lbl{font-size:11px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:8px}
        .chip{border:1.5px solid #DDD;border-radius:50px;padding:8px 13px;font-size:13px;cursor:pointer;background:#fff;display:inline-flex;align-items:center;gap:6px;transition:all .15s;font-family:'DM Sans',sans-serif;color:#444;user-select:none}
        .chip.on{border-color:#3A7D44;background:#EDFBEE;color:#2E6B3A;font-weight:600}
        .chip:active{transform:scale(.96)}
        select{width:100%;padding:11px 14px;border:1.5px solid #E0E0E0;border-radius:12px;font-size:14px;font-family:'DM Sans',sans-serif;color:#333;background:#fff;outline:none;-webkit-appearance:none}
        .btn{width:100%;padding:15px;border:none;border-radius:14px;font-size:15px;font-family:'DM Sans',sans-serif;font-weight:600;cursor:pointer;transition:all .2s;-webkit-tap-highlight-color:transparent}
        .green{background:linear-gradient(135deg,#2E7D32,#4CAF50);color:#fff}
        .green:active{transform:scale(.98)}
        .green:disabled{opacity:.45;cursor:not-allowed}
        .outline{background:transparent;border:1.5px solid #DDD;color:#555;margin-top:10px}
        .sec{font-family:'Playfair Display',serif;font-size:17px;color:#1a3622;margin-bottom:14px}
      `}</style>

      <div style={{ maxWidth:580, margin:"0 auto" }}>

        {/* ── Header ── */}
        <div style={{ textAlign:"center", padding:"6px 0 20px" }}>
          <div style={{ fontSize:42, lineHeight:1.1, marginBottom:6 }}>🌿</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:900, color:"#1a3622", letterSpacing:"-.5px" }}>
            Alergio <span style={{ fontStyle:"italic", fontWeight:400, fontSize:20, color:"#888" }}>SR</span>
          </h1>
          <p style={{ color:"#aaa", fontSize:12.5, marginTop:5 }}>
            Dáta: ÚVZ SR · pelovespravodajstvo.sk · týždeň 21–22/2026
          </p>
        </div>

        {/* ── SETUP ── */}
        {view === "setup" && (
          <div className="card up" style={{ padding:26, marginBottom:16 }}>
            <div style={{ marginBottom:20 }}>
              <span className="lbl">Mesto</span>
              <select value={city} onChange={e=>setCity(e.target.value)}>
                {CITIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:20 }}>
              <span className="lbl">Moje alergie</span>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {ALL_IDS.map(id => {
                  const d = POLLEN_DATA[id];
                  return (
                    <button key={id} className={`chip${chosen.includes(id)?" on":""}`} onClick={()=>toggle(id)}>
                      {d.emoji} {d.label.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom:26 }}>
              <span className="lbl">Citlivosť</span>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                {[["nízka","😌 Nízka"],["stredná","😐 Stredná"],["vysoká","😤 Vysoká"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setSens(v)} style={{
                    padding:"9px 4px", border:`1.5px solid ${sens===v?"#3A7D44":"#DDD"}`,
                    borderRadius:10, background:sens===v?"#EDFBEE":"#fff",
                    color:sens===v?"#2E6B3A":"#666",
                    fontFamily:"'DM Sans',sans-serif", fontSize:13, cursor:"pointer",
                    fontWeight:sens===v?600:400, transition:"all .15s",
                  }}>{l}</button>
                ))}
              </div>
            </div>

            <button className="btn green" disabled={!chosen.length} onClick={go}>
              🔍 Zobraziť predpoveď
            </button>

            <div style={{ marginTop:14, padding:"10px 12px", background:"#F0FDF4", borderRadius:10, fontSize:12, color:"#3A6B3A", lineHeight:1.5 }}>
              📡 Reálne dáta z ÚVZ SR (pelovespravodajstvo.sk) · Aktualizované 27.5.2026<br/>
              <span style={{ color:"#888" }}>Sezóna: borovica vrcholí · trávy nastupujú · ambrózia ešte nezačala</span>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {view === "result" && forecast && (
          <div className="up">

            {/* Risk header */}
            <div className="card" style={{
              padding:24, marginBottom:12,
              background:`linear-gradient(135deg,${rbg} 0%,#fff 70%)`,
              border:`2px solid ${rc}22`,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:11, color:"#bbb", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>
                    {today} · {city}
                  </div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#1a3622", marginBottom:3 }}>
                    Celkové riziko
                  </div>
                  <div style={{ fontSize:26, fontWeight:700, color:rc, marginBottom:10 }}>
                    {ri} {forecast.celkovyRiziko}
                  </div>
                  <Bar score={forecast.celkovySkore} color={rc} big />
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, color:"#aaa", marginBottom:4 }}>Sezóna</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#444" }}>Trávy 🌾 nastupujú</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#888", marginTop:2 }}>Borovica 🌲 klesá</div>
                </div>
              </div>
            </div>

            {/* Best/Worst */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
              {[
                ["✅","Najlepší čas","18:00–22:00","#DCFCE7","#166534"],
                ["⚠️","Najhorší čas","06:00–10:00","#FEE2E2","#991B1B"],
              ].map(([icon,lbl,val,bg,col])=>(
                <div key={lbl} className="card" style={{ padding:"14px 10px", textAlign:"center", background:bg, border:`1px solid ${col}20` }}>
                  <div style={{ fontSize:22 }}>{icon}</div>
                  <div style={{ fontSize:10, color:"#999", textTransform:"uppercase", letterSpacing:.7, margin:"5px 0 2px" }}>{lbl}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:14, color:col, fontWeight:700 }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Allergens */}
            <div className="card" style={{ padding:22, marginBottom:12 }}>
              <div className="sec">Tvoje alergény dnes</div>
              {forecast.allergens.map((a,i) => {
                const col = C[a.adjustedUroven]||"#888";
                const bg  = B[a.adjustedUroven]||"#f5f5f5";
                return (
                  <div key={i} style={{ background:bg, border:`1px solid ${col}30`, borderRadius:12, padding:"12px 14px", marginBottom:9 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                      <div style={{ fontWeight:600, fontSize:14, color:"#222", display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                        <span>{a.emoji} {a.label}</span>
                        {a.sezona && <Tag text="SEZÓNA" color="#fff" bg={col}/>}
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0, marginLeft:8 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:col }}>{a.adjustedUroven}</div>
                        <div style={{ fontSize:10, color:"#bbb", marginTop:1 }}>{a.trend}</div>
                      </div>
                    </div>
                    <Bar score={a.adjustedSkore} color={col}/>
                    {a.pelZrn && a.pelZrn !== "zatiaľ 0" && (
                      <div style={{ fontSize:11.5, color:"#888", marginTop:5 }}>📊 {a.pelZrn}</div>
                    )}
                    <div style={{ fontSize:12.5, color:"#555", marginTop:5, lineHeight:1.5 }}>{a.komentar}</div>
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            <div className="card" style={{ padding:22, marginBottom:12 }}>
              <div className="sec">Odporúčania na dnes</div>
              {forecast.varovanie && (
                <div style={{ background:"#FEF9C3", border:"1px solid #FDE047", borderRadius:10, padding:"10px 12px", marginBottom:12, fontSize:13, color:"#713F12", lineHeight:1.5 }}>
                  {forecast.varovanie}
                </div>
              )}
              {forecast.recs.map((r,i)=>(
                <div key={i} style={{ display:"flex", gap:10, marginBottom:9, alignItems:"flex-start" }}>
                  <div style={{ minWidth:22, height:22, background:"#DCFCE7", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#166534" }}>{i+1}</div>
                  <div style={{ fontSize:13.5, color:"#333", lineHeight:1.55, paddingTop:2 }}>{r}</div>
                </div>
              ))}
            </div>

            {/* 3-day outlook */}
            <div className="card" style={{ padding:22, marginBottom:12 }}>
              <div className="sec">Výhľad 3 dni</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:9 }}>
                {forecast.dayOutlooks.map((d,i)=>{
                  const dc = C[d.riziko]||"#888", db = B[d.riziko]||"#f5f5f5";
                  return (
                    <div key={i} style={{ background:db, borderRadius:12, padding:"12px 8px", textAlign:"center", border:`1px solid ${dc}22` }}>
                      <div style={{ fontSize:10.5, color:"#aaa", textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>{d.den}</div>
                      <Bar score={d.skore} color={dc}/>
                      <div style={{ fontSize:12, fontWeight:700, color:dc, marginTop:5 }}>{d.riziko}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:12, fontSize:12, color:"#888", lineHeight:1.5 }}>
                📈 Trávy budú <strong>dominantným alergénom najbližšie 2 mesiace</strong> (jún–júl). Borovica postupne dokvitá.
              </div>
            </div>

            {/* Tip */}
            <div className="card" style={{ padding:18, marginBottom:12, background:"linear-gradient(135deg,#F5F3FF,#EDE9FE)" }}>
              <div style={{ fontSize:13, color:"#5B21B6", lineHeight:1.5 }}>
                💡 <strong>Vedeli ste?</strong> Peľová sezóna tráv je pre alergikov najnáročnejšia — trávy produkujú obrovské množstvo ľahkého peľu, ktorý sa šíri do vzdialenosti až 400 km.
              </div>
            </div>

            {/* Source */}
            <div style={{ padding:"10px 14px", background:"rgba(255,255,255,.65)", borderRadius:10, marginBottom:12, fontSize:12, color:"#aaa", textAlign:"center", lineHeight:1.6 }}>
              📡 Zdroj: pelovespravodajstvo.sk · ÚVZ SR · týždeň 21–22/2026<br/>
              Stanice: RÚVZ BB, NR, TT, ZA · ÚVZ SR BA
            </div>

            <button className="btn green" onClick={()=>setView("setup")}>⚙️ Zmeniť nastavenia</button>
          </div>
        )}

      </div>
    </div>
  );
}