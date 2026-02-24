"use client";

import { cn } from "@/lib/utils";
import { BarChart3, Star } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

interface NavLink {
    label: string;
    href: string;
}

interface HeaderProps {
    variant?: "light" | "dark";
    navLinks?: NavLink[];
    score?: number;
}

const defaultDarkLinks: NavLink[] = [
    { label: "Analysis", href: "/dashboard" },
    { label: "Roadmap", href: "/roadmap" },
];

const defaultLightLinks: NavLink[] = [];

function HeaderContent({ variant = "light", navLinks, score }: HeaderProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const userParam = searchParams?.get("user");
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isDashboard = (pathname?.includes('/dashboard') || pathname?.includes('/roadmap') || pathname?.includes('/insights')) ?? false;

    // Append `?user=` to the links if available
    const baseLinks = navLinks ?? (isDashboard ? defaultDarkLinks : defaultLightLinks);
    const links = baseLinks.map(link => ({
        ...link,
        href: (userParam && isDashboard && !link.href.includes('?')) ? `${link.href}?user=${userParam}` : link.href
    }));

    const isDark = variant === "dark";

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full border-b transition-all duration-300",
                isDark
                    ? "bg-[#0d1117]/90 border-white/[0.06] backdrop-blur-xl"
                    : "bg-white/90 border-gray-200/60 backdrop-blur-xl"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div
                            className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105",
                                isDark ? "bg-blue-600" : "bg-blue-600"
                            )}
                        >
                            {isDark ? (
                                <Star className="w-4 h-4 text-white" fill="white" strokeWidth={0} />
                            ) : (
                                <BarChart3 className="w-4 h-4 text-white" />
                            )}
                        </div>
                        <span
                            className={cn(
                                "font-bold text-base tracking-tight",
                                isDark ? "text-white" : "text-gray-900"
                            )}
                        >
                            DevGrade
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-6">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        isDark
                                            ? isActive
                                                ? "text-blue-400"
                                                : "text-gray-400 hover:text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {!user ? (
                            <>
                                <Link
                                    href="/login"
                                    className={cn("text-sm font-medium hidden sm:block", isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}
                                >
                                    Log in
                                </Link>
                                {/* <Link
                                    href="/dashboard"
                                    className={cn("text-sm font-semibold px-4 py-2 rounded-lg transition-colors", isDark ? "bg-white text-black hover:bg-gray-200" : "bg-gray-900 text-white hover:bg-gray-700")}
                                >
                                    Get Started
                                </Link> */}
                            </>
                        ) : (
                            <div className="flex items-center gap-3 relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500/40 flex-shrink-0 cursor-pointer focus:outline-none"
                                >
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">{user.email?.charAt(0).toUpperCase() || "A"}</span>
                                        </div>
                                    )}
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute right-0 top-12 w-48 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                                        <div className="px-4 py-2 border-b border-[#30363d] mb-1">
                                            <p className="text-sm font-medium text-white truncate">{user.displayName || user.email}</p>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#21262d] flex items-center gap-2 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default function Header(props: HeaderProps) {
    return (
        <Suspense fallback={<header className="sticky top-0 z-50 w-full border-b h-14 bg-[#0d1117]/90" />}>
            <HeaderContent {...props} />
        </Suspense>
    );
}
