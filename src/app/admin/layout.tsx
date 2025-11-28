"use client";

import { useState } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import { Menu, X, ChefHat, LogOut } from "lucide-react";
import { logout } from "./login/actions";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/admin/items", label: "Menu Items" },
    { href: "/admin/categories", label: "Categories" },
  ];

  return (
    <div className={`${inter.variable} ${playfair.variable} min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`}>
      {/* Single Elegant Header with Navigation */}
      <header className="sticky top-0 z-50 border-b border-amber-900/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <ChefHat className="relative w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <h1 className="relative font-playfair text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 bg-clip-text text-transparent">
                  Little Paris
                </h1>
                <span className="text-slate-500 text-[10px] sm:text-xs font-light tracking-widest uppercase">
                  Admin
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-amber-300 hover:bg-amber-900/10 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center ml-4">
               <form action={logout}>
                  <button type="submit" className="p-2 text-slate-400 hover:text-red-400 transition-colors" title="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
               </form>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-amber-400 hover:text-amber-300 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2 border-t border-amber-900/20">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-slate-300 hover:text-amber-300 hover:bg-amber-900/10 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-amber-900/20">
                <form action={logout}>
                  <button type="submit" className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-950/20 rounded-lg transition-all duration-200 flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </form>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        {children}
      </main>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 sm:w-96 h-64 sm:h-96 bg-amber-600/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
