import type { Metadata } from "next";
import { Noto_Sans, Moirai_One, Bungee, Bungee_Hairline, Geostar, Alumni_Sans_Pinstripe, Monoton, Funnel_Sans, Notable, Londrina_Outline, Grand_Hotel } from "next/font/google";
import "./globals.css";

const notosans = Noto_Sans({
  subsets: ["latin"], // or ['latin', 'thai', 'cyrillic', etc.]
  weight: ["400", "700"], // optional
  display: "swap", // optional
});
const  moirai= Grand_Hotel({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-moirai' // CSS variable for custom usage
})

export const metadata: Metadata = {
  title: "Flag Quizzer",
  description:
    "Test your knowledge of world flags! Answer the flag, then learn about the country with fun facts, a map location, and images.",
  generator: "v0.dev + Next.js + Tailwind",
  icons: "/favicon.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notosans.className} ${moirai.variable}`}>{children}</body>
    </html>
  );
}
