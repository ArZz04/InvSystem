import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { AuthProvider } from "./providers/AuthProvider";
import Navbar from "./components/Navbar";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvSystem",
  description: "Created by Juan Arvizu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${roboto.variable} ${robotoMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <Navbar /> {/* Siempre visible */}
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
