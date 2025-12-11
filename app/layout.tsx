"use client"

import { Plus_Jakarta_Sans, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
// import { QueryProvider } from "@/lib/query-provider";

// 1. Police Sans-Serif (Police principale/UI) : Plus Jakarta Sans
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans", // Utilisée comme police par défaut
  subsets: ["latin"],
});

// 2. Police à empattement (Police Serif) : Lora
const lora = Lora({
  variable: "--font-serif", // Nouvelle variable pour la police Serif
  subsets: ["latin"],
});

// 3. Police Monospace : IBM Plex Mono
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono", // Variable pour la police Monospace
  subsets: ["latin"],
  weight: ["400", "700"], // Ajoutez des poids si nécessaire
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${plusJakartaSans.variable} ${lora.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {/* <QueryProvider> */}
          {children}
        {/* </QueryProvider> */}
      </body>
    </html>
  );
}