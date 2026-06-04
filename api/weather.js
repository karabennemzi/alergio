// api/weather.js — Vercel serverless proxy pre Open-Meteo

export default async function handler(req, res) {
  const lat = req.query?.lat || "48.1486";
  const lon = req.query?.lon || "17.1077";

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&daily=temperature_2m_max,precipitation_sum,windspeed_10m_max,cloudcover_mean,weathercode` +
    `&hourly=temperature_2m,precipitation,windspeed_10m,cloudcover,relative_humidity_2m` +
    `&forecast_days=7&timezone=Europe%2FBratislava`;

  let lastErr;
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`${r.status}`);
      const data = await r.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "s-maxage=1800");
      return res.status(200).json(data);
    } catch (e) {
      lastErr = e;
      if (i < 2) await new Promise(r => setTimeout(r, 400 * (i + 1)));
    }
  }

  res.status(502).json({ error: lastErr?.message || "failed" });
}