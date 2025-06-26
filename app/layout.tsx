import type { Metadata } from "next";
import { Noto_Sans, Grand_Hotel } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const notosans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
const moirai = Grand_Hotel({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-moirai", // CSS variable for custom usage
});

export const metadata: Metadata = {
  title: "Flag Quizzer",
  description:
    "Test your knowledge of world flags! Answer the flag, then learn about the country with fun facts, a map location, and images.",
  generator: "v0.dev + Next.js + Tailwind",
  icons: "/favicon.png",
  verification: { google: "BTD7AsgB6onr1be4O7NE6le06ng_Gw6ACDpt6KzlnRo" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notosans.className} ${moirai.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
