"use client";

import Header from "@/components/layout/Header";
import AiRoadmap from "@/components/roadmap/AiRoadmap";
import { RefreshCw, Share2, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";

function RoadmapContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const username = searchParams?.get("user");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!username) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ githubUrl: `https://github.com/${username}` })
                });

                const json = await res.json();
                if (!res.ok) throw new Error(json.error || 'Failed to fetch data');
                setData(json);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username, router]);

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
                    <button
                        onClick={() => router.push('/')}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold px-6 py-2 rounded-xl transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const signalsCount = data.metrics?.commits || 142;
    const progress = 75; // Mock for now

    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col">
            {/* Dark header */}
            <Header variant="dark" score={data.overallScore} />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-10 pb-20">
                {/* AI Roadmap Component with real API generated data */}
                <AiRoadmap roadmap={data.roadmap} />

                {/* Bottom cards */}
                <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sharing card */}
                    <div className="border border-[#30363d] rounded-3xl p-7 flex flex-col justify-between gap-6 bg-[#161b22]/40 hover:bg-[#161b22]/60 transition-colors">
                        <div>
                            <h3 className="text-white font-semibold text-[17px] mb-2 tracking-tight">Sharing Your Progress</h3>
                            <p className="text-[#8b949e] text-[14px] leading-relaxed">
                                Developers who share their live roadmaps with recruiters see a 40% higher
                                engagement rate on their profiles.
                            </p>
                        </div>
                        <button className="flex items-center justify-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-white text-[14px] font-semibold py-3 rounded-2xl border border-white/[0.08] transition-colors w-full">
                            <Share2 className="w-4 h-4 text-[#3b82f6]" />
                            Generate Public Link
                        </button>
                    </div>

                    {/* Grade forecast card */}
                    <div className="border border-[#30363d] rounded-3xl p-7 flex flex-col justify-between gap-6 bg-[#161b22]/40 hover:bg-[#161b22]/60 transition-colors">
                        <div>
                            <h3 className="text-white font-semibold text-[17px] mb-4 tracking-tight">Grade Forecast</h3>
                            <div className="flex items-center gap-5">
                                <span className="text-5xl font-normal text-white leading-none">A+</span>
                                <p className="text-[#8b949e] text-[13px] leading-relaxed max-w-[200px]">
                                    Predicted grade after completing current roadmap milestones.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1.5 text-[#8b949e]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                                Current: B+
                            </span>
                            <span className="text-[#8b949e]">→</span>
                            <span className="flex items-center gap-1.5 text-[#3b82f6]">
                                Target: A+
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 px-6 mt-auto">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 font-semibold text-[10px] uppercase tracking-widest text-[#8b949e]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1f6feb]" />
                        <span>System Status: All Signals Normal</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-8 gap-y-4 text-[11px] font-bold uppercase tracking-widest text-[#8b949e]">
                        {["Docs", "Security", "Changelog"].map((item) => (
                            <Link key={item} href="#" className="hover:text-white transition-colors">
                                {item}
                            </Link>
                        ))}
                        <span className="text-[#484f58] ml-4 font-semibold uppercase tracking-widest text-[9px]">© 2024 DevGrade Engine<br />v2.4.0</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function RoadmapPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <RoadmapContent />
        </Suspense>
    );
}
