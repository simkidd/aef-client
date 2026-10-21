"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { useAuthStore } from "@/stores";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Programs", href: "/programs" },
  { label: "About", href: "/about" },
  { label: "Stories", href: "/stories" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function PublicHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePortalClick = () => {
    if (isAuthenticated) {
      if (user?.isStaff || user?.roles?.includes("SUPER_ADMIN")) {
        router.push("/admin");
      } else {
        router.push("/portal");
      }
    } else {
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  // Completely transparent on home when unscrolled (allowing hero photo to shine)
  // When scrolled or on inner pages: clean frosted glass backdrop
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isTransparent
          ? "bg-transparent border-b border-transparent shadow-none"
          : "bg-background/95 backdrop-blur-md border-b border-border/80 shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center h-20 px-4 sm:px-6 lg:px-8">
        {/* Brand Lockup: Logo in White Tab (synchronized smooth corner morph & fixed height) */}
        <Link
          href="/"
          aria-label="Adele Empowerment Foundation"
          className={cn(
            "h-full justify-self-start flex items-center justify-center px-4 sm:px-5 transition-all duration-500 ease-in-out w-fit select-none",
            isTransparent
              ? "shadow-sm rounded-b-2xl sm:rounded-b-3xl bg-white/95 backdrop-blur-md "
              : "shadow-none rounded-b-none sm:rounded-b-none bg-transparent dark:bg-white/95",
          )}
        >
          <div className="relative flex items-center justify-center shrink-0 transition-transform duration-300">
            <Logo className="h-10 sm:h-12 w-auto" priority />
          </div>
        </Link>

        {/* Clean 5 Desktop Nav Links — Perfectly Centered */}
        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 justify-self-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-all relative py-1 ${
                  isTransparent
                    ? isActive
                      ? "text-white font-bold"
                      : "text-white/85 hover:text-white"
                    : isActive
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${
                    isTransparent ? "bg-emerald-400" : "bg-primary"
                  } ${isActive ? "w-full" : "w-0 hover:w-full"}`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Actions: Trainee Portal, Apply Button, Mobile Hamburger */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 justify-self-end">
          {/* Trainee Portal conditioned via useRouter */}
          <button
            type="button"
            onClick={handlePortalClick}
            className={`hidden sm:inline-flex items-center text-xs sm:text-sm font-semibold transition-colors px-2.5 py-1.5 rounded-lg cursor-pointer ${
              isTransparent
                ? "text-white/85 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {mounted && isAuthenticated
              ? user?.isStaff || user?.roles?.includes("SUPER_ADMIN")
                ? "Admin Portal"
                : "Trainee Portal"
              : "Login"}
          </button>

          {/* Apply Now (Registration CTA) */}
          <Link href="/auth/register">
            <Button
              size="sm"
              className="h-10 px-5 font-bold text-xs sm:text-sm rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 gap-1.5 transition-all hover:scale-105"
            >
              <span>Apply Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border transition-colors cursor-pointer ${
              isTransparent
                ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                : "border-border/80 bg-muted/50 text-foreground hover:bg-muted"
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bottom-0 h-[calc(100dvh-5rem)] z-40 bg-background/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-8 overflow-y-auto border-t border-border/80 animate-in fade-in duration-200">
          <nav className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-lg font-heading font-bold transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/25 shadow-xs"
                      : "text-foreground/90 hover:bg-muted/60"
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight
                    className={`h-4 w-4 transition-transform ${
                      isActive ? "text-primary" : "text-muted-foreground/50"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-border/70 flex flex-col gap-4 mt-auto">
            <div className="flex flex-col gap-2.5">
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full text-sm font-bold rounded-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2">
                  <span>Apply for Cohort 2026</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handlePortalClick();
                }}
                className="w-full text-sm font-semibold rounded-full h-11 border-border text-foreground hover:bg-muted cursor-pointer"
              >
                {mounted && isAuthenticated
                  ? user?.isStaff || user?.roles?.includes("SUPER_ADMIN")
                    ? "Go to Admin Dashboard"
                    : "Go to Trainee Portal"
                  : "Login"}
              </Button>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Admissions Helpline</span>
              <a
                href="tel:+2348012345678"
                className="text-primary font-semibold hover:underline"
              >
                +234 801 234 5678
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
