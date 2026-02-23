export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col pt-24 px-4 w-full" aria-label="Loading dashboard data">
            {/* Header / Score Overview Skeleton */}
            <div className="flex flex-col items-center justify-center mb-16 mt-8 space-y-4">
                <div className="w-48 h-48 rounded-full bg-slate-800 animate-pulse" />
                <div className="w-64 h-8 bg-slate-800 rounded animate-pulse" />
                <div className="w-96 h-4 bg-slate-800 rounded animate-pulse" />
            </div>

            {/* Metrics Grid and Radar Chart Skeleton */}
            <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="glass-card rounded-2xl p-5 flex items-start gap-4">
                            <div className="w-[72px] h-[72px] rounded-full bg-slate-800 animate-pulse flex-shrink-0" />
                            <div className="flex flex-col gap-2 w-full">
                                <div className="w-24 h-4 bg-slate-800 rounded animate-pulse" />
                                <div className="w-full h-10 bg-slate-800 rounded animate-pulse mt-1" />
                                <div className="w-16 h-5 bg-slate-800 rounded animate-pulse mt-2" />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Radar Chart Skeleton Placeholder */}
                <div className="flex-shrink-0 w-full md:w-[350px] h-[350px] glass-card rounded-2xl p-4 flex flex-col items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-slate-800/50 animate-pulse border border-slate-700/50" />
                </div>
            </div>

            {/* Stats Bar Skeleton */}
            <div className="w-full max-w-4xl mx-auto mt-8 mb-4">
                <div className="glass-card rounded-2xl h-24 bg-slate-800 animate-pulse" />
            </div>

            {/* Roadmap Skeleton */}
            <div className="w-full max-w-4xl mx-auto mt-8 space-y-4">
                <div className="w-48 h-6 bg-slate-800 rounded animate-pulse mb-6" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-start pl-10">
                        <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse flex-shrink-0" />
                        <div className="glass-card rounded-xl p-4 w-full h-20 bg-slate-800 animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
}
