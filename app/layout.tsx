import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TubeGenius Studio",
  description: "Download and analyze YouTube videos with AI-powered insights."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-yt-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
