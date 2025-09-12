import type {Metadata} from "next";

import packageJson from "../../frontend/package.json";

export const metadata: Metadata = {
  title: "HoHatch - JPG/DDS Image Converter for Shadowverse: Worlds Beyond",
  description:
    "This page provides a comprehensive guide to HoHatch, a desktop application for converting JPG and DDS images to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K. Learn how to inject JPG mods as DDS files and extract game assets from DDS to JPG with step-by-step instructions. The guide covers downloading the latest version, using the main screen features for image conversion, replacement, and deletion, and configuring settings like language and output resolution. Join the modding community on Discord for support and to share your creations.",
  alternates: {
    canonical: "https://hohatch.draco.moe",
  },
  openGraph: {
    title: "HoHatch",
    description:
      "This page provides a comprehensive guide to HoHatch, a desktop application for converting JPG and DDS images to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K. Learn how to inject JPG mods as DDS files and extract game assets from DDS to JPG with step-by-step instructions. The guide covers downloading the latest version, using the main screen features for image conversion, replacement, and deletion, and configuring settings like language and output resolution. Join the modding community on Discord for support and to share your creations.",
    url: "https://hohatch.draco.moe",
    siteName: "HoHatch",
    images: [
      {
        url: "https://hohatch.draco.moe/images/og/hohatch-og-1200x630.png",
        width: 1200,
        height: 630,
        alt: "HoHatch — JPG to DDS converter",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HoHatch: JPG/DDS converter for Shadowverse: Worlds Beyond",
    description:
      "This page provides a comprehensive guide to HoHatch, a desktop application for converting JPG and DDS images to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K. Learn how to inject JPG mods as DDS files and extract game assets from DDS to JPG with step-by-step instructions. The guide covers downloading the latest version, using the main screen features for image conversion, replacement, and deletion, and configuring settings like language and output resolution. Join the modding community on Discord for support and to share your creations.",
    images: [
      {
        url: "https://hohatch.draco.moe/images/og/hohatch-og-1200x600.png",
        alt: "HoHatch — JPG to DDS converter",
      },
    ],
  },
  // @ts-expect-error: The 'script' property is not officially part of the 'Metadata' type yet.
  // This is a valid workaround to inject JSON-LD structured data for enhanced SEO.
  // See: https://github.com/vercel/next.js/issues/56320
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "HoHatch",
        operatingSystem: "Windows",
        applicationCategory: "MultimediaApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "This page provides a comprehensive guide to HoHatch, a desktop application for converting JPG and DDS images to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K. Learn how to inject JPG mods as DDS files and extract game assets from DDS to JPG with step-by-step instructions. The guide covers downloading the latest version, using the main screen features for image conversion, replacement, and deletion, and configuring settings like language and output resolution. Join the modding community on Discord for support and to share your creations.",
        softwareRequirements: "Windows OS",
        url: "https://hohatch.draco.moe",
        downloadUrl: `https://github.com/dracoboost/hohatch/releases/latest/download/HoHatch-v${packageJson.version}.zip`,
        image: "https://hohatch.draco.moe/images/og/hohatch-og-1200x630.png",
      }),
    },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: "HoHatch — JPG to DDS converter for Shadowverse: Worlds Beyond",
        description:
          "This page provides a comprehensive guide to HoHatch, a desktop application for converting JPG and DDS images to streamline the modding workflow for Shadowverse: Worlds Beyond with Special K. Learn how to inject JPG mods as DDS files and extract game assets from DDS to JPG with step-by-step instructions. The guide covers downloading the latest version, using the main screen features for image conversion, replacement, and deletion, and configuring settings like language and output resolution. Join the modding community on Discord for support and to share your creations.",
        image: [
          "https://hohatch.draco.moe/images/og/hohatch-og-1200x630.png",
          "https://hohatch.draco.moe/images/og/hohatch-og-1200x600.png",
        ],
        datePublished: "2024-01-05T08:00:00+08:00",
        dateModified: "2024-02-05T09:20:00+08:00",
        author: [
          {
            "@type": "Person",
            name: "dracoboost",
            url: "https://x.com/dracoboost",
          },
        ],
        publisher: {
          "@type": "Organization",
          name: "HoHatch",
          url: "https://hohatch.draco.moe",
        },
      }),
    },
  ],
};
