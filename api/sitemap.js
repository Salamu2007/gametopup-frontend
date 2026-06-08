module.exports = function handler(req, res) {
  const baseUrl = 'https://gamestopupdz.vercel.app';
  const urls = ['', 'games', 'how-it-works', 'contact', 'about-us', 'charge-games'];
  const lastMod = new Date().toISOString();

  const entries = urls
    .map((path) => {
      const loc = path ? `${baseUrl}/${path}` : baseUrl;
      const priority = path ? '0.8' : '1.0';

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
