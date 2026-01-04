import { BeatLoader } from 'react-spinners';
import Button from '../ui/Button';
import { HiMiniTrash } from "react-icons/hi2";
import { deleteEndpoint } from '../../services/endpointService';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AnalyticsCard({ endpoint, liveStats, onDelete }) {
    const [loading, setLoading] = useState(false)
    if (!endpoint) return null;

    const formatDate = (isoString) => {
        if (!isoString) return "Never";
        return new Date(isoString).toLocaleString('fi-FI', { 
            day: '2-digit', month: '2-digit', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        setLoading(true);
        try {
            await deleteEndpoint(endpoint.id);
            toast.success("Endpoint deleted.");
            if (onDelete) onDelete(endpoint.id);
        } catch(error) {
            toast.error(error.response?.data?.message || "Failed to delete.");
        } finally {
            setLoading(false);
        }
    };

    const isUp = liveStats?.is_up;
    const hasStats = liveStats !== undefined;

    const styleConfig = {
        pending: {
            border: "border-slate-500/30 hover:border-slate-500/50",
            dot: "bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.5)]",
            text: "text-slate-400",
            statusLabel: "PENDING"
        },
        online: {
            border: "border-emerald-500/50 hover:border-emerald-400",
            dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
            text: "text-emerald-200",
            statusLabel: "ONLINE"
        },
        offline: {
            border: "border-red-500/50 hover:border-red-500",
            dot: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
            text: "text-red-400",
            statusLabel: "OFFLINE"
        }
    };

    const currentStyle = !hasStats ? styleConfig.pending : (isUp ? styleConfig.online : styleConfig.offline);

    return (
        <li 
            className={`
                group relative flex flex-col h-full w-full p-5 gap-3 rounded-xl
                bg-white/5 hover:bg-white/10 
                border transition-all duration-300 ease-out
                hover:scale-[1.01] hover:z-10 hover:shadow-2xl hover:shadow-black/20
                cursor-pointer
                ${currentStyle.border}
            `}
        >
            <div className="flex justify-between items-start">
                <span className="text-white font-medium text-sm truncate w-full pr-2">
                    {endpoint.name || "Unnamed"}
                </span>
                
                {hasStats && (
                    <div className={`w-2 h-2 rounded-full shrink-0 mt-1 group-hover:animate-pulse ${currentStyle.dot}`} /> 
                )}
            </div>

            <div className="grid grid-cols-1 grid-rows-1 flex-grow items-end">
                <span className="
                    col-start-1 row-start-1 w-full
                    transition-all duration-300 ease-in-out
                    opacity-100 translate-y-0
                    group-hover:opacity-0 group-hover:translate-y-2 group-hover:pointer-events-none"
                >
                    {hasStats ? (
                        <div className={`flex flex-col gap-1 ${currentStyle.text}`}>
                            <ul>
                                <li className="text-xs font-bold">{currentStyle.statusLabel}</li>
                                <li className="text-xs font-bold">Status: {liveStats.status_code}</li>
                                <li className="text-xs font-bold">Last: {formatDate(liveStats.checked_at)}</li>
                            </ul>
                        </div>
                    ) : (
                        <div className="mt-2 opacity-50">
                            <BeatLoader color="#34d399" size={8} margin={2} />
                        </div>
                    )}
                </span>

                <div className="
                    col-start-1 row-start-1 w-full flex flex-col justify-end gap-2
                    transition-all duration-300 ease-in-out
                    opacity-0 translate-y-2
                    group-hover:opacity-100 group-hover:translate-y-0"
                >
                    <div className='flex flex-col text-white'>
                        <span className='hidden md:flex text-sm'>See full analysis</span>
                        <span className="hidden md:flex text-[10px] opacity-70 truncate">{endpoint.url}</span>
                    </div>
                    <div className='flex justify-end'>
                        <Button 
                            onClick={handleDelete}
                            className="bg-red-500/10 border border-red-500/20 text-red-200 hover:bg-red-500/20"
                        >
                            <HiMiniTrash />
                        </Button>
                    </div> 
                </div>
            </div>
        </li>
    );
}