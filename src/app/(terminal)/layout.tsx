import React from "react";

export const metadata = {
  title: "AEF Biometric Attendance Terminal",
  description: "Dedicated full-screen biometric attendance terminal for Adele TVET centres.",
};

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Standalone Kiosk Container */}
      <main className="flex-1 w-full p-3 sm:p-6 lg:p-8 flex flex-col justify-start">
        {children}
      </main>

      {/* Subtle Kiosk Brand Footer */}
      <footer className="py-2.5 px-6 border-t border-border/40 text-center text-[11px] text-muted-foreground bg-card/40 backdrop-blur-xs flex items-center justify-between">
        <span className="font-semibold tracking-wide">
          Adele Empowerment Foundation • Automated TVET Biometrics OS
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/75">
          Terminal v2.4 • Port Harcourt & Yenagoa
        </span>
      </footer>
    </div>
  );
}
