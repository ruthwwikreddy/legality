import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://legality.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/services', '/how-it-works', '/contact', '/login', '/register'],
        disallow: ['/portal/', '/admin/', '/api/', '/agreements/sign/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
