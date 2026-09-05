import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { QueryProvider } from "../providers/QueryProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import { TooltipProvider } from "../components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const heading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adele Empowerment Foundation — Skills Training & Community Platform",
  description:
    "Official management and learning platform for Adele Empowerment Foundation staff, multi-skill vocational programs, regional centres, and beneficiary training.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(sans.variable, heading.variable, "font-sans")}
    >
      <body className="antialiased selection:bg-primary/15 selection:text-primary dark:selection:bg-emerald-900 dark:selection:text-primary">
        <NextTopLoader
          color="var(--primary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
        />
        <ThemeProvider defaultTheme="system">
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
