import type { Metadata } from "next";
// Ikkala shriftni ham import qilamiz
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner"

// Inter'ni asosiy matn uchun, --font-inter o'zgaruvchisi bilan
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Lora'ni sarlavhalar uchun, --font-lora o'zgaruvchisi bilan
const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "FlashCard Pro - Master Your Memory",
  description: "Cement Your Knowledge. Forever.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      {/* Ikkala shrift o'zgaruvchisini ham body'ga beramiz */}
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex flex-col min-h-screen overflow-hidden">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
