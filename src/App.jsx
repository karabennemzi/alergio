import { useState, useEffect, useRef } from "react";

/* ══ THEME TOKENS ══════════════════════════════════════════════ */
const LIGHT = {
  bg:           "#F8FAF8",
  card:         "#ffffff",
  cardBorder:   "#EAECF0",
  sidebar:      "#ffffff",
  sidebarBorder:"#EAECF0",
  text:         "#111827",
  textSub:      "#374151",
  textMuted:    "#6B7280",
  textFaint:    "#9CA3AF",
  textPlaceholder:"#D1D5DB",
  lbl:          "#9CA3AF",
  divider:      "#F3F4F6",
  input:        "#ffffff",
  inputBorder:  "#E5E7EB",
  chipBg:       "#ffffff",
  chipBorder:   "#E5E7EB",
  navBg:        "#ffffff",
  navBorder:    "#EAECF0",
  accent:       "#1a3622",
  accentLight:  "#ECFDF5",
  accentText:   "#166534",
  infoRow:      "#F8FAFF",
  tipBg:        "#F8F7FF",
  tipBorder:    "#8B5CF6",
  tipText:      "#5B21B6",
  toggleBg:     "#F3F4F6",
  toggleIcon:   "🌙",
};
const DARK = {
  bg:           "#0d1a0e",
  card:         "#162318",
  cardBorder:   "#1e3824",
  sidebar:      "#111f13",
  sidebarBorder:"#1e3824",
  text:         "#f0fdf4",
  textSub:      "#d1fae5",
  textMuted:    "#6ee7b7",
  textFaint:    "#34d399",
  textPlaceholder:"#1e3824",
  lbl:          "#4ade80",
  divider:      "#1a2e1c",
  input:        "#162318",
  inputBorder:  "#1e3824",
  chipBg:       "#162318",
  chipBorder:   "#1e3824",
  navBg:        "#111f13",
  navBorder:    "#1e3824",
  accent:       "#22c55e",
  accentLight:  "#052e16",
  accentText:   "#4ade80",
  infoRow:      "#0d1a0e",
  tipBg:        "#1e1b4b",
  tipBorder:    "#7c3aed",
  tipText:      "#c4b5fd",
  toggleBg:     "#1e3824",
  toggleIcon:   "☀️",
};

/* ══════════════════════════════════════════════════════════════
   DÁTA — ÚVZ SR / pelovespravodajstvo.sk
   22. týždeň 2026
   ══════════════════════════════════════════════════════════════ */
const POLLEN_DATA = {
  borovica: { label: "Borovica / Ihličnany", short: "Borovica", emoji: "🌲", uroven: "Veľmi vysoká", skore: 5, sezona: true, pelZrn: "687 zŕn/m³ (Žilina) · 275 zŕn/m³ (Nitra)", trend: "↘ klesá", komentar: "Dominantný alergén týždňa — viditeľné žlté povlaky na autách a terasách. Ihličnany dokvitajú.", outlook: [4,3,2] },
  travy:    { label: "Trávy (lipnicovité)",  short: "Trávy",    emoji: "🌾", uroven: "Stredná",     skore: 3, sezona: true, pelZrn: "55 zŕn/m³ (Žilina) · 45 zŕn/m³ (Nitra)", trend: "↗ rastie", komentar: "Sezóna práve začína — trávy sa stanú dominantným alergénom na najbližšie 2 mesiace.", outlook: [4,4,5] },
  breza:    { label: "Breza",                short: "Breza",    emoji: "🌳", uroven: "Veľmi nízka", skore: 1, sezona: false, pelZrn: "nízke koncentrácie", trend: "↘ klesá", komentar: "Sezóna brezy sa končí, koncentrácie sú nízke.", outlook: [1,1,1] },
  lieska:   { label: "Lieska",               short: "Lieska",   emoji: "🌰", uroven: "Veľmi nízka", skore: 1, sezona: false, pelZrn: "stopové množstvá", trend: "— ukončená", komentar: "Sezóna liesky je dávno ukončená.", outlook: [1,1,1] },
  ambrozia: { label: "Ambrózia",             short: "Ambrózia", emoji: "🌿", uroven: "Veľmi nízka", skore: 1, sezona: false, pelZrn: "zatiaľ 0", trend: "— nezačala", komentar: "Ambrózia začína až v júli–auguste. Zatiaľ nie je v ovzduší.", outlook: [1,1,1] },
  byliny:   { label: "Byliny (štiav, skorocel)", short: "Byliny", emoji: "🌱", uroven: "Stredná",  skore: 3, sezona: true, pelZrn: "nízke až stredné", trend: "↗ rastie", komentar: "Pŕhľavovité, štiav a skorocel dosahujú stredné hodnoty — na celom území SR stúpajú.", outlook: [3,4,4] },
  huby:     { label: "Spóry húb (Cladospórium)", short: "Spóry húb", emoji: "🍄", uroven: "Veľmi vysoká", skore: 5, sezona: true, pelZrn: "vysoké hodnoty", trend: "↗ rastie", komentar: "Spóry plesní Cladospórium a Alternária dosahujú vysoké hodnoty po nedávnom oteplení.", outlook: [5,5,4] },
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
// Reálne dáta — pelovespravodajstvo.sk (k=1 merané) + ÚVZ SR text · 22. týždeň 2026
const CITY_DATA = {
  "Bratislava":      { borovica:3, travy:2, huby:5, breza:1, byliny:2, pelBor:"48 zŕn/m³",  pelTra:"25 zŕn/m³",  pelHub:"153 zŕn/m³" }, // k=1 merané
  "Trnava":          { borovica:3, travy:2, huby:5, breza:1, byliny:2, pelBor:"48 zŕn/m³",  pelTra:"25 zŕn/m³",  pelHub:"153 zŕn/m³" }, // k=1 odhadnuté
  "Trenčín":         { borovica:4, travy:2, huby:5, breza:1, byliny:2, pelBor:"110 zŕn/m³", pelTra:"25 zŕn/m³",  pelHub:"800 zŕn/m³" }, // z textu ÚVZ SR
  "Nitra":           { borovica:5, travy:3, huby:5, breza:1, byliny:2, pelBor:"200 zŕn/m³", pelTra:"45 zŕn/m³",  pelHub:"680 zŕn/m³" }, // z textu (peak 275)
  "Žilina":          { borovica:5, travy:4, huby:5, breza:2, byliny:2, pelBor:"420 zŕn/m³", pelTra:"55 zŕn/m³",  pelHub:"900 zŕn/m³" }, // z textu (peak 687)
  "Banská Bystrica": { borovica:5, travy:3, huby:4, breza:2, byliny:2, pelBor:"165 zŕn/m³", pelTra:"38 zŕn/m³",  pelHub:"120 zŕn/m³" }, // z textu ÚVZ SR
  "Prešov":          { borovica:5, travy:3, huby:4, breza:2, byliny:2, pelBor:"165 zŕn/m³", pelTra:"38 zŕn/m³",  pelHub:"120 zŕn/m³" }, // z textu ÚVZ SR
  "Košice":          { borovica:5, travy:3, huby:4, breza:2, byliny:2, pelBor:"165 zŕn/m³", pelTra:"38 zŕn/m³",  pelHub:"120 zŕn/m³" }, // z textu ÚVZ SR
};

// Prognóza na 22. týždeň 2026 — pelovespravodajstvo.sk / RÚVZ BB
const PROGNOZA = {
  tyzden: "23. týždeň 2026",
  datum: "od 9.6.2026",
  items: [
    { emoji:"🌾", label:"Trávy (lipnicovité)",       trend:"↗ dominantné", text:"Peľová sezóna tráv pokračuje — dominantný alergén. Ovplyvní ju búrková činnosť.", color:"#ea580c" },
    { emoji:"🌱", label:"Byliny (skorocel, pŕhľava)", trend:"↗ stúpa",     text:"Pribúda peľ bylín — najmä skorocelu a pŕhľavovitých. Rastúci trend celé leto.", color:"#65a30d" },
    { emoji:"🌲", label:"Borovica / Ihličnany",       trend:"↘ klesá",     text:"Dreviny s vysokou produkciou peľu pomaly dokvitajú. Borovica na ústupe.", color:"#2e7d32" },
    { emoji:"🌸", label:"Lipa, agát, gaštan",         trend:"↗ nastupuje", text:"V ovzduší sa bude vyskytovať peľ agátu, bazy, gaštanu a lipy.", color:"#d97706" },
    { emoji:"🍄", label:"Spóry húb",                  trend:"↗ stúpa",     text:"Denné koncentrácie spór húb (Cladospórium) počas teplejších dní stúpnu.", color:"#7c3aed" },
  ],
  poznamka: "Búrková činnosť spôsobí regionálne rozdiely. Množstvo peľu bude lokálne ovplyvňované zrážkovou aktivitou.",
  zdroj: "ÚVZ SR · 22. týždeň 2026",
};

// Citlivosť ovplyvňuje prah príznakov, nie koncentráciu peľu
// Pri vysokej citlivosti zobrazíme varovanie aj pri nižšej hladine
const SENS_MULT = { "nízka":1.0, "stredná":1.0, "vysoká":1.0 };
const SENS_THRESHOLD = { "nízka": 4, "stredná": 3, "vysoká": 2 };
// SENS_THRESHOLD = od akého skóre dostane upozornenie "rizikové pre teba"

// Posun vnímania rizika podľa citlivosti
// Reálny peľ je rovnaký, ale vnímané riziko sa líši
const SENS_SHIFT = { "nízka": -1, "stredná": 0, "vysoká": 1 };

// Vráti VNÍMANÉ skóre (pre farbu, label, varovanie) — nie reálny peľ
function perceivedScore(realScore, sens) {
  const shift = SENS_SHIFT[sens] ?? 0;
  return Math.min(5, Math.max(0, realScore + shift));
}

// Bezpečný prah pre "čas vonku" podľa citlivosti
const SAFE_THRESHOLD = { "nízka": 0.60, "stredná": 0.45, "vysoká": 0.28 };

// Text odporúčania podľa citlivosti a skóre
function sensitivityAdvice(percScore, sens) {
  if (sens === "vysoká") {
    if (percScore >= 4) return "Silná alergia: zvážte zostať doma, noste respirátor vonku.";
    if (percScore >= 3) return "Zvýšená opatrnosť: obmedzte pobyt vonku, majte lieky pri sebe.";
    if (percScore >= 2) return "Mierny peľ: môžete ísť von, sledujte príznaky.";
    return "Nízke riziko aj pre citlivých — vhodný čas na vonkajšie aktivity.";
  }
  if (sens === "nízka") {
    if (percScore >= 5) return "Extrémne vysoký peľ — aj pri nízkej citlivosti možné príznaky.";
    if (percScore >= 4) return "Vysoký peľ — pri dlhšom pobyte vonku môžu nastať príznaky.";
    return "Väčšina ľudí s nízkou citlivosťou bez výrazných príznakov.";
  }
  // stredná — default
  if (percScore >= 4) return "Vysoký peľ — obmedzte pobyt vonku, majte antihistaminiká.";
  if (percScore >= 3) return "Stredný peľ — citlivé osoby môžu pociťovať príznaky.";
  if (percScore >= 2) return "Nízky peľ — príznaky len pri dlhšom pobyte vonku.";
  return "Minimálny peľ — vhodný čas vonku.";
}

// Citlivosť ovplyvňuje: prah varovania, bezpečný čas, farbu rizika, text odporúčaní
const S2L = ["","Veľmi nízka","Nízka","Stredná","Vysoká","Veľmi vysoká"];
// Stredný rod — pre "riziko je..." (neuter)
const S2L_N = ["","Veľmi nízke","Nízke","Stredné","Vysoké","Veľmi vysoké"];
const DAYS = ["Zajtra","Pozajtra","Za 3 dni"];

// Vysvetlivky koncentrácií peľu — ÚVZ SR definícia
const CONC_INFO = [
  { range:"0 – 30",   label:"Nízke",        desc:"Väčšina alergikov bez príznakov",            color:"#16a34a", bg:"#f0fdf4" },
  { range:"30 – 150", label:"Stredné–Vysoké",desc:"Príznaky u citlivých jedincov",              color:"#f59e0b", bg:"#fefce8" },
  { range:"nad 150",  label:"Veľmi vysoké",  desc:"Silné príznaky u väčšiny alergikov",         color:"#dc2626", bg:"#fef2f2" },
];
const CONC_NOTE = "Biologické častice = peľové zrná a spóry húb (plesní). Hodnoty v počte zŕn/m³ vzduchu. Zdroj: ÚVZ SR.";

const CITY_COORDS = {
  "Bratislava":      [48.1486, 17.1077],
  "Košice":          [48.7164, 21.2611],
  "Prešov":          [48.9985, 21.2396],
  "Žilina":          [49.2232, 18.7394],
  "Banská Bystrica": [48.7395, 19.1530],
  "Nitra":           [48.3069, 18.0864],
  "Trnava":          [48.3774, 17.5884],
  "Trenčín":         [48.8943, 18.0440],
};

// Fenologické trendy — týždenné multiplikátory od 21. týždňa
// Vychádza z historických pozorovaní SR (ÚVZ SR + ČHMÚ referenčné dáta)
const FENO_BASE_WEEK = 22;
const FENO = {
  borovica: [1.00, 0.55, 0.35, 0.20, 0.12, 0.07, 0.04], // dokvitá — pokles pokračuje
  travy:    [1.00, 1.25, 1.50, 1.60, 1.55, 1.35, 1.10], // stúpa k vrcholu jún–júl
  byliny:   [1.00, 1.20, 1.40, 1.55, 1.55, 1.40, 1.25], // stúpa (skorocel, pŕhľava)
  huby:     [1.00, 1.20, 1.25, 1.15, 1.05, 0.95, 0.82], // závisí od teploty a zrážok
  breza:    [1.00, 0.30, 0.10, 0.04, 0.02, 0.02, 0.01], // sezóna ukončená
  lieska:   [1.00, 0.40, 0.15, 0.06, 0.03, 0.03, 0.02], // sezóna ukončená
  ambrozia: [0.00, 0.00, 0.00, 0.02, 0.06, 0.15, 0.30], // začína v júli
};

function wmoToEmoji(code) {
  if (code === 0) return "☀️";
  if (code <= 2)  return "🌤️";
  if (code <= 3)  return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌦️";
  return "⛈️";
}

// Výpočet počasieho faktora pre peľ
// Váhy peľu podľa veľkosti zŕn — ovplyvňuje ako rýchlo dážď zmyje peľ
// Ťažší peľ (borovica) klesá rýchlejšie, ľahký (trávy, ambrozia) zostáva dlhšie
const POLLEN_RAIN_SENSITIVITY = {
  borovica: 0.65, // ťažké zrná — dážď zmyje rýchlo
  breza:    0.80,
  lieska:   0.80,
  travy:    1.00, // ľahké zrná — dážď nezmyje tak rýchlo
  byliny:   1.00,
  ambrozia: 1.10, // veľmi ľahké — drží sa dlho
  huby:     0.90, // spóry — stredné
};

// Nadmorská výška miest — oneskorenie sezóny pre hornaté oblasti (+týždeň na 300m)
const CITY_ALTITUDE_DELAY = {
  "Bratislava": 0, "Trnava": 0, "Nitra": 0,
  "Trenčín":    0.5, // 200m n.m.
  "Žilina":     1.0, // 365m n.m. + horské okolie
  "Banská Bystrica": 1.0, // 362m n.m.
  "Prešov":     1.0, // 260m n.m. + Tatry v dosahu
  "Košice":     0.5, // 208m n.m.
};

// Fenologický koeficient — DENNÁ interpolácia medzi týždennými hodnotami
// FENO[n] = koeficient pre n-tý týždeň od teraz
// Day 0 = dnes, Day 7 = o týždeň → interpolujeme plynulo
function fenoCoeff(id, dayIndex, city) {
  const delay  = CITY_ALTITUDE_DELAY[city] || 0;
  const fArr   = FENO[id];
  if (!fArr) return 1.0;

  // Prepočet dní na týždenný float (s korekciou nadmorskej výšky)
  const weekFloat = Math.max(0, (dayIndex - delay * 7) / 7);
  const w0  = Math.floor(weekFloat);
  const w1  = Math.min(w0 + 1, fArr.length - 1);
  const w0c = Math.min(w0, fArr.length - 1);
  const frac = weekFloat - w0;

  // Lineárna interpolácia medzi dvoma týždňami
  return fArr[w0c] + frac * (fArr[w1] - fArr[w0c]);
}

// Počet po sebe idúcich suchých dní pred daným dňom (akumulačný efekt)
function dryStreakBefore(weatherDays, upToIndex) {
  let streak = 0;
  for (let i = upToIndex - 1; i >= 0; i--) {
    if (weatherDays[i].rain < 0.5) streak++;
    else break;
  }
  return streak;
}

function calcWeatherFactor(day, prevRain = 0, pollenId = null, dryStreak = 0) {
  const { temp, rain, wind, clouds } = day;

  // 1. TEPLOTA — nelineárna krivka (optimum 22-28°C)
  const tF = temp < 5  ? 0.10 :
             temp < 10 ? 0.40 :
             temp < 15 ? 0.70 :
             temp < 20 ? 0.90 :
             temp < 24 ? 1.10 :
             temp < 28 ? 1.30 : 1.40;

  // 2. DÁŽĎ — upravený podľa hmotnosti peľu daného alergénu
  const rainSens = (pollenId && POLLEN_RAIN_SENSITIVITY[pollenId]) || 1.0;
  let rF = rain > 15 ? 0.08 * rainSens :
           rain > 8  ? 0.18 * rainSens :
           rain > 3  ? 0.42 * rainSens :
           rain > 0.5? (0.65 + (1 - rainSens) * 0.20) : 1.00;
  rF = Math.max(0.05, Math.min(rF, 1.0));

  // Burst efekt deň po silnom daždi (peľ sa uvoľní po vlhkosti)
  if (prevRain > 8 && rain < 0.5) {
    const burstMult = pollenId === "borovica" ? 1.20 : 1.40; // borovica menej
    rF = Math.min(rF * burstMult, 1.45);
  }

  // 3. VIETOR — optimum pre šírenie je 10-25 km/h
  const wF = wind < 3  ? 0.75 :
             wind < 10 ? 0.95 :
             wind < 25 ? 1.20 :
             wind < 40 ? 1.35 :
             wind < 55 ? 1.15 : 0.90; // búrlivý vietor narúša kvety

  // 4. OBLAČNOSŤ — pri zatvorených kvetoch menej peľu
  const cF = 1.0 - (clouds / 100) * 0.22;

  // 5. AKUMULAČNÝ EFEKT — suché dni hromadia peľ v ovzduší
  // Po 3 suchých dňoch +15%, po 5 dňoch +25%, max +35%
  const accumF = 1.0 + Math.min(dryStreak * 0.07, 0.35);

  // Kombinovaný faktor — cap aby sme predišli nereálnym extrémom
  // Faktory nie sú plne nezávislé, preto nepoužívame čisté násobenie
  const rawCombined = tF * rF * wF * cF * accumF;

  // Soft cap: nad 1.6 rast spomalíme (reálny peľ má fyzikálny strop)
  const capped = rawCombined > 1.6
    ? 1.6 + (rawCombined - 1.6) * 0.3
    : rawCombined;

  return Math.min(capped, 2.0); // absolútny max ×2.0 oproti baseline
}

// Hlavný dôvod pre daný deň — zobrazí sa ako text vo widgete
function weatherDriver(day, prevRain) {
  const { temp, rain, wind, clouds } = day;
  // Zoraď faktory podľa sily vplyvu
  if (rain > 15)                   return { text: `Silný dážď ${rain.toFixed(0)}mm — peľ ↓↓`, pos: false };
  if (rain > 5)                    return { text: `Dážď ${rain.toFixed(0)}mm — peľ klesá ↓`, pos: false };
  if (rain > 0.5)                  return { text: `Slabý dážď — peľ mierne ↓`, pos: false };
  if (prevRain > 8 && rain < 0.5)  return { text: `Po daždi — výbuch peľu ↑`, pos: true };
  if (temp > 30)                   return { text: `Veľmi horúco ${Math.round(temp)}°C — peľ ↑↑`, pos: true };
  if (temp > 25)                   return { text: `Teplo ${Math.round(temp)}°C — ideálne pre peľ ↑`, pos: true };
  if (temp < 8)                    return { text: `Chladno ${Math.round(temp)}°C — peľ ↓↓`, pos: false };
  if (temp < 14)                   return { text: `Chladnejšie — peľ ↓`, pos: false };
  if (wind > 40)                   return { text: `Búrlivý vietor — narúša kvety`, pos: null };
  if (wind > 25)                   return { text: `Silný vietor — peľ sa šíri ↑`, pos: true };
  if (wind > 12)                   return { text: `Vietor — dobré šírenie peľu`, pos: null };
  if (clouds > 90)                 return { text: `Celozatažené — kvety zatvorené ↓`, pos: false };
  if (clouds > 70)                 return { text: `Zamračené — menej peľu`, pos: false };
  if (temp > 20 && clouds < 30)    return { text: `Slnečno a teplo — peľ ↑`, pos: true };
  return { text: "Priemerné podmienky", pos: null };
}

async function fetchWeather(city) {
  const [lat, lon] = CITY_COORDS[city] || [48.15, 17.11];
  // Priame volanie z prehliadača — Open-Meteo blokuje serverové IP
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=temperature_2m_max,precipitation_sum,windspeed_10m_max,cloudcover_mean,weathercode` +
    `&hourly=temperature_2m,precipitation,windspeed_10m,cloudcover,relative_humidity_2m` +
    `&forecast_days=7&timezone=Europe%2FBratislava`;

  // Retry 3x pri dočasnom výpadku
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
        const res = await fetch(url);
      if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
      const data = await res.json();
      const d = data.daily;
      const h = data.hourly;

  // Parse hourly into per-day arrays (24h each)
  const hourlyByDay = d.time.map((date, di) => {
    return Array.from({length:24}, (_, hr) => {
      const idx = di * 24 + hr;
      return {
        hour:   hr,
        temp:   h.temperature_2m[idx]  ?? 18,
        rain:   h.precipitation[idx]   ?? 0,
        wind:   h.windspeed_10m[idx]   ?? 10,
        clouds: h.cloudcover[idx]      ?? 40,
      };
    });
  });

      return d.time.map((date, i) => ({
        date,
        temp:   d.temperature_2m_max[i]  || 20,
        rain:   d.precipitation_sum[i]   || 0,
        wind:   d.windspeed_10m_max[i]   || 10,
        clouds: d.cloudcover_mean[i]     || 30,
        wmo:    d.weathercode[i]         || 1,
        emoji:  wmoToEmoji(d.weathercode[i] || 1),
        hourly: hourlyByDay[i] || [],
      }));
    } catch (e) {
      lastErr = e;
      if (attempt < 2) await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
    }
  }
  throw new Error(lastErr?.message || "Počasie nedostupné");
}

// Per-alergén hodinové profily — každý alergén má iný čas uvoľňovania
// Vychádza z vedeckých štúdií (Galán et al. 2017, AAAAI guidelines)
const HOURLY_PROFILES = {
  // Trávy: klasický ranný vrchol, rosa vysychá okolo 7-9h
  travy:    [.04,.04,.04,.05,.10,.25, .60,.90,1.0,.92,.82,.72, .65,.60,.55,.50,.45,.40, .30,.22,.15,.10,.06,.04],
  // Breza: neskorší ranný vrchol, závisí od teploty
  breza:    [.03,.03,.03,.04,.07,.15, .40,.72,.92,1.0,.95,.85, .75,.68,.60,.55,.48,.42, .32,.22,.14,.09,.05,.03],
  // Borovica: poobedný vrchol (ťažší peľ, potrebuje vyššiu teplotu)
  borovica: [.03,.03,.03,.04,.06,.12, .30,.55,.78,.92,1.0,.98, .92,.85,.78,.70,.60,.50, .38,.28,.18,.12,.07,.04],
  // Lieska: podobná breze
  lieska:   [.03,.03,.03,.04,.08,.18, .45,.75,.95,1.0,.92,.82, .72,.65,.58,.52,.45,.38, .28,.20,.13,.08,.05,.03],
  // Ambrózia: veľmi skoro ráno! (5-8h je vrchol)
  ambrozia: [.05,.05,.05,.06,.15,.40, .85,1.0,.95,.85,.75,.65, .58,.52,.47,.42,.38,.33, .25,.18,.12,.08,.05,.05],
  // Byliny: podobné trávam, mierne neskorší vrchol
  byliny:   [.04,.04,.04,.05,.09,.22, .55,.82,.95,1.0,.92,.82, .72,.65,.60,.55,.50,.44, .34,.24,.16,.10,.06,.04],
  // Spóry húb: poobedný-večerný vrchol! (teplo + vlhkosť popoludní)
  huby:     [.05,.05,.05,.06,.08,.12, .22,.35,.50,.68,.82,.92, .98,1.0,.96,.90,.82,.72, .58,.44,.32,.22,.14,.07],
};
// Fallback pre neznáme alergény
const BASE_HOURLY_POLLEN = HOURLY_PROFILES.travy;

// Mestá v kotlinách — ranná teplotná inverzia zachytáva peľ
const VALLEY_CITIES = new Set(["Bratislava","Nitra","Trenčín"]);

function calcBestWorstTime(dayData, city = "", chosenIds = [], sens = "stredná") {
  const hourly = dayData?.hourly;
  if (!hourly || hourly.length < 24) {
    return {
      best:        "18:00–22:00",
      worst:       "06:00–10:00",
      bestReason:  "Peľ sedimentuje podvečer",
      worstReason: "Ranné uvoľňovanie peľu",
      fromHourly:  false,
    };
  }

  const isValley = VALLEY_CITIES.has(city);

  // FIX 4: Identifikuj kedy dážď PRESTANE — burst nastane 1-2h potom
  const rainStopsAt = (() => {
    for (let h = 1; h < 24; h++) {
      if ((hourly[h-1]?.rain ?? 0) > 0.5 && (hourly[h]?.rain ?? 0) < 0.2) return h;
    }
    return -1;
  })();

  // Vytvor kompozitný hodinový profil zo všetkých vybraných alergénov
  // FIX 3: Každý alergén má vlastný profil
  const compositeProfile = Array.from({length:24}, (_, hr) => {
    if (!chosenIds || chosenIds.length === 0) return BASE_HOURLY_POLLEN[hr];
    const vals = chosenIds.map(id => (HOURLY_PROFILES[id] ?? HOURLY_PROFILES.travy)[hr]);
    return vals.reduce((a,b)=>a+b,0) / vals.length;
  });

  // Vypočítaj hodinové riziko
  const scores = hourly.map(h => {
    const base = compositeProfile[h.hour] ?? 0.5;

    // Dážď
    let rainMod = 1.0;
    if (h.rain > 2.0)       rainMod = 0.04;
    else if (h.rain > 0.8)  rainMod = 0.20;
    else if (h.rain > 0.2)  rainMod = 0.50;

    // FIX 4: Burst 1-2h po zastavení dažďa
    if (rainStopsAt > 0 && (h.hour === rainStopsAt + 1 || h.hour === rainStopsAt + 2)) {
      rainMod = Math.min(rainMod * 1.50, 1.40);
    }

    // Teplota
    const tempMod = h.temp < 6  ? 0.15 :
                    h.temp < 10 ? 0.45 :
                    h.temp < 16 ? 0.78 :
                    h.temp < 22 ? 1.00 :
                    h.temp < 27 ? 1.18 : 1.28;

    // Vietor
    const windMod = h.wind < 5  ? 0.85 :
                    h.wind < 15 ? 1.00 :
                    h.wind < 30 ? 1.22 :
                    h.wind < 45 ? 1.32 : 1.05;

    // Oblačnosť
    const cloudMod = 1.0 - (h.clouds / 100) * 0.22;

    // FIX 5: Vlhkosť (ak dostupná)
    const humMod = h.humidity !== undefined
      ? (h.humidity > 90 ? 0.15 : h.humidity > 80 ? 0.50 : h.humidity > 70 ? 0.80 : 1.00)
      : 1.0;

    // FIX 6: Kotlinová inverzia — ráno (5-10h) +25% pre BA, NR, TN
    const inversionMod = (isValley && h.hour >= 5 && h.hour <= 10) ? 1.25 : 1.0;

    return base * rainMod * tempMod * windMod * cloudMod * humMod * inversionMod;
  });

  // Nájdi najlepší a najhorší 2-hodinový blok (mimo noci 23:00-05:00)
  const DAYTIME = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
  const EVENING_SAFE = [18,19,20,21,22,23];

  // Najhorší blok — kde je riziko najvyššie
  let worstStart = 7, worstMax = -1;
  for (const hr of DAYTIME) {
    const avg = (scores[hr] + scores[Math.min(hr+1,23)] + scores[Math.min(hr+2,23)]) / 3;
    if (avg > worstMax) { worstMax = avg; worstStart = hr; }
  }

  // Najlepší blok — kde je riziko najnižšie (priorita na večer/ráno počas dažďa)
  let bestStart = 18, bestMin = 999;
  for (const hr of DAYTIME) {
    const avg = (scores[hr] + scores[Math.min(hr+1,23)] + scores[Math.min(hr+2,23)]) / 3;
    if (avg < bestMin) { bestMin = avg; bestStart = hr; }
  }

  const fmt = h => `${h}:00`;
  const worstEnd = Math.min(worstStart + 3, 23);
  const bestEnd  = Math.min(bestStart  + 3, 23);

  // Generuj vysvetlenie
  const worstHour = hourly[worstStart];
  const bestHour  = hourly[bestStart];

  function worstReason(h, startHr) {
    if (h.rain < 0.3 && h.temp > 22 && startHr >= 6 && startHr <= 10)
      return "Ranné uvoľňovanie peľu + teplo";
    if (h.rain < 0.3 && h.temp > 26)
      return `Horúco ${Math.round(h.temp)}°C — peľ vo vrchole`;
    if (h.wind > 25 && h.rain < 0.3)
      return `Silný vietor ${Math.round(h.wind)} km/h šíri peľ`;
    if (startHr >= 6 && startHr <= 10)
      return "Ranné uvoľňovanie peľu";
    if (startHr >= 11 && startHr <= 15)
      return "Vrchol teplôt — peľ aktívny";
    return "Najvyššia koncentrácia peľu";
  }

  function bestReason(h, startHr) {
    if (h.rain > 1.0) return `Dážď ${h.rain.toFixed(1)}mm — peľ zmytý ↓`;
    if (h.rain > 0.3) return "Zrážky — peľ klesá";
    if (startHr >= 18) return "Peľ sedimentuje podvečer";
    if (startHr >= 20) return "Nočný pokoj — minimum peľu";
    if (h.temp < 12)  return `Chladno ${Math.round(h.temp)}°C — peľ neaktívny`;
    if (h.clouds > 85) return "Zatažené — kvety zatvorené";
    return "Najnižšia koncentrácia dňa";
  }

  // Find the longest consecutive LOW-RISK window (score < 0.45) in daytime
  const LOW_THRESH = SAFE_THRESHOLD[sens] ?? 0.45;
  let longestStart = bestStart, longestLen = 3;
  let curStart = -1, curLen = 0;
  for (let hr = 6; hr <= 22; hr++) {
    if (scores[hr] < LOW_THRESH) {
      if (curStart < 0) curStart = hr;
      curLen++;
      if (curLen > longestLen) { longestLen = curLen; longestStart = curStart; }
    } else {
      curStart = -1; curLen = 0;
    }
  }
  const longestEnd = Math.min(longestStart + longestLen, 23);

  // Now (current hour) risk level
  const nowHour    = new Date().getHours();
  const nowScore   = scores[nowHour] || 0;
  const nowLevel   = nowScore < 0.3 ? "nízke" : nowScore < 0.6 ? "stredné" : nowScore < 0.85 ? "vysoké" : "veľmi vysoké";
  const nowColor   = nowScore < 0.3 ? "#16a34a" : nowScore < 0.6 ? "#ca8a04" : nowScore < 0.85 ? "#ea580c" : "#dc2626";

  return {
    best:        `${fmt(longestStart)}–${fmt(longestEnd)}`,
    worst:       `${fmt(worstStart)}–${fmt(worstEnd)}`,
    bestReason:  bestReason(bestHour, longestStart),
    worstReason: worstReason(worstHour, worstStart),
    bestDuration: longestLen,
    fromHourly:  true,
    worstScore:  Math.round(worstMax * 100),
    bestScore:   Math.round(bestMin * 100),
    nowScore, nowLevel, nowColor, nowHour,
    hourlyScores: scores,  // expose for mini timeline
  };
}

function calcHybrid(city, ids, sens, weatherDays) {
  const cd = CITY_DATA[city] || {};
  const sm = SENS_MULT[sens] || 1.0;

  return ids.map(id => {
    const b = POLLEN_DATA[id]; if (!b) return null;
    const baseScore = cd[id] !== undefined ? cd[id] : b.skore;

    // Ak je baseline 0 a alergén ešte nie je v sezóne → ostane 0
    if (baseScore === 0 && !b.sezona) {
      return {
        id, emoji: b.emoji, label: b.short,
        days: weatherDays.map(day => ({
          score: 0, uroven: "Veľmi nízka",
          driver: weatherDriver(day, 0),
        })),
      };
    }

    return {
      id, emoji: b.emoji, label: b.short,
      days: weatherDays.map((day, i) => {
        const prevRain  = i > 0 ? weatherDays[i - 1].rain : 0;
        const dryStreak = dryStreakBefore(weatherDays, i);

        // P1: Fenológia s korekciou nadmorskej výšky (denná interpolácia)
        const feno = fenoCoeff(id, i, city);

        // P2+P3: Počasie s peľ-špecifickým rain faktorom + akumulácia
        const wf = calcWeatherFactor(day, prevRain, id, dryStreak);

        // P4b: Kotlinová inverzia — denný boost pre mestá v kotlinách
        const inversionDayBoost = VALLEY_CITIES.has(city) ? 1.12 : 1.0;

        const raw   = baseScore * feno * wf * inversionDayBoost;
        const score = Math.min(5, Math.max(0, Math.round(raw)));
        const driver = weatherDriver(day, prevRain);

        return { score, uroven: S2L[score] || "Veľmi nízka", driver };
      }),
    };
  }).filter(Boolean);
}
const COL = { "Veľmi nízka":"#16a34a","Nízka":"#65a30d","Stredná":"#ca8a04","Vysoká":"#ea580c","Veľmi vysoká":"#dc2626" };
const BG  = { "Veľmi nízka":"#f0fdf4","Nízka":"#f7fee7","Stredná":"#fefce8","Vysoká":"#fff7ed","Veľmi vysoká":"#fef2f2" };

function calcForecast(city, ids, sens) {
  const cd = CITY_DATA[city] || {};
  const sm = SENS_MULT[sens] || 1;
  const allergens = ids.map(id => {
    const b = POLLEN_DATA[id]; if (!b) return null;
    // Use city-specific measured score if available, else base score
    const baseScore = (cd[id] !== undefined) ? cd[id] : b.skore;
    const s = Math.min(5, Math.round(baseScore * sm));
    // City-specific pelZrn label
    const pelZrnCity = id==="borovica" ? (cd.pelBor||b.pelZrn)
                     : id==="travy"    ? (cd.pelTra||b.pelZrn)
                     : id==="huby"     ? (cd.pelHub||b.pelZrn)
                     : b.pelZrn;
    // Apply city factor to outlook (sensitivity no longer inflates score)
    const cityFactor = (b.skore > 0 && cd[id] !== undefined) ? (cd[id] / b.skore) : 1;
    const threshold = SENS_THRESHOLD[sens] || 3;
    return { ...b, id, s, uroven: S2L[s] || b.uroven, pelZrn: pelZrnCity,
             isRiskyForUser: s >= threshold,
             outlook: b.outlook.map(o => Math.min(5, Math.round(o * cityFactor))) };
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
function AlmanachPage({ T }) {
  if (!T) T = LIGHT;
  const [selected, setSelected] = useState(null);
  const currentMonth = new Date().getMonth(); // 0-indexed

  return (
    <div className="almanach-page" style={{ padding:"32px 36px", overflowX:"hidden", background:T.bg, minHeight:"100vh", transition:"background .3s" }}>
      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:13, color:T.textFaint, marginBottom:4 }}>Peľový sprievodca</div>
        <h1 style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-.3px", marginBottom:8 }}>
          Peľový kalendár Slovenska
        </h1>
        <p style={{ fontSize:14, color:T.textMuted, maxWidth:640, lineHeight:1.6 }}>
          Prehľad všetkých alergénov, ich sezóny kvitnutia a charakteristík. Aktuálny mesiac je zvýraznený.
        </p>
      </div>

      {/* Timeline table */}
      <div style={{ background:"#fff", border:"1px solid #EAECF0", borderRadius:14, marginBottom:28, overflow:"hidden" }}>
        {/* Month header */}
        <div className="cal-header" style={{ display:"grid", gridTemplateColumns:"220px repeat(12,1fr)", borderBottom:"1px solid #EAECF0" }}>
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
            <div className="cal-cat-label" style={{ display:"grid", gridTemplateColumns:"220px repeat(12,1fr)", background:"#F9FAFB", borderBottom:"1px solid #EAECF0", borderTop:"1px solid #EAECF0" }}>
              <div style={{ padding:"6px 16px", fontSize:11, fontWeight:700, color:T.textMuted, textTransform:"uppercase", letterSpacing:1 }}>
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
                  {/* Desktop row */}
                  <div className="cal-row-desktop"
                    onClick={() => setSelected(isOpen ? null : p)}
                    style={{ display:"grid", gridTemplateColumns:"220px repeat(12,1fr)", borderBottom: isOpen ? "none" : "1px solid #F3F4F6", cursor:"pointer", transition:"background .15s",
                      background: isOpen ? `${p.farba}10` : "transparent" }}
                    onMouseEnter={e=>{ if(!isOpen) e.currentTarget.style.background="#F9FAFB"; }}
                    onMouseLeave={e=>{ if(!isOpen) e.currentTarget.style.background="transparent"; }}>
                    <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:18 }}>{p.emoji}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{p.label}</div>
                        <div style={{ fontSize:11, color:"#9CA3AF", marginTop:1 }}>
                          {[0,1,2,3,4].map(i => (
                            <span key={i} style={{ color: i<p.intenzita ? p.farba : "#E5E7EB", marginRight:2, fontSize:8 }}>●</span>
                          ))}
                          <span style={{ marginLeft:4 }}>{p.intenzita<=2?"Nízka":p.intenzita===3?"Stredná":p.intenzita===4?"Vysoká":"Veľmi vysoká"}</span>
                        </div>
                      </div>
                      <span style={{ fontSize:12, color: isOpen ? p.farba : "#D1D5DB", marginRight:8, display:"inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition:"transform .2s" }}>▼</span>
                    </div>
                    {p.mesiace.map((active,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"12px 3px", background: i===currentMonth ? "#F0FDF4" : "transparent" }}>
                        {active ? <div style={{ width:"100%", height:10, borderRadius:5, background:p.farba, opacity:p.intenzita/5, minWidth:8 }}/> : <div style={{ width:"100%", height:2, background:"#F3F4F6", borderRadius:1 }}/>}
                      </div>
                    ))}
                  </div>

                  {/* Mobile row — name row + months row */}
                  <div className="cal-row-mobile" style={{ display:"none", borderBottom: isOpen ? "none" : "1px solid #F3F4F6", background: isOpen ? `${p.farba}10` : "transparent" }}
                    onClick={() => setSelected(isOpen ? null : p)}>
                    {/* Row 1: name */}
                    <div style={{ padding:"10px 12px", display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:18 }}>{p.emoji}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{p.label}</div>
                        <div style={{ fontSize:11, color:"#9CA3AF" }}>
                          {[0,1,2,3,4].map(i => (
                            <span key={i} style={{ color: i<p.intenzita ? p.farba : "#E5E7EB", marginRight:2, fontSize:8 }}>●</span>
                          ))}
                          <span style={{ marginLeft:4 }}>{p.intenzita<=2?"Nízka":p.intenzita===3?"Stredná":p.intenzita===4?"Vysoká":"Veľmi vysoká"}</span>
                        </div>
                      </div>
                      <span style={{ fontSize:11, color: isOpen ? p.farba : "#D1D5DB", display:"inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition:"transform .2s", marginRight:4 }}>▼</span>
                    </div>
                    {/* Row 2: month bars full width */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(12,1fr)", padding:"0 12px 10px", gap:2 }}>
                      {MESIACE.map((m,i) => (
                        <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                          <div style={{ fontSize:8, color: i===currentMonth?"#166534":"#9CA3AF", fontWeight: i===currentMonth?700:400 }}>{m}</div>
                          {p.mesiace[i] ? (
                            <div style={{ width:"100%", height:8, borderRadius:3, background:p.farba, opacity:p.intenzita/5 }}/>
                          ) : (
                            <div style={{ width:"100%", height:2, background:"#F3F4F6", borderRadius:1, marginTop:3 }}/>
                          )}
                        </div>
                      ))}
                    </div>
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
                      <div className="cal-detail-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:24 }}>
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
      <div className="legend-bar" style={{ display:"flex", alignItems:"center", gap:24, padding:"16px 20px", background:T.bg, borderRadius:10, fontSize:12, color:T.textMuted, border:`1px solid ${T.cardBorder}` }}>
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
        <span className="legend-right" style={{ marginLeft:"auto", color:"#9CA3AF" }}>Klikni na riadok ▼ pre detail · Zdroj: ÚVZ SR</span>
      </div>
    </div>
  );
}

/* ══ FORECAST PAGE ══ */
function ForecastPage({ city, chosen, sens, forecast, setForecast, weather, weatherLoading, T }) {
  if (!T) T = LIGHT;
  const today = new Date().toLocaleDateString("sk-SK",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  // Hybrid scores for today — use calcHybrid if weather available, else calcForecast
  const hybridToday = (weather?.length && chosen?.length)
    ? calcHybrid(city, chosen, sens, weather)
    : null;

  // Reálne max skóre dnes
  const todayMax    = hybridToday
    ? Math.max(...hybridToday.map(h => h.days[0]?.score || 0), 0)
    : forecast?.total || 0;

  // VNÍMANÉ skóre — posunuté citlivosťou (pre farbu, label, varovania)
  const todayPerc   = perceivedScore(todayMax, sens);
  const todayRiziko = S2L_N[todayPerc] || S2L[todayPerc] || forecast?.riziko || "—";
  const sensAdvice  = sensitivityAdvice(todayPerc, sens);

  // Zajtra — reálne + vnímané
  const tomorrowMax  = hybridToday
    ? Math.max(...hybridToday.map(h => h.days[1]?.score || 0), 0)
    : (forecast?.days?.[0]?.s || 0);
  const tomorrowPerc = perceivedScore(tomorrowMax, sens);

  const trendDiff   = tomorrowPerc - todayPerc;
  const trendUp     = trendDiff >  0.4;
  const trendDown   = trendDiff < -0.4;
  const trendColor  = trendDown ? "#16a34a" : trendUp ? "#dc2626" : "#94a3b8";
  const trendArrow  = trendDown ? "↓" : trendUp ? "↑" : "→";
  const trendLabel  = trendDown ? "Zajtra lepšie" : trendUp ? "Zajtra horšie" : "Zajtra podobne";

  const rc  = COL[S2L[todayPerc]]  || "#3A7D44"; // S2L = ženský rod = kľúč v COL
  const rbg = BG[S2L[todayPerc]]   || "#f9fafb";

  // Warning threshold from SENS_THRESHOLD
  const warnAt   = SENS_THRESHOLD[sens] ?? 3;
  const sensWarn = todayPerc >= warnAt ? sensAdvice : null;

  return (
    <div className="forecast-page" style={{ flex:1, padding:"32px 36px", overflowY:"auto", overflowX:"hidden", background:T.bg, transition:"background .3s" }}>
      {!forecast && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"70vh", gap:16, opacity:.5 }}>
          <div style={{ fontSize:56 }}>🌿</div>
          <div style={{ fontSize:16, fontWeight:500, color:T.textMuted }}>Nastav profil a zobraz predpoveď</div>
          <div style={{ fontSize:13, color:T.textFaint }}>Vyber mesto, alergie a citlivosť v ľavom paneli</div>
        </div>
      )}
      {forecast && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
            <div>
              <div style={{ fontSize:13, color:T.textFaint, marginBottom:2 }}>{today}</div>
              <h1 style={{ fontSize:22, fontWeight:700, color:T.text, letterSpacing:"-.3px" }}>Peľová situácia · {city}</h1>
            </div>
            <button onClick={()=>setForecast(calcForecast(city,chosen,sens))} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", background:T.card, border:`1.5px solid ${T.cardBorder}`, borderRadius:8, fontSize:13, fontWeight:500, color:T.textSub, cursor:"pointer", transition:"all .2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#3A7D44"}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.cardBorder;}}>
              ↺ Obnoviť
            </button>
          </div>

          <div className="top-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
            <div style={{
              padding:24,
              borderRadius:14,
              background: `linear-gradient(160deg, ${rbg} 0%, ${T.card} 70%)`,
              border:`2px solid ${rc}55`,
              boxShadow:`0 4px 28px ${rc}22`,
              transition:"background .3s, border .3s",
            }}>
              {/* Header: label + sensitivity badge */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:700, color:rc, textTransform:"uppercase", letterSpacing:1 }}>
                  Celkové riziko · dnes
                </div>
                <div style={{ fontSize:9.5, padding:"2px 8px", borderRadius:20,
                  background:`${rc}15`, color:rc,
                  border:`1px solid ${rc}35`,
                  fontWeight:600, textTransform:"uppercase", letterSpacing:.5 }}>
                  {sens==="vysoká"?"⚡ Vysoká citlivosť": sens==="nízka"?"😌 Nízka citlivosť":"😐 Stredná citlivosť"}
                </div>
              </div>

              {/* Big risk label */}
              <div style={{ fontSize:32, fontWeight:800, color:rc, letterSpacing:"-1px", lineHeight:1, marginBottom:12 }}>
                {todayRiziko}
                {sens !== "stredná" && todayPerc !== todayMax && (
                  <span style={{ fontSize:11, fontWeight:400, color:rc, opacity:.6, marginLeft:6 }}>
                    (merané: {S2L[todayMax]})
                  </span>
                )}
              </div>

              {/* Dot progress bar */}
              <Dots score={todayPerc} color={rc}/>

              {/* Trend arrow + tomorrow */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:12, marginBottom:12,
                padding:"8px 12px", borderRadius:10,
                background:`${rc}10`, border:`1px solid ${rc}25` }}>
                <span style={{ fontSize:18, fontWeight:800, color:trendColor }}>{trendArrow}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:trendColor }}>{trendLabel}</div>
                  {tomorrowMax > 0 && (
                    <div style={{ fontSize:11, color:T.textMuted, marginTop:1 }}>
                      Zajtra: <span style={{ fontWeight:600, color:COL[S2L[tomorrowMax]]||T.textMuted }}>{S2L_N[tomorrowMax]}</span>
                      {trendDiff !== 0 && (
                        <span style={{ marginLeft:4, color:trendColor, fontSize:10 }}>
                          ({trendDiff>0?"+":""}{trendDiff.toFixed(1)} bod)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Advice text */}
              <div style={{ fontSize:11.5, color:rc, lineHeight:1.55, fontWeight:500,
                padding:"8px 12px", borderRadius:9,
                background:`${rc}08`, borderLeft:`3px solid ${rc}` }}>
                {sensAdvice}
              </div>
            </div>
            <div className="card" style={{ padding:22 }}>
              {(() => {
                const bw = calcBestWorstTime(weather?.[0], city, chosen, sens);
                const hasHourly = bw.hourlyScores?.length > 0;

                // Score → color for timeline bars
                const barColor = s =>
                  s < 0.25 ? "#16a34a" :
                  s < 0.50 ? "#84cc16" :
                  s < 0.70 ? "#f59e0b" :
                  s < 0.88 ? "#ea580c" : "#dc2626";

                const HOURS = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
                const HOUR_LABELS = ["6","","","9","","","12","","","15","","","18","","","21","22"];

                return (
                  <div>
                    {/* Header row */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                      <div className="lbl" style={{ marginBottom:0 }}>Čas vonku</div>
                      {/* Now indicator */}
                      {hasHourly && (
                        <div style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 8px",
                          background:`${bw.nowColor}15`, borderRadius:20, border:`1px solid ${bw.nowColor}30` }}>
                          <div style={{ width:6, height:6, borderRadius:"50%", background:bw.nowColor }}/>
                          <span style={{ fontSize:10.5, fontWeight:600, color:bw.nowColor }}>
                            Teraz {bw.nowHour}:00 — {bw.nowLevel}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Hourly mini-timeline */}
                    {hasHourly && (
                      <div style={{ marginBottom:14 }}>
                        <div style={{ display:"flex", gap:2, alignItems:"flex-end", height:32 }}>
                          {HOURS.map((hr, idx) => {
                            const s    = bw.hourlyScores[hr] ?? 0;
                            const col  = barColor(s);
                            const isNow = hr === bw.nowHour;
                            const barH = Math.max(4, Math.round(s * 28));
                            return (
                              <div key={hr} style={{ flex:1, display:"flex", flexDirection:"column",
                                alignItems:"center", justifyContent:"flex-end" }}>
                                <div style={{
                                  width:"100%", height:barH, borderRadius:"2px 2px 0 0",
                                  background: col,
                                  opacity: isNow ? 1 : 0.75,
                                  outline: isNow ? `2px solid ${col}` : "none",
                                  outlineOffset: 1,
                                  transition:"height .3s",
                                }}/>
                              </div>
                            );
                          })}
                        </div>
                        {/* Hour labels */}
                        <div style={{ display:"flex", gap:2, marginTop:2 }}>
                          {HOUR_LABELS.map((lbl,i) => (
                            <div key={i} style={{ flex:1, textAlign:"center",
                              fontSize:8.5, color: HOURS[i]===bw.nowHour?"#3A7D44":T.textPlaceholder,
                              fontWeight: HOURS[i]===bw.nowHour?700:400 }}>
                              {lbl}
                            </div>
                          ))}
                        </div>
                        {/* Color legend */}
                        <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:6 }}>
                          <div style={{ display:"flex", gap:1, flex:1 }}>
                            {["#16a34a","#84cc16","#f59e0b","#ea580c","#dc2626"].map(c => (
                              <div key={c} style={{ flex:1, height:3, background:c, borderRadius:1 }}/>
                            ))}
                          </div>
                          <span style={{ fontSize:9, color:T.textPlaceholder }}>nízky → vysoký</span>
                        </div>
                      </div>
                    )}

                    <div style={{ height:1, background:T.divider, marginBottom:12 }}/>

                    {/* Best + Worst */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      <div>
                        <div style={{ fontSize:10, color:T.textFaint, textTransform:"uppercase",
                          letterSpacing:.5, marginBottom:3 }}>✅ Odporúčaný čas</div>
                        <div style={{ fontSize:15, fontWeight:700, color:"#16a34a" }}>{bw.best}</div>
                        {bw.bestDuration > 0 && (
                          <div style={{ fontSize:10, color:"#16a34a", marginTop:1 }}>
                            ~{bw.bestDuration}h s nízkym peľom
                          </div>
                        )}
                        <div style={{ fontSize:10.5, color:T.textMuted, marginTop:3, lineHeight:1.4 }}>{bw.bestReason}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:10, color:T.textFaint, textTransform:"uppercase",
                          letterSpacing:.5, marginBottom:3 }}>⚠️ Vyhnúť sa</div>
                        <div style={{ fontSize:15, fontWeight:700, color:"#dc2626" }}>{bw.worst}</div>
                        <div style={{ fontSize:10.5, color:T.textMuted, marginTop:3, lineHeight:1.4 }}>{bw.worstReason}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="card" style={{ padding:24 }}>
              <div className="lbl">Počasie a výhľad</div>
              {weather && weather[0] ? (
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:4 }}>
                  {/* Today weather row */}
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:34 }}>{weather[0].emoji}</span>
                    <div>
                      <div style={{ fontSize:20, fontWeight:700, color:T.text }}>{Math.round(weather[0].temp)}°C</div>
                      <div style={{ fontSize:12, color:T.textMuted, marginTop:1 }}>
                        {weather[0].rain > 0.5 ? `💧 ${weather[0].rain.toFixed(0)}mm` : "Bez zrážok"}
                        {weather[0].wind > 15 ? ` · 💨 ${Math.round(weather[0].wind)} km/h` : ""}
                      </div>
                    </div>
                    <div style={{ marginLeft:"auto", textAlign:"right" }}>
                      {(() => { const drv = weatherDriver(weather[0], 0); return (
                        <div style={{ fontSize:11.5, color: drv.pos===false?"#16a34a":drv.pos===true?"#dc2626":"#6B7280", fontWeight:600, lineHeight:1.4, maxWidth:100 }}>
                          {drv.text}
                        </div>
                      ); })()}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height:1, background:"#F3F4F6" }}/>

                  {/* 3-day mini forecast */}
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {weather.slice(1, 4).map((day, i) => {
                      const dayIdx = i + 1;
                      const prevRain = weather[dayIdx - 1]?.rain || 0;
                      // Use hybrid (weather-adjusted) if available, fallback to calcForecast
                      const hybridScores = weather?.length
                        ? calcHybrid(city, chosen, sens, weather).map(h => h.days[i+1]?.score || 0)
                        : [];
                      const outlookScore = hybridScores.length
                        ? Math.max(...hybridScores, 0)
                        : (forecast?.days?.[i]?.s || 0);
                      const dc = COL[S2L[outlookScore]] || "#9CA3AF";
                      const drv = weatherDriver(day, prevRain);
                      const dayLabel = i === 0 ? "Zajtra" : i === 1 ? "Pozajtra" : "Za 3 dni";
                      return (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                          {/* Day + weather */}
                          <div style={{ width:64, flexShrink:0 }}>
                            <div style={{ fontSize:11, color:T.textFaint, fontWeight:600, textTransform:"uppercase", letterSpacing:.4 }}>{dayLabel}</div>
                          </div>
                          <span style={{ fontSize:16 }}>{day.emoji}</span>
                          <div style={{ fontSize:12, fontWeight:600, color:T.text, width:36, flexShrink:0 }}>{Math.round(day.temp)}°</div>
                          {day.rain > 0.5
                            ? <div style={{ fontSize:10, color:"#3b82f6", width:30, flexShrink:0 }}>💧{day.rain.toFixed(0)}</div>
                            : <div style={{ width:30, flexShrink:0 }}/>
                          }
                          {/* Pollen bar */}
                          <div style={{ flex:1, height:6, borderRadius:3, background:"#F3F4F6", overflow:"hidden" }}>
                            <div style={{ height:"100%", width:`${(outlookScore/5)*100}%`, background:dc, borderRadius:3, transition:"width .4s" }}/>
                          </div>
                          {/* Risk label */}
                          <div style={{ fontSize:11, fontWeight:700, color:dc, width:70, textAlign:"right", flexShrink:0 }}>
                            {S2L[outlookScore] || "—"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontSize:10.5, color:T.textPlaceholder }}>Open-Meteo · {city}</div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:4 }}>
                  {/* Fallback: static 3-day from calcForecast */}
                  {(forecast?.days || []).map((d,i) => {
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
                  <div style={{ fontSize:12, color:"#9CA3AF" }}>{weatherLoading ? "⏳ Načítavam počasie…" : "—"}</div>
                </div>
              )}
            </div>
          </div>

          <PollenTrendChart city={city} chosen={chosen} sens={sens} weather={weather} loading={weatherLoading} T={T}/>

          {/* Concentration scale — directly below chart */}
          <ConcentrationInfoWidget T={T}/>

          <div className="main-grid" style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:16, marginBottom:16 }}>
            <div className="card" style={{ padding:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div className="lbl" style={{ marginBottom:0 }}>Tvoje alergény dnes</div>
                <div style={{ fontSize:11, color:T.textFaint }}>týždeň 21–22/2026</div>
              </div>
              {(hybridToday
                  ? hybridToday.map(h => ({
                      ...POLLEN_DATA[h.id],
                      id: h.id,
                      s: h.days[0]?.score || 0,
                      uroven: h.days[0]?.uroven || "Veľmi nízka",
                      isRiskyForUser: h.days[0]?.score >= (SENS_THRESHOLD[sens]||3),
                      pelZrn: (CITY_DATA[city]?.[`pel${h.id.charAt(0).toUpperCase()+h.id.slice(1)}`]) || POLLEN_DATA[h.id]?.pelZrn,
                    }))
                  : forecast.allergens
                ).map((a,i) => {
                const realS = a.s || 0;
                const percS = perceivedScore(realS, sens);
                const col   = COL[S2L[percS]] || COL[a.uroven] || "#888";
                const bg    = BG[S2L[percS]]  || "#f9fafb";
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom: i<(hybridToday||forecast.allergens).length-1?`1px solid ${T.divider}`:"none" }}>
                    <div style={{ fontSize:20, width:28, textAlign:"center", flexShrink:0 }}>{a.emoji}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                        <span style={{ fontSize:14, fontWeight:600, color:T.text }}>{a.label}</span>
                        {a.sezona && <span style={{ fontSize:10, fontWeight:600, color:col, background:`${col}18`, padding:"1px 6px", borderRadius:20 }}>SEZÓNA</span>}
                        {a.isRiskyForUser && <span style={{ fontSize:10, fontWeight:600, color:"#dc2626", background:"#fef2f2", padding:"1px 6px", borderRadius:20 }}>⚠ rizik. pre teba</span>}
                      </div>
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>{a.komentar}</div>
                      <Dots score={a.s} color={col}/>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:col }}>{a.uroven}</div>
                      <div style={{ fontSize:11, color:T.textFaint, marginTop:2 }}>{a.trend}</div>
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
                    <div style={{ fontSize:13.5, color:T.textSub, lineHeight:1.6 }}>{r}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:20, padding:"12px 14px", background:T.tipBg, borderRadius:10, borderLeft:`3px solid ${T.tipBorder}` }}>
                <div style={{ fontSize:11, fontWeight:600, color:T.tipBorder, marginBottom:3, textTransform:"uppercase", letterSpacing:.5 }}>Vedeli ste?</div>
                <div style={{ fontSize:12.5, color:T.tipText, lineHeight:1.5 }}>Peľová sezóna tráv je pre alergikov najnáročnejšia — trávy produkujú obrovské množstvo ľahkého peľu, ktorý sa šíri do vzdialenosti až 400 km.</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding:22 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:0 }}>Prognóza · {PROGNOZA.tyzden}</div>
              <div style={{ fontSize:11, color:"#9CA3AF" }}>{PROGNOZA.datum}</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))", gap:10, marginBottom:14 }}>
              {PROGNOZA.items.map((p,i) => (
                <div key={i} style={{ display:"flex", gap:10, padding:"10px 12px", background:`${p.color}08`, borderRadius:10, border:`1px solid ${p.color}20`, alignItems:"flex-start" }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{p.emoji}</span>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:T.text }}>{p.label}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:p.color, background:`${p.color}18`, padding:"1px 6px", borderRadius:20 }}>{p.trend}</span>
                    </div>
                    <div style={{ fontSize:12, color:T.textMuted, lineHeight:1.5 }}>{p.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:`1px solid ${T.divider}` }}>
              <div style={{ fontSize:11.5, color:T.textFaint, fontStyle:"italic" }}>⚠️ {PROGNOZA.poznamka}</div>
              <div style={{ fontSize:11, color:T.textPlaceholder, flexShrink:0, marginLeft:12 }}>{PROGNOZA.zdroj}</div>
            </div>
          </div>

          <div style={{ marginTop:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:11, color:"#D1D5DB" }}>Zdroj: ÚVZ SR · Stanice: RÚVZ BB, NR, KE, TT, ZA · ÚVZ SR BA</div>
            <button onClick={()=>setForecast(null)} style={{ fontSize:12, color:"#9CA3AF", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>Resetovať</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ SIDEBAR (shared) ══ */
function Sidebar({ page, setPage, city, setCity, chosen, toggle, sens, setSens, go, T, dark, setDark }) {
  return (
    <aside style={{ width:280, minWidth:280, background:T.sidebar, borderRight:`1px solid ${T.sidebarBorder}`, height:"100vh", position:"sticky", top:0, overflowY:"auto", display:"flex", flexDirection:"column", transition:"background .3s" }} className="sidebar-inner">
      {/* Logo */}
      <div style={{ padding:"24px 20px 16px", borderBottom:`1px solid ${T.sidebarBorder}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
          <span style={{ fontSize:20 }}>🌿</span>
          <span style={{ fontSize:19, fontWeight:700, color:T.accent, letterSpacing:"-.3px" }}>Alergio</span>
        </div>
        <div style={{ fontSize:11.5, color:T.textFaint }}>Peľová predpoveď pre Slovensko</div>
        <button onClick={()=>setDark(d=>!d)} style={{
          marginTop:10, display:"flex", alignItems:"center", gap:7, padding:"5px 10px",
          background:T.toggleBg, border:`1px solid ${T.cardBorder}`, borderRadius:20,
          fontSize:12, fontWeight:500, color:T.textMuted, cursor:"pointer",
          fontFamily:"'Inter',sans-serif", transition:"all .2s",
        }}>
          <span>{T.toggleIcon}</span>
          <span>{dark ? "Svetlý režim" : "Tmavý režim"}</span>
        </button>
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
          <div style={{ height:1, background:T.divider, marginBottom:16 }}/>
          <div style={{ marginBottom:18 }}>
            <span style={{ fontSize:11, fontWeight:600, color:T.lbl, textTransform:"uppercase", letterSpacing:.8, display:"block", marginBottom:7 }}>Mesto</span>
            <select style={{ width:"100%", padding:"8px 12px", border:`1.5px solid ${T.inputBorder}`, borderRadius:9, fontSize:13.5, fontFamily:"'Inter',sans-serif", color:T.text, background:T.input, outline:"none", appearance:"none", WebkitAppearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center", paddingRight:28 }} value={city} onChange={e=>setCity(e.target.value)}>
              {CITIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:18 }}>
            <span style={{ fontSize:11, fontWeight:600, color:T.lbl, textTransform:"uppercase", letterSpacing:.8, display:"block", marginBottom:7 }}>Moje alergie</span>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {Object.entries(POLLEN_DATA).map(([id,d]) => (
                <button key={id} onClick={()=>toggle(id)} style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"5px 10px", border:`1.5px solid ${chosen.includes(id)?"#3A7D44":T.chipBorder}`, borderRadius:100, fontSize:12, fontWeight: chosen.includes(id)?600:400, color: chosen.includes(id)?"#166534":T.textMuted, cursor:"pointer", background: chosen.includes(id)?T.accentLight:T.chipBg, transition:"all .15s" }}>
                  {d.emoji} {d.short}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:20 }}>
            <span style={{ fontSize:11, fontWeight:600, color:T.lbl, textTransform:"uppercase", letterSpacing:.8, display:"block", marginBottom:7 }}>Citlivosť</span>
            <div style={{ display:"flex", gap:5 }}>
              {[["nízka","Nízka"],["stredná","Stredná"],["vysoká","Vysoká"]].map(([v,l])=>(
                <button key={v} onClick={()=>setSens(v)} style={{ flex:1, padding:"7px 4px", border:`1.5px solid ${sens===v?"#3A7D44":T.inputBorder}`, borderRadius:7, fontSize:12, fontWeight: sens===v?600:400, fontFamily:"'Inter',sans-serif", cursor:"pointer", background: sens===v?T.accentLight:T.input, color: sens===v?"#166534":T.textMuted, transition:"all .15s" }}>{l}</button>
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
          <div style={{ height:1, background:T.divider, marginBottom:16 }}/>
          <div style={{ fontSize:12.5, color:T.textMuted, lineHeight:1.7 }}>
            Prehľad sezón kvitnutia všetkých alergénov na Slovensku.<br/><br/>
            Klikni na riadok pre rozbalenie detailu.
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding:"14px 20px", borderTop:`1px solid ${T.sidebarBorder}` }}>
        <div style={{ fontSize:11, color:T.textPlaceholder, lineHeight:1.6 }}>
          Dáta: ÚVZ SR<br/>
          22. týždeň 2026 · 3.6.2026
        </div>
      </div>
    </aside>
  );
}

const SK_DAYS = ["Nedeľa","Pondelok","Utorok","Streda","Štvrtok","Piatok","Sobota"];

// Trend direction colors — klesá=zelená (dobrá správa), stúpa=červená (zlá správa)
const TREND_UP   = "#dc2626"; // stúpajúci peľ = zlé
const TREND_DOWN = "#16a34a"; // klesajúci peľ = dobré
const TREND_FLAT = "#94a3b8"; // stabilný

function trendColor(scores) {
  const slope = (scores[scores.length-1] - scores[0]) / Math.max(scores.length-1, 1);
  if (slope >  0.15) return TREND_UP;
  if (slope < -0.15) return TREND_DOWN;
  return TREND_FLAT;
}

function PollenTrendChart({ city, chosen, sens, weather, loading, T }) {
  if (!T) T = LIGHT;
  const [hoverIdx, setHoverIdx] = useState(null);
  const svgRef = useRef(null);

  if (loading) return (
    <div className="card" style={{ padding:20, textAlign:"center", marginBottom:16 }}>
      <div style={{ fontSize:13, color:T.textFaint }}>⏳ Sťahujem predpoveď počasia…</div>
    </div>
  );
  if (!weather?.length || !chosen?.length) return null;

  const hybrid = calcHybrid(city, chosen, sens, weather);
  const DAYS   = weather.length;

  // SVG layout — výška znížená o 1/3 (210→140)
  const VW = 560, VH = 148;
  const PAD = { t:12, r:18, b:42, l:52 };
  const CW  = VW - PAD.l - PAD.r;
  const CH  = VH - PAD.t - PAD.b;

  const xAt = i => PAD.l + (i / (DAYS-1)) * CW;
  const yAt = s => PAD.t + CH * (1 - Math.min(s,5)/5);

  function smoothPath(scores) {
    const pts = scores.map((s,i) => [xAt(i), yAt(s)]);
    if (pts.length < 2) return "";
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length-1; i++) {
      const [x0,y0] = pts[Math.max(0,i-1)];
      const [x1,y1] = pts[i], [x2,y2] = pts[i+1];
      const [x3,y3] = pts[Math.min(pts.length-1,i+2)];
      const cp1x=x1+(x2-x0)/6, cp1y=y1+(y2-y0)/6;
      const cp2x=x2-(x3-x1)/6, cp2y=y2-(y3-y1)/6;
      d+=` C${cp1x.toFixed(1)},${cp1y.toFixed(1)},${cp2x.toFixed(1)},${cp2y.toFixed(1)},${x2.toFixed(1)},${y2.toFixed(1)}`;
    }
    return d;
  }

  const handleMouse = e => {
    const svg = svgRef.current; if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const svgX  = ((e.clientX-rect.left)/rect.width)*VW;
    let best=0, bestD=Infinity;
    for (let i=0;i<DAYS;i++) { const d=Math.abs(xAt(i)-svgX); if(d<bestD){bestD=d;best=i;} }
    setHoverIdx(best);
  };

  const hDay = hoverIdx!==null ? weather[hoverIdx] : null;
  const hDrv = hDay ? weatherDriver(hDay, hoverIdx>0?weather[hoverIdx-1].rain:0) : null;

  // Risk bands (very subtle)
  const BANDS = [
    {from:4,to:5,color:"#fef2f2"},{from:3,to:4,color:"#fff7ed"},
    {from:2,to:3,color:"#fefce8"},{from:1,to:2,color:"#f7fee7"},{from:0,to:1,color:"#f0fdf4"},
  ];
  const Y_LABELS = [[5,"V.Vysoká"],[4,"Vysoká"],[3,"Stredná"],[2,"Nízka"],[1,"V.Nízka"]];

  // Per-allergen trend colors
  const allergenColors = hybrid.map(h => trendColor(h.days.map(d=>d.score)));

  return (
    <div className="card" style={{ padding:"18px 20px 12px", marginBottom:16 }}>

      {/* Header + legend */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div>
          <div className="lbl" style={{ marginBottom:1 }}>Trend peľu · 7 dní</div>
          <div style={{ fontSize:10, color:T.textFaint }}>ÚVZ SR × fenológia × počasie</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end" }}>
          {/* Allergen list with trend arrow */}
          <div style={{ display:"flex", gap:"4px 10px", flexWrap:"wrap", justifyContent:"flex-end", maxWidth:300 }}>
            {hybrid.map((h,hi) => {
              const scores = h.days.map(d=>d.score);
              const slope  = (scores[scores.length-1]-scores[0]) / Math.max(scores.length-1,1);
              const isUp   = slope > 0.15;
              const isDn   = slope < -0.15;
              return (
                <div key={h.id} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:9, fontWeight:700, color:isDn?"#16a34a":isUp?"#dc2626":"#94a3b8" }}>
                    {isDn?"↓":isUp?"↑":"→"}
                  </span>
                  <span style={{ fontSize:10, color:T.textMuted }}>{h.emoji} {h.label}</span>
                </div>
              );
            })}
          </div>
          {/* Color scale hint */}
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:40, height:4, borderRadius:2, background:"linear-gradient(to right,#16a34a,#f59e0b,#dc2626)" }}/>
            <span style={{ fontSize:9, color:T.textPlaceholder }}>nízky → vysoký peľ</span>
          </div>
        </div>
      </div>

      {/* SVG */}
      <div style={{ position:"relative" }}>
        <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} width="100%"
          style={{ display:"block", cursor:"crosshair", userSelect:"none" }}
          onMouseMove={handleMouse} onMouseLeave={()=>setHoverIdx(null)}>

          <defs>
            {/* Vertical Y-based gradient: red at top (high pollen=bad), green at bottom (low=good) */}
            <linearGradient id="y-grad-line" x1="0" y1={PAD.t} x2="0" y2={PAD.t+CH} gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#dc2626"/>
              <stop offset="50%"  stopColor="#f59e0b"/>
              <stop offset="100%" stopColor="#16a34a"/>
            </linearGradient>
            {/* Area fill gradient per line — very subtle */}
            {hybrid.map((h,hi) => (
              <linearGradient key={h.id} id={`area-${h.id}`} x1="0" y1={PAD.t} x2="0" y2={PAD.t+CH} gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#dc2626" stopOpacity="0.10"/>
                <stop offset="50%"  stopColor="#f59e0b" stopOpacity="0.05"/>
                <stop offset="100%" stopColor="#16a34a" stopOpacity="0.02"/>
              </linearGradient>
            ))}
          </defs>

          {/* Minimal background — single subtle gradient wash */}
          <defs>
            <linearGradient id="bg-wash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef2f2" stopOpacity="0.6"/>
              <stop offset="60%" stopColor="#fefce8" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#f0fdf4" stopOpacity="0.5"/>
            </linearGradient>
          </defs>
          <rect x={PAD.l} y={PAD.t} width={CW} height={CH} fill="url(#bg-wash)" rx="4"/>

          {/* Grid lines */}
          {[1,2,3,4,5].map(s => (
            <line key={s} x1={PAD.l} x2={PAD.l+CW} y1={yAt(s)} y2={yAt(s)}
              stroke={T.cardBorder} strokeWidth="0.8"/>
          ))}

          {/* Y labels */}
          {Y_LABELS.map(([s,lbl]) => (
            <text key={s} x={PAD.l-6} y={yAt(s)+4}
              textAnchor="end" fontSize="8" fill={T.textPlaceholder}>{lbl}</text>
          ))}

          {/* X labels: day name + date + emoji */}
          {weather.map((day,i) => {
            const nm = i===0?"Dnes":i===1?"Zajtra":SK_DAYS[new Date(day.date).getDay()];
            const dt = new Date(day.date).toLocaleDateString("sk-SK",{day:"numeric",month:"numeric"});
            return (
              <g key={i}>
                <text x={xAt(i)} y={VH-PAD.b+11} textAnchor="middle"
                  fontSize="9.5" fontWeight={i===0?"700":"500"}
                  fill={i===0?"#3A7D44":T.textFaint}>{nm}</text>
                <text x={xAt(i)} y={VH-PAD.b+20} textAnchor="middle"
                  fontSize="8" fill={T.textPlaceholder}>{dt}</text>
                <text x={xAt(i)} y={VH-PAD.b+32} textAnchor="middle" fontSize="10">{day.emoji}</text>
              </g>
            );
          })}

          {/* Hover line */}
          {hoverIdx!==null && (
            <line x1={xAt(hoverIdx)} x2={xAt(hoverIdx)} y1={PAD.t} y2={PAD.t+CH}
              stroke="#3A7D44" strokeWidth="1.5" strokeDasharray="3,3" opacity={0.45}/>
          )}

          {/* Area fills + lines + emoji dots */}
          {hybrid.map((h,hi) => {
            const scores = h.days.map(d=>d.score);
            const col    = allergenColors[hi];
            const line   = smoothPath(scores);
            const area   = line+` L${xAt(DAYS-1).toFixed(1)},${yAt(0).toFixed(1)} L${xAt(0).toFixed(1)},${yAt(0).toFixed(1)} Z`;
            return (
              <g key={h.id}>
                {/* Subtle area fill — Y-gradient */}
                <path d={area} fill={`url(#area-${h.id})`}/>
                {/* Line — thin, Y-gradient stroke */}
                <path d={line} fill="none" stroke="url(#y-grad-line)" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" opacity={0.85}/>
                {/* Small emoji at each point — grows on hover */}
                {scores.map((s,i) => (
                  <text key={i} x={xAt(i)} y={yAt(s)}
                    textAnchor="middle"
                    fontSize={hoverIdx===i ? "11" : "9"}
                    style={{ transition:"font-size .15s", userSelect:"none" }}
                    dominantBaseline="middle">{h.emoji}</text>
                ))}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoverIdx!==null && hDay && (
          <div style={{
            position:"absolute",
            left:`${(xAt(hoverIdx)/VW)*100}%`,
            top:"2px",
            transform: hoverIdx>=DAYS-2?"translateX(-108%)":hoverIdx===0?"translateX(6px)":"translateX(-50%)",
            background:T.card, border:`1.5px solid ${T.cardBorder}`,
            borderRadius:10, padding:"10px 12px",
            boxShadow:"0 4px 20px rgba(0,0,0,.12)",
            minWidth:155, pointerEvents:"none", zIndex:10,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7,
              paddingBottom:6, borderBottom:`1px solid ${T.divider}` }}>
              <span style={{ fontSize:20 }}>{hDay.emoji}</span>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:T.text }}>
                  {hoverIdx===0?"Dnes":hoverIdx===1?"Zajtra":SK_DAYS[new Date(hDay.date).getDay()]}
                  <span style={{ fontSize:9, fontWeight:400, color:T.textFaint, marginLeft:4 }}>
                    {new Date(hDay.date).toLocaleDateString("sk-SK",{day:"numeric",month:"numeric"})}
                  </span>
                </div>
                <div style={{ fontSize:10.5, color:T.textMuted }}>
                  {Math.round(hDay.temp)}°C{hDay.rain>0.5?` · 💧${hDay.rain.toFixed(0)}mm`:""}
                  {hDay.wind>15?` · 💨${Math.round(hDay.wind)}km/h`:""}
                </div>
              </div>
            </div>
            {hybrid.map((h,hi) => {
              const ds       = h.days[hoverIdx];
              const levelCol = COL[ds.uroven] || "#94a3b8";
              return (
                <div key={h.id} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:levelCol, flexShrink:0 }}/>
                  <span style={{ fontSize:10.5, color:T.textSub, flex:1 }}>{h.emoji} {h.label}</span>
                  <span style={{ fontSize:10.5, fontWeight:700, color:levelCol }}>{ds.uroven}</span>
                </div>
              );
            })}
            {hDrv && (
              <div style={{ marginTop:5, paddingTop:5, borderTop:`1px solid ${T.divider}`,
                fontSize:10, fontWeight:600,
                color:hDrv.pos===false?"#16a34a":hDrv.pos===true?"#dc2626":T.textMuted }}>
                {hDrv.pos===false?"↓ ":hDrv.pos===true?"↑ ":"→ "}{hDrv.text}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ fontSize:9.5, color:T.textPlaceholder, textAlign:"right", marginTop:3 }}>
        Prechod kurzorom = detail · 🟢 klesá · 🔴 stúpa
      </div>
    </div>
  );
}
function ConcentrationInfoWidget({ T }) {
  if (!T) T = LIGHT;
  const [open, setOpen] = useState(false);
  return (
    <div className="card" style={{ padding:"14px 18px", marginBottom:16 }}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        width:"100%", background:"none", border:"none", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        fontFamily:"'Inter',sans-serif", padding:0,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:14 }}>ℹ️</span>
          <span style={{ fontSize:12.5, fontWeight:600, color:T.text }}>Čo znamenajú hodnoty peľu?</span>
        </div>
        <span style={{ fontSize:13, color:T.textFaint, transition:"transform .2s",
          display:"inline-block", transform: open?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
      </button>
      {open && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${T.divider}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:10 }}>
            {CONC_INFO.map((c,i) => (
              <div key={i} style={{ background:c.bg, borderRadius:9, padding:"10px 10px",
                border:`1px solid ${c.color}25` }}>
                <div style={{ fontSize:11, fontWeight:700, color:c.color, marginBottom:2 }}>{c.label}</div>
                <div style={{ fontSize:12, fontWeight:600, color:T.text, marginBottom:3 }}>{c.range} zŕn/m³</div>
                <div style={{ fontSize:11, color:T.textMuted, lineHeight:1.4 }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:10.5, color:T.textFaint, lineHeight:1.5, fontStyle:"italic" }}>
            {CONC_NOTE}
          </div>
        </div>
      )}
    </div>
  );
}

// ── GA4 dynamické načítanie po súhlase ──
function loadGA4() {
  if (window.__ga4Loaded) return;
  window.__ga4Loaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=G-YC302EP2P7";
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", "G-YC302EP2P7");
}

function CookieBanner({ onConsent, T }) {
  if (!T) T = LIGHT;
  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:1000,
      background:T.card, borderTop:`1px solid ${T.cardBorder}`,
      padding:"12px 20px",
      boxShadow:"0 -4px 20px rgba(0,0,0,.08)",
      display:"flex", alignItems:"center", gap:12, flexWrap:"wrap",
    }}>
      <span style={{ fontSize:12.5, color:T.textMuted, flex:1, minWidth:200, lineHeight:1.5 }}>
        🍪 Používame analytické cookies (Google Analytics) na zlepšenie aplikácie.
        Vaše nastavenia alergií ukladáme lokálne vo vašom prehliadači.{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener"
          style={{ color:"#3A7D44", textDecoration:"underline" }}>Viac info</a>
      </span>
      <div style={{ display:"flex", gap:8, flexShrink:0 }}>
        <button onClick={()=>onConsent(false)} style={{
          padding:"7px 14px", border:`1.5px solid ${T.cardBorder}`, borderRadius:8,
          background:"transparent", color:T.textMuted, fontSize:12.5, fontWeight:500,
          fontFamily:"'Inter',sans-serif", cursor:"pointer",
        }}>Odmietnuť</button>
        <button onClick={()=>onConsent(true)} style={{
          padding:"7px 16px", border:"none", borderRadius:8,
          background:"#1a3622", color:"#fff", fontSize:12.5, fontWeight:600,
          fontFamily:"'Inter',sans-serif", cursor:"pointer",
        }}>Prijať analytiku</button>
      </div>
    </div>
  );
}

function DynamicStyles({ T }) {
  return (
    <style>{`
      .card {
        background: ${T.card} !important;
        border: 1px solid ${T.cardBorder} !important;
        box-shadow: 0 2px 18px rgba(0,0,0,${T === DARK ? ".25" : ".07"}) !important;
        transition: background .3s, border .3s !important;
      }
      .lbl { color: ${T.lbl} !important; }
      body { background: ${T.bg}; transition: background .3s; }
      .mobile-nav { background: ${T.navBg} !important; border-top: 1px solid ${T.navBorder} !important; }
      .mobile-nav-btn { color: ${T.textFaint} !important; }
      .mobile-nav-btn.on { color: ${T.accentText} !important; }
      .mobile-back { background: ${T.card} !important; border-bottom: 1px solid ${T.cardBorder} !important; }
      ::-webkit-scrollbar-thumb { background: ${T.cardBorder}; }
      .cal-cat-label { background: ${T.bg} !important; }
      select { background: ${T.input} !important; color: ${T.text} !important; border-color: ${T.inputBorder} !important; }
    `}</style>
  );
}

/* ══ ROOT APP ══ */
export default function App() {
  // ── Preferences — uložené v localStorage (funkčné, nevyžadujú súhlas) ──
  const [page,    setPage]    = useState("forecast");
  const [city,    setCity]    = useState(() => localStorage.getItem("alergio_city") || "Bratislava");
  const [chosen,  setChosen]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("alergio_allergens")) || ["travy","borovica"]; }
    catch { return ["travy","borovica"]; }
  });
  const [sens,    setSens]    = useState(() => localStorage.getItem("alergio_sens") || "stredná");
  const [dark,    setDark]    = useState(() => localStorage.getItem("alergio_dark") === "1");
  const [forecast,setForecast]= useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // ── Cookie consent ──
  const [consent, setConsent] = useState(() => localStorage.getItem("alergio_consent")); // "yes"|"no"|null

  // Uložiť preferencie pri zmene
  useEffect(() => { localStorage.setItem("alergio_city", city); }, [city]);
  useEffect(() => { localStorage.setItem("alergio_allergens", JSON.stringify(chosen)); }, [chosen]);
  useEffect(() => { localStorage.setItem("alergio_sens", sens); }, [sens]);
  useEffect(() => { localStorage.setItem("alergio_dark", dark ? "1" : "0"); }, [dark]);

  // Načítať GA4 ak je súhlas
  useEffect(() => { if (consent === "yes") loadGA4(); }, [consent]);

  const handleConsent = (accepted) => {
    const val = accepted ? "yes" : "no";
    localStorage.setItem("alergio_consent", val);
    setConsent(val);
    if (accepted) loadGA4();
  };

  const T = dark ? DARK : LIGHT;

  const toggle = id => setChosen(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);

  const go = async () => {
    if (!chosen.length) return;
    setForecast(calcForecast(city, chosen, sens));
    setWeatherLoading(true);
    try {
      const w = await fetchWeather(city);
      setWeather(w);
    } catch(e) { console.warn("Počasie nedostupné:", e); }
    finally { setWeatherLoading(false); }
  };

  // Auto-refresh forecast when settings change
  useEffect(() => {
    if (forecast && chosen.length) setForecast(calcForecast(city, chosen, sens));
  }, [city, chosen, sens]);

  // Re-fetch weather when city changes (if forecast already shown)
  useEffect(() => {
    if (!forecast) return;
    setWeatherLoading(true);
    fetchWeather(city)
      .then(w => setWeather(w))
      .catch(e => console.warn("Počasie nedostupné:", e))
      .finally(() => setWeatherLoading(false));
  }, [city]);

  // On mobile: show results screen OR setup screen (not both)
  // isMobileResult = mobile + forecast exists + on forecast page
  const showMobileResults = forecast && page === "forecast";

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Inter',system-ui,sans-serif", transition:"background .3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:#D1D5DB; border-radius:2px; }
        .card { border-radius:14px; }
        .lbl { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.8px; display:block; margin-bottom:8px; }

        /* ── DESKTOP ── */
        .layout { display:flex; max-width:1440px; margin:0 auto; min-height:100vh; }
        .sidebar-el { display:block; }
        .top-grid { grid-template-columns:1fr 1fr 1fr; }
        .main-grid { grid-template-columns:1.2fr 1fr; }
        .mobile-nav { display:none; }
        .mobile-back { display:none; }

        /* ── MOBILE ── */
        @media (max-width:768px) {
          .layout { flex-direction:column; }

          /* Mobile nav bar at bottom */
          .mobile-nav {
            display:flex;
            position:fixed; bottom:0; left:0; right:0; z-index:100;
            background:#fff; border-top:1px solid #EAECF0;
            padding:8px 0 max(8px, env(safe-area-inset-bottom));
          }
          .mobile-nav-btn {
            flex:1; display:flex; flex-direction:column; align-items:center; gap:3px;
            background:none; border:none; cursor:pointer; padding:4px 0;
            font-family:'Inter',sans-serif; font-size:10px; font-weight:500;
            color:#9CA3AF; transition:color .15s;
          }
          .mobile-nav-btn.on { color:#166534; }

          /* Sidebar becomes full-screen setup on mobile */
          .sidebar-el {
            width:100% !important; min-width:unset !important;
            height:auto !important; position:static !important;
            border-right:none !important;
          }
          /* Hide sidebar when showing results on mobile */
          .sidebar-el.hidden-mobile { display:none !important; }
          /* Hide main results when showing setup on mobile */
          .main-hidden-mobile { display:none !important; }

          /* Back bar on mobile results */
          .mobile-back {
            display:flex;
            align-items:center; justify-content:space-between;
            padding:12px 16px;
            background:#fff; border-bottom:1px solid #EAECF0;
            position:sticky; top:0; z-index:10;
          }

          .top-grid { grid-template-columns:1fr !important; }
          .main-grid { grid-template-columns:1fr !important; }

          /* Add padding for bottom nav */
          .main-content { padding-bottom:80px !important; }
          .sidebar-inner { width:100% !important; height:auto !important; position:static !important; }
          .sidebar-inner aside { padding-bottom:20px; }

          /* Forecast carousel: 3 columns on mobile */
          .forecast-carousel { grid-template-columns: repeat(3,1fr) !important; }
          .forecast-carousel > *:nth-child(4) { display:none !important; }

          /* No horizontal overflow anywhere */
          body, html { overflow-x:hidden; max-width:100vw; }
          * { max-width:100%; }

          /* Season overview — stack vertically on mobile */
          .season-grid { grid-template-columns:1fr 1fr !important; }

          /* Calendar — mobile layout */
          .cal-header { display:none !important; }
          .cal-cat-label { font-size:12px !important; padding:8px 12px !important; }
          .cal-row-desktop { display:none !important; }
          .cal-row-mobile { display:block !important; }
          .cal-detail-grid { grid-template-columns:1fr !important; }

          /* Forecast page padding */
          .forecast-page { padding:16px 14px 24px !important; }
          .almanach-page { padding:16px 14px 24px !important; }

          /* Legend wrap */
          .legend-bar { flex-wrap:wrap !important; gap:10px !important; }
          .legend-bar .legend-right { margin-left:0 !important; width:100%; }
        }
      `}</style>

      <DynamicStyles T={T}/>
      {consent === null && <CookieBanner onConsent={handleConsent} T={T}/>}
      <div className="layout">

        {/* Sidebar — hidden on mobile when showing results */}
        <div className={`sidebar-el${showMobileResults ? " hidden-mobile" : ""}`}>
          <Sidebar page={page} setPage={setPage} city={city} setCity={setCity} chosen={chosen} toggle={toggle} sens={sens} setSens={setSens} go={go} T={T} dark={dark} setDark={setDark}/>
        </div>

        {/* Main content */}
        <main className={`main-content${!showMobileResults && page==="forecast" ? " main-hidden-mobile" : ""}`}
          style={{ flex:1, overflowY:"auto", paddingBottom: consent===null ? 80 : 0 }}>

          {/* Mobile back bar — only visible on mobile when showing results */}
          {page === "forecast" && forecast && (
            <div className="mobile-back">
              <button onClick={()=>setForecast(null)} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", fontSize:14, fontWeight:600, color:T.accentText, fontFamily:"'Inter',sans-serif" }}>
                ← Zmeniť nastavenia
              </button>
              <button onClick={()=>setForecast(calcForecast(city,chosen,sens))} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px", background:"#F0FDF4", border:"1px solid #86efac", borderRadius:8, fontSize:13, fontWeight:500, color:"#166534", cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
                ↺ Obnoviť
              </button>
            </div>
          )}

          {page === "forecast" && <ForecastPage city={city} chosen={chosen} sens={sens} forecast={forecast} setForecast={setForecast} weather={weather} weatherLoading={weatherLoading} T={T}/>}
          {page === "almanach" && <AlmanachPage T={T}/>}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        {[
          { id:"forecast", label:"Predpoveď", icon:"📊" },
          { id:"almanach", label:"Kalendár", icon:"📅" },
        ].map(n => (
          <button key={n.id} className={`mobile-nav-btn${page===n.id?" on":""}`}
            onClick={()=>{ setPage(n.id); if(n.id!=="forecast") setForecast(null); }}>
            <span style={{ fontSize:22 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}