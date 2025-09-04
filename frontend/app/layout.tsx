"use client";

import {HeroUIProvider} from "@heroui/system";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {useRouter} from "next/navigation";

import "@/styles/globals.css";
import "@/styles/tailwind.css";

export default function RootLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();

  const navigateTo = async (path: string) => {
    if (typeof window !== "undefined" && window.pywebview) {
      await window.pywebview.api.load_url(path);
    } else {
      router.push(path);
    }
  };

  return (
    <html suppressHydrationWarning lang="en">
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
