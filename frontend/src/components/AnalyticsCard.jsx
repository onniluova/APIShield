export default function AnalyticsCard({ endpoint, liveStats }) {
    if (!endpoint) return null;

    return (
        <li 
            className="
                group relative flex flex-col justify-between h-24 p-3 rounded-xl
                bg-white/5 hover:bg-white/10 
                border border-white/10 hover:border-emerald-500/50
                transition-all duration-300 ease-out
                hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-emerald-900/20
                cursor-pointer
            "
            >
            <div className="flex justify-between items-start">
                <span className="text-white font-medium text-sm truncate w-full pr-2">
                    {endpoint.name || "Unnamed"}
                </span>
                {liveStats?.is_up !== undefined && (
                    <div className={'w-2 h-2 rounded-full shrink-0 mt-1 group-hover:animate-pulse'
                        ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)"
                        : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)"
                    }>
                    </div> 
                )}
            </div>

            <div className="relative h-15 w-full">
                
                <span className="
                    absolute top-0 left-0 w-full
                    text-emerald-400/70 text-[10px] font-mono break-all line-clamp-2 leading-tight
                    transition-all duration-300
                    group-hover:opacity-0 group-hover:translate-y-2
                ">
                    {endpoint.url}
                
                    {liveStats?.is_up !== undefined && (
                        <div className={`flex flex-col gap-1 ${liveStats?.is_up? "text-emerald-500" : "text-red-500"}`}>
                            <ul>
                                <li>{liveStats.is_up ? "ONLINE" : "OFFLINE"}</li>
                                <li>Status code: {liveStats.status_code}</li>
                                <li>Checked at: {liveStats.checked_at}</li>
                            </ul>
                        </div>
                    )}
                </span>

                <div className="
                    absolute top-0 left-0 w-full flex items-center gap-2
                    text-white text-xs font-bold uppercase tracking-wider
                    opacity-0 translate-y-2
                    transition-all duration-300
                    group-hover:opacity-100 group-hover:translate-y-0
                ">
                    <span>See full analysis</span>
                </div>

            </div>
            </li>
     );
}