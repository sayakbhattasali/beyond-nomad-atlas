import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WeatherProvider from "@/components/WeatherProvider";
import { CinemaTransitionProvider } from "@/components/CinemaTransitionContext";
import CinemaTransition from "@/components/CinemaTransition";

export const metadata: Metadata = {
  title: "BEYOND NOMAD Atlas",
  description: "Beyond Nomad Atlas — a curated cinematic discovery platform for modern explorers and weekend nomads in Odisha."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="noise">
        <CinemaTransitionProvider>
          <WeatherProvider>
            <Navbar />
            {children}
            <Footer />
          </WeatherProvider>
          <CinemaTransition />
        </CinemaTransitionProvider>
      </body>
    </html>
  );
}
