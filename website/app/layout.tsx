"use client";

import {HeroUIProvider} from "@heroui/react";
import {Analytics} from "@vercel/analytics/next";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {useRouter} from "next/navigation";

import "@/styles/globals.css";
import "@/styles/tailwind.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const navigateTo = (path: string) => router.push(path);

  return (
    <html suppressHydrationWarning lang="en">
      <body className="bg-slate-900 text-white antialiased">
        <HeroUIProvider navigate={navigateTo}>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <link href="/favicon.ico" rel="icon" type="image/x-icon" />
            <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
            {children}
            <Analytics />
          </NextThemesProvider>
        </HeroUIProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
