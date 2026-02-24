"use client";

import { cn } from "@/lib/utils";
import { BarChart3, Star } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

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
    { label: "Insights", href: "/insights" },
    { label: "Portfolio Creator", href: "/portfolio" },
];

const defaultLightLinks: NavLink[] = [
    { label: "Features", href: "/#features" },
    { label: "Benchmarks", href: "/#benchmarks" },
    { label: "Enterprise", href: "/#enterprise" },
    { label: "Docs", href: "/docs" },
];

function HeaderContent({ variant = "light", navLinks, score }: HeaderProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const user = searchParams?.get("user");

    const isDashboard = (pathname?.includes('/dashboard') || pathname?.includes('/roadmap') || pathname?.includes('/insights')) ?? false;

    // Append `?user=` to the links if available
    const baseLinks = navLinks ?? (isDashboard ? defaultDarkLinks : defaultLightLinks);
    const links = baseLinks.map(link => ({
        ...link,
        href: (user && isDashboard && !link.href.includes('?')) ? `${link.href}?user=${user}` : link.href
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
                        {isDark && score !== undefined && (
                            <div className="hidden sm:flex items-center gap-2 text-right">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                                        Current Score
                                    </p>
                                    <p className="text-blue-400 font-bold text-base leading-none">{score}</p>
                                </div>
                            </div>
                        )}

                        {!isDashboard && (
                            <>
                                <Link
                                    href="/login"
                                    className={cn("text-sm font-medium hidden sm:block", isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className={cn("text-sm font-semibold px-4 py-2 rounded-lg transition-colors", isDark ? "bg-white text-black hover:bg-gray-200" : "bg-gray-900 text-white hover:bg-gray-700")}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}

                        {/* Avatar */}
                        {isDashboard && (
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500/40 flex-shrink-0 cursor-pointer">
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">A</span>
                                </div>
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
