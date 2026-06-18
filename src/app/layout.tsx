import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Compass",
  description:
    "A portfolio project for project clarity, QA, traceability and test automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-white px-6 py-6 text-center text-xs text-slate-500">
          <p>
            © 2026 Johan Larsson. Project Compass is a portfolio project for
            project clarity, QA, traceability and test automation.
          </p>
          <p className="mt-2">
            <a
              href="https://github.com/Zion8a/project-compass"
              className="font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <span className="mx-2">·</span>
            <a
              href="mailto:johan@bergochhav.nu"
              className="font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
            >
              Contact
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}