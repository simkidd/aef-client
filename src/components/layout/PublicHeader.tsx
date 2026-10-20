"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";

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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Completely transparent on home when unscrolled (allowing hero photo to shine)
  // When scrolled or on inner pages: clean frosted glass backdrop
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-b border-transparent"
          : "bg-background/95 backdrop-blur-md border-b border-border/80 shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Lockup: Logo in White Tab (matching adele-foundation) */}
        <Link
          href="/"
          aria-label="Adele Empowerment Foundation"
          className={cn(
            "self-start flex items-center justify-center p-3 sm:p-4 rounded-b-2xl sm:rounded-b-3xl transition-all duration-300 w-fit group",
            isTransparent
              ? "bg-white/95 backdrop-blur-md shadow-sm"
              : "dark:bg-white/95 dark:backdrop-blur-md dark:shadow-sm",
          )}
        >
          <div className="relative flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Logo className="h-10 sm:h-12 w-auto" priority />
          </div>
        </Link>

        {/* Clean 5 Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
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

        {/* Actions: Theme Toggle, Trainee Portal, Apply Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          {/* Trainee Portal (Candidate & Staff Login) */}
          <Link href="/auth/login" className="hidden sm:inline-flex">
            <Button
              variant="outline"
              size="sm"
              className={`font-semibold text-xs sm:text-sm h-10 px-4 rounded-full transition-all ${
                isTransparent
                  ? "border-white/25 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm shadow-xs"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              Trainee Portal
            </Button>
          </Link>

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
            className={`md:hidden p-2 rounded-xl border transition-colors ${
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/80 bg-background/98 backdrop-blur-xl px-5 pt-4 pb-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold border border-primary/20"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="text-xs text-primary">&bull;</span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 mt-2 border-t border-border/60 grid grid-cols-2 gap-2">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="w-full text-xs font-bold rounded-xl h-10 border-border"
                >
                  Trainee Portal
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="w-full text-xs font-bold rounded-xl h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                  Apply Now
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
