export default function AnalyticsCard({ endpoint }) {
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
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0 mt-1 group-hover:animate-pulse"></div>
            </div>

            <div className="relative h-8 w-full">
                
                <span className="
                    absolute top-0 left-0 w-full
                    text-emerald-400/70 text-[10px] font-mono break-all line-clamp-2 leading-tight
                    transition-all duration-300
                    group-hover:opacity-0 group-hover:translate-y-2
                ">
                    {endpoint.url}
                </span>

                <div className="
                    absolute top-0 left-0 w-full flex items-center gap-2
                    text-white text-xs font-bold uppercase tracking-wider
                    opacity-0 translate-y-2
                    transition-all duration-300
                    group-hover:opacity-100 group-hover:translate-y-0
                ">
                    <span>Manage Endpoint</span>
                    <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>

            </div>
            </li>
     );
}