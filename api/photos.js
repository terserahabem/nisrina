import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  if (req.method === 'POST') {
    const type = req.headers['content-type'] || '';
    if (!ALLOWED.includes(type)) {
      return res.status(400).json({ error: 'Hanya JPG, PNG, atau WebP' });
    }
    const name = String(req.query.filename || 'foto').replace(/[^\w.-]/g, '_');
    const blob = await put(`foto/${name}`, req, {
      access: 'public',
      addRandomSuffix: true,
      contentType: type,
    });
    await sql`INSERT INTO photos (url) VALUES (${blob.url})`;
    return res.status(201).json({ url: blob.url });
  }

  const rows = await sql`SELECT id, url FROM photos ORDER BY id DESC LIMIT 50`;
  res.status(200).json(rows);
}
