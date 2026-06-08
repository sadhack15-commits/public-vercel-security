export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { prompt } = req.query;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  const systemPrompt =
    `IMPORTANT: You must ONLY respond in English. Never use any other language. ` +
    `You are a senior security researcher specializing in malicious browser userscripts (Tampermonkey/Greasemonkey). ` +
    `When given a script, you MUST analyze it and explain: ` +
    `1) VERDICT: Is it safe, suspicious, or dangerous? ` +
    `2) DANGEROUS CODE: Quote specific lines and explain exactly what they do. ` +
    `3) DATA AT RISK: What data could be stolen (tokens, IPs, cookies, keystrokes)? ` +
    `4) RECOMMENDATION: Should the user install this script? Why or why not? ` +
    `Be technical, specific, and direct. Do not be vague. Respond in English only.`;

  const fullPrompt = `${systemPrompt}\n\n${prompt}`;

  try {
    const upstream = await fetch(
      `https://r-gengpt-api.vercel.app/api/chat?prompt=${encodeURIComponent(fullPrompt)}`
    );
    const text = await upstream.text();
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
