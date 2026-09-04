import React from "react";
import Logo from "@/components/shared/Logo";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading Adele Foundation Portal"
      className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden p-6 select-none"
    >
      {/* Inline animation keyframes for smooth, framerate-independent rendering */}
      <style>{`
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-5px) scale(1.01); }
        }
        @keyframes shimmerBeam {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.35; transform: scale(0.98); }
          50% { opacity: 0.65; transform: scale(1.05); }
        }
      `}</style>

      {/* Background ambient radial aura */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent dark:from-primary/15"
        aria-hidden="true"
      />

      {/* Soft pulsing ambient glow orbs */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full bg-primary/15 dark:bg-primary/20 blur-[110px]"
        style={{ animation: "pulseGlow 6s ease-in-out infinite" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 right-1/4 w-60 h-60 rounded-full bg-emerald-400/10 dark:bg-emerald-400/15 blur-[90px]"
        aria-hidden="true"
      />

      {/* Main loading container */}
      <div
        className="relative z-10 flex flex-col items-center gap-6 max-w-sm w-full"
        style={{ animation: "subtleFloat 4.5s ease-in-out infinite" }}
      >
        {/* Logo Badge */}
        <div className="relative flex items-center justify-center">
          {/* Soft outer glow */}
          <div className="absolute inset-0 rounded-3xl bg-linear-to-tr from-primary/20 via-emerald-500/10 to-transparent blur-xl animate-pulse" />

          {/* Glassmorphic Logo Container */}
          <div className="relative flex items-center justify-center p-4 sm:p-5 rounded-2xl bg-card/85 dark:bg-card/75 backdrop-blur-xl border border-border/70 shadow-2xl shadow-primary/10 transition-all">
            <Logo size={90} className="h-12 sm:h-14 w-auto" priority />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col items-center w-full">
          {/* Slim glowing progress beam */}
          <div className="relative h-1.5 w-44 sm:w-52 rounded-full bg-muted/80 dark:bg-muted/50 overflow-hidden border border-border/30">
            <div
              className="absolute inset-y-0 w-2/3 rounded-full bg-linear-to-r from-transparent via-primary to-transparent"
              style={{ animation: "shimmerBeam 1.8s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
