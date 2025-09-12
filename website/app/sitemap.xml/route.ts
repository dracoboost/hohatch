import {promises as fs} from "fs";
import path from "path";

export const dynamic = "force-static";

// Helper function to get image data from a specific directory
async function getImages(directory: string, baseUrl: string) {
  const imageDirectory = path.join(process.cwd(), "public", directory);
  try {
    const imageFiles = await fs.readdir(imageDirectory);
    return imageFiles
      .filter((file) => /\.(png|jpg|jpeg)$/.test(file))
      .map((file) => {
        const name = path.basename(file, path.extname(file)).replace(/-/g, " ");
        const caption = name.charAt(0).toUpperCase() + name.slice(1);
        // Sanitize caption and title for XML
        const sanitizedCaption = caption
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");
        return {
          url: `${baseUrl}/${directory}/${file}`,
          caption: sanitizedCaption,
          title: sanitizedCaption,
        };
      });
  } catch (error) {
    console.error(`Could not read directory: ${imageDirectory}`, error);
    return [];
  }
}

export async function GET() {
  const baseUrl = "https://hohatch.draco.moe";

  const lastmod = new Date().toISOString().split("T")[0];

  const guideImages = await getImages("images/guide", baseUrl);
  const ogImages = await getImages("images/og", baseUrl);
  const allImages = [...guideImages, ...ogImages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    ${allImages
      .map(
        (image) => `
      <image:image>
        <image:loc>${image.url}</image:loc>
        <image:caption>${image.caption}</image:caption>
        <image:title>${image.title}</image:title>
      </image:image>
    `,
      )
      .join("")}
  </url>
</urlset>
  `;

  return new Response(sitemap.trim(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
