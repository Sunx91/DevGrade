"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Globe, ShieldAlert } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

type BadgeVariant = "advanced" | "expert" | "good" | "needs-focus";

interface MetricCard {
    id: string;
    score: number;
    title: string;
    description: string;
    badge: { label: string; variant: BadgeVariant };
    icon: React.ReactNode;
    ringColor: string;
    trackColor: string;
}

interface MetricsGridProps {
    metrics: {
        quality: { score: number };
        techStack: { score: number; languages?: string[] };
        documentation: { score: number };
        security: { score: number };
        commits: number;
        mergedPRs: number;
    };
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
    const CARDS: MetricCard[] = [
        {
            id: "project-quality",
            score: metrics.quality.score,
            title: "Project Quality",
            description: "Evaluated code recency, activity consistency, and issue management.",
            badge: { label: metrics.quality.score > 80 ? "ADVANCED" : "GOOD", variant: metrics.quality.score > 80 ? "advanced" : "good" },
            icon: <CheckCircle2 className="w-3.5 h-3.5" />,
            ringColor: "#3b82f6",
            trackColor: "rgba(59,130,246,0.15)",
        },
        {
            id: "tech-diversity",
            score: metrics.techStack.score,
            title: "Tech Diversity",
            description: metrics.techStack.languages ? `Demonstrated proficiency in ${metrics.techStack.languages.join(', ')}.` : "Tech stack analysis based on primary languages.",
            badge: { label: metrics.techStack.score > 70 ? "GOOD" : "NEEDS FOCUS", variant: metrics.techStack.score > 70 ? "good" : "needs-focus" },
            icon: <Globe className="w-3.5 h-3.5" />,
            ringColor: "#3b82f6",
            trackColor: "rgba(59,130,246,0.15)",
        },
        {
            id: "documentation",
            score: metrics.documentation.score,
            title: "Documentation",
            description: "Evaluated base documentation standards, descriptions, and presence of links.",
            badge: { label: metrics.documentation.score > 80 ? "EXPERT" : "GOOD", variant: metrics.documentation.score > 80 ? "expert" : "good" },
            icon: <BookOpen className="w-3.5 h-3.5" />,
            ringColor: "#3b82f6",
            trackColor: "rgba(59,130,246,0.15)",
        },
        {
            id: "security",
            score: metrics.security.score,
            title: "Security",
            description: "Checking foundational repository security features and licenses.",
            badge: { label: metrics.security.score > 60 ? "GOOD" : "NEEDS FOCUS", variant: metrics.security.score > 60 ? "good" : "needs-focus" },
            icon: <ShieldAlert className="w-3.5 h-3.5" />,
            ringColor: "#eab308",
            trackColor: "rgba(234,179,8,0.15)",
        },
    ];

    const badgeStyles: Record<BadgeVariant, string> = {
        advanced: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        expert: "bg-green-500/10 text-green-400 border border-green-500/20",
        good: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
        "needs-focus": "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    };

    const radarData = [
        { subject: "Quality", A: metrics.quality.score, fullMark: 100 },
        { subject: "Diversity", A: metrics.techStack.score, fullMark: 100 },
        { subject: "Docs", A: metrics.documentation.score, fullMark: 100 },
        { subject: "Security", A: metrics.security.score, fullMark: 100 },
    ];

    function MiniRing({ score, ringColor, trackColor }: { score: number; ringColor: string; trackColor: string }) {
        const size = 72;
        const strokeWidth = 7;
        const r = (size - strokeWidth) / 2;
        const circ = 2 * Math.PI * r;
        const offset = circ - (score / 100) * circ;

        return (
            <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
                    style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={size / 2} cy={size / 2} r={r}
                        fill="transparent" stroke={trackColor} strokeWidth={strokeWidth} />
                    <motion.circle
                        cx={size / 2} cy={size / 2} r={r}
                        fill="transparent"
                        stroke={ringColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={`${circ} ${circ}`}
                        initial={{ strokeDashoffset: circ }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        style={{ filter: `drop-shadow(0 0 6px ${ringColor}80)` }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-base">{score}</span>
                </div>
            </div>
        );
    }

    return (
        <section className="w-full max-w-4xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-6">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CARDS.map((card, i) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i, duration: 0.5 }}
                        className="glass-card rounded-2xl p-5 flex items-start gap-4 hover:border-white/[0.14] transition-colors"
                        aria-label={`Metric card for ${card.title}`}
                    >
                        <MiniRing score={card.score} ringColor={card.ringColor} trackColor={card.trackColor} />
                        <div className="flex flex-col gap-1.5 min-w-0">
                            <div className="flex items-center gap-1.5 text-white/70">
                                {card.icon}
                                <h3 className="font-semibold text-white text-sm">{card.title}</h3>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed">{card.description}</p>
                            <span className={cn(
                                "mt-1 self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md",
                                badgeStyles[card.badge.variant]
                            )}>
                                {card.badge.label}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
            {/* Radar Chart Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex-shrink-0 w-full md:w-[350px] h-[350px] glass-card rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-2xl"
                aria-label="Radar chart showing distribution of specific metrics"
            >
                <h3 className="text-white text-sm font-semibold self-start ml-2 mb-2">Metrics Distribution</h3>
                <div className="w-full h-full p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#3b82f6' }}
                            />
                            <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </section>
    );
}
