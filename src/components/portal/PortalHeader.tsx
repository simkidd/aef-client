'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  FileText,
  Calendar,
  Clock,
  Award,
  User,
  LogOut,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../ui/button';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '@/lib/api/auth.api';

export function PortalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('Logout error:', e);
    } finally {
      clearAuth();
      router.push('/auth/login');
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/portal', icon: Compass },
    { label: 'Programs', href: '/portal/programs', icon: Sparkles },
    { label: 'My Applications', href: '/portal/applications', icon: FileText },
    { label: 'My Training', href: '/portal/training', icon: Calendar },
    { label: 'Timetable', href: '/portal/timetable', icon: Clock },
    { label: 'Certificates', href: '/portal/certificates', icon: Award },
    { label: 'My Profile', href: '/portal/profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs dark:border-slate-800 dark:bg-slate-950/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/portal" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-sm">
              A
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 tracking-tight dark:text-slate-100">
                ADELE FOUNDATION
              </span>
              <span className="block text-[10px] font-semibold text-primary tracking-wide">
                Beneficiary Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary dark:text-primary' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Admin Switch / Logout */}
          <div className="flex items-center gap-2">
            {user?.isStaff && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin')}
                className="gap-1.5 text-xs text-primary border-primary/20 hidden sm:flex"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                Staff Operations
              </Button>
            )}

            {/* Notifications */}
            <NotificationDropdown />

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                {user?.firstName?.[0] || 'B'}
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign Out">
                <LogOut className="h-4 w-4 text-slate-500 hover:text-rose-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-2 py-1 flex justify-around">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-all ${
                isActive ? 'text-primary dark:text-primary font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="h-4 w-4 mb-0.5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
