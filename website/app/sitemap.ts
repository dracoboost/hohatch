import { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hohatch.draco.moe';

  // Path to the directory containing guide images
  const imageDirectory = path.join(process.cwd(), 'public', 'images', 'guide');

  // Read all files from the directory
  const imageFiles = await fs.readdir(imageDirectory);

  // Filter for image files and create full URLs
  const imageUrls = imageFiles
    .filter((file) => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
    .map((file) => `${baseUrl}/images/guide/${file}`);

  return [
    {
      url: baseUrl + '/',
      lastModified: new Date(),
      images: imageUrls,
    },
  ];
}