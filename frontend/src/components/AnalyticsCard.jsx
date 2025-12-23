import { BeatLoader } from 'react-spinners';

export default function AnalyticsCard({ endpoint, liveStats }) {
    if (!endpoint) return null;

    const formatDate = (isoString) => {
        if (!isoString) return "Never";
        const date = new Date(isoString);
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    let statusColor = "bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.5)]"; // Default Gray
    let statusText = "PENDING";
    let textColor = "text-slate-300";

    if (liveStats?.is_up === true) {
        statusColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
        statusText = "ONLINE";
        textColor = "text-emerald-200";
    } else if (liveStats?.is_up === false) {
        statusColor = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
        statusText = "OFFLINE";
        textColor = "text-red-400";
    }

    const showContent = liveStats !== undefined;

    return (
        <li 
            className="
                group relative flex flex-col justify-between h-full w-full p-5 gap-2 rounded-xl
                bg-white/5 hover:bg-white/10 
                border border-emerald-500/50 hover:border-emerald-500/50
                transition-all duration-300 ease-out
                hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-emerald-900/20
                cursor-pointer
            "
        >
            <div className="flex justify-between items-start">
                <span className="text-white font-medium text-sm truncate w-full pr-2">
                    {endpoint.name || "Unnamed"}
                </span>
                
                {showContent && (
                    <div className={`w-2 h-2 rounded-full shrink-0 mt-1 group-hover:animate-pulse ${statusColor}`} /> 
                )}
            </div>

            <div className="relative h-auto w-full gap-1">
                
                <span className="
                    top-0 left-0 w-full
                    text-emerald-200 text-[10px] font-mono break-all line-clamp-2 leading-tight
                    transition-all duration-300
                    group-hover:opacity-0 group-hover:translate-y-2
                ">
                    {showContent ? (
                        <div className={`flex flex-col gap-1 ${textColor}`}>
                            <ul>
                                <li className="text-xs font-bold">{statusText}</li>
                                <li>Status code: {liveStats.status_code}</li>
                                <li>Last: {formatDate(liveStats.checked_at)}</li>
                            </ul>
                        </div>
                    ) : (
                        <div className="mt-2 opacity-50">
                            <BeatLoader color="#34d399" size={8} margin={2} />
                        </div>
                    )}
                </span>

                <div className="
                    absolute top-0 left-0 w-full flex flex-col justify-end
                    text-white text-xs font-bold uppercase tracking-wider
                    opacity-0 translate-y-2
                    transition-all duration-300
                    group-hover:opacity-100 group-hover:translate-y-0
                ">
                    <span>See full analysis</span>
                    <span className="text-[10px] font-normal normal-case opacity-70 truncate">{endpoint.url}</span>
                </div>

            </div>
        </li>
    );
}