
import type { Metadata } from "next";
import { Inter, Raleway, Open_Sans, Urbanist } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-raleway",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-opensans",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Gradient Kuliah - Aplikasi Belajar Kuliah No 1 di Indonesia",
  description: "Akses video dari dosen universitas top, sambil melihat pembahasan dan rangkuman soal, disertai AI untuk membantumu raih IPK idaman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${raleway.variable} ${openSans.variable} ${urbanist.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
