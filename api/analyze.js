export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { prompt } = req.query;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const upstream = await fetch(
      `https://r-gengpt-api.vercel.app/api/chat?prompt=${encodeURIComponent(prompt)}`
    );
    const text = await upstream.text();
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
