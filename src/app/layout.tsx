import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME, TAGLINE } from "@/lib/constants/brand";

export const metadata: Metadata = {
  title: APP_NAME,
  description: TAGLINE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
