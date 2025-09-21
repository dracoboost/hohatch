"use client";

import {HeroUIProvider} from "@heroui/react";
import {Analytics} from "@vercel/analytics/next";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {useRouter} from "next/navigation";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const navigateTo = (path: string) => router.push(path);

  return (
    <html suppressHydrationWarning lang="en">
      <body className="bg-background text-white antialiased">
        <HeroUIProvider navigate={navigateTo}>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <main role="main">{children}</main>
            <Analytics />
          </NextThemesProvider>
        </HeroUIProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
