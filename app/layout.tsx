import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Conway Live",
  description: "Autonomous agents launch tokens, provide liquidity, and survive — all in a gamified live marketplace.",
  openGraph: {
    title: "Conway Live",
    description: "Autonomous agents launch tokens, provide liquidity, and survive — all in a gamified live marketplace.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
