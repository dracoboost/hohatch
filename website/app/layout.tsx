"use client";

import {ThemeProvider as NextThemesProvider} from "next-themes";
import {useRouter} from "next/navigation";
import {HeroUIProvider} from "@heroui/react";

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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <HeroUIProvider navigate={navigateTo}>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <link href="/favicons/favicon.ico" rel="icon" />
            {children}
          </NextThemesProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
