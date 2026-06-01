import { useState } from "react";

/* ══════════════════════════════════════════════════════════════
   DÁTA — ÚVZ SR / pelovespravodajstvo.sk
   21. týždeň 2026 · aktualizované 27.5.2026
   ══════════════════════════════════════════════════════════════ */
const POLLEN_DATA = {
  borovica: { label: "Borovica / Ihličnany", short: "Borovica", emoji: "🌲", uroven: "Veľmi vysoká", skore: 5, sezona: true, pelZrn: "2 373 zŕn/m³ (Žilina) · 656 zŕn/m³ (Nitra)", trend: "↘ klesá", komentar: "Dominantný alergén týždňa — viditeľné žlté povlaky na autách a terasách. Ihličnany dokvitajú.", outlook: [4,3,2] },
  travy:    { label: "Trávy (lipnicovité)",  short: "Trávy",    emoji: "🌾", uroven: "Vysoká",      skore: 4, sezona: true, pelZrn: "rastúce koncentrácie", trend: "↗ rastie", komentar: "Sezóna práve začína — trávy sa stanú dominantným alergénom na najbližšie 2 mesiace.", outlook: [5,5,5] },
  breza:    { label: "Breza",                short: "Breza",    emoji: "🌳", uroven: "Nízka",        skore: 2, sezona: false, pelZrn: "nízke koncentrácie", trend: "↘ klesá", komentar: "Sezóna brezy sa končí, koncentrácie sú nízke.", outlook: [1,1,1] },
  lieska:   { label: "Lieska",               short: "Lieska",   emoji: "🌰", uroven: "Veľmi nízka", skore: 1, sezona: false, pelZrn: "stopové množstvá", trend: "— ukončená", komentar: "Sezóna liesky je dávno ukončená.", outlook: [1,1,1] },
  ambrozia: { label: "Ambrózia",             short: "Ambrózia", emoji: "🌿", uroven: "Veľmi nízka", skore: 1, sezona: false, pelZrn: "zatiaľ 0", trend: "— nezačala", komentar: "Ambrózia začína až v júli–auguste. Zatiaľ nie je v ovzduší.", outlook: [1,1,1] },
  byliny:   { label: "Byliny (štiav, skorocel)", short: "Byliny", emoji: "🌱", uroven: "Stredná",  skore: 3, sezona: true, pelZrn: "nízke až stredné", trend: "↗ rastie", komentar: "Pŕhľavovité, štiav a skorocel dosahujú stredné hodnoty — na celom území SR stúpajú.", outlook: [3,4,4] },
  huby:     { label: "Spóry húb (Cladospórium)", short: "Spóry húb", emoji: "🍄", uroven: "Vysoká", skore: 4, sezona: true, pelZrn: "vysoké hodnoty", trend: "↗ rastie", komentar: "Spóry plesní Cladospórium a Alternária dosahujú vysoké hodnoty po nedávnom oteplení.", outlook: [4,4,3] },
};

/* ── Peľový kalendár ── */
const CALENDAR = [
  {
    id: "lieska", emoji: "🌰", label: "Lieska", kategoria: "Stromy",
    mesiace: [1,1,1,0,0,0,0,0,0,0,0,0],
    peak: "Február",
    intenzita: 3,
    farba: "#f59e0b",
    popis: "Lieska je jednou z prvých rastlín, ktoré začínajú prášiť peľom — niekedy už v januári pri miernejšom počasí. Produkuje veľké množstvo ľahkého, vietor-prenášaného peľu.",
    alergennost: "Stredná",
    krizeReakcie: "Breza, jelša, lieskovec",
    oblast: "Celé Slovensko",
    znaky: ["Bolesť hlavy", "Výtok z nosa", "Svrbenie očí"],
  },
  {
    id: "jelsa", emoji: "🌿", label: "Jelša", kategoria: "Stromy",
    mesiace: [0,1,1,1,0,0,0,0,0,0,0,0],
    peak: "Február–Marec",
    intenzita: 3,
    farba: "#10b981",
    popis: "Jelša kvitne skoro na jar, často spoločne s lieskou. Rastie najmä pozdĺž vodných tokov a vlhkých biotopov. Peľ sa šíri vetrom na veľké vzdialenosti.",
    alergennost: "Stredná",
    krizeReakcie: "Lieska, breza",
    oblast: "Pozdĺž riek a potokov",
    znaky: ["Nádcha", "Kýchanie", "Opuch slizníc"],
  },
  {
    id: "breza", emoji: "🌳", label: "Breza", kategoria: "Stromy",
    mesiace: [0,0,1,1,1,0,0,0,0,0,0,0],
    peak: "Apríl",
    intenzita: 5,
    farba: "#8d6e63",
    popis: "Breza je jeden z najsilnejších alergénov strednej Európy. Jeden strom môže produkovať až 5 miliónov peľových zŕn denne. Peľ sa šíri až do 500 km.",
    alergennost: "Veľmi vysoká",
    krizeReakcie: "Jablká, hrušky, mrkva, zeler, lieskovce",
    oblast: "Celé Slovensko, najmä nižšie polohy",
    znaky: ["Silná nádcha", "Svrbenie očí", "Astmatické záchvaty", "Opuch hrdla"],
  },
  {
    id: "jasen", emoji: "🌲", label: "Jaseň / Dub", kategoria: "Stromy",
    mesiace: [0,0,1,1,0,0,0,0,0,0,0,0],
    peak: "Apríl",
    intenzita: 3,
    farba: "#6b7280",
    popis: "Jaseň a dub kvitú súčasne s brezou a zosilňujú alergickú záťaž. Dub produkuje veľké množstvo peľu, no jeho alergennosť je nižšia ako u brezy.",
    alergennost: "Stredná",
    krizeReakcie: "Breza, lieska",
    oblast: "Listnaté lesy, parky",
    znaky: ["Nádcha", "Kýchanie", "Svrbenie"],
  },
  {
    id: "borovica", emoji: "🌲", label: "Borovica / Ihličnany", kategoria: "Stromy",
    mesiace: [0,0,0,0,1,1,0,0,0,0,0,0],
    peak: "Máj–Jún",
    intenzita: 4,
    farba: "#2e7d32",
    popis: "Borovicové peľ vytvára charakteristické žlté povlaky na autách, parapetoch a terasách. Napriek obrovskému množstvu je jeho alergennosť relatívne nízka — väčšina ľudí reaguje len pri extrémnych koncentráciách.",
    alergennost: "Nízka až stredná",
    krizeReakcie: "Ostatné ihličnany",
    oblast: "Horské oblasti, lesy",
    znaky: ["Podráždenie dýchacích ciest", "Výtok z nosa"],
  },
  {
    id: "travy", emoji: "🌾", label: "Trávy (lipnicovité)", kategoria: "Byliny a trávy",
    mesiace: [0,0,0,0,1,1,1,1,0,0,0,0],
    peak: "Jún–Júl",
    intenzita: 5,
    farba: "#16a34a",
    popis: "Trávy sú najvýznamnejším alergénom leta. Sezóna trvá až 4 mesiace. Peľ lipnicovitých tráv (timotejka, kostrava, medzi inými) je zodpovedný za väčšinu letných alergií v SR.",
    alergennost: "Veľmi vysoká",
    krizeReakcie: "Múka, pšenica, raž (u niektorých)",
    oblast: "Lúky, záhrady, trávniky, poľné cesty",
    znaky: ["Silná nádcha", "Svrbenie a slzenie očí", "Dýchavičnosť", "Kožné reakcie"],
  },
  {
    id: "lipa", emoji: "🌸", label: "Lipa", kategoria: "Stromy",
    mesiace: [0,0,0,0,0,1,1,0,0,0,0,0],
    peak: "Jún–Júl",
    intenzita: 2,
    farba: "#eab308",
    popis: "Lipa kvitne v lete a jej peľ je relatívne ťažší — nešíri sa na dlhé vzdialenosti. Alergické reakcie sú menej časté, no u citlivých jedincov môžu byť silné.",
    alergennost: "Nízka",
    krizeReakcie: "Zriedkavé",
    oblast: "Mestské aleje, parky",
    znaky: ["Mierna nádcha", "Svrbenie"],
  },
  {
    id: "byliny", emoji: "🌱", label: "Byliny (štiav, skorocel)", kategoria: "Byliny a trávy",
    mesiace: [0,0,0,0,1,1,1,1,1,0,0,0],
    peak: "Jún–August",
    intenzita: 3,
    farba: "#65a30d",
    popis: "Pŕhľavovité, štiav, skorocel a mrkvovité tvoria skupinu letných bylín. Ich sezóna sa prelína s trávami a predlžuje alergickú záťaž až do jesene.",
    alergennost: "Stredná",
    krizeReakcie: "Ambrózia (krížová reakcia možná)",
    oblast: "Lúky, okraje ciest, záhrady",
    znaky: ["Nádcha", "Kýchanie", "Svrbenie očí"],
  },
  {
    id: "ambrozia", emoji: "🌿", label: "Ambrózia", kategoria: "Byliny a trávy",
    mesiace: [0,0,0,0,0,0,1,1,1,1,0,0],
    peak: "August–September",
    intenzita: 5,
    farba: "#dc2626",
    popis: "Ambrózia je invázna rastlina pôvodom zo Severnej Ameriky — dnes jeden z najnebezpečnejších alergénov v strednej Európe. Jeden kvet produkuje až miliardu peľových zŕn. Sezóna trvá až do prvých mrazov.",
    alergennost: "Extrémna",
    krizeReakcie: "Melón, uhorka, banán, kamilka",
    oblast: "Južné Slovensko, úhory, okraje ciest",
    znaky: ["Veľmi silná nádcha", "Opuch očných viečok", "Astma", "Ekzém"],
  },
  {
    id: "huby", emoji: "🍄", label: "Spóry húb", kategoria: "Spóry",
    mesiace: [0,0,0,1,1,1,1,1,1,1,0,0],
    peak: "Júl–September",
    intenzita: 4,
    farba: "#7c3aed",
    popis: "Spóry plesní Cladospórium a Alternária sa šíria vzduchom celú vegetačnú sezónu. Na rozdiel od peľu nemajú pevnú sezónu — stúpajú po daždi a teplom. Môžu byť prítomné aj v interiéri.",
    alergennost: "Vysoká",
    krizeReakcie: "Plesnivé potraviny, syr",
    oblast: "Celé Slovensko, vlhké prostredia",
    znaky: ["Astma", "Alergická nádcha", "Ekzém", "Podráždenie dýchacích ciest"],
  },
];

const MESIACE = ["Jan","Feb","Mar","Apr","Máj","Jún","Júl","Aug","Sep","Okt","Nov","Dec"];
const KATEGORIE = ["Stromy","Byliny a trávy","Spóry"];

const CITIES = ["Bratislava","Košice","Prešov","Žilina","Banská Bystrica","Nitra","Trnava","Trenčín"];
const CITY_MOD = { "Žilina":{"borovica":1.3,"travy":1.1}, "Nitra":{"borovica":1.1,"travy":1.2,"byliny":1.2}, "Banská Bystrica":{"borovica":1.2}, "Bratislava":{"travy":1.1,"huby":1.1}, "Trnava":{"travy":1.15} };
const SENS_MULT = { "nízka":0.8, "stredná":1.0, "vysoká":1.25 };
const S2L = ["","Veľmi nízka","Nízka","Stredná","Vysoká","Veľmi vysoká"];
const DAYS = ["Zajtra","Pozajtra","Za 3 dni"];
const COL = { "Veľmi nízka":"#16a34a","Nízka":"#65a30d","Stredná":"#ca8a04","Vysoká":"#ea580c","Veľmi vysoká":"#dc2626" };
const BG  = { "Veľmi nízka":"#f0fdf4","Nízka":"#f7fee7","Stredná":"#fefce8","Vysoká":"#fff7ed","Veľmi vysoká":"#fef2f2" };

function calcForecast(city, ids, sens) {
  const cm = CITY_MOD[city] || {};
  const sm = SENS_MULT[sens] || 1;
  const allergens = ids.map(id => {
    const b = POLLEN_DATA[id]; if (!b) return null;
    const cf = cm[id] || 1;
    const s = Math.min(5, Math.round(b.skore * cf * sm));
    return { ...b, id, s, uroven: S2L[s] || b.uroven, outlook: b.outlook.map(o => Math.min(5, Math.round(o * cf * sm))) };
  }).filter(Boolean).sort((a,b) => b.s - a.s);
  const max = allergens.reduce((m,a) => Math.max(m,a.s), 0);
  const avg = Math.round(allergens.reduce((t,a) => t+a.s, 0) / Math.max(allergens.length,1));
  const total = Math.max(max, avg);
  const days = DAYS.map((den,i) => { const m = Math.max(...allergens.map(a=>a.outlook[i]||1)); return {den,s:m,riziko:S2L[m]}; });
  let warn = null;
  if (sens==="vysoká" && total>=4) warn = "Vysoká citlivosť + vysoký peľ: majte po ruke záchranné lieky a zvážte obmedzenie pobytu vonku.";
  else if (total===5) warn = "Extrémne vysoké koncentrácie — zvážte obmedzenie pobytu vonku na minimum.";
  const recs = buildRecs(ids, sens, max);
  return { allergens, total, riziko: S2L[total], days, warn, recs };
}

function buildRecs(ids, sens, max) {
  const r = [];
  const hasTravy = ids.includes("travy") && POLLEN_DATA.travy.skore >= 3;
  const hasBor = ids.includes("borovica") && POLLEN_DATA.borovica.skore >= 4;
  if (max >= 4) r.push("Zostaňte vnútri počas ranných hodín (6:00–10:00) — koncentrácie peľu sú vtedy najvyššie.");
  if (max >= 4) r.push("Zatvorte okná v noci a ráno. Používajte klimatizáciu s peľovým filtrom.");
  if (sens==="vysoká" && max>=3) r.push("Poraďte sa s lekárom o úprave antihistaminickej liečby — sezóna vrcholí.");
  if (hasTravy) r.push("Vyhýbajte sa trávnatým plochám a parkom. Po príchode domov sa osprchujte a prezlečte.");
  if (hasBor) r.push("Po daždi môže dôjsť k náhlemu uvoľneniu peľu borovíc — vyčkajte hodinu vo vnútri.");
  if (ids.includes("huby") && POLLEN_DATA.huby.skore >= 3) r.push("Spóry húb sú vysoké — vyhýbajte sa vlhkým miestam, kompostom a listovej pôde.");
  if (r.length < 3) r.push("Najlepší čas na vonkajšie aktivity je podvečer (18:00–21:00), keď koncentrácie klesajú.");
  if (r.length < 4) r.push("Noste wrap-around slnečné okuliare vonku — zredukujú kontakt peľu s očami až o 30 %.");
  return r.slice(0,5);
}

function Dots({ score, color }) {
  return (
    <div style={{ display:"flex", gap:4 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width:8, height:8, borderRadius:"50%", background: i<=score ? color : "#E5E7EB" }}/>
      ))}
    </div>
  );
}

/* ══ ALMANACH PAGE ══ */
function AlmanachPage() {
  const [selected, setSelected] = useState(null);
  const currentMonth = new Date().getMonth(); // 0-indexed

  return (
    <div style={{ padding:"32px 36px" }}>
      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:13, color:"#9CA3AF", marginBottom:4 }}>Peľový sprievodca</div>
        <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", letterSpacing:"-.3px", marginBottom:8 }}>
          Peľový kalendár Slovenska
        </h1>
        <p style={{ fontSize:14, color:"#6B7280", maxWidth:640, lineHeight:1.6 }}>
          Prehľad všetkých alergénov, ich sezóny kvitnutia a charakteristík. Aktuálny mesiac je zvýraznený.
        </p>
      </div>

      {/* Timeline table */}
      <div style={{ background:"#fff", border:"1px solid #EAECF0", borderRadius:14, marginBottom:28, overflow:"hidden" }}>
        {/* Month header */}
        <div style={{ display:"grid", gridTemplateColumns:"220px repeat(12,1fr)", borderBottom:"1px solid #EAECF0" }}>
          <div style={{ padding:"10px 16px", fontSize:11, fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8 }}>
            Alergén
          </div>
          {MESIACE.map((m,i) => (
            <div key={i} style={{
              padding:"10px 4px", textAlign:"center", fontSize:11, fontWeight:600,
              color: i===currentMonth ? "#166534" : "#9CA3AF",
              background: i===currentMonth ? "#F0FDF4" : "transparent",
              letterSpacing:.5,
            }}>{m}</div>
          ))}
        </div>

        {/* Category groups */}
        {KATEGORIE.map(kat => (
          <div key={kat}>
            {/* Category label */}
            <div style={{ display:"grid", gridTemplateColumns:"220px repeat(12,1fr)", background:"#F9FAFB", borderBottom:"1px solid #EAECF0", borderTop:"1px solid #EAECF0" }}>
              <div style={{ padding:"6px 16px", fontSize:11, fontWeight:700, color:"#6B7280", textTransform:"uppercase", letterSpacing:1 }}>
                {kat}
              </div>
              {MESIACE.map((_,i) => (
                <div key={i} style={{ background: i===currentMonth ? "#F0FDF4" : "transparent" }}/>
              ))}
            </div>

            {/* Rows */}
            {CALENDAR.filter(p=>p.kategoria===kat).map(p => {
              const isOpen = selected?.id===p.id;
              return (
                <div key={p.id}>
                  {/* Main row */}
                  <div
                    onClick={() => setSelected(isOpen ? null : p)}
                    style={{ display:"grid", gridTemplateColumns:"220px repeat(12,1fr)", borderBottom: isOpen ? "none" : "1px solid #F3F4F6", cursor:"pointer", transition:"background .15s",
                      background: isOpen ? `${p.farba}10` : "transparent" }}
                    onMouseEnter={e=>{ if(!isOpen) e.currentTarget.style.background="#F9FAFB"; }}
                    onMouseLeave={e=>{ if(!isOpen) e.currentTarget.style.background="transparent"; }}>

                    {/* Name */}
                    <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:18 }}>{p.emoji}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{p.label}</div>
                        <div style={{ fontSize:11, color:"#9CA3AF", marginTop:1 }}>
                          {[0,1,2,3,4].map(i => (
                            <span key={i} style={{ color: i<p.intenzita ? p.farba : "#E5E7EB", marginRight:2, fontSize:8 }}>●</span>
                          ))}
                          <span style={{ marginLeft:4 }}>
                            {p.intenzita<=2?"Nízka":p.intenzita===3?"Stredná":p.intenzita===4?"Vysoká":"Veľmi vysoká"}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize:12, color: isOpen ? p.farba : "#D1D5DB", marginRight:8, transition:"transform .2s", display:"inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                    </div>

                    {/* Month bars */}
                    {p.mesiace.map((active,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"12px 3px", background: i===currentMonth ? "#F0FDF4" : "transparent" }}>
                        {active ? (
                          <div style={{ width:"100%", height:10, borderRadius:5, background:p.farba, opacity:p.intenzita/5, minWidth:8 }}/>
                        ) : (
                          <div style={{ width:"100%", height:2, background:"#F3F4F6", borderRadius:1 }}/>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Inline detail — expands below the row */}
                  {isOpen && (
                    <div style={{
                      borderBottom:"1px solid #F3F4F6",
                      background:`${p.farba}06`,
                      borderLeft:`3px solid ${p.farba}`,
                      padding:"20px 24px",
                      animation:"fadeUp .2s ease both",
                    }}>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:24 }}>
                        {/* Popis */}
                        <div>
                          <div style={{ fontSize:12, fontWeight:600, color:p.farba, textTransform:"uppercase", letterSpacing:.8, marginBottom:6 }}>O alergéne</div>
                          <p style={{ fontSize:13, color:"#374151", lineHeight:1.7, marginBottom:10 }}>{p.popis}</p>
                          <div style={{ display:"flex", gap:16 }}>
                            <div>
                              <div style={{ fontSize:10, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5, marginBottom:2 }}>Sezóna vrcholí</div>
                              <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{p.peak}</div>
                            </div>
                            <div>
                              <div style={{ fontSize:10, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5, marginBottom:2 }}>Výskyt</div>
                              <div style={{ fontSize:13, color:"#374151" }}>{p.oblast}</div>
                            </div>
                            <div>
                              <div style={{ fontSize:10, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5, marginBottom:2 }}>Alergennosť</div>
                              <div style={{ fontSize:13, fontWeight:600, color:p.farba }}>{p.alergennost}</div>
                            </div>
                          </div>
                        </div>
                        {/* Príznaky */}
                        <div>
                          <div style={{ fontSize:12, fontWeight:600, color:p.farba, textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Príznaky</div>
                          {p.znaky.map((z,i) => (
                            <div key={i} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                              <div style={{ width:5, height:5, borderRadius:"50%", background:p.farba, flexShrink:0 }}/>
                              <span style={{ fontSize:12.5, color:"#374151" }}>{z}</span>
                            </div>
                          ))}
                        </div>
                        {/* Krížové reakcie */}
                        <div>
                          <div style={{ fontSize:12, fontWeight:600, color:p.farba, textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Krížové reakcie</div>
                          <div style={{ fontSize:12.5, color: p.krizeReakcie==="Zriedkavé" ? "#9CA3AF" : "#374151", lineHeight:1.6 }}>{p.krizeReakcie}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display:"flex", alignItems:"center", gap:24, padding:"16px 20px", background:"#F9FAFB", borderRadius:10, fontSize:12, color:"#6B7280" }}>
        <span style={{ fontWeight:600, color:"#374151" }}>Legenda:</span>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:32, height:10, borderRadius:5, background:"#16a34a", opacity:.9 }}/>
          <span>Aktívna sezóna</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:32, height:2, background:"#E5E7EB", borderRadius:1 }}/>
          <span>Mimo sezóny</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:12, height:12, background:"#F0FDF4", border:"1px solid #86efac", borderRadius:3 }}/>
          <span>Aktuálny mesiac</span>
        </div>
        <span style={{ marginLeft:"auto", color:"#9CA3AF" }}>Klikni na riadok ▼ pre rozbalenie detailu · Zdroj: ÚVZ SR</span>
      </div>
    </div>
  );
}

/* ══ FORECAST PAGE ══ */
function ForecastPage({ city, chosen, sens, forecast, setForecast }) {
  const today = new Date().toLocaleDateString("sk-SK",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  const rc  = forecast ? (COL[forecast.riziko]||"#888") : "#3A7D44";
  const rbg = forecast ? (BG[forecast.riziko]||"#f9fafb") : "#f9fafb";

  return (
    <div style={{ flex:1, padding:"32px 36px", overflowY:"auto" }}>
      {!forecast && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"70vh", gap:16, opacity:.5 }}>
          <div style={{ fontSize:56 }}>🌿</div>
          <div style={{ fontSize:16, fontWeight:500, color:"#6B7280" }}>Nastav profil a zobraz predpoveď</div>
          <div style={{ fontSize:13, color:"#9CA3AF" }}>Vyber mesto, alergie a citlivosť v ľavom paneli</div>
        </div>
      )}
      {forecast && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
            <div>
              <div style={{ fontSize:13, color:"#9CA3AF", marginBottom:2 }}>{today}</div>
              <h1 style={{ fontSize:22, fontWeight:700, color:"#111827", letterSpacing:"-.3px" }}>Peľová situácia · {city}</h1>
            </div>
            <button onClick={()=>setForecast(calcForecast(city,chosen,sens))} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", background:"#fff", border:"1.5px solid #E5E7EB", borderRadius:8, fontSize:13, fontWeight:500, color:"#374151", cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#3A7D44"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#E5E7EB"}>
              ↺ Obnoviť
            </button>
          </div>

          <div className="top-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
            <div className="card" style={{ padding:24, background:`linear-gradient(135deg,${rbg},#fff)`, border:`1px solid ${rc}20` }}>
              <div className="lbl">Celkové riziko</div>
              <div style={{ fontSize:32, fontWeight:700, color:rc, letterSpacing:"-1px", marginBottom:12 }}>{forecast.riziko}</div>
              <Dots score={forecast.total} color={rc}/>
              {forecast.warn && (
                <div style={{ marginTop:12, padding:"8px 10px", background:`${rc}12`, borderRadius:8, fontSize:12, color:rc, lineHeight:1.5 }}>{forecast.warn}</div>
              )}
            </div>
            <div className="card" style={{ padding:24 }}>
              <div className="lbl">Čas vonku</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:4 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:32, height:32, background:"#ECFDF5", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✅</div>
                  <div>
                    <div style={{ fontSize:11, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5 }}>Najlepší čas</div>
                    <div style={{ fontSize:16, fontWeight:700, color:"#166534" }}>18:00–22:00</div>
                  </div>
                </div>
                <div style={{ height:1, background:"#F3F4F6" }}/>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:32, height:32, background:"#FEF2F2", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⚠️</div>
                  <div>
                    <div style={{ fontSize:11, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.5 }}>Najhorší čas</div>
                    <div style={{ fontSize:16, fontWeight:700, color:"#DC2626" }}>06:00–10:00</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card" style={{ padding:24 }}>
              <div className="lbl">Výhľad 3 dni</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:4 }}>
                {forecast.days.map((d,i) => {
                  const dc = COL[d.riziko]||"#888";
                  return (
                    <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <span style={{ fontSize:13, color:"#6B7280", fontWeight:500, width:72 }}>{d.den}</span>
                      <div style={{ flex:1, margin:"0 12px" }}>
                        <div style={{ height:4, borderRadius:2, background:"#F3F4F6", overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${(d.s/5)*100}%`, background:dc, borderRadius:2 }}/>
                        </div>
                      </div>
                      <span style={{ fontSize:12, fontWeight:600, color:dc, width:82, textAlign:"right" }}>{d.riziko}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="main-grid" style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:16, marginBottom:16 }}>
            <div className="card" style={{ padding:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div className="lbl" style={{ marginBottom:0 }}>Tvoje alergény dnes</div>
                <div style={{ fontSize:11, color:"#9CA3AF" }}>týždeň 21–22/2026</div>
              </div>
              {forecast.allergens.map((a,i) => {
                const col = COL[a.uroven]||"#888";
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom: i<forecast.allergens.length-1?"1px solid #F3F4F6":"none" }}>
                    <div style={{ fontSize:20, width:28, textAlign:"center", flexShrink:0 }}>{a.emoji}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                        <span style={{ fontSize:14, fontWeight:600, color:"#111827" }}>{a.label}</span>
                        {a.sezona && <span style={{ fontSize:10, fontWeight:600, color:col, background:`${col}18`, padding:"1px 6px", borderRadius:20 }}>SEZÓNA</span>}
                      </div>
                      <div style={{ fontSize:12, color:"#6B7280", marginBottom:6 }}>{a.komentar}</div>
                      <Dots score={a.s} color={col}/>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:col }}>{a.uroven}</div>
                      <div style={{ fontSize:11, color:"#9CA3AF", marginTop:2 }}>{a.trend}</div>
                      {a.pelZrn && a.pelZrn!=="zatiaľ 0" && <div style={{ fontSize:10, color:"#D1D5DB", marginTop:2 }}>{a.pelZrn}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="card" style={{ padding:24 }}>
              <div className="lbl" style={{ marginBottom:16 }}>Odporúčania na dnes</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {forecast.recs.map((r,i) => (
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div style={{ width:22, height:22, minWidth:22, background:"#F0FDF4", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#166534", marginTop:1 }}>{i+1}</div>
                    <div style={{ fontSize:13.5, color:"#374151", lineHeight:1.6 }}>{r}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:20, padding:"12px 14px", background:"#F8F7FF", borderRadius:10, borderLeft:"3px solid #8B5CF6" }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#7C3AED", marginBottom:3, textTransform:"uppercase", letterSpacing:.5 }}>Vedeli ste?</div>
                <div style={{ fontSize:12.5, color:"#5B21B6", lineHeight:1.5 }}>Peľová sezóna tráv je pre alergikov najnáročnejšia — trávy produkujú obrovské množstvo ľahkého peľu, ktorý sa šíri do vzdialenosti až 400 km.</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding:24 }}>
            <div className="lbl" style={{ marginBottom:16 }}>Prehľad sezóny — všetky alergény</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8 }}>
              {Object.entries(POLLEN_DATA).map(([id,d]) => {
                const col = COL[d.uroven]||"#888";
                const bg  = BG[d.uroven]||"#f9fafb";
                return (
                  <div key={id} style={{ background:bg, border:`1px solid ${col}22`, borderRadius:10, padding:"12px 8px", textAlign:"center" }}>
                    <div style={{ fontSize:20, marginBottom:6 }}>{d.emoji}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:"#374151", marginBottom:4, lineHeight:1.3 }}>{d.short}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:col }}>{d.uroven}</div>
                    <div style={{ fontSize:10, color:"#9CA3AF", marginTop:2 }}>{d.trend}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:11, color:"#D1D5DB" }}>Zdroj: pelovespravodajstvo.sk · ÚVZ SR · Stanice: RÚVZ BB, NR, KE, TT, ZA · ÚVZ SR BA</div>
            <button onClick={()=>setForecast(null)} style={{ fontSize:12, color:"#9CA3AF", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>Resetovať</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ SIDEBAR (shared) ══ */
function Sidebar({ page, setPage, city, setCity, chosen, toggle, sens, setSens, go }) {
  return (
    <aside style={{ width:280, minWidth:280, background:"#fff", borderRight:"1px solid #EAECF0", height:"100vh", position:"sticky", top:0, overflowY:"auto", display:"flex", flexDirection:"column" }}>
      {/* Logo */}
      <div style={{ padding:"24px 20px 16px", borderBottom:"1px solid #EAECF0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
          <span style={{ fontSize:20 }}>🌿</span>
          <span style={{ fontSize:19, fontWeight:700, color:"#1a3622", letterSpacing:"-.3px" }}>Alergio</span>
        </div>
        <div style={{ fontSize:11.5, color:"#9CA3AF" }}>Peľová predpoveď pre Slovensko</div>
      </div>

      {/* Nav */}
      <div style={{ padding:"12px 12px 0" }}>
        {[
          { id:"forecast", label:"Dnešná predpoveď", icon:"📊" },
          { id:"almanach", label:"Peľový kalendár", icon:"📅" },
        ].map(n => (
          <button key={n.id} onClick={()=>setPage(n.id)} style={{
            width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
            border:"none", borderRadius:8, cursor:"pointer", textAlign:"left", marginBottom:2,
            background: page===n.id ? "#ECFDF5" : "transparent",
            color: page===n.id ? "#166534" : "#6B7280",
            fontFamily:"'Inter',sans-serif", fontSize:13.5, fontWeight: page===n.id ? 600 : 400,
            transition:"all .15s",
          }}>
            <span style={{ fontSize:16 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>

      {/* Settings (only for forecast) */}
      {page === "forecast" && (
        <div style={{ padding:"16px 20px", flex:1 }}>
          <div style={{ height:1, background:"#F3F4F6", marginBottom:16 }}/>
          <div style={{ marginBottom:18 }}>
            <span style={{ fontSize:11, fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, display:"block", marginBottom:7 }}>Mesto</span>
            <select style={{ width:"100%", padding:"8px 12px", border:"1.5px solid #E5E7EB", borderRadius:9, fontSize:13.5, fontFamily:"'Inter',sans-serif", color:"#374151", background:"#fff", outline:"none", appearance:"none", WebkitAppearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center", paddingRight:28 }} value={city} onChange={e=>setCity(e.target.value)}>
              {CITIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:18 }}>
            <span style={{ fontSize:11, fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, display:"block", marginBottom:7 }}>Moje alergie</span>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {Object.entries(POLLEN_DATA).map(([id,d]) => (
                <button key={id} onClick={()=>toggle(id)} style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"5px 10px", border:`1.5px solid ${chosen.includes(id)?"#3A7D44":"#E5E7EB"}`, borderRadius:100, fontSize:12, fontWeight: chosen.includes(id)?600:400, color: chosen.includes(id)?"#166534":"#6B7280", cursor:"pointer", background: chosen.includes(id)?"#ECFDF5":"#fff", transition:"all .15s" }}>
                  {d.emoji} {d.short}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:20 }}>
            <span style={{ fontSize:11, fontWeight:600, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:.8, display:"block", marginBottom:7 }}>Citlivosť</span>
            <div style={{ display:"flex", gap:5 }}>
              {[["nízka","Nízka"],["stredná","Stredná"],["vysoká","Vysoká"]].map(([v,l])=>(
                <button key={v} onClick={()=>setSens(v)} style={{ flex:1, padding:"7px 4px", border:`1.5px solid ${sens===v?"#3A7D44":"#E5E7EB"}`, borderRadius:7, fontSize:12, fontWeight: sens===v?600:400, fontFamily:"'Inter',sans-serif", cursor:"pointer", background: sens===v?"#ECFDF5":"#fff", color: sens===v?"#166534":"#6B7280", transition:"all .15s" }}>{l}</button>
              ))}
            </div>
          </div>
          <button disabled={!chosen.length} onClick={go} style={{ width:"100%", padding:"11px", background:"#1a3622", color:"#fff", border:"none", borderRadius:9, fontSize:13.5, fontWeight:600, fontFamily:"'Inter',sans-serif", cursor:"pointer", opacity: chosen.length?1:.4, transition:"all .15s" }}>
            Zobraziť predpoveď
          </button>
        </div>
      )}

      {page === "almanach" && (
        <div style={{ padding:"16px 20px", flex:1 }}>
          <div style={{ height:1, background:"#F3F4F6", marginBottom:16 }}/>
          <div style={{ fontSize:12.5, color:"#6B7280", lineHeight:1.7 }}>
            Prehľad sezón kvitnutia všetkých alergénov na Slovensku.<br/><br/>
            Klikni na riadok pre rozbalenie detailu.
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding:"14px 20px", borderTop:"1px solid #EAECF0" }}>
        <div style={{ fontSize:11, color:"#D1D5DB", lineHeight:1.6 }}>
          Dáta: ÚVZ SR · pelovespravodajstvo.sk<br/>
          21. týždeň 2026 · 27.5.2026
        </div>
      </div>
    </aside>
  );
}

/* ══ ROOT APP ══ */
export default function App() {
  const [page,    setPage]    = useState("forecast");
  const [city,    setCity]    = useState("Bratislava");
  const [chosen,  setChosen]  = useState(["travy","borovica"]);
  const [sens,    setSens]    = useState("stredná");
  const [forecast,setForecast]= useState(null);

  const toggle = id => setChosen(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const go = () => { if (chosen.length) setForecast(calcForecast(city, chosen, sens)); };

  return (
    <div style={{ minHeight:"100vh", background:"#F8FAF8", fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:#D1D5DB; border-radius:2px; }
        .card { background:#fff; border-radius:14px; border:1px solid #EAECF0; }
        .lbl { font-size:11px; font-weight:600; color:#9CA3AF; text-transform:uppercase; letter-spacing:.8px; display:block; margin-bottom:8px; }
        @media (max-width:768px) { .layout { flex-direction:column !important; } .sidebar-el { width:100% !important; min-width:unset !important; height:auto !important; position:static !important; border-right:none !important; border-bottom:1px solid #EAECF0; } .top-grid { grid-template-columns:1fr !important; } .main-grid { grid-template-columns:1fr !important; } }
      `}</style>
      <div className="layout" style={{ display:"flex", maxWidth:1440, margin:"0 auto", minHeight:"100vh" }}>
        <div className="sidebar-el">
          <Sidebar page={page} setPage={setPage} city={city} setCity={setCity} chosen={chosen} toggle={toggle} sens={sens} setSens={setSens} go={go}/>
        </div>
        <main style={{ flex:1, overflowY:"auto" }}>
          {page === "forecast" && <ForecastPage city={city} chosen={chosen} sens={sens} forecast={forecast} setForecast={setForecast}/>}
          {page === "almanach" && <AlmanachPage/>}
        </main>
      </div>
    </div>
  );
}