"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, ChevronRight, LayoutTemplate, RefreshCcw, SlidersHorizontal } from "lucide-react";

type CategoryVariant = "identity" | "architecture" | "consistency" | "engineering";

interface CompletedMilestone {
    id: string;
    title: string;
    description: string;
    category: { label: string; variant: CategoryVariant };
}

interface NextMilestone {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
    category: { label: string; variant: CategoryVariant };
    extras?: React.ReactNode;
}

const categoryStyles: Record<CategoryVariant, string> = {
    identity: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    architecture: "bg-blue-500/10   text-blue-400   border border-blue-500/20",
    consistency: "bg-teal-500/10   text-teal-400   border border-teal-500/20",
    engineering: "bg-orange-500/10 text-orange-400  border border-orange-500/20",
};

const completedMilestones: CompletedMilestone[] = [
    {
        id: "1",
        title: "Establish Profile Readme",
        description: "Professional bio and tech stack visualization successfully integrated into main profile.",
        category: { label: "IDENTITY", variant: "identity" },
    },
];

const nextMilestones: NextMilestone[] = [
    {
        id: "2",
        icon: <LayoutTemplate className="w-4 h-4 text-blue-400" />,
        title: "Refactor Readme: Architecture",
        description: (
            <>
                Add technical architecture diagrams to{" "}
                <code className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[11px] font-mono">
                    distributed-cache-v2
                </code>
                . High-impact repos are missing visual documentation.
            </>
        ),
        category: { label: "ARCHITECTURE", variant: "architecture" },
        extras: (
            <div className="flex items-center gap-2 mt-3">
                <div className="flex -space-x-1">
                    {["A", "B", "C"].map((l) => (
                        <div key={l} className="w-5 h-5 rounded-full bg-blue-600 border border-[#0d1117] flex items-center justify-center text-[8px] text-white font-bold">
                            {l}
                        </div>
                    ))}
                </div>
                <span className="text-gray-500 text-xs">3 mentors suggest this fix</span>
            </div>
        ),
    },
    {
        id: "3",
        icon: <RefreshCcw className="w-4 h-4 text-gray-400" />,
        title: "Contribution Velocity",
        description: "Commit to 3 open-source repositories this week. Your current activity shows a 14-day trailing decline.",
        category: { label: "CONSISTENCY", variant: "consistency" },
        extras: (
            <div className="flex gap-1 mt-3">
                {Array.from({ length: 14 }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-2 flex-1 rounded-full",
                            i >= 11 ? "bg-blue-600" : i >= 8 ? "bg-blue-400/50" : "bg-white/10"
                        )}
                    />
                ))}
            </div>
        ),
    },
    {
        id: "4",
        icon: <SlidersHorizontal className="w-4 h-4 text-gray-400" />,
        title: "Tech Stack Diversity",
        description: (
            <>
                Integrate a modern testing framework like <strong className="text-white">Vitest</strong> or{" "}
                <strong className="text-white">Playwright</strong> in your top 2 TypeScript repositories.
            </>
        ),
        category: { label: "ENGINEERING", variant: "engineering" },
    },
];

export default function MilestoneTimeline() {
    return (
        <section className="w-full max-w-3xl mx-auto px-4 py-8">
            {/* RECENTLY COMPLETED */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">
                        Recently Completed
                    </span>
                </div>

                {completedMilestones.map((m, i) => (
                    <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative pl-10 pb-6"
                    >
                        {/* Timeline line */}
                        <div className="absolute left-3.5 top-6 bottom-0 w-px bg-white/[0.06]" />
                        {/* Checkmark */}
                        <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-green-400" />
                        </div>

                        <div className="glass-card rounded-xl p-4">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h3 className="text-white font-semibold text-sm">{m.title}</h3>
                                    <p className="text-gray-500 text-xs mt-1 leading-relaxed line-through">
                                        {m.description}
                                    </p>
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md whitespace-nowrap flex-shrink-0",
                                    categoryStyles[m.category.variant]
                                )}>
                                    {m.category.label}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* NEXT MILESTONES */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">
                        Next Milestones
                    </span>
                </div>

                <div className="flex flex-col gap-0">
                    {nextMilestones.map((m, i) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.12 }}
                            className="relative pl-10 pb-4"
                        >
                            {/* Timeline line */}
                            {i < nextMilestones.length - 1 && (
                                <div className="absolute left-3.5 top-8 bottom-0 w-px bg-white/[0.06]" />
                            )}
                            {/* Icon */}
                            <div className={cn(
                                "absolute left-0 top-0.5 w-7 h-7 rounded-full border flex items-center justify-center",
                                i === 0
                                    ? "bg-blue-600/20 border-blue-500/40"
                                    : "bg-white/[0.04] border-white/[0.1]"
                            )}>
                                {m.icon}
                            </div>

                            <div className={cn(
                                "glass-card rounded-xl p-4 transition-colors",
                                i === 0 ? "border-blue-500/20" : ""
                            )}>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold text-sm">{m.title}</h3>
                                        <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{m.description}</p>
                                        {m.extras}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md",
                                            categoryStyles[m.category.variant]
                                        )}>
                                            {m.category.label}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-600" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
