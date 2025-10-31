import type { Metadata } from "next";
import "./globals.css";
import NextAuthSessionProvider from "./providers/SessionProvider";
import { QueryProvider } from "./providers/QueryProvider";
import { ConfigProvider } from "@/providers/ConfigProvider";
import { Public_Sans, Poppins } from "next/font/google";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "GlidingPath",
  description: "Retirement plan management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} ${poppins.variable}`}>
      <body className={`${publicSans.className}`}>
        <QueryProvider>
          <NextAuthSessionProvider>
            <ConfigProvider>{children}</ConfigProvider>
          </NextAuthSessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
