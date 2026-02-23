"use client";

import { motion } from "framer-motion";
import { RefreshCw, Share2 } from "lucide-react";

interface ScoreOverviewProps {
    score?: number;
    title?: string;
    subtitle?: string;
    onRescan?: () => void;
    onShare?: () => void;
}

function ScoreRing({ score = 84 }: { score: number }) {
    const radius = 110;
    const strokeWidth = 12;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
            {/* Outer ambient glow rings */}
            <div className="absolute inset-0 rounded-full" style={{
                background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)"
            }} />
            <div className="absolute rounded-full border border-blue-500/10"
                style={{ width: 230, height: 230 }} />
            <div className="absolute rounded-full border border-blue-500/20"
                style={{ width: 200, height: 200 }} />

            {/* SVG Ring */}
            <svg
                width={240}
                height={240}
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                className="absolute score-ring-glow"
                style={{ transform: "rotate(-90deg)" }}
            >
                {/* Track ring */}
                <circle
                    cx={radius}
                    cy={radius}
                    r={normalizedRadius}
                    fill="transparent"
                    stroke="rgba(59,130,246,0.12)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress ring */}
                <motion.circle
                    cx={radius}
                    cy={radius}
                    r={normalizedRadius}
                    fill="transparent"
                    stroke="url(#blueGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: progress }}
                    transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
                />
                <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Score text */}
            <div className="relative flex flex-col items-center select-none">
                <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-6xl font-black text-white leading-none"
                >
                    {score}
                    <span className="text-3xl font-bold text-blue-400">%</span>
                </motion.span>
                <span className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mt-1">
                    Health Score
                </span>
            </div>
        </div>
    );
}

export default function ScoreOverview({
    score = 84,
    title = "Engineering Readiness Score",
    subtitle = "Your profile ranks in the top 5% of contributors globally. Excellent project hygiene and documentation standards detected.",
    onRescan,
    onShare,
}: ScoreOverviewProps) {
    return (
        <section className="flex flex-col items-center text-center px-4 py-16">
            {/* Glowing ring */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <ScoreRing score={score} />
            </motion.div>

            {/* Title & subtitle */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8 max-w-lg"
            >
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{title}</h1>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    {subtitle.split("top 5%").length > 1 ? (
                        <>
                            {subtitle.split("top 5%")[0]}
                            <span className="text-blue-400 font-medium">top 5%</span>
                            {subtitle.split("top 5%")[1]}
                        </>
                    ) : (
                        subtitle
                    )}
                </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-3 mt-8"
            >
                <button
                    onClick={onRescan}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30"
                >
                    <RefreshCw className="w-4 h-4" />
                    Re-scan Profile
                </button>
                <button
                    onClick={onShare}
                    className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-semibold px-6 py-3 rounded-xl border border-white/[0.08] transition-all duration-200"
                >
                    <Share2 className="w-4 h-4" />
                    Share Report
                </button>
            </motion.div>
        </section>
    );
}
