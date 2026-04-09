import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoUniverse Dashboard | ZBJ Agency AI Team",
  description: "Real-time dashboard for the ZBJ Agency AI Team - 16 specialized agents working in harmony",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-green-400 font-mono">
        {children}
      </body>
    </html>
  );
}
