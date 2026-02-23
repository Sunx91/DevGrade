import Header from "@/components/layout/Header";
import MilestoneTimeline from "@/components/roadmap/MilestoneTimeline";
import { RefreshCw, Share2 } from "lucide-react";
import Link from "next/link";

// Mock data – replace with real API data
const MOCK_ROADMAP = {
    score: 842,
    username: "alex-dev-ux",
    targetGrade: "Senior Grade",
    progress: 75,
    progressLabel: "75% to Platinum Status",
    signals: 142,
};

export default function RoadmapPage() {
    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col">
            {/* Dark header */}
            <Header variant="dark" score={MOCK_ROADMAP.score} />

            <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-10 pb-20">
                {/* Page heading */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">
                            Your Roadmap to{" "}
                            <span className="text-blue-400">{MOCK_ROADMAP.targetGrade}</span>
                        </h1>
                        <p className="text-gray-400 text-sm mt-2">
                            Personalized trajectory based on {MOCK_ROADMAP.signals} GitHub repository signals.
                        </p>
                    </div>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 self-start">
                        <RefreshCw className="w-4 h-4" />
                        Re-scan Profile
                    </button>
                </div>

                {/* Progress bar */}
                <div className="mb-10">
                    <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                            style={{ width: `${MOCK_ROADMAP.progress}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                            Progress
                        </span>
                        <span className="text-blue-400 text-xs font-semibold">
                            {MOCK_ROADMAP.progressLabel}
                        </span>
                    </div>
                </div>

                {/* Timeline */}
                <MilestoneTimeline />

                {/* Bottom cards */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sharing card */}
                    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between gap-6">
                        <div>
                            <h3 className="text-white font-bold text-base mb-2">Sharing Your Progress</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Developers who share their live roadmaps with recruiters see a 40% higher
                                engagement rate on their profiles.
                            </p>
                        </div>
                        <button className="flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-semibold py-2.5 rounded-xl border border-white/[0.08] transition-colors w-full">
                            <Share2 className="w-4 h-4" />
                            Generate Public Link
                        </button>
                    </div>

                    {/* Grade forecast card */}
                    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between gap-4">
                        <div>
                            <h3 className="text-white font-bold text-base mb-2">Grade Forecast</h3>
                            <div className="flex items-start gap-4">
                                <span className="text-5xl font-black text-white leading-none">A+</span>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Predicted grade after completing current roadmap milestones.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-semibold">
                            <span className="flex items-center gap-1.5 text-gray-400">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                Current: B+
                            </span>
                            <span className="text-gray-600">→</span>
                            <span className="flex items-center gap-1.5 text-green-400">
                                <span className="w-2 h-2 rounded-full bg-green-400" />
                                Target: A+
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] py-4 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <span>System Status: All Signals Normal</span>
                    </div>
                    <div className="flex items-center gap-6">
                        {["Docs", "Security", "Changelog"].map((item) => (
                            <Link key={item} href="#" className="hover:text-gray-400 transition-colors uppercase tracking-wider text-[10px] font-semibold">
                                {item}
                            </Link>
                        ))}
                        <span className="text-gray-700">© 2024 DevGrade Engine v2.4.0</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
