import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://hohatch.draco.moe',
      lastModified: new Date(),
    },
  ];
}
