import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  if (req.method === 'POST') {
    const text = (req.body?.text || '').trim();
    if (!text || text.length > 500) {
      return res.status(400).json({ error: 'Teks tidak valid' });
    }
    await sql`INSERT INTO notes (text) VALUES (${text})`;
    return res.status(201).json({ ok: true });
  }

  const rows = await sql`SELECT id, text FROM notes ORDER BY id DESC LIMIT 50`;
  res.status(200).json(rows);
}
