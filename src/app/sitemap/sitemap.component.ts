import { Component, OnInit, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  template: '',
})
export class SitemapComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly baseUrl = 'https://gamestopupdz.vercel.app';

  ngOnInit(): void {
    const xml = this.generateSitemapXml();
    const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });

    const reader = new FileReader();
    reader.onload = () => {
      this.document.open('text/xml');
      this.document.write(reader.result as string);
      this.document.close();
    };

    reader.readAsText(blob);
  }

  private generateSitemapXml(): string {
    const urls = [
      '',
      'games',
      'how-it-works',
      'contact',
      'about-us',
      'charge-games',
    ];

    const lastMod = new Date().toISOString();

    const entries = urls
      .map((path) => {
        const url = `${this.baseUrl}/${path}`.replace(/\/+/g, '/').replace(/\?$/, '');

        return `  <url>
    <loc>${this.escapeXml(url)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
  }

  private escapeXml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
  }
}
