import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Romantic 3D Ask-Out",
  description: "A dreamy interactive romantic website built with React Three Fiber and Framer Motion."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
