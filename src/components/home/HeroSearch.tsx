"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BarChart2, BoxSelect, Network, Search, AlertTriangle, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FeatureCard {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const features: FeatureCard[] = [
    {
        icon: <BarChart2 className="w-5 h-5 text-blue-500" />,
        title: "Commit Velocity",
        description:
            "Deep analysis of sprint patterns and deployment frequency over your entire history.",
    },
    {
        icon: <BoxSelect className="w-5 h-5 text-blue-500" />,
        title: "Code Complexity",
        description:
            "Identify architectural consistency and technical debt across multiple repositories.",
    },
    {
        icon: <Network className="w-5 h-5 text-blue-500" />,
        title: "Impact Score",
        description:
            "Quantify the reach of your open-source work and community contributions.",
    },
];

export default function HeroSearch() {
    const [username, setUsername] = useState("");
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!username.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ githubUrl: `https://github.com/${username.trim()}` })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to analyze user');
            }

            // Successfully fetched data. In this simplified flow we will push 
            // the data to the dashboard, perhaps via query params or a global store.
            // For now, based on instructions, we are navigating to the dashboard route.
            // We pass the username to be handled by the dashboard page.
            router.push(`/dashboard?user=${encodeURIComponent(username.trim())}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex flex-col items-center px-4 pt-20 pb-32">
            {/* Announcement pill */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 border border-blue-200 text-blue-600 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-10"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Now Supporting GitHub Enterprise
            </motion.div>

            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-6xl sm:text-7xl md:text-8xl font-black text-center tracking-tight leading-none mb-6"
                style={{
                    background: "linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                DevGrade
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-500 text-center text-base sm:text-lg max-w-lg mb-12 leading-relaxed"
            >
                Measure the engineering health of your GitHub portfolio. Advanced heuristics for
                code quality, contribution velocity, and architectural impact.
            </motion.p>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xl mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl shadow-lg"
                >
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">{error}</p>
                </motion.div>
            )}

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full max-w-xl"
            >
                <div className="flex items-center bg-gray-900 rounded-2xl px-5 py-1 shadow-2xl">
                    <Search className="w-5 h-5 text-gray-400 flex-shrink-0 mr-3" />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                        placeholder="Enter your GitHub username (e.g., octocat)"
                        aria-label="GitHub username search input"
                        className={cn(
                            "flex-1 bg-transparent text-white placeholder-gray-500 text-sm",
                            "outline-none py-4 min-w-0"
                        )}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        aria-label={isLoading ? "Analyzing portfolio..." : "Analyze GitHub portfolio"}
                        className={cn(
                            "flex-shrink-0 ml-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center min-w-[120px]",
                            isLoading && "opacity-80 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze →"}
                    </button>
                </div>
                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 mt-5">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gray-500" />
                        Verified Analysis
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
                        Encrypted Scans
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                        <Network className="w-3.5 h-3.5 text-gray-500" />
                        Official API
                    </div>
                </div>
            </motion.div>

            {/* Feature Cards */}
            <div className="mt-20 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                        className="glass-card flex flex-col gap-3 rounded-2xl p-7 hover:border-white/[0.14] transition-colors"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-1">
                            {feature.icon}
                        </div>
                        <h3 className="text-white font-semibold text-[15px]">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
