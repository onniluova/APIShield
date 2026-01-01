import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast';
import Header from "./Header";
import { getEndpointStats } from "../services/endpointService";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const modalVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

export default function DetailedAnalyticsModal({ onClose, endpoint_id }) {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            setLoading(true);
            try {
                const response = await getEndpointStats(endpoint_id, startDate, endDate, 500);
                setHistory(response.data.history || []);
                setStats(response.data);
            } catch(error) {
                toast.error("Failed to load stats.");
                onClose();
            } finally {
                setLoading(false);
            }
        }
        
        if (endpoint_id) loadAnalytics();
    }, [endpoint_id, startDate, endDate]);

    const formattedData = history.map(item => ({
        timestamp: item.checked_at, 
        latency: item.latency_ms
    }));

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString([], { 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        });
    };

    useEffect(() => {
        if (formattedData.length > 0) {
            console.log("Formatted Data:", formattedData);
        }
    }, [formattedData]);

    const getGradientOffset = () => {
        if (formattedData.length === 0) return 0;
        
        const dataMax = Math.max(...formattedData.map((i) => i.latency));
        const dataMin = Math.min(...formattedData.map((i) => i.latency));
        
        const total = formattedData.reduce((sum, item) => sum + item.latency, 0);
        const avg = total / formattedData.length;

        const threshold = avg * 1.5;

        if (dataMax <= 0) return 0;
        if (dataMin >= dataMax) return 0;

        const offset = (dataMax - threshold) / (dataMax - dataMin);
        
        return Math.min(Math.max(offset, 0), 1);
    };

    const off = getGradientOffset();

    const axisColor = "#ffffff"; 
    const goodColor = "#34d399";
    const badColor = "#f87171";

    return (
        <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-md p-2"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div 
                className="relative w-full max-w-2xl bg-gradient-to-br from-emerald-900/25 to-violet-900/25 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                >
                    <IoClose size={24} />
                </button>

                <div className="mb-6 text-center">
                    <Header className="text-white text-2xl font-bold">
                        {stats?.endpoint_name || "Analytics"}
                    </Header>
                    {stats?.endpoint_url && (
                        <p className="text-white/50 text-xs mt-1">{stats.endpoint_url}</p>
                    )}
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <RotateLoader color={goodColor} size={10} />
                    </div>
                ) : (
                    <div className="flex flex-col w-full min-w-0">
                        <div className="h-64 w-full">
                            {formattedData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <LineChart data={formattedData}>
                                        <defs>
                                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset={off} stopColor={badColor} stopOpacity={1} />
                                                <stop offset={off} stopColor={goodColor} stopOpacity={1} />
                                            </linearGradient>
                                        </defs>

                                        <XAxis 
                                            dataKey="timestamp" 
                                            stroke={axisColor} 
                                            opacity={0.5} 
                                            tick={{fontSize: 12}}
                                            minTickGap={30}
                                            tickFormatter={formatDate} 
                                        />
                                        <YAxis stroke={axisColor} opacity={0.5} tick={{fontSize: 12}} width={40}/>
                                        
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                            itemStyle={{ color: '#fff' }}
                                            labelStyle={{ color: '#ccc', marginBottom: '4px' }}
                                            labelFormatter={formatTime}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="latency" 
                                            stroke="url(#splitColor)" 
                                            strokeWidth={3}
                                            dot={false}
                                            activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-white/50">
                                    No data available for this period.
                                </div>
                            )}
                            
                            <div className="flex flex-row justify-center text-white mt-2 text-center text-sm gap-2">
                                Uptime: {stats.uptime}%
                            </div>
                            
                            <div 
                                className="mt-6 w-full bg-black/5 border border-white/10 rounded-xl p-4 backdrop-blur-md"
                                onTouchStart={(e) => e.stopPropagation()}
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label 
                                            htmlFor="start" 
                                            className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-1.5 ml-1"
                                        >
                                            From
                                        </label>
                                        <input
                                            type="date"
                                            id="start"
                                            name="date-start"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-400/50 focus:bg-black/30 focus:ring-1 focus:ring-emerald-400/20 transition-all min-h-[44px] cursor-pointer"
                                            style={{ colorScheme: "dark" }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label 
                                            htmlFor="end" 
                                            className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-1.5 ml-1"
                                        >
                                            To
                                        </label>
                                        <input
                                            type="date"
                                            id="end"
                                            name="date-end" 
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-400/50 focus:bg-black/30 focus:ring-1 focus:ring-violet-400/20 transition-all min-h-[44px] cursor-pointer"
                                            style={{ colorScheme: "dark" }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                )}
            </motion.div>
        </motion.div>
    );
};