import type { Metadata } from "next";
import {Inter, Roboto, Noto_Sans} from "next/font/google"
import "./globals.css";

const inter = Inter({
  subsets: ['latin'], // or ['latin', 'thai', 'cyrillic', etc.]
  weight: ['400', '700'], // optional
  display: 'swap', // optional
})
const roboto = Roboto({
  subsets: ['latin'], // or ['latin', 'thai', 'cyrillic', etc.]
  weight: ['400', '700'], // optional
  display: 'swap', // optional
})

const notosans = Noto_Sans({
  subsets: ['latin'], // or ['latin', 'thai', 'cyrillic', etc.]
  weight: ['400', '700'], // optional
  display: 'swap', // optional
})
export const metadata: Metadata = {
  title: "Flag Quiz",
  description:
    "Test your knowledge of world flags! Answer the flag, then learn about the country with fun facts, a map location, and images.",
  generator: "v0.dev + Next.js + Tailwind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={notosans.className}>{children}</body>
    </html>
  );
}
