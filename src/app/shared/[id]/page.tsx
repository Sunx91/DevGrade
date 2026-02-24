"use client";

import Header from "@/components/layout/Header";
import ScoreOverview from "@/components/dashboard/ScoreOverview";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import Roadmap from "@/components/dashboard/Roadmap";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";
import Link from "next/link";
import { motion } from "framer-motion";

import { useEffect, useState, Suspense } from "react";
import { AlertTriangle, Share2, Check, Loader2 } from "lucide-react";
import { getSharedResult, SharedResult, createSharedResult } from "@/lib/firebase/db";
import { useAuth } from "@/contexts/AuthContext";

function SharedContent({ id }: { id: string }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<SharedResult | null>(null);
    const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'copied'>('idle');
    const { user } = useAuth();

    useEffect(() => {
        const fetchSharedData = async () => {
            try {
                const result = await getSharedResult(id);
                if (!result) {
                    throw new Error("Shared link not found or has expired.");
                }
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSharedData();
        }
    }, [id]);

    const handleShare = async () => {
        if (!data) return;
        setShareStatus('sharing');
        try {
            // Already sharing a shared link? Just copy the browser URL!
            const shareUrl = window.location.href;
            await navigator.clipboard.writeText(shareUrl);

            setShareStatus('copied');
            setTimeout(() => setShareStatus('idle'), 3000);
        } catch (err) {
            console.error("Failed to share:", err);
            setShareStatus('idle');
        }
    };

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl shadow-xl flex flex-col items-center max-w-md text-center">
                    <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
                    <h2 className="text-xl font-bold mb-2">Analysis Failed</h2>
                    <p className="text-sm leading-relaxed mb-6">{error || 'Unknown error occurred'}</p>
                    <Link
                        href="/"
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold px-6 py-2 rounded-xl transition-colors"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    // Reconstruct the data structure expected by the components
    const displayData = data.analysisData;
    const roadmap = data.roadmapData;

    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col">
            {/* Dark header */}
            <Header variant="dark" score={displayData.overallScore} />

            {/* Main */}
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-1 flex flex-col pt-8 relative"
            >
                {/* Share Button Floating Top Right */}
                <div className="absolute top-4 right-4 sm:right-8 z-10">
                    <button
                        onClick={handleShare}
                        disabled={shareStatus !== 'idle'}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                        {shareStatus === 'sharing' ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Copying...</>
                        ) : shareStatus === 'copied' ? (
                            <><Check className="w-4 h-4" /> Link Copied!</>
                        ) : (
                            <><Share2 className="w-4 h-4" /> Copy Link</>
                        )}
                    </button>

                    <div className="mt-2 text-right">
                        <span className="text-xs text-blue-400 font-medium px-2 py-1 rounded-md bg-blue-900/30 border border-blue-500/20">
                            Public Shared View
                        </span>
                    </div>
                </div>

                {/* Score ring section */}
                <ScoreOverview
                    score={displayData.overallScore}
                    title="Engineering Readiness Score"
                    subtitle={`Based on the live analysis of their repositories, documentation standards, and overall tech stack diversity.`}
                />

                {/* Metrics grid */}
                <MetricsGrid metrics={displayData.metrics} />

                {/* AI Roadmap Generated by Gemini */}
                <Roadmap roadmap={roadmap} />

                {/* Stats bar */}
                <div className="w-full max-w-4xl mx-auto px-4 mt-8 mb-4">
                    <div className="glass-card rounded-2xl p-5 flex flex-wrap items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                                Total Analyzed
                            </span>
                            <span className="text-white font-bold text-xl mt-0.5">
                                {displayData.metrics.commits > 0 ? 'Data Available' : 'No Data'}
                            </span>
                        </div>
                        <div className="w-px h-10 bg-white/[0.06] hidden sm:block" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                                Commits (1yr)
                            </span>
                            <span className="text-white font-bold text-xl mt-0.5">
                                {displayData.metrics.commits.toLocaleString()}
                            </span>
                        </div>
                        <div className="w-px h-10 bg-white/[0.06] hidden sm:block" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                                PRs Merged
                            </span>
                            <span className="text-white font-bold text-xl mt-0.5">
                                {displayData.metrics.mergedPRs}
                            </span>
                        </div>
                        <div className="ml-auto">
                            <Link
                                href={`https://github.com/${displayData.username}`}
                                target="_blank"
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                            >
                                View GitHub Profile →
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.main>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] py-5 px-6 mt-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-500/30">
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{displayData.username.charAt(0).toUpperCase()}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold">{displayData.username}</p>
                            <p className="text-gray-500 text-xs">github.com/{displayData.username}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        {["Privacy Policy", "Documentation", "Contact Support"].map((item) => (
                            <Link key={item} href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
                                {item}
                            </Link>
                        ))}
                        <span className="text-gray-600 text-xs">© 2024 DevGrade AI</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function SharedPage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <SharedContent id={params.id} />
        </Suspense>
    );
}
